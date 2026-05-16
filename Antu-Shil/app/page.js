"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const BLOCKS = [
  { type: "hero", label: "Hero Section", icon: "⬛", category: "Layout" },
  { type: "heading", label: "Heading", icon: "H", category: "Text" },
  { type: "paragraph", label: "Paragraph", icon: "¶", category: "Text" },
  { type: "button", label: "Button", icon: "⬜", category: "Elements" },
  { type: "image", label: "Image", icon: "🖼", category: "Media" },
  { type: "columns2", label: "2 Columns", icon: "▥", category: "Layout" },
  { type: "card", label: "Card", icon: "▭", category: "Elements" },
  { type: "divider", label: "Divider", icon: "—", category: "Elements" },
  { type: "navbar", label: "Navbar", icon: "≡", category: "Layout" },
  { type: "footer", label: "Footer", icon: "⊟", category: "Layout" },
  { type: "testimonial", label: "Testimonial", icon: "❝", category: "Elements" },
  { type: "cta", label: "CTA Banner", icon: "★", category: "Layout" },
];

const THEMES = {
  ocean: { bg: "#0f172a", surface: "#1e293b", accent: "#38bdf8", text: "#f1f5f9", muted: "#64748b" },
  forest: { bg: "#1a2e1a", surface: "#243d24", accent: "#4ade80", text: "#f0fdf4", muted: "#6b7280" },
  rose: { bg: "#1c0a13", surface: "#2d1321", accent: "#fb7185", text: "#fff1f2", muted: "#9f7f8a" },
  slate: { bg: "#f8fafc", surface: "#ffffff", accent: "#6366f1", text: "#0f172a", muted: "#64748b" },
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function defaultContent(type) {
  switch (type) {
    case "hero": return { title: "Welcome to My Website", subtitle: "Build beautiful pages without writing code.", cta: "Get Started" };
    case "heading": return { text: "Section Heading", level: "h2" };
    case "paragraph": return { text: "Add your content here. Click to edit this text and make it your own." };
    case "button": return { text: "Click Me", variant: "primary" };
    case "image": return { src: "https://placehold.co/800x400/1e293b/38bdf8?text=Image", alt: "Placeholder" };
    case "columns2": return { left: "Left column content here.", right: "Right column content here." };
    case "card": return { title: "Card Title", body: "Card description goes here.", cta: "Learn More" };
    case "divider": return { style: "solid" };
    case "navbar": return { brand: "MySite", links: ["Home", "About", "Services", "Contact"] };
    case "footer": return { brand: "MySite", tagline: "© 2026 All rights reserved." };
    case "testimonial": return { quote: "This is the best product I've ever used. Highly recommend!", author: "Jane Doe", role: "CEO, Acme Corp" };
    case "cta": return { title: "Ready to get started?", subtitle: "Join thousands of happy users today.", cta: "Start Free" };
    default: return {};
  }
}

function BlockRenderer({ block, theme, selected, onClick, onUpdate }) {
  const t = THEMES[theme];
  const base = {
    cursor: "pointer",
    position: "relative",
    transition: "outline 0.15s",
    outline: selected ? `2px solid ${t.accent}` : "2px solid transparent",
    borderRadius: 8,
  };

  const handleClick = (e) => { e.stopPropagation(); onClick(block.id); };

  switch (block.type) {
    case "navbar":
      return (
        <div style={{ ...base, background: t.surface, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={handleClick}>
          <span style={{ color: t.accent, fontWeight: 700, fontSize: 20 }}>{block.content.brand}</span>
          <div style={{ display: "flex", gap: 24 }}>
            {block.content?.links?.map((l, i) => (
              <span key={i} style={{ color: t.muted, fontSize: 14 }}>{l}</span>
            ))}
          </div>
        </div>
      );
    case "hero":
      return (
        <div style={{ ...base, background: `linear-gradient(135deg, ${t.bg} 0%, ${t.surface} 100%)`, padding: "80px 48px", textAlign: "center" }} onClick={handleClick}>
          <h1 style={{ color: t.text, fontSize: 48, fontWeight: 800, margin: "0 0 16px" }}>{block.content.title}</h1>
          <p style={{ color: t.muted, fontSize: 20, margin: "0 0 32px" }}>{block.content.subtitle}</p>
          <button style={{ background: t.accent, color: t.bg, border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{block.content.cta}</button>
        </div>
      );
    case "heading":
      const Tag = block.content.level || "h2";
      const sizes = { h1: 40, h2: 32, h3: 24, h4: 20 };
      return (
        <div style={{ ...base, padding: "20px 32px" }} onClick={handleClick}>
          <Tag style={{ color: t.text, fontSize: sizes[Tag] || 32, fontWeight: 700, margin: 0 }}>{block.content.text}</Tag>
        </div>
      );
    case "paragraph":
      return (
        <div style={{ ...base, padding: "12px 32px" }} onClick={handleClick}>
          <p style={{ color: t.muted, fontSize: 16, lineHeight: 1.7, margin: 0 }}>{block.content.text}</p>
        </div>
      );
    case "button":
      return (
        <div style={{ ...base, padding: "16px 32px" }} onClick={handleClick}>
          <button style={{ background: block.content.variant === "primary" ? t.accent : "transparent", color: block.content.variant === "primary" ? t.bg : t.accent, border: `2px solid ${t.accent}`, borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            {block.content.text}
          </button>
        </div>
      );
    case "image":
      return (
        <div style={{ ...base, padding: "16px 32px" }} onClick={handleClick}>
          <img src={block.content.src} alt={block.content.alt} style={{ width: "100%", borderRadius: 8, display: "block" }} />
        </div>
      );
    case "columns2":
      return (
        <div style={{ ...base, padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} onClick={handleClick}>
          <div style={{ background: t.surface, borderRadius: 8, padding: 20 }}>
            <p style={{ color: t.muted, margin: 0, lineHeight: 1.7 }}>{block.content.left}</p>
          </div>
          <div style={{ background: t.surface, borderRadius: 8, padding: 20 }}>
            <p style={{ color: t.muted, margin: 0, lineHeight: 1.7 }}>{block.content.right}</p>
          </div>
        </div>
      );
    case "card":
      return (
        <div style={{ ...base, padding: "24px 32px" }} onClick={handleClick}>
          <div style={{ background: t.surface, borderRadius: 12, padding: 28, border: `1px solid ${t.muted}22` }}>
            <h3 style={{ color: t.text, fontSize: 20, fontWeight: 700, margin: "0 0 10px" }}>{block.content.title}</h3>
            <p style={{ color: t.muted, margin: "0 0 20px", lineHeight: 1.6 }}>{block.content.body}</p>
            <span style={{ color: t.accent, fontSize: 14, fontWeight: 600 }}>{block.content.cta} →</span>
          </div>
        </div>
      );
    case "divider":
      return (
        <div style={{ ...base, padding: "12px 32px" }} onClick={handleClick}>
          <hr style={{ border: "none", borderTop: `1px ${block.content.style} ${t.muted}44`, margin: 0 }} />
        </div>
      );
    case "testimonial":
      return (
        <div style={{ ...base, padding: "32px 48px", background: t.surface, textAlign: "center" }} onClick={handleClick}>
          <p style={{ color: t.text, fontSize: 20, fontStyle: "italic", margin: "0 0 20px", lineHeight: 1.6 }}>
            "{block.content.quote}"</p>
          <p style={{ color: t.accent, fontWeight: 700, margin: "0 0 4px" }}>{block.content.author}</p>
          <p style={{ color: t.muted, fontSize: 13, margin: 0 }}>{block.content.role}</p>
        </div>
      );
    case "cta":
      return (
        <div style={{ ...base, background: t.accent, padding: "56px 48px", textAlign: "center" }} onClick={handleClick}>
          <h2 style={{ color: t.bg, fontSize: 36, fontWeight: 800, margin: "0 0 12px" }}>{block.content.title}</h2>
          <p style={{ color: `${t.bg}bb`, fontSize: 18, margin: "0 0 28px" }}>{block.content.subtitle}</p>
          <button style={{ background: t.bg, color: t.accent, border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{block.content.cta}</button>
        </div>
      );
    case "footer":
      return (
        <div style={{ ...base, background: t.surface, padding: "32px", textAlign: "center" }} onClick={handleClick}>
          <p style={{ color: t.accent, fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>{block.content.brand}</p>
          <p style={{ color: t.muted, fontSize: 13, margin: 0 }}>{block.content.tagline}</p>
        </div>
      );
    default:
      return <div style={{ ...base, padding: 20, background: t.surface }} onClick={handleClick}><span style={{ color: t.muted }}>Unknown block</span></div>;
  }
}

function PropertyPanel({ block, onUpdate, theme }) {
  const t = THEMES[theme];
  if (!block) return (
    <div style={{ padding: 24, color: t.muted, textAlign: "center", marginTop: 60 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
      <p style={{ fontSize: 14 }}>Click a block on the canvas to edit its properties</p>
    </div>
  );

  const update = (key, value) => onUpdate(block.id, { ...block.content, [key]: value });
  const inputStyle = { width: "100%", background: t.surface, border: `1px solid ${t.muted}44`, borderRadius: 6, padding: "8px 10px", color: t.text, fontSize: 13, boxSizing: "border-box", marginTop: 4 };
  const labelStyle = { color: t.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 };

  const fields = [];
  const c = block.content;

  switch (block.type) {
    case "hero":
      fields.push(
        <div key="title" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={c.title} onChange={e => update("title", e.target.value)} />
        </div>,
        <div key="sub" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Subtitle</label>
          <textarea style={{ ...inputStyle, height: 64, resize: "vertical" }} value={c.subtitle} onChange={e => update("subtitle", e.target.value)} />
        </div>,
        <div key="cta" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>CTA Text</label>
          <input style={inputStyle} value={c.cta} onChange={e => update("cta", e.target.value)} />
        </div>
      );
      break;
    case "heading":
      fields.push(
        <div key="text" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Text</label>
          <input style={inputStyle} value={c.text} onChange={e => update("text", e.target.value)} />
        </div>,
        <div key="level" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Level</label>
          <select style={inputStyle} value={c.level} onChange={e => update("level", e.target.value)}>
            {["h1", "h2", "h3", "h4"].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>
      );
      break;
    case "paragraph":
      fields.push(
        <div key="text" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Text</label>
          <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={c.text} onChange={e => update("text", e.target.value)} />
        </div>
      );
      break;
    case "button":
      fields.push(
        <div key="text" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Label</label>
          <input style={inputStyle} value={c.text} onChange={e => update("text", e.target.value)} />
        </div>,
        <div key="variant" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Variant</label>
          <select style={inputStyle} value={c.variant} onChange={e => update("variant", e.target.value)}>
            <option value="primary">Primary</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      );
      break;
    case "image":
      fields.push(
        <div key="src" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Image URL</label>
          <input style={inputStyle} value={c.src} onChange={e => update("src", e.target.value)} />
        </div>,
        <div key="alt" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Alt Text</label>
          <input style={inputStyle} value={c.alt} onChange={e => update("alt", e.target.value)} />
        </div>
      );
      break;
    case "card":
      fields.push(
        <div key="title" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={c.title} onChange={e => update("title", e.target.value)} />
        </div>,
        <div key="body" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Body</label>
          <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={c.body} onChange={e => update("body", e.target.value)} />
        </div>,
        <div key="cta" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Link Text</label>
          <input style={inputStyle} value={c.cta} onChange={e => update("cta", e.target.value)} />
        </div>
      );
      break;
    case "testimonial":
      fields.push(
        <div key="quote" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Quote</label>
          <textarea style={{ ...inputStyle, height: 90, resize: "vertical" }} value={c.quote} onChange={e => update("quote", e.target.value)} />
        </div>,
        <div key="author" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Author</label>
          <input style={inputStyle} value={c.author} onChange={e => update("author", e.target.value)} />
        </div>,
        <div key="role" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Role</label>
          <input style={inputStyle} value={c.role} onChange={e => update("role", e.target.value)} />
        </div>
      );
      break;
    case "navbar":
      fields.push(
        <div key="brand" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Brand Name</label>
          <input style={inputStyle} value={c.brand} onChange={e => update("brand", e.target.value)} />
        </div>,
        <div key="links" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Nav Links (comma separated)</label>
          <input style={inputStyle} value={c.links?.join(", ")} onChange={e => update("links", e.target.value.split(",").map(s => s.trim()))} />
        </div>
      );
      break;
    case "cta":
      fields.push(
        <div key="title" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={c.title} onChange={e => update("title", e.target.value)} />
        </div>,
        <div key="sub" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Subtitle</label>
          <input style={inputStyle} value={c.subtitle} onChange={e => update("subtitle", e.target.value)} />
        </div>,
        <div key="cta" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Button Text</label>
          <input style={inputStyle} value={c.cta} onChange={e => update("cta", e.target.value)} />
        </div>
      );
      break;
    case "footer":
      fields.push(
        <div key="brand" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Brand</label>
          <input style={inputStyle} value={c.brand} onChange={e => update("brand", e.target.value)} />
        </div>,
        <div key="tagline" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Tagline</label>
          <input style={inputStyle} value={c.tagline} onChange={e => update("tagline", e.target.value)} />
        </div>
      );
      break;
    case "columns2":
      fields.push(
        <div key="left" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Left Column</label>
          <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={c.left} onChange={e => update("left", e.target.value)} />
        </div>,
        <div key="right" style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Right Column</label>
          <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={c.right} onChange={e => update("right", e.target.value)} />
        </div>
      );
      break;
    default:
      fields.push(<p key="na" style={{ color: t.muted, fontSize: 13 }}>No editable properties for this block.</p>);
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${t.muted}33` }}>
        <p style={{ color: t.accent, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Editing</p>
        <p style={{ color: t.text, fontSize: 15, fontWeight: 600, margin: 0 }}>{BLOCKS.find(b => b.type === block.type)?.label}</p>
      </div>
      {fields}
    </div>
  );
}

export default function Home() {
  const [blocks, setBlocks] = useState([
    { id: "nav-1", type: "navbar", content: defaultContent("navbar") },
    { id: "hero-1", type: "hero", content: defaultContent("hero") },
    { id: "card-1", type: "card", content: defaultContent("card") },
    { id: "footer-1", type: "footer", content: defaultContent("footer") },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [theme, setTheme] = useState("ocean");
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggingExisting, setDraggingExisting] = useState(null);
  const [preview, setPreview] = useState(false);
  const t = THEMES[theme];

  const selectedBlock = blocks.find(b => b.id === selectedId);

  const handlePanelUpdate = (id, newContent) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setBlocks(prev => prev.filter(b => b.id !== selectedId));
    setSelectedId(null);
  };

  const handleMoveUp = () => {
    if (!selectedId) return;
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === selectedId);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const handleMoveDown = () => {
    if (!selectedId) return;
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === selectedId);
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const onPaletteDragStart = (type) => {
    setDraggedBlock(type);
    setDraggingExisting(null);
  };

  const onCanvasDragStart = (id) => {
    setDraggingExisting(id);
    setDraggedBlock(null);
  };

  const onCanvasDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const onCanvasDrop = (e, index) => {
    e.preventDefault();
    if (draggedBlock) {
      const newBlock = { id: generateId(), type: draggedBlock, content: defaultContent(draggedBlock) };
      setBlocks(prev => {
        const next = [...prev];
        next.splice(index, 0, newBlock);
        return next;
      });
      setSelectedId(newBlock.id);
    } else if (draggingExisting) {
      setBlocks(prev => {
        const fromIdx = prev.findIndex(b => b.id === draggingExisting);
        if (fromIdx === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        const toIdx = index > fromIdx ? index - 1 : index;
        next.splice(toIdx, 0, moved);
        return next;
      });
    }
    setDraggedBlock(null);
    setDraggingExisting(null);
    setDragOverIndex(null);
  };

  const onDragEnd = () => {
    setDraggedBlock(null);
    setDraggingExisting(null);
    setDragOverIndex(null);
  };

  const categories = [...new Set(BLOCKS.map(b => b.category))];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: t.bg, overflow: "hidden" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 52, background: t.surface, borderBottom: `1px solid ${t.muted}22`, flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: t.accent, fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>✦ BuildIt</span>
          <span style={{ color: t.muted, fontSize: 12 }}>Visual Website Builder</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: t.muted, fontSize: 12, marginRight: 4 }}>Theme:</span>
          {Object.keys(THEMES).map(k => (
            <button key={k} onClick={() => setTheme(k)} style={{ width: 22, height: 22, borderRadius: "50%", background: THEMES[k].accent, border: theme === k ? `2px solid ${t.text}` : "2px solid transparent", cursor: "pointer" }} title={k} />
          ))}
          <div style={{ width: 1, height: 24, background: `${t.muted}44`, margin: "0 8px" }} />
          <button onClick={() => setPreview(!preview)} style={{ background: preview ? t.accent : "transparent", color: preview ? t.bg : t.accent, border: `1px solid ${t.accent}`, borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {preview ? "✏ Edit" : "👁 Preview"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Panel — Block Palette */}
        {!preview && (
          <div style={{ width: 200, background: t.surface, borderRight: `1px solid ${t.muted}22`, overflowY: "auto", flexShrink: 0 }}>
            <div style={{ padding: "14px 14px 8px", color: t.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Blocks</div>
            {categories.map(cat => (
              <div key={cat}>
                <div style={{ padding: "6px 14px 4px", color: `${t.muted}99`, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{cat}</div>
                {BLOCKS.filter(b => b.category === cat).map(b => (
                  <div
                    key={b.type}
                    draggable
                    onDragStart={() => onPaletteDragStart(b.type)}
                    onDragEnd={onDragEnd}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", cursor: "grab", borderRadius: 6, margin: "2px 6px", transition: "background 0.15s", userSelect: "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = `${t.accent}18`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{b.icon}</span>
                    <span style={{ color: t.text, fontSize: 13 }}>{b.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Canvas */}
        <div
          style={{ flex: 1, overflowY: "auto", background: preview ? t.bg : `${t.bg}cc`, padding: preview ? 0 : "20px 40px" }}
          onClick={() => setSelectedId(null)}
        >
          {!preview && (
            <div style={{ maxWidth: 860, margin: "0 auto 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: t.muted, fontSize: 12 }}>Canvas — {blocks.length} blocks</span>
              {selectedId && (
                <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                  <button onClick={handleMoveUp} style={{ background: "transparent", border: `1px solid ${t.muted}44`, color: t.muted, borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>↑ Up</button>
                  <button onClick={handleMoveDown} style={{ background: "transparent", border: `1px solid ${t.muted}44`, color: t.muted, borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>↓ Down</button>
                  <button onClick={handleDelete} style={{ background: "transparent", border: `1px solid #f8717144`, color: "#f87171", borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>✕ Delete</button>
                </div>
              )}
            </div>
          )}

          <div style={{ maxWidth: 860, margin: "0 auto", background: t.bg, borderRadius: preview ? 0 : 12, overflow: "hidden", boxShadow: preview ? "none" : `0 0 0 1px ${t.muted}22` }}>
            {/* Drop zone at top */}
            {!preview && (
              <div
                onDragOver={e => onCanvasDragOver(e, 0)}
                onDrop={e => onCanvasDrop(e, 0)}
                style={{ height: dragOverIndex === 0 ? 48 : 8, background: dragOverIndex === 0 ? `${t.accent}33` : "transparent", borderRadius: 4, transition: "all 0.15s", margin: "0 4px", border: dragOverIndex === 0 ? `2px dashed ${t.accent}` : "2px dashed transparent" }}
              />
            )}

            {blocks.map((block, index) => (
              <div key={block.id} style={{ position: "relative" }}>
                <div
                  draggable={!preview}
                  onDragStart={() => onCanvasDragStart(block.id)}
                  onDragEnd={onDragEnd}
                  style={{ opacity: draggingExisting === block.id ? 0.4 : 1 }}
                >
                  <BlockRenderer
                    block={block}
                    theme={theme}
                    selected={selectedId === block.id && !preview}
                    onClick={(id) => !preview && setSelectedId(id)}
                    onUpdate={handlePanelUpdate}
                  />
                </div>
                {!preview && (
                  <div
                    onDragOver={e => onCanvasDragOver(e, index + 1)}
                    onDrop={e => onCanvasDrop(e, index + 1)}
                    style={{ height: dragOverIndex === index + 1 ? 48 : 8, background: dragOverIndex === index + 1 ? `${t.accent}33` : "transparent", borderRadius: 4, transition: "all 0.15s", margin: "0 4px", border: dragOverIndex === index + 1 ? `2px dashed ${t.accent}` : "2px dashed transparent" }}
                  />
                )}
              </div>
            ))}

            {blocks.length === 0 && (
              <div style={{ padding: "80px 40px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                <p style={{ color: t.muted, fontSize: 16 }}>Drag blocks from the left panel to start building</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Properties */}
        {!preview && (
          <div style={{ width: 240, background: t.surface, borderLeft: `1px solid ${t.muted}22`, overflowY: "auto", flexShrink: 0 }}>
            <div style={{ padding: "14px 20px 8px", color: t.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, borderBottom: `1px solid ${t.muted}22` }}>Properties</div>
            <PropertyPanel block={selectedBlock} onUpdate={handlePanelUpdate} theme={theme} />
          </div>
        )}
      </div>
    </div>
  );
}
