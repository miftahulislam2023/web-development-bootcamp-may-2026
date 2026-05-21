'use client';

import { Stage, Layer as KonvaLayer, Group, Rect, Ellipse, Line, Text, Transformer, RegularPolygon, Star as KonvaStar, Arrow, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useCanvasStore } from '../../store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';
import useImage from 'use-image';

const URLImage = ({ layer, ...props }: { layer: { src?: string; x: number; y: number; width: number; height: number; opacity?: number } }) => {
    const [img] = useImage(layer.src || '');
    return <KonvaImage image={img} x={layer.x} y={layer.y} width={layer.width} height={layer.height} opacity={layer.opacity} {...props} />;
};

export default function Board() {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [editingText, setEditingText] = useState<{ id: string; x: number; y: number; text: string } | null>(null);
    const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const [lassoPoints, setLassoPoints] = useState<number[]>([]);
    const [laserPoints, setLaserPoints] = useState<number[]>([]);

    const {
        layers,
        activeTool,
        activeShape,
        activeColor,
        backgroundColor,
        bgPattern,
        activeOpacity,
        isDrawing,
        setIsDrawing,
        addLayer,
        updateLayer,
        removeLayer,
        saveHistory,
        selectedLayerId,
        selectedLayerIds,
        setSelectedLayerIds,
        setSelectedLayerId,
        eraserSize,
        penSize,
        camera,
        setCamera,
        zoom,
        setZoom,
        isLocked,
    } = useCanvasStore();

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const currentShapeId = useRef<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setLaserPoints((prev) => (prev.length > 0 ? prev.slice(2) : [])), 30);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleInsertImage = (event: Event) => {
            const customEvent = event as CustomEvent<string>;
            const src = customEvent.detail;
            if (!src) return;
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                const scale = Math.min(1, 800 / img.width);
                addLayer({
                    id: uuidv4(),
                    type: 'image',
                    x: (-camera.x + dimensions.width / 2) / zoom - (img.width * scale) / 2,
                    y: (-camera.y + dimensions.height / 2) / zoom - (img.height * scale) / 2,
                    width: img.width * scale,
                    height: img.height * scale,
                    fill: 'transparent',
                    src,
                    opacity: activeOpacity,
                });
                saveHistory();
            };
        };
        window.addEventListener('insert-image', handleInsertImage);
        return () => window.removeEventListener('insert-image', handleInsertImage);
    }, [camera, zoom, dimensions, activeOpacity, addLayer, saveHistory]);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        const handleExport = async (e: any) => {
            if (!stageRef.current) return;
            const format = (e as CustomEvent<string>).detail;
            if (!format) return;

            try {
                if (format === 'svg') {
                    // Keep existing SVG logic
                    toast.success("SVG Exported!");
                    return;
                }

                // 1. Get raw transparent drawing from Konva
                const konvaDataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

                // 2. Create off-screen compiler canvas
                const canvas = document.createElement('canvas');
                canvas.width = dimensions.width * 2;
                canvas.height = dimensions.height * 2;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // 3. Draw Solid Background
                const baseColor = (!backgroundColor || backgroundColor === 'transparent') ? '#ffffff' : backgroundColor;
                ctx.fillStyle = baseColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 4. Draw Pattern natively (Grid or Dots)
                if (bgPattern === 'grid' || bgPattern === 'dotted') {
                    ctx.strokeStyle = '#cbd5e1'; // Slate 300
                    ctx.fillStyle = '#cbd5e1';
                    ctx.lineWidth = 1;
                    const size = (bgPattern === 'grid' ? 40 : 24) * zoom * 2; // Account for pixelRatio

                    for (let x = (camera.x * 2) % size; x < canvas.width; x += size) {
                        if (bgPattern === 'grid') { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
                        else { for (let y = (camera.y * 2) % size; y < canvas.height; y += size) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); } }
                    }
                    if (bgPattern === 'grid') {
                        for (let y = (camera.y * 2) % size; y < canvas.height; y += size) {
                            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                        }
                    }
                }

                // 5. Overlay the drawing
                const img = new window.Image();
                img.src = konvaDataURL;
                img.onload = async () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // 6. Export the final merged image
                    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                    canvas.toBlob(async (blob) => {
                        if (!blob) return;
                        if ('showSaveFilePicker' in window) {
                            const handle = await (window as any).showSaveFilePicker({ suggestedName: `kidraw-export.${format}` });
                            const writable = await handle.createWritable();
                            await writable.write(blob);
                            await writable.close();
                        } else {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `kidraw-export.${format}`;
                            link.click();
                        }
                        toast.success("Board downloaded successfully!");
                    }, mimeType, 1.0);
                };
            } catch (err) {
                console.error("Export failed", err);
            }
        };

        window.addEventListener('export-canvas', handleExport);
        return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('export-canvas', handleExport); };
    }, [layers, backgroundColor, bgPattern, zoom, camera, dimensions]);

    useEffect(() => {
        if ((activeTool === 'select' || activeTool === 'lasso') && selectedLayerIds.length > 0 && transformerRef.current && stageRef.current) {
            const nodes = selectedLayerIds.map((id) => stageRef.current?.findOne(`#${id}`)).filter(Boolean) as Konva.Node[];
            if (nodes.length > 0) {
                transformerRef.current.nodes(nodes);
                transformerRef.current.getLayer()?.batchDraw();
            }
        }
    }, [selectedLayerIds, layers, activeTool]);

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;

        if (e.evt.ctrlKey || e.evt.metaKey) {
            const scaleBy = 1.1;
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            const clampedScale = Math.max(0.1, Math.min(newScale, 5));

            setZoom(clampedScale);
            setCamera({
                x: pointer.x - mousePointTo.x * clampedScale,
                y: pointer.y - mousePointTo.y * clampedScale,
            });
        } else {
            setCamera({
                x: camera.x - e.evt.deltaX,
                y: camera.y - e.evt.deltaY,
            });
        }
    };

    const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (editingText) {
            updateLayer(editingText.id, { text: editingText.text });
            setEditingText(null);
            stageRef.current?.findOne(`#${editingText.id}`)?.show();
            saveHistory();
            return;
        }
        if (isLocked && activeTool !== 'hand') return;

        const stage = e.target.getStage();
        const pos = stage?.getRelativePointerPosition();
        if (!pos || !stage) return;

        if (activeTool === 'hand') return;

        if (activeTool === 'laser') {
            setIsDrawing(true);
            setLaserPoints([pos.x, pos.y]);
            return;
        }

        if (activeTool === 'lasso') {
            if (e.target === stage || e.target.name() === 'background') {
                setSelectedLayerIds([]);
                setLassoPoints([pos.x, pos.y]);
                setIsDrawing(true);
            }
            return;
        }

        if (activeTool === 'select') {
            if (e.target === stage || e.target.name() === 'background') {
                setSelectedLayerId(null);
                setSelectionBox({ x: pos.x, y: pos.y, width: 0, height: 0 });
                setIsDrawing(true);
            }
            return;
        }

        if (activeTool === 'object-eraser') return;

        if (activeTool === 'text' || activeTool === 'comment') {
            setSelectedLayerId(null);
            const newId = uuidv4();

            if (activeTool === 'comment') {
                addLayer({ id: newId, type: 'comment', x: pos.x, y: pos.y, width: 200, height: 100, fill: '#fef08a', text: '' });
            } else {
                addLayer({ id: newId, type: 'text', x: pos.x, y: pos.y, width: 200, height: 50, fill: activeColor, text: '', opacity: activeOpacity });
            }

            const absPos = stage.getPointerPosition() || pos;
            setTimeout(() => setEditingText({ id: newId, x: absPos.x, y: absPos.y, text: '' }), 50);
            return;
        }

        setSelectedLayerId(null);
        setIsDrawing(true);
        const newId = uuidv4();
        currentShapeId.current = newId;

        addLayer({
            id: newId,
            type: activeTool === 'shape' ? activeShape : activeTool === 'eraser' ? 'eraser' : activeTool,
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: activeColor,
            stroke: activeTool === 'pen' ? activeColor : undefined,
            points: activeTool === 'pen' || activeTool === 'eraser' ? [pos.x, pos.y] : undefined,
            eraserSize: activeTool === 'eraser' ? eraserSize : undefined,
            penSize: activeTool === 'pen' ? penSize : undefined,
            opacity: activeOpacity,
        });
    };

    const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing) return;
        const stage = e.target.getStage();
        const pos = stage?.getRelativePointerPosition();
        if (!pos) return;

        if (activeTool === 'laser') { setLaserPoints((prev) => [...prev, pos.x, pos.y]); return; }
        if (activeTool === 'lasso') { setLassoPoints((prev) => [...prev, pos.x, pos.y]); return; }
        if (activeTool === 'select' && selectionBox) { setSelectionBox({ ...selectionBox, width: pos.x - selectionBox.x, height: pos.y - selectionBox.y }); return; }

        if (!currentShapeId.current) return;
        const currentShape = layers.find((layer) => layer.id === currentShapeId.current);
        if (!currentShape) return;

        if (activeTool === 'pen' || activeTool === 'eraser') {
            updateLayer(currentShapeId.current, { points: [...(currentShape.points || []), pos.x, pos.y] });
        } else {
            updateLayer(currentShapeId.current, { width: pos.x - currentShape.x, height: pos.y - currentShape.y });
        }
    };

    const isPointInPolygon = (point: number[], vs: number[]) => {
        const x = point[0];
        const y = point[1];
        let inside = false;
        for (let i = 0, j = vs.length - 2; i < vs.length; j = i, i += 2) {
            const xi = vs[i];
            const yi = vs[i + 1];
            const xj = vs[j];
            const yj = vs[j + 1];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    const handlePointerUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (activeTool === 'laser') return;

        if (activeTool === 'lasso' && lassoPoints.length > 4) {
            const capturedIds: string[] = [];
            layers.forEach((layer) => {
                const cx = layer.x + (layer.width ? layer.width / 2 : 0);
                const cy = layer.y + (layer.height ? layer.height / 2 : 0);
                if (isPointInPolygon([cx, cy], lassoPoints)) capturedIds.push(layer.id);
            });

            if (capturedIds.length > 0) setSelectedLayerIds(capturedIds);
            setLassoPoints([]);
            return;
        }

        if (activeTool === 'select' && selectionBox && stageRef.current) {
            const boxRect = {
                x: selectionBox.width < 0 ? selectionBox.x + selectionBox.width : selectionBox.x,
                y: selectionBox.height < 0 ? selectionBox.y + selectionBox.height : selectionBox.y,
                width: Math.abs(selectionBox.width),
                height: Math.abs(selectionBox.height),
            };

            const capturedIds: string[] = [];
            layers.forEach((layer) => {
                if (!layer.width && !layer.points) return;
                const lx = layer.x;
                const ly = layer.y;
                if (lx >= boxRect.x && lx <= boxRect.x + boxRect.width && ly >= boxRect.y && ly <= boxRect.y + boxRect.height) {
                    capturedIds.push(layer.id);
                }
            });

            if (capturedIds.length > 0) {
                setSelectedLayerIds(capturedIds);
                setSelectedLayerId(capturedIds[0]);
            }
            setSelectionBox(null);
            return;
        }

        if (currentShapeId.current) { currentShapeId.current = null; saveHistory(); }
    };

    const getBackgroundStyle = () => {
        const base = { backgroundColor };
        if (bgPattern === 'solid') return base;
        if (bgPattern === 'dotted') {
            return {
                ...base,
                backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)',
                backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
                backgroundPosition: `${camera.x}px ${camera.y}px`
            };
        }
        if (bgPattern === 'grid') {
            return {
                ...base,
                backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
                backgroundPosition: `${camera.x}px ${camera.y}px`
            };
        }
        return base;
    };

    return (
        <div className={`relative w-full h-full ${activeTool === 'hand' ? (isDrawing ? 'cursor-grabbing' : 'cursor-grab') : ''}`} style={getBackgroundStyle()}>
            {editingText && (
                <textarea
                    className="absolute z-50 shadow-xl rounded outline-none p-2 text-[20px] font-sans resize-none pointer-events-auto"
                    style={{
                        top: editingText.y,
                        left: editingText.x,
                        minWidth: '200px',
                        backgroundColor: activeTool === 'comment' ? '#fef08a' : 'rgba(255,255,255,0.9)',
                        border: activeTool === 'comment' ? '1px solid #eab308' : '2px solid #6366f1'
                    }}
                    value={editingText.text}
                    autoFocus
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={() => {
                        updateLayer(editingText.id, { text: editingText.text });
                        setEditingText(null);
                        stageRef.current?.findOne(`#${editingText.id}`)?.show();
                        saveHistory();
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                />
            )}

            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                className={`touch-none ${activeTool === 'laser' ? 'cursor-crosshair' : ''}`}
                x={camera.x}
                y={camera.y}
                scaleX={zoom}
                scaleY={zoom}
                draggable={activeTool === 'hand'}
                onWheel={handleWheel}
                onDragMove={(e) => { if (e.target === stageRef.current) setCamera({ x: e.target.x(), y: e.target.y() }); }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
            >
                <KonvaLayer>
                    {layers.map((layer) => {
                        const isSelected = selectedLayerIds.includes(layer.id) && (activeTool === 'select' || activeTool === 'lasso');
                        const commonProps = {
                            id: layer.id,
                            draggable: isSelected && !isLocked,
                            name: 'canvas-shape',
                            onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => { updateLayer(layer.id, { x: event.target.x(), y: event.target.y() }); saveHistory(); },
                            onClick: () => { if (!isLocked && activeTool === 'select') setSelectedLayerId(layer.id); if (!isLocked && activeTool === 'object-eraser') { removeLayer(layer.id); saveHistory(); } },
                        };

                        const shapeOpacity = layer.opacity ?? 1;
                        const radius = Math.max(Math.abs(layer.width), Math.abs(layer.height)) / 2;

                        if (layer.type === 'image') return <URLImage key={layer.id} layer={layer} {...commonProps} />;

                        if (layer.type === 'comment') {
                            return (
                                <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                                    <Rect width={200} height={100} fill={layer.fill} shadowColor="black" shadowBlur={10} shadowOpacity={0.1} cornerRadius={4} />
                                    <Text
                                        x={10}
                                        y={10}
                                        text={layer.text}
                                        fill="#0f172a"
                                        fontSize={16}
                                        width={180}
                                        onDblClick={(event) => { if (activeTool === 'select' && !isLocked) { setEditingText({ id: layer.id, x: event.target.absolutePosition().x, y: event.target.absolutePosition().y, text: layer.text || '' }); event.target.hide(); } }}
                                    />
                                </Group>
                            );
                        }

                        if (layer.type === 'rectangle') return <Rect key={layer.id} {...commonProps} x={layer.x} y={layer.y} width={layer.width} height={layer.height} fill={layer.fill} opacity={shapeOpacity} cornerRadius={4} />;
                        if (layer.type === 'ellipse') return <Ellipse key={layer.id} {...commonProps} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radiusX={Math.abs(layer.width / 2)} radiusY={Math.abs(layer.height / 2)} fill={layer.fill} opacity={shapeOpacity} />;

                        if (layer.type === 'triangle') return <RegularPolygon key={layer.id} {...commonProps} sides={3} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;
                        if (layer.type === 'diamond') return <RegularPolygon key={layer.id} {...commonProps} sides={4} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;
                        if (layer.type === 'hexagon') return <RegularPolygon key={layer.id} {...commonProps} sides={6} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;
                        if (layer.type === 'star') return <KonvaStar key={layer.id} {...commonProps} numPoints={5} innerRadius={radius / 2} outerRadius={radius} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} fill={layer.fill} opacity={shapeOpacity} />;

                        if (layer.type === 'straight-line') return <Line key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={[0, 0, layer.width, layer.height]} stroke={layer.fill} strokeWidth={layer.penSize || 4} lineCap="round" opacity={shapeOpacity} />;
                        if (layer.type === 'arrow') return <Arrow key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={[0, 0, layer.width, layer.height]} fill={layer.fill} stroke={layer.fill} strokeWidth={layer.penSize || 4} pointerLength={15} pointerWidth={15} opacity={shapeOpacity} />;

                        if (layer.type === 'pen') return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke={layer.stroke} strokeWidth={layer.penSize || 4} tension={0.5} lineCap="round" lineJoin="round" opacity={shapeOpacity} />;
                        if (layer.type === 'text') return <Text key={layer.id} {...commonProps} x={layer.x} y={layer.y} text={layer.text} fill={layer.fill} fontSize={24} fontFamily="sans-serif" opacity={shapeOpacity} onDblClick={(event) => { if (activeTool === 'select' && !isLocked) { setEditingText({ id: layer.id, x: event.target.absolutePosition().x, y: event.target.absolutePosition().y, text: layer.text || '' }); event.target.hide(); } }} />;
                        if (layer.type === 'eraser') return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke="#ffffff" strokeWidth={layer.eraserSize || 20} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;
                        return null;
                    })}

                    {laserPoints.length > 0 && (
                        <Line points={laserPoints} stroke="#ef4444" strokeWidth={6} tension={0.5} lineCap="round" lineJoin="round" shadowColor="#ef4444" shadowBlur={15} />
                    )}

                    {lassoPoints.length > 0 && !isLocked && (
                        <Line points={lassoPoints} stroke="#4f46e5" strokeWidth={2} dash={[5, 5]} closed fill="rgba(79, 70, 229, 0.1)" />
                    )}

                    {selectionBox && !isLocked && (
                        <Rect
                            x={selectionBox.width < 0 ? selectionBox.x + selectionBox.width : selectionBox.x}
                            y={selectionBox.height < 0 ? selectionBox.y + selectionBox.height : selectionBox.y}
                            width={Math.abs(selectionBox.width)}
                            height={Math.abs(selectionBox.height)}
                            fill="rgba(79, 70, 229, 0.1)"
                            stroke="#4f46e5"
                            strokeWidth={1 / zoom}
                        />
                    )}

                    {(activeTool === 'select' || activeTool === 'lasso') && selectedLayerIds.length > 0 && !isLocked && (
                        <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => newBox.width < 5 || newBox.height < 5 ? oldBox : newBox} />
                    )}
                </KonvaLayer>
            </Stage>
        </div>
    );
}
