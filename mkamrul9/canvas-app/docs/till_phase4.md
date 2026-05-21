Canvas Application: Progress Report (Phases 1-4)
Overview
We are building a production-grade, highly scalable canvas drawing application. The core objective is to create a visually polished, highly performant single-player whiteboard that is architecturally prepared for real-time multiplayer collaboration in the future.

Tech Stack & System Architecture
Core Framework: Next.js (App Router) - Chosen for fast routing, robust API capabilities, and modern React features.

Canvas Engine: React-Konva - Allows declarative rendering of HTML5 Canvas elements, pairing perfectly with React's component model.

State Management: Zustand - Selected over Redux or Context API for its lightweight footprint and high-performance, rapid state updates (crucial for real-time mouse tracking).

Styling & UI: Tailwind CSS & Shadcn UI - Ensures a sleek, professional, and accessible user interface without writing redundant CSS.

Language: TypeScript - Enforced with strict typings to ensure code reliability and catch runtime errors during compilation.

Phase Summaries
Phase 1: Project Setup & Architecture
What we did:
Initialized the repository with Next.js and established a strict, scalable directory structure separating UI components, canvas logic, and global state. We also defined our core TypeScript interfaces (types/canvas.ts) early to prevent data-structure inconsistencies.

Processes: Used create-next-app, integrated Tailwind, and installed the base dependencies (zustand, react-konva, lucide-react).

Phase 2: Global State & The Canvas Foundation
What we did:
Built the foundational useCanvasStore.ts using Zustand to track the activeTool, activeColor, and the array of layers (shapes). We also implemented a responsive <Board/> component that automatically resizes to the window dimensions.

Challenges Faced:

Challenge 1 (SSR Hydration): Next.js attempts to render components on the server, but react-konva relies on the browser's window object, causing compilation crashes.

Solution: Utilized Next.js next/dynamic with ssr: false to force the Canvas component to load strictly on the client side.

Challenge 2 (Cascading Renders): React ESLint warnings triggered due to updating state (setDimensions) synchronously inside a useEffect.

Solution: Initialized the useState directly with window.innerWidth since the component is guaranteed to be client-side, removing the need for an initial useEffect state mutation.

Phase 3: Mouse Events & Drawing Logic
What we did:
Engineered the core drawing mechanism. We captured pointer coordinates using onMouseDown, onMouseMove, and onMouseUp. When a user drags the mouse, a temporary shape is rapidly updated in the Zustand store and rendered in real-time via React-Konva.

Challenges Faced:

Challenge (Strict Typing & Imports): Missing imports caused Rect is not defined errors, and the event handlers lacked strict TypeScript definitions.

Solution: Imported specific Konva elements (Rect, Stage) and utilized Konva's built-in event types (Konva.KonvaEventObject<MouseEvent TouchEvent |>) to completely eliminate any types, ensuring the app is touch-screen compatible and meets strict bootcamp engineering standards. We also integrated the uuid library to ensure every shape has a strictly unique React key.

Phase 4: Professional UI Integration
What we did:
Designed and integrated floating, minimalist user interfaces using Shadcn UI components. We built a top-centered Toolbar for tool selection and a right-aligned PropertiesPanel for color selection. Both were connected directly to the Zustand store to control the canvas state.

Challenges Faced:

Challenge (Event Interception): Clicking on UI elements (like a color button) inadvertently triggered the canvas onMouseDown event, causing the app to draw a shape instead of clicking the button.

Solution: Resolved the stacking context by adjusting the DOM order (rendering the Canvas first) and applying z-50 tailwind classes to the UI panels. This created a physical barrier, ensuring UI clicks do not bleed through to the canvas below.

Current Functionalities (How to Test)
Responsive Canvas: Resize the browser window; the canvas will dynamically adjust without scrollbars.

Tool Selection: Click the tools in the top toolbar. The active tool is visually highlighted.

Color Selection: Click a color in the right sidebar. The active color scales up slightly to indicate selection.

Drawing Rectangles:

Select the Rectangle tool.

Select a color.

Click and drag anywhere on the canvas.

Expected Result: A colored rectangle is drawn smoothly. You can draw in any direction (top-left to bottom-right, or bottom-right to top-left) and the math handles the absolute dimensions automatically.

No Interference: Clicking buttons on the UI toolbars will not trigger accidental drawing on the canvas.