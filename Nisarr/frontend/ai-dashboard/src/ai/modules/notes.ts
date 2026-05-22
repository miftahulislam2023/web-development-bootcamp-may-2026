// Notes AI Module - handles note actions

import { AIModule, NoteHooks } from '../core/types';

export const NOTE_ACTIONS = [
    "ADD_NOTE",
    "UPDATE_NOTE",
    "DELETE_NOTE",
    "TOGGLE_PIN_NOTE",
    "CHANGE_NOTE_COLOR",
    "ARCHIVE_NOTE",
    "TRASH_NOTE",
];

export const NOTE_PROMPT = `NOTE RULES:
For ADD_NOTE, data must include: title (string), content (string), tags (optional, comma-separated string), color (optional)
For UPDATE_NOTE, data must include: title (string, to find note), and any fields: new_title, content, tags
For DELETE_NOTE, data must include: id or title
For TOGGLE_PIN_NOTE, data must include: title (to find note)
For CHANGE_NOTE_COLOR, data must include: title, color (valid: default, coral, peach, sand, mint, sage, fog, storm, dusk, blossom, clay, chalk)
For ARCHIVE_NOTE, data must include: title, archive (boolean, default true)
For TRASH_NOTE, data must include: title, trash (boolean, default true)

Note Examples:
- "note: remember to check the oven" → ADD_NOTE with title "Reminder", content "Check the oven"
- "pin the shopping list" → TOGGLE_PIN_NOTE with title "Shopping List"
- "make the meeting note red/coral" → CHANGE_NOTE_COLOR with title "Meeting", color "coral"
- "archive the old physics notes" → ARCHIVE_NOTE with title "physics", archive true
- "restore physics note from archive" → ARCHIVE_NOTE with title "physics", archive false
- "move budget note to trash" → TRASH_NOTE with title "Budget", trash true`;

export async function executeNoteAction(
    action: string,
    data: Record<string, unknown>,
    hooks: NoteHooks
): Promise<void> {
    // Helper to find note
    const findNote = (search: unknown) => {
        if (!search) return undefined;
        const query = String(search).toLowerCase();
        return hooks.notes?.find(n => n.title.toLowerCase().includes(query) || n.id === search);
    };

    switch (action) {
        case "ADD_NOTE":
            await hooks.addNote.mutateAsync({
                title: String(data.title || "Quick Note"),
                content: String(data.content || data.title || ""),
                tags: data.tags ? String(data.tags) : undefined,
                color: data.color ? String(data.color) : "default",
            });
            break;

        case "UPDATE_NOTE": {
            const noteToUpdate = findNote(data.title || data.id);
            if (noteToUpdate) {
                await hooks.updateNote.mutateAsync({
                    ...noteToUpdate,
                    title: data.new_title ? String(data.new_title) : noteToUpdate.title,
                    content: data.content ? String(data.content) : noteToUpdate.content,
                    tags: data.tags !== undefined ? String(data.tags) : noteToUpdate.tags,
                });
            }
            break;
        }

        case "DELETE_NOTE": {
            const noteToDelete = findNote(data.title || data.id);
            if (noteToDelete) await hooks.deleteNote.mutateAsync(noteToDelete.id);
            break;
        }

        case "TOGGLE_PIN_NOTE": {
            const noteToPin = findNote(data.title || data.id);
            if (noteToPin) hooks.togglePin.mutate(noteToPin);
            break;
        }

        case "CHANGE_NOTE_COLOR": {
            const noteToColor = findNote(data.title || data.id);
            if (noteToColor && data.color) {
                hooks.updateColor.mutate({ id: noteToColor.id, color: String(data.color) });
            }
            break;
        }

        case "ARCHIVE_NOTE": {
            const noteToArchive = findNote(data.title || data.id);
            // Default to true if not specified, allows "archive X" to mean archive=true
            const shouldArchive = data.archive !== false && data.archive !== "false";
            if (noteToArchive) {
                hooks.archiveNote.mutate({ id: noteToArchive.id, archive: shouldArchive });
            }
            break;
        }

        case "TRASH_NOTE": {
            const noteToTrash = findNote(data.title || data.id);
            const shouldTrash = data.trash !== false && data.trash !== "false";
            if (noteToTrash) {
                hooks.trashNote.mutate({ id: noteToTrash.id, trash: shouldTrash });
            }
            break;
        }
    }
}

export const notesModule: AIModule = {
    name: "notes",
    actions: NOTE_ACTIONS,
    prompt: NOTE_PROMPT,
    execute: executeNoteAction as AIModule['execute'],
};
