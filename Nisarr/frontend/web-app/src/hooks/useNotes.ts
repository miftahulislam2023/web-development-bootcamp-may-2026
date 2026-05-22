import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export type NoteColor =
    | "default"
    | "coral"
    | "peach"
    | "sand"
    | "mint"
    | "sage"
    | "fog"
    | "storm"
    | "dusk"
    | "blossom"
    | "clay"
    | "chalk";

export const NOTE_COLORS: Record<NoteColor, { light: string; dark: string; label: string }> = {
    default: { light: "bg-white", dark: "dark:bg-secondary/40", label: "Default" },
    coral: { light: "bg-red-100", dark: "dark:bg-red-500/15 dark:border-red-500/20", label: "Coral" },
    peach: { light: "bg-orange-100", dark: "dark:bg-orange-500/15 dark:border-orange-500/20", label: "Peach" },
    sand: { light: "bg-yellow-100", dark: "dark:bg-yellow-500/15 dark:border-yellow-500/20", label: "Sand" },
    mint: { light: "bg-green-100", dark: "dark:bg-green-500/15 dark:border-green-500/20", label: "Mint" },
    sage: { light: "bg-teal-100", dark: "dark:bg-teal-500/15 dark:border-teal-500/20", label: "Sage" },
    fog: { light: "bg-gray-100", dark: "dark:bg-gray-500/15 dark:border-gray-500/20", label: "Fog" },
    storm: { light: "bg-blue-100", dark: "dark:bg-blue-500/15 dark:border-blue-500/20", label: "Storm" },
    dusk: { light: "bg-indigo-100", dark: "dark:bg-indigo-500/15 dark:border-indigo-500/20", label: "Dusk" },
    blossom: { light: "bg-purple-100", dark: "dark:bg-purple-500/15 dark:border-purple-500/20", label: "Blossom" },
    clay: { light: "bg-amber-100", dark: "dark:bg-amber-500/15 dark:border-amber-500/20", label: "Clay" },
    chalk: { light: "bg-stone-100", dark: "dark:bg-stone-500/15 dark:border-stone-500/20", label: "Chalk" },
};

export interface Note {
    id: string;
    user_id: string;
    title: string;
    content?: string;
    tags?: string;
    is_pinned: number;
    color: NoteColor;
    is_archived: number;
    is_trashed: number;
    updated_at: string;
    created_at: string;
    serial_number: number;
}

export function useNotes() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const notesQuery = useQuery({
        queryKey: ["notes", userId],
        queryFn: async () => {
            if (!userId) return [];
            const result = await apiFetch("/data/notes");
            return (result as Note[]).map(n => ({
                ...n,
                is_pinned: n.is_pinned ?? 0,
                color: (n.color as NoteColor) || "default",
                is_archived: n.is_archived ?? 0,
                is_trashed: n.is_trashed ?? 0,
                updated_at: n.updated_at || n.created_at,
                // Ensure serial_number is treated as number
                serial_number: Number(n.serial_number) || 0,
            }));
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const addNote = useMutation({
        mutationFn: async (note: { title: string; content?: string; tags?: string; color?: NoteColor }) => {
            if (!userId) throw new Error("Not authenticated");
            const now = new Date().toISOString();

            // Client-side sequential numbering based on existing data
            const existingNotes = notesQuery.data || [];
            const maxSerial = existingNotes.length > 0 
                ? Math.max(...existingNotes.map(n => n.serial_number || 0)) 
                : 0;
            const serial = maxSerial + 1;

            const res = await apiFetch("/data/notes", {
                method: "POST",
                body: JSON.stringify({
                    title: note.title,
                    content: note.content || null,
                    tags: note.tags || null,
                    color: note.color || "default",
                    updated_at: now,
                    serial_number: serial
                })
            });
            return res.id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    const updateNote = useMutation({
        mutationFn: async (note: Partial<Note> & { id: string }) => {
            const now = new Date().toISOString();
            
            const body: Record<string, any> = { ...note, updated_at: now };
            
            await apiFetch("/data/notes", {
                method: "PUT",
                body: JSON.stringify(body)
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    const togglePin = useMutation({
        mutationFn: async (note: Note) => {
            const newVal = note.is_pinned ? 0 : 1;
            await apiFetch("/data/notes", {
                method: "PUT",
                body: JSON.stringify({ id: note.id, is_pinned: newVal })
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    const updateColor = useMutation({
        mutationFn: async ({ id, color }: { id: string; color: NoteColor }) => {
            await apiFetch("/data/notes", {
                method: "PUT",
                body: JSON.stringify({ id, color })
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    const archiveNote = useMutation({
        mutationFn: async ({ id, archive }: { id: string; archive: boolean }) => {
            await apiFetch("/data/notes", {
                method: "PUT",
                body: JSON.stringify({ id, is_archived: archive ? 1 : 0 })
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    const trashNote = useMutation({
        mutationFn: async ({ id, trash }: { id: string; trash: boolean }) => {
            await apiFetch("/data/notes", {
                method: "PUT",
                body: JSON.stringify({ id, is_trashed: trash ? 1 : 0 })
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    const deleteNote = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/notes/${id}`, { method: "DELETE" });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
    });

    return {
        notes: notesQuery.data ?? [],
        isLoading: notesQuery.isLoading,
        error: notesQuery.error,
        addNote,
        updateNote,
        togglePin,
        updateColor,
        archiveNote,
        trashNote,
        deleteNote,
    };
}
