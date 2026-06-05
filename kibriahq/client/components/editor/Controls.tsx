import {
    BetweenHorizontalStart,
    BetweenVerticalStart,
    Bold,
    BrushCleaning,
    ChevronDown,
    Code,
    Code2,
    Grid2x2X,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    ListTodo,
    Minus,
    Plus,
    Quote,
    Redo,
    RedoDot,
    Strikethrough,
    Table,
    TextAlignCenter,
    TextAlignEnd,
    TextAlignJustify,
    TextAlignStart,
    Trash2,
    Underline,
    Undo,
    UndoDot,
    Pilcrow,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import ControlButton from "./ui/ControlButton";

const COLOR_PALETTE = [
    { hex: "#000000", label: "Black" }, { hex: "#1a1a1a", label: "Near black" },
    { hex: "#404040", label: "Dark gray" }, { hex: "#737373", label: "Gray" },
    { hex: "#a3a3a3", label: "Medium gray" }, { hex: "#d4d4d4", label: "Light gray" },
    { hex: "#f5f5f5", label: "Near white" }, { hex: "#ffffff", label: "White" },
    { hex: "#7f1d1d", label: "Red 900" }, { hex: "#b91c1c", label: "Red 700" },
    { hex: "#ef4444", label: "Red" }, { hex: "#fca5a5", label: "Red 300" },
    { hex: "#7c2d12", label: "Orange 900" }, { hex: "#c2410c", label: "Orange 700" },
    { hex: "#f97316", label: "Orange" }, { hex: "#fdba74", label: "Orange 300" },
    { hex: "#713f12", label: "Amber 900" }, { hex: "#b45309", label: "Amber 700" },
    { hex: "#eab308", label: "Yellow" }, { hex: "#fde047", label: "Yellow 300" },
    { hex: "#14532d", label: "Green 900" }, { hex: "#15803d", label: "Green 700" },
    { hex: "#22c55e", label: "Green" }, { hex: "#86efac", label: "Green 300" },
    { hex: "#164e63", label: "Cyan 900" }, { hex: "#0e7490", label: "Cyan 700" },
    { hex: "#06b6d4", label: "Cyan" }, { hex: "#67e8f9", label: "Cyan 300" },
    { hex: "#1e3a8a", label: "Blue 900" }, { hex: "#1d4ed8", label: "Blue 700" },
    { hex: "#3b82f6", label: "Blue" }, { hex: "#93c5fd", label: "Blue 300" },
    { hex: "#3b0764", label: "Purple 900" }, { hex: "#7e22ce", label: "Purple 700" },
    { hex: "#8b5cf6", label: "Purple" }, { hex: "#c4b5fd", label: "Purple 300" },
    { hex: "#831843", label: "Pink 900" }, { hex: "#be185d", label: "Pink 700" },
    { hex: "#ec4899", label: "Pink" }, { hex: "#f9a8d4", label: "Pink 300" },
];

const HIGHLIGHT_PALETTE = [
    { hex: "#fef08a", label: "Yellow" }, { hex: "#fed7aa", label: "Orange" },
    { hex: "#fecaca", label: "Red" }, { hex: "#bbf7d0", label: "Green" },
    { hex: "#bfdbfe", label: "Blue" }, { hex: "#e9d5ff", label: "Purple" },
    { hex: "#fbcfe8", label: "Pink" }, { hex: "#99f6e4", label: "Teal" },
    { hex: "#ffff00", label: "Vivid yellow" }, { hex: "#ff9900", label: "Vivid orange" },
    { hex: "#ff6666", label: "Vivid red" }, { hex: "#00ff7f", label: "Vivid green" },
    { hex: "#66b3ff", label: "Vivid blue" }, { hex: "#cc99ff", label: "Vivid purple" },
    { hex: "#ff99cc", label: "Vivid pink" }, { hex: "#40e0d0", label: "Vivid teal" },
];

type Props = { editor: Editor };

function useDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return { open, setOpen, ref };
}

function Dropdown({
    trigger,
    children,
    open,
    setOpen,
    dropdownRef,
}: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    open: boolean;
    setOpen: (v: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-0.5 px-2 py-1.5 rounded text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
                {trigger}
                <ChevronDown size={13} className="text-slate-400 mt-px" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-200/60 py-1 min-w-max">
                    {children}
                </div>
            )}
        </div>
    );
}

