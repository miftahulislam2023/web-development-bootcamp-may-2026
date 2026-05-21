export type Color = string;
// Added arrow, straight-line, and hexagon
export type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'diamond' | 'star' | 'arrow' | 'straight-line' | 'hexagon';
export type LayerType = ShapeType | 'pen' | 'text' | 'eraser' | 'comment' | 'image';

export type Tool = 'select' | 'lasso' | 'hand' | 'shape' | 'pen' | 'text' | 'eraser' | 'object-eraser' | 'comment' | 'laser' | 'image';

export type Camera = {
    x: number;
    y: number;
};

export type Layer = {
    id: string;
    type: LayerType;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    stroke?: Color;
    points?: number[];
    text?: string;
    eraserSize?: number;
    penSize?: number;
    opacity?: number; // NEW: Track the opacity of individual shapes!
    src?: string; // NEW: Store Base64 string for images!
};