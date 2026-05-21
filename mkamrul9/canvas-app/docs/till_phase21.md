Phase 12: Advanced UX Polish & Tool Refinement
What we did:
Executed a sophisticated typographical and thematic overhaul utilizing the "Inter" font and a muted SaaS color palette. We implemented React-Konva's <Transformer> to allow users to click, resize, and rotate existing shapes, and added a dynamic HTML <textarea> overlay for seamless text editing.

Challenges Faced:

Challenge (Text Input Focus): Native canvas text rendering cannot handle standard typing cursors or text selection natively.

Solution: Engineered a synchronized overlay mechanism. Double-clicking canvas text hides the Konva node and spawns an absolutely positioned HTML <textarea> directly over the exact coordinates, saving the text back to the canvas upon onBlur.

Phase 13: The Ultimate UX Refinement & Eraser Tools
What we did:
Re-engineered the toolbar to support grouped sub-menus, separating the "Normal Eraser" and "Object Eraser". We introduced a custom rainbow color picker with memory for recent colors, and built a tri-state background cycler (White, Dotted, Black).

Challenges Faced:

Challenge (Destructive Erasing): Drawing white lines to simulate an eraser ruined the underlying dotted grid background.

Solution: Separated the background layer from the drawing layer. We applied globalCompositeOperation="destination-out" to the eraser strokes, allowing them to literally "eat away" the pixels of the shapes above without affecting the CSS background below.

Phase 14: The Infinite Canvas & Smart Selection
What we did:
Upgraded the fixed board to an Infinite Canvas utilizing a "Hand" panning tool. We grouped pen thickness variants and shape selections into floating popovers. We also implemented a Marquee Box Selection tool to capture multiple shapes at once.

Challenges Faced:

Challenge (Grid Synchronization): When panning the infinite canvas, the background dots remained static, destroying the illusion of camera movement.

Solution: Bound the CSS background-position of the wrapper <div> directly to the Zustand camera.x and camera.y coordinates, ensuring the grid moves precisely with the user's viewport.

Phase 15: Deep Navigation & Extended Shapes
What we did:
Expanded the geometric library by adding Triangles, Diamonds, and Stars. We implemented mouse-wheel math for zooming (Ctrl/Cmd + Scroll) and built a "Minimap HUD" in the bottom corner to display current zoom levels and viewport controls.

Challenges Faced:

Challenge (Zoom Origin Math): Scaling the canvas normally zoomed directly into the top-left corner (0,0) rather than where the user's mouse pointer was aimed.

Solution: Implemented complex offset calculations during the onWheel event, adjusting the camera coordinates relative to the pointer's location and the new scale factor to achieve a natural "zoom-to-cursor" effect.

Phase 16: Access Control, Opacity, and Advanced Geometry
What we did:
Introduced advanced geometry (Arrows, Straight Lines, Hexagons). Added a universal shape opacity slider. We secured the board state by introducing a "Lock" toggle to prevent accidental edits, and integrated the modern Clipboard API for a one-click "Share Link" feature.

Challenges Faced:

Challenge (State Protection): Locking the board needed to prevent drawing without disabling the user's ability to navigate the infinite canvas.

Solution: Injected an isLocked guard clause into the onPointerDown and onPointerMove event handlers, explicitly blocking all state mutations unless the active tool was the "Hand" panning tool.

Phase 17: The Collaboration Prep (Permissions, Comments & Minimap)
What we did:
Built a dynamic "Share" modal allowing owners to set Viewer, Commenter, or Editor permissions. We deployed a visual, HTML-based Minimap to the HUD, and added a new "Comment" layer type that renders as a yellow sticky note.

Challenges Faced:

Challenge (Minimap Performance): Rendering a secondary, scaled-down Konva <Stage> to act as the minimap caused severe memory and rendering lag.

Solution: Designed a "pseudo-minimap" by mapping the layers array to standard, lightweight HTML <div> elements, calculating their percentage-based positions relative to a fixed 10,000x10,000 coordinate grid.

Phase 18: Professional UI Layout & Collaboration Refinement
What we did:
Restructured the application interface to match enterprise SaaS standards. We extracted global actions (Save, Clear, Download) into a dedicated Top-Right ActionToolbar, and decoupled the background "pattern" from the background "color" to allow endless combinations.

Challenges Faced:

Challenge (Comment Artifacts): The newly introduced Comment sticky notes crashed the Konva rendering cycle or lost their text when moved.

Solution: Identified an invalid React-Konva nesting structure. Wrapped the background <Rect> and the foreground <Text> of the sticky notes securely inside a Konva <Group> component to ensure they behave as a single draggable entity.

Phase 19: Minimap Navigation & Compact SaaS Properties
What we did:
Redesigned the right-hand Properties Panel from a tall, screen-clipping column into compact, icon-triggered popover menus. We also upgraded the Minimap from a passive display into an interactive navigation tool.

Challenges Faced:

Challenge (Minimap Inverse Kinematics): Clicking the minimap needed to instantly transport the user's main camera to that exact location on the infinite canvas.

Solution: Reverse-engineered the scale math. Attached onPointerDown and onPointerMove to the minimap container, converting the mouse's click percentage inside the tiny map box back into absolute x/y coordinates to update the global camera state.

Phase 20: Laser Pointer, Export Engine, & Core Fixes
What we did:
Engineered a professional SVG/PNG/JPEG export dropdown menu. We also added a "Laser Pointer" presentation tool that leaves a glowing trail that automatically fades out over time.

Challenges Faced:

Challenge (Vector Exports): HTML5 <canvas> natively exports to rasterized PNG/JPEG, making high-quality vector sharing impossible.

Solution: Engineered a custom SVG compiler function. When exporting to SVG, the app iterates through the Zustand layers array, translating mathematical shape coordinates (x, y, radius, fill) into raw XML <svg> strings, bundling it into a downloadable Blob.

Phase 21: Images, Lasso Selection & Safety Guards
What we did:
Enabled native image uploads utilizing the HTML5 FileReader API. We upgraded the Marquee tool by adding a freehand "Lasso" selection mode. Finally, we added explicit confirmation guards to the "Clear Canvas" action to prevent catastrophic data loss.

Challenges Faced:

Challenge (Complex Polygon Selection): Determining if a drawn shape falls inside an irregular, freehand lasso path requires heavy computational geometry.

Solution: Implemented the Ray-Casting algorithm. When the lasso path closes, the engine calculates the mathematical center of every shape on the board, firing a virtual "ray" to determine if that center point intersects the drawn boundary an odd number of times (confirming it is inside).

Current Functionalities (How to Test)
Infinite Panning & Zoom: Select the Hand tool (or hold Spacebar) to drag infinitely across the dotted grid. Use Ctrl/Cmd + Scroll to zoom in and out.

Interactive Minimap: Click the Map icon in the bottom left. Click and drag anywhere inside the small window to instantly teleport your viewport across the infinite canvas.

Lasso Selection: Click the dropdown arrow next to the Select arrow. Choose Lasso, then draw a circle around multiple shapes. They will group together inside a single Transformer bounding box.

Laser Pointer: Select the Magic Wand icon and drag across the screen. A red glowing line will follow your cursor and smoothly fade away.

Image Upload: Click the Image icon. Select a local file from your machine; it will be converted to Base64 and rendered directly onto the canvas.

Multi-Format Export: Click the Download icon in the top right. Select PNG, JPEG, or SVG to trigger the native OS Save dialogue using the File System Access API.

Permissions & Sharing: Click the Share button. Change the dropdown to "Can View" or "Can Edit", and the generated link will copy to your clipboard to enforce those roles.