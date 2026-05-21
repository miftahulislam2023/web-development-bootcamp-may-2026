Phase 5: Ellipses and Freehand Drawing
What we did:
Expanded the canvas engine capabilities by introducing the Ellipse and freehand Pen tools. We updated the global TypeScript definitions to support path-based coordinates and integrated React-Konva's <Ellipse> and <Line> components.

Challenges Faced:

Challenge (Data Structure Discrepancy): Rectangles use width and height, while freehand lines require an ever-expanding array of [x, y] coordinates.

Solution: Refactored the Layer type to accommodate optional points arrays and conditional stroke properties. We configured the handlePointerMove event to append coordinates to the array in real-time when the Pen tool is active, utilizing Konva's tension property to professionally smooth out jagged mouse movements.

Phase 6: Canvas Management (History & Export)
What we did:
Engineered a robust History state mechanism to support Undo, Redo, and Clear functionalities. We also implemented a frontend-only high-resolution PNG export feature by capturing the Konva Stage reference.

Challenges Faced:

Challenge (History Pollution): Capturing state during onMouseMove flooded the history stack, causing the Undo button to only reverse single pixels of movement.

Solution: Architected the saveHistory dispatcher to fire strictly on the onMouseUp event, ensuring that only completed shapes and strokes are committed to the timeline.

Phase 7: Advanced Canvas & Database Architecture
What we did:
Introduced customizable canvas backgrounds and upgraded the export mechanism. We also initialized the backend architecture utilizing a serverless PostgreSQL database (NeonDB) and Prisma ORM to store canvas layers as JSONB data.

Challenges Faced:

Challenge (Black Background on Export): Transparent HTML5 canvases export as solid black in JPEG format or in certain image viewers.

Solution: Injected a dedicated Konva <Rect> at the bottom of the layer stack bound to a Zustand backgroundColor state.

Challenge (Modern File Saving): Standard programmatic downloads bypass the OS "Save As" prompt.

Solution: Implemented the modern browser File System Access API (showSaveFilePicker), falling back to standard anchor-tag downloads for older browsers.

Phase 8: API Routing & Cloud Sync
What we did:
Built Next.js API endpoints (GET and POST) to push and pull the JSONB layer data from NeonDB. We integrated sonner to provide professional, toast-based UI feedback during asynchronous operations.

Challenges Faced:

Challenge (Stale Data): Next.js aggressively cached the API routes, causing the browser to load empty or outdated canvas data upon refresh.

Solution: Applied export const dynamic = 'force-dynamic' to the API route to strictly bypass the Next.js cache layer.

Phase 9: Authentication & Attribution
What we did:
Secured the application using NextAuth.js (Auth.js) to support GitHub and Google OAuth providers. The database schema was updated to establish a relational link between a User and their Boards. The API was locked down to reject unauthorized save attempts.

Challenges Faced:

Challenge (Prisma Edge Initialization): Next.js edge runtime threw a PrismaClientInitializationError due to strict configuration requirements in Prisma v7.

Solution: Executed a strategic downgrade to the Prisma v5 stable branch and integrated @prisma/adapter-pg to ensure seamless compatibility with Next.js and the serverless Postgres environment.

Phase 10: Secure Routing & The User Dashboard
What we did:
Extracted the core canvas into a dynamic route (/board/[id]). We built a server-rendered User Dashboard at the root (/) that queries the database directly to display only the boards authored by the authenticated session user.

Challenges Faced:

Challenge (Async Params): React 19 / Next 16 strictly requires dynamic route parameters to be treated as Promises.

Solution: Utilized the new React use() hook to safely unwrap the params object and synchronize the URL boardId with the Zustand global store.

Phase 11: UI/UX Overhaul & The Text Tool
What we did:
Executed a complete UI overhaul to match modern SaaS aesthetics (e.g., Figma, Miro). Upgraded toolbars with glassmorphism (backdrop-blur), added a CSS-based dotted grid background, and integrated user avatars via Shadcn Dropdown menus. We also deployed a foundational Text stamping tool to the canvas.

Challenges Faced:

Challenge (Performance vs. Aesthetics): Rendering thousands of dots natively in HTML5 Canvas for a grid background causes severe performance degradation.

Solution: Offloaded the grid rendering entirely to the browser's CSS engine using highly optimized Tailwind radial-gradient background patterns, keeping the Konva canvas unpolluted and performant.

Current Functionalities (How to Test)
Authentication Flow: Click "Get Started Free" to log in via NextAuth. You will be redirected to your personal dashboard.

Dashboard Management: Click "New Board" to dynamically generate a UUID, create a database record, and route to the active canvas. Existing boards display their last modified dates.

Canvas Drawing & Text:

Use the Pen to draw smooth freehand lines.

Use the Text tool to stamp text layers onto the grid.

History Management: Draw three separate shapes. Click the Undo arrow twice, then the Redo arrow once. The shapes will appear and disappear sequentially.

Cloud Sync: Draw a shape and click the Cloud icon in the toolbar. A "Saving..." toast will appear, followed by a success message. Completely refresh the page; your shapes will instantly reload from the PostgreSQL database.

Export Dialogue: Click the Download icon. The browser will natively ask where you want to save your high-resolution PNG/JPEG file.