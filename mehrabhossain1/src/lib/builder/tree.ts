import type {
  BuilderElement,
  ContainerElement,
  ElementStyles,
  PageDocument,
} from "@/types/builder";

// --- internal helpers ---

function isContainer(el: BuilderElement): el is ContainerElement {
  return el.type === "container";
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** True if `id` is `el` itself or anywhere within its subtree. */
function containsId(el: BuilderElement, id: string): boolean {
  if (el.id === id) return true;
  if (isContainer(el)) return el.children.some((child) => containsId(child, id));
  return false;
}

/**
 * Returns a new tree where the element matching `id` is replaced by `fn(el)`.
 * Untouched subtrees keep their references (structural sharing); the input is
 * never mutated. `fn` must preserve the element's `type`.
 */
function transform(
  el: BuilderElement,
  id: string,
  fn: (el: BuilderElement) => BuilderElement,
): BuilderElement {
  if (el.id === id) return fn(el);
  if (!isContainer(el)) return el;

  let changed = false;
  const children = el.children.map((child) => {
    const next = transform(child, id, fn);
    if (next !== child) changed = true;
    return next;
  });
  return changed ? { ...el, children } : el;
}

// --- public API (all pure: return a new PageDocument, never mutate input) ---

/** Finds an element anywhere in the tree, or `null`. */
export function findElement(
  doc: PageDocument,
  id: string,
): BuilderElement | null {
  const search = (el: BuilderElement): BuilderElement | null => {
    if (el.id === id) return el;
    if (isContainer(el)) {
      for (const child of el.children) {
        const found = search(child);
        if (found) return found;
      }
    }
    return null;
  };
  return search(doc.root);
}

/** Finds the container that directly holds `id`, or `null` (the root has none). */
export function findParent(
  doc: PageDocument,
  id: string,
): ContainerElement | null {
  const search = (container: ContainerElement): ContainerElement | null => {
    for (const child of container.children) {
      if (child.id === id) return container;
      if (isContainer(child)) {
        const found = search(child);
        if (found) return found;
      }
    }
    return null;
  };
  return search(doc.root);
}

/**
 * Adds `element` as a child of the container `parentId` at `index`
 * (appended when `index` is omitted). No-op if the parent is missing or
 * is not a container.
 */
export function addElement(
  doc: PageDocument,
  parentId: string,
  element: BuilderElement,
  index?: number,
): PageDocument {
  const parent = findElement(doc, parentId);
  if (!parent || !isContainer(parent)) return doc;

  const root = transform(doc.root, parentId, (el) => {
    const container = el as ContainerElement;
    const children = [...container.children];
    children.splice(
      clamp(index ?? children.length, 0, children.length),
      0,
      element,
    );
    return { ...container, children };
  }) as ContainerElement;

  return { ...doc, root };
}

/** Removes the element `id` and its subtree. No-op for the root or unknown ids. */
export function removeElement(doc: PageDocument, id: string): PageDocument {
  if (id === doc.root.id) return doc;
  if (!findElement(doc, id)) return doc;

  const remove = (container: ContainerElement): ContainerElement => {
    let changed = false;
    const children: BuilderElement[] = [];
    for (const child of container.children) {
      if (child.id === id) {
        changed = true;
        continue;
      }
      if (isContainer(child)) {
        const next = remove(child);
        if (next !== child) changed = true;
        children.push(next);
      } else {
        children.push(child);
      }
    }
    return changed ? { ...container, children } : container;
  };

  return { ...doc, root: remove(doc.root) };
}

/**
 * Moves element `id` into container `newParentId` at `index` (the position
 * within the target's children after removal). No-op for the root, unknown
 * ids, a non-container target, or a move into the element's own subtree.
 */
export function moveElement(
  doc: PageDocument,
  id: string,
  newParentId: string,
  index: number,
): PageDocument {
  if (id === doc.root.id) return doc;

  const element = findElement(doc, id);
  if (!element) return doc;

  const newParent = findElement(doc, newParentId);
  if (!newParent || !isContainer(newParent)) return doc;

  // Reject moving an element into itself or one of its descendants.
  if (containsId(element, newParentId)) return doc;

  return addElement(removeElement(doc, id), newParentId, element, index);
}

/** Shallow-merges `props` into the element `id`. No-op for unknown ids. */
export function updateProps(
  doc: PageDocument,
  id: string,
  props: Record<string, unknown>,
): PageDocument {
  const root = transform(
    doc.root,
    id,
    (el) => ({ ...el, props: { ...el.props, ...props } }) as BuilderElement,
  ) as ContainerElement;
  return { ...doc, root };
}

/** Shallow-merges `styles` into the element `id`. No-op for unknown ids. */
export function updateStyles(
  doc: PageDocument,
  id: string,
  styles: ElementStyles,
): PageDocument {
  const root = transform(
    doc.root,
    id,
    (el) => ({ ...el, styles: { ...el.styles, ...styles } }) as BuilderElement,
  ) as ContainerElement;
  return { ...doc, root };
}