function DropdownItem({
    onClick,
    isActive,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors ${isActive ? "text-blue-600 bg-blue-50 font-medium" : "text-slate-700"}`}
        >
            {children}
        </button>
    );
}

const Divider = () => <div className="w-px bg-slate-200 mx-0.5 self-stretch" />;

export default function Controls({ editor }: Props) {
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [color, setColor] = useState("#000000");
    const [highlight, setHighlight] = useState("#ffff00");

    const headingDropdown = useDropdown();
    const listDropdown = useDropdown();
    const alignDropdown = useDropdown();
    const tableDropdown = useDropdown();
    const colorDropdown = useDropdown();
    const highlightDropdown = useDropdown();

    const {
        isBold, isItalic, isUnderline, isStrike, isCode,
        isHeading1, isHeading2, isHeading3, isHeading4, isParagraph,
        isBulletList, isOrderedList, isTaskList,
        isCodeBlock, isTable,
        istextAlignLeft, istextAlignCenter, istextAlignRight, istextAlignJustify,
        isBlockquote, canUndo, canRedo,
    } = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor.isActive("bold"),
            isItalic: editor.isActive("italic"),
            isUnderline: editor.isActive("underline"),
            isStrike: editor.isActive("strike"),
            isCode: editor.isActive("code"),
            isHeading1: editor.isActive("heading", { level: 1 }),
            isHeading2: editor.isActive("heading", { level: 2 }),
            isHeading3: editor.isActive("heading", { level: 3 }),
            isHeading4: editor.isActive("heading", { level: 4 }),
            isParagraph: editor.isActive("paragraph"),
            isBulletList: editor.isActive("bulletList"),
            isOrderedList: editor.isActive("orderedList"),
            isTaskList: editor.isActive("taskList"),
            isCodeBlock: editor.isActive("codeBlock"),
            isTable: editor.isActive("table"),
            istextAlignLeft: editor.isActive({ textAlign: "left" }),
            istextAlignCenter: editor.isActive({ textAlign: "center" }),
            istextAlignRight: editor.isActive({ textAlign: "right" }),
            istextAlignJustify: editor.isActive({ textAlign: "justify" }),
            isBlockquote: editor.isActive("blockquote"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
        }),
    });

    // Heading label for dropdown trigger
    const headingLabel = isHeading1 ? (
        <span className="flex items-center gap-1.5"><Heading1 size={15} /><span>Heading 1</span></span>
    ) : isHeading2 ? (
        <span className="flex items-center gap-1.5"><Heading2 size={15} /><span>Heading 2</span></span>
    ) : isHeading3 ? (
        <span className="flex items-center gap-1.5"><Heading3 size={15} /><span>Heading 3</span></span>
    ) : isHeading4 ? (
        <span className="flex items-center gap-1.5"><Heading4 size={15} /><span>Heading 4</span></span>
    ) : (
        <span className="flex items-center gap-1.5"><Pilcrow size={15} /><span>Paragraph</span></span>
    );

    // Alignment label
    const alignLabel = istextAlignCenter ? (
        <TextAlignCenter size={15} />
    ) : istextAlignRight ? (
        <TextAlignEnd size={15} />
    ) : istextAlignJustify ? (
        <TextAlignJustify size={15} />
    ) : (
        <TextAlignStart size={15} />
    );

    // List label
    const listLabel = isBulletList ? (
        <List size={15} />
    ) : isOrderedList ? (
        <ListOrdered size={15} />
    ) : isTaskList ? (
        <ListTodo size={15} />
    ) : (
        <List size={15} />
    );

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
            setLinkUrl("");
            setShowLinkInput(false);
        }
    };

    return (
        <div className="editor-toolbar flex items-center gap-0.5 flex-wrap px-2 py-1.5 border-b border-slate-200 bg-white">

            {/* Undo / Redo */}
            <ControlButton onClick={() => editor.chain().focus().undo().run()} disabled={!canUndo} className="disabled:opacity-30">
                {canUndo ? <UndoDot size={16} /> : <Undo size={16} />}
            </ControlButton>
            <ControlButton onClick={() => editor.chain().focus().redo().run()} disabled={!canRedo} className="disabled:opacity-30">
                {canRedo ? <RedoDot size={16} /> : <Redo size={16} />}
            </ControlButton>

            <Divider />

            {/* Heading / Paragraph dropdown */}
            <Dropdown
                trigger={headingLabel}
                open={headingDropdown.open}
                setOpen={headingDropdown.setOpen}
                dropdownRef={headingDropdown.ref}
            >
                <DropdownItem isActive={isParagraph} onClick={() => { editor.chain().focus().setParagraph().run(); headingDropdown.setOpen(false); }}>
                    <Pilcrow size={15} /> Paragraph
                </DropdownItem>
                <DropdownItem isActive={isHeading1} onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); headingDropdown.setOpen(false); }}>
                    <Heading1 size={15} /> Heading 1
                </DropdownItem>
                <DropdownItem isActive={isHeading2} onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); headingDropdown.setOpen(false); }}>
                    <Heading2 size={15} /> Heading 2
                </DropdownItem>
                <DropdownItem isActive={isHeading3} onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); headingDropdown.setOpen(false); }}>
                    <Heading3 size={15} /> Heading 3
                </DropdownItem>
                <DropdownItem isActive={isHeading4} onClick={() => { editor.chain().focus().toggleHeading({ level: 4 }).run(); headingDropdown.setOpen(false); }}>
                    <Heading4 size={15} /> Heading 4
                </DropdownItem>
            </Dropdown>

            <Divider />

            {/* Inline formatting */}
            <ControlButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={isBold}>
                <Bold size={16} />
            </ControlButton>
            <ControlButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={isItalic}>
                <Italic size={16} />
            </ControlButton>
            <ControlButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={isUnderline}>
                <Underline size={16} />
            </ControlButton>
            <ControlButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={isStrike}>
                <Strikethrough size={16} />
            </ControlButton>
            <ControlButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={isCode}>
                <Code size={16} />
            </ControlButton>

            <Divider />

            {/* List dropdown */}
            <Dropdown
                trigger={listLabel}
                open={listDropdown.open}
                setOpen={listDropdown.setOpen}
                dropdownRef={listDropdown.ref}
            >
                <DropdownItem isActive={isBulletList} onClick={() => { editor.chain().focus().toggleBulletList().run(); listDropdown.setOpen(false); }}>
                    <List size={15} /> Bullet list
                </DropdownItem>
                <DropdownItem isActive={isOrderedList} onClick={() => { editor.chain().focus().toggleOrderedList().run(); listDropdown.setOpen(false); }}>
                    <ListOrdered size={15} /> Ordered list
                </DropdownItem>
                <DropdownItem isActive={isTaskList} onClick={() => { editor.chain().focus().toggleTaskList().run(); listDropdown.setOpen(false); }}>
                    <ListTodo size={15} /> Task list
                </DropdownItem>
            </Dropdown>

            {/* Alignment dropdown */}
            <Dropdown
                trigger={alignLabel}
                open={alignDropdown.open}
                setOpen={alignDropdown.setOpen}
                dropdownRef={alignDropdown.ref}
            >
                <DropdownItem isActive={istextAlignLeft} onClick={() => { editor.chain().focus().setTextAlign("left").run(); alignDropdown.setOpen(false); }}>
                    <TextAlignStart size={15} /> Left
                </DropdownItem>
                <DropdownItem isActive={istextAlignCenter} onClick={() => { editor.chain().focus().setTextAlign("center").run(); alignDropdown.setOpen(false); }}>
                    <TextAlignCenter size={15} /> Center
                </DropdownItem>
                <DropdownItem isActive={istextAlignRight} onClick={() => { editor.chain().focus().setTextAlign("right").run(); alignDropdown.setOpen(false); }}>
                    <TextAlignEnd size={15} /> Right
                </DropdownItem>
                <DropdownItem isActive={istextAlignJustify} onClick={() => { editor.chain().focus().setTextAlign("justify").run(); alignDropdown.setOpen(false); }}>
                    <TextAlignJustify size={15} /> Justify
                </DropdownItem>
            </Dropdown>

            <Divider />

            {/* Table dropdown */}
            <Dropdown
                trigger={<Table size={15} />}
                open={tableDropdown.open}
                setOpen={tableDropdown.setOpen}
                dropdownRef={tableDropdown.ref}
            >
                <DropdownItem isActive={isTable} onClick={() => { editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(); tableDropdown.setOpen(false); }}>
                    <Table size={15} /> Insert table
                </DropdownItem>
                <DropdownItem onClick={() => { editor.chain().focus().addColumnAfter().run(); tableDropdown.setOpen(false); }}>
                    <BetweenVerticalStart size={15} /> Add column
                </DropdownItem>
                <DropdownItem onClick={() => { editor.chain().focus().addRowAfter().run(); tableDropdown.setOpen(false); }}>
                    <BetweenHorizontalStart size={15} /> Add row
                </DropdownItem>
                <div className="my-1 border-t border-slate-100" />
                <DropdownItem onClick={() => { editor.chain().focus().deleteTable().run(); tableDropdown.setOpen(false); }}>
                    <Grid2x2X size={15} className="text-red-400" />
                    <span className="text-red-500">Delete table</span>
                </DropdownItem>
            </Dropdown>

            <Divider />

            {/* Block-level buttons */}
            <ControlButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={isCodeBlock}>
                <Code2 size={16} />
            </ControlButton>
            <ControlButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={isBlockquote}>
                <Quote size={16} />
            </ControlButton>
            <ControlButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus size={16} />
            </ControlButton>

            <Divider />

            {/* Link */}
            <div className="relative">
                <ControlButton className="flex items-center gap-0.5" onClick={() => {
                    setShowLinkInput(!showLinkInput);
                    colorDropdown.setOpen(false);
                    highlightDropdown.setOpen(false);
                }} title="Insert link">
                    <LinkIcon size={16} />
                    <ChevronDown size={13} className="text-slate-400" />
                </ControlButton>
                {showLinkInput && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-200/60 p-2 flex gap-1">
                        <input
                            type="url"
                            placeholder="https://..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addLink()}
                            className="border border-slate-200 rounded-md px-2 py-1 text-sm w-44 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                        <button onClick={addLink} className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-sm transition-colors">
                            <Plus size={14} />
                        </button>
                        <button onClick={() => editor.chain().focus().unsetLink().run()} className="bg-red-50 hover:bg-red-100 text-red-500 px-2 py-1 rounded-md text-sm transition-colors">
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            <Divider />

            {/* Text color */}
            <div ref={colorDropdown.ref} className="relative">
                <button
                    onClick={() => { colorDropdown.setOpen(!colorDropdown.open); highlightDropdown.setOpen(false); setShowLinkInput(false); }}
                    className="flex flex-col items-center justify-center w-7 h-7 rounded hover:bg-slate-100 transition-colors"
                    title="Text color"
                >
                    <span className="text-sm font-bold text-slate-700 leading-none">A</span>
                    <span className="w-4 h-[3px] rounded-full mt-0.5" style={{ backgroundColor: color }} />
                </button>
                {colorDropdown.open && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-3" style={{ width: "216px" }}>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-2">Text color</p>
                        <div className="grid grid-cols-8 gap-1">
                            {COLOR_PALETTE.map((c) => (
                                <button
                                    key={c.hex}
                                    title={c.label}
                                    onClick={() => { editor.chain().focus().setColor(c.hex).run(); setColor(c.hex); colorDropdown.setOpen(false); }}
                                    className="w-6 h-6 rounded hover:scale-110 transition-transform cursor-pointer border border-slate-200 relative"
                                    style={{ backgroundColor: c.hex }}
                                >
                                    {color === c.hex && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: c.hex === "#ffffff" ? "#000" : "#fff" }} />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => { editor.chain().focus().unsetColor().run(); setColor("#000000"); colorDropdown.setOpen(false); }}
                            className="mt-2.5 w-full text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-md py-1.5 transition-colors bg-slate-50 hover:bg-slate-100"
                        >
                            Reset to default
                        </button>
                    </div>
                )}
            </div>

            {/* Highlight color */}
            <div ref={highlightDropdown.ref} className="relative">
                <button
                    onClick={() => { highlightDropdown.setOpen(!highlightDropdown.open); colorDropdown.setOpen(false); setShowLinkInput(false); }}
                    className="flex items-center justify-center w-7 h-7 rounded hover:bg-slate-100 transition-colors"
                    title="Highlight color"
                >
                    <span className="text-sm font-bold leading-none px-[3px] py-px rounded-sm" style={{ backgroundColor: highlight, color: "#1e293b" }}>
                        A
                    </span>
                </button>
                {highlightDropdown.open && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-3" style={{ width: "216px" }}>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1.5">Soft highlights</p>
                        <div className="grid grid-cols-8 gap-1 mb-3">
                            {HIGHLIGHT_PALETTE.slice(0, 8).map((c) => (
                                <button
                                    key={c.hex}
                                    title={c.label}
                                    onClick={() => { editor.chain().focus().toggleHighlight({ color: c.hex }).run(); setHighlight(c.hex); highlightDropdown.setOpen(false); }}
                                    className="w-6 h-6 rounded hover:scale-110 transition-transform cursor-pointer border border-slate-200 relative"
                                    style={{ backgroundColor: c.hex }}
                                >
                                    {highlight === c.hex && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="w-2 h-2 rounded-full bg-slate-600/50" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1.5">Vivid highlights</p>
                        <div className="grid grid-cols-8 gap-1">
                            {HIGHLIGHT_PALETTE.slice(8).map((c) => (
                                <button
                                    key={c.hex}
                                    title={c.label}
                                    onClick={() => { editor.chain().focus().toggleHighlight({ color: c.hex }).run(); setHighlight(c.hex); highlightDropdown.setOpen(false); }}
                                    className="w-6 h-6 rounded hover:scale-110 transition-transform cursor-pointer border border-slate-200 relative"
                                    style={{ backgroundColor: c.hex }}
                                >
                                    {highlight === c.hex && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="w-2 h-2 rounded-full bg-slate-600/50" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => { editor.chain().focus().unsetHighlight().run(); setHighlight("#fef08a"); highlightDropdown.setOpen(false); }}
                            className="mt-2.5 w-full text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-md py-1.5 transition-colors bg-slate-50 hover:bg-slate-100"
                        >
                            Remove highlight
                        </button>
                    </div>
                )}
            </div>

            <Divider />

            {/* Clear formatting */}
            <ControlButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
                <BrushCleaning size={16} />
            </ControlButton>
        </div>
    );
}