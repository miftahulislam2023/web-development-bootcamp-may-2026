import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────

export interface StudySubject {
    id: string;
    user_id: string;
    name: string;
    color_index: number;
    created_at: string;
}

export interface StudyChapter {
    id: string;
    user_id: string;
    subject_id: string;
    name: string;
    sort_order: number;
    created_at: string;
}

export interface StudyPart {
    id: string;
    user_id: string;
    chapter_id: string;
    name: string;
    status: "not-started" | "in-progress" | "completed";
    estimated_minutes: number;
    scheduled_date?: string;
    scheduled_time?: string;
    notes?: string;
    sort_order: number;
    created_at: string;
    completed_at?: string;
    parent_id?: string | null;
}

export interface StudyCommonPreset {
    id: string;
    subject_id: string;
    name: string;
    estimated_minutes: number;
    created_at: string;
    parent_id?: string | null;
    preset_type?: "chapter" | "part"; // "chapter" = auto-added to new chapters, "part" = manual template
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useStudy() {
    const qc = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    // ── Queries ──────────────────────────────────────────────────────

    const subjectsQuery = useQuery<StudySubject[]>({
        queryKey: ["study_subjects", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/study_subjects");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const chaptersQuery = useQuery<StudyChapter[]>({
        queryKey: ["study_chapters", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/study_chapters_v2");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const partsQuery = useQuery<StudyPart[]>({
        queryKey: ["study_parts", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/study_parts");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    const commonPresetsQuery = useQuery<StudyCommonPreset[]>({
        queryKey: ["study_common_presets", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await apiFetch("/data/study_common_presets");
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });

    // ── Derived data ─────────────────────────────────────────────────

    const subjects = subjectsQuery.data ?? [];
    const chapters = chaptersQuery.data ?? [];
    const parts = partsQuery.data ?? [];
    const commonPresets = commonPresetsQuery.data ?? [];

    const chaptersBySubject = useMemo(() => {
        const map: Record<string, StudyChapter[]> = {};
        subjects.forEach(s => { map[s.id] = []; });
        chapters.forEach(c => {
            if (!map[c.subject_id]) map[c.subject_id] = [];
            map[c.subject_id].push(c);
        });
        return map;
    }, [subjects, chapters]);

    const partsByChapter = useMemo(() => {
        const map: Record<string, StudyPart[]> = {};
        chapters.forEach(c => { map[c.id] = []; });
        parts.forEach(p => {
            if (!map[p.chapter_id]) map[p.chapter_id] = [];
            map[p.chapter_id].push(p);
        });
        return map;
    }, [chapters, parts]);

    const chapterProgress = useMemo(() => {
        const map: Record<string, number> = {};
        chapters.forEach(c => {
            const cParts = partsByChapter[c.id] || [];
            if (cParts.length === 0) { map[c.id] = 0; return; }
            const done = cParts.filter(p => p.status === "completed").length;
            map[c.id] = Math.round((done / cParts.length) * 100);
        });
        return map;
    }, [chapters, partsByChapter]);

    const subjectProgress = useMemo(() => {
        const map: Record<string, number> = {};
        subjects.forEach(s => {
            const sChapters = chaptersBySubject[s.id] || [];
            const allParts = sChapters.flatMap(c => partsByChapter[c.id] || []);
            if (allParts.length === 0) { map[s.id] = 0; return; }
            const done = allParts.filter(p => p.status === "completed").length;
            map[s.id] = Math.round((done / allParts.length) * 100);
        });
        return map;
    }, [subjects, chaptersBySubject, partsByChapter]);

    // ── Invalidation helper ──────────────────────────────────────────
    const invalidateAll = () => {
        qc.invalidateQueries({ queryKey: ["study_subjects"] });
        qc.invalidateQueries({ queryKey: ["study_chapters"] });
        qc.invalidateQueries({ queryKey: ["study_parts"] });
    };

    // ── Subject mutations ────────────────────────────────────────────

    const addSubject = useMutation({
        mutationFn: async (name: string) => {
            if (!userId) throw new Error("Not authenticated");
            const colorIndex = subjects.length % 7;
            const res = await apiFetch("/data/study_subjects", {
                method: "POST",
                body: JSON.stringify({ name, color_index: colorIndex })
            });
            return res.id;
        },
        onSuccess: invalidateAll,
    });

    const renameSubject = useMutation({
        mutationFn: async ({ id, name }: { id: string; name: string }) => {
            await apiFetch("/data/study_subjects", {
                method: "PUT",
                body: JSON.stringify({ id, name })
            });
        },
        onSuccess: invalidateAll,
    });

    const deleteSubject = useMutation({
        mutationFn: async (id: string) => {
            // Because our generic backend doesn't support complex cascades easily, we do them from client
            const subjectChapters = chapters.filter(c => c.subject_id === id);
            for (const ch of subjectChapters) {
                const chapterParts = parts.filter(p => p.chapter_id === ch.id);
                for (const p of chapterParts) {
                    await apiFetch(`/data/study_parts/${p.id}`, { method: "DELETE" });
                }
                await apiFetch(`/data/study_chapters_v2/${ch.id}`, { method: "DELETE" });
            }
            await apiFetch(`/data/study_subjects/${id}`, { method: "DELETE" });
        },
        onSuccess: invalidateAll,
    });

    // ── Chapter mutations ────────────────────────────────────────────

    const addChapter = useMutation({
        mutationFn: async ({ subjectId, name }: { subjectId: string; name: string }) => {
            if (!userId) throw new Error("Not authenticated");
            const order = (chaptersBySubject[subjectId]?.length || 0);
            const createdAt = new Date().toISOString();

            const res = await apiFetch("/data/study_chapters_v2", {
                method: "POST",
                body: JSON.stringify({ subject_id: subjectId, name, sort_order: order, created_at: createdAt })
            });
            const id = res.id;

            const subjectPresets = commonPresets.filter(p => p.subject_id === subjectId && (p.preset_type === "chapter" || !p.preset_type));

            const createPartsForPresets = async (presets: StudyCommonPreset[], parentPartId: string | null = null) => {
                for (const preset of presets) {
                    const presetRes = await apiFetch("/data/study_parts", {
                        method: "POST",
                        body: JSON.stringify({
                            chapter_id: id,
                            name: preset.name,
                            status: "not-started",
                            estimated_minutes: preset.estimated_minutes,
                            sort_order: 0,
                            created_at: new Date().toISOString(),
                            parent_id: parentPartId
                        })
                    });
                    const newPartId = presetRes.id;

                    const children = subjectPresets.filter(p => p.parent_id === preset.id);
                    if (children.length > 0) {
                        await createPartsForPresets(children, newPartId);
                    }
                }
            };

            const rootPresets = subjectPresets.filter(p => !p.parent_id);
            await createPartsForPresets(rootPresets, null);

            return id;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["study_chapters"] });
            qc.invalidateQueries({ queryKey: ["study_parts"] });
        },
    });

    const renameChapter = useMutation({
        mutationFn: async ({ id, name }: { id: string; name: string }) => {
            await apiFetch("/data/study_chapters_v2", {
                method: "PUT",
                body: JSON.stringify({ id, name })
            });
        },
        onSuccess: invalidateAll,
    });

    const deleteChapter = useMutation({
        mutationFn: async (id: string) => {
            const chapterParts = parts.filter(p => p.chapter_id === id);
            for (const p of chapterParts) {
                await apiFetch(`/data/study_parts/${p.id}`, { method: "DELETE" });
            }
            await apiFetch(`/data/study_chapters_v2/${id}`, { method: "DELETE" });
        },
        onSuccess: invalidateAll,
    });

    // ── Part mutations ───────────────────────────────────────────────

    const addPart = useMutation({
        mutationFn: async ({ chapterId, name, estimatedMinutes, scheduledDate, scheduledTime, parentId }: {
            chapterId: string; name: string; estimatedMinutes?: number; scheduledDate?: string; scheduledTime?: string; parentId?: string;
        }) => {
            if (!userId) throw new Error("Not authenticated");
            const order = (partsByChapter[chapterId]?.length || 0);
            
            const res = await apiFetch("/data/study_parts", {
                method: "POST",
                body: JSON.stringify({
                    chapter_id: chapterId,
                    name,
                    estimated_minutes: estimatedMinutes ?? 30,
                    scheduled_date: scheduledDate ?? null,
                    scheduled_time: scheduledTime ?? null,
                    sort_order: order,
                    parent_id: parentId || null
                })
            });
            return res.id;
        },
        onSuccess: invalidateAll,
    });

    const updatePart = useMutation({
        mutationFn: async (update: { id: string; name?: string; estimated_minutes?: number; scheduled_date?: string | null; scheduled_time?: string | null; notes?: string | null }) => {
            const body: Record<string, any> = { id: update.id };
            if (update.name !== undefined) body.name = update.name;
            if (update.estimated_minutes !== undefined) body.estimated_minutes = update.estimated_minutes;
            if (update.scheduled_date !== undefined) body.scheduled_date = update.scheduled_date;
            if (update.scheduled_time !== undefined) body.scheduled_time = update.scheduled_time;
            if (update.notes !== undefined) body.notes = update.notes;
            
            if (Object.keys(body).length > 1) {
                await apiFetch("/data/study_parts", {
                    method: "PUT",
                    body: JSON.stringify(body)
                });
            }
        },
        onSuccess: invalidateAll,
    });

    const togglePartStatus = useMutation({
        mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
            const next = currentStatus === "not-started" ? "in-progress" : currentStatus === "in-progress" ? "completed" : "not-started";
            const completedAt = next === "completed" ? new Date().toISOString() : null;
            await apiFetch("/data/study_parts", {
                method: "PUT",
                body: JSON.stringify({ id, status: next, completed_at: completedAt })
            });
        },
        onSuccess: invalidateAll,
    });

    const deletePart = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/study_parts/${id}`, { method: "DELETE" });
        },
        onSuccess: invalidateAll,
    });

    // ── Common Presets Mutations ─────────────────────────────────────

    const addCommonPreset = useMutation({
        mutationFn: async ({ subjectId, name, minutes, parentId, type = "chapter" }: { subjectId: string; name: string; minutes: number, parentId?: string, type?: "chapter" | "part" }) => {
            const res = await apiFetch("/data/study_common_presets", {
                method: "POST",
                body: JSON.stringify({
                    subject_id: subjectId,
                    name,
                    estimated_minutes: minutes,
                    parent_id: parentId || null,
                    preset_type: type,
                    created_at: new Date().toISOString()
                })
            });
            return res;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["study_common_presets"] }),
    });

    const deleteCommonPreset = useMutation({
        mutationFn: async (id: string) => {
            await apiFetch(`/data/study_common_presets/${id}`, { method: "DELETE" });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["study_common_presets"] }),
    });

    const ensurePartsForChapter = async (chapterId: string, presetsToApply: StudyCommonPreset[], rootParentId: string | null = null) => {
        const existingParts = partsByChapter[chapterId] || [];

        const ensurePartsForPresets = async (presets: StudyCommonPreset[], parentPartId: string | null = null) => {
            for (const preset of presets) {
                let part = existingParts.find(p => p.name === preset.name && (p.parent_id === parentPartId || (!p.parent_id && !parentPartId)));

                if (!part) {
                    const res = await apiFetch("/data/study_parts", {
                        method: "POST",
                        body: JSON.stringify({
                            chapter_id: chapterId,
                            name: preset.name,
                            status: "not-started",
                            estimated_minutes: preset.estimated_minutes,
                            sort_order: existingParts.filter(p => p.parent_id === parentPartId).length,
                            parent_id: parentPartId,
                            created_at: new Date().toISOString()
                        })
                    });
                    
                    part = { ...res, id: res.id };
                    existingParts.push(part!);
                }

                const children = presetsToApply.filter(p => p.parent_id === preset.id);
                if (children.length > 0) {
                    await ensurePartsForPresets(children, part!.id);
                }
            }
        };

        const roots = presetsToApply.filter(p => !p.parent_id || !presetsToApply.find(parent => parent.id === p.parent_id));
        await ensurePartsForPresets(roots, rootParentId);
    };

    const applyPresetsToAllChapters = useMutation({
        mutationFn: async (subjectId: string) => {
            if (!userId) throw new Error("User not found");
            const subjectPresets = commonPresets.filter(p => p.subject_id === subjectId && (p.preset_type === "chapter" || !p.preset_type));
            const subjectChapters = chaptersBySubject[subjectId] || [];

            for (const chapter of subjectChapters) {
                await ensurePartsForChapter(chapter.id, subjectPresets, null);
            }
        },
        onSuccess: () => {
            // Invalidate parts query to refresh UI
            qc.invalidateQueries({ queryKey: ["study_parts"] });
        }
    });

    const addPresetsToChapter = useMutation({
        mutationFn: async ({ chapterId, presetIds, targetPartId }: { chapterId: string, presetIds: string[], targetPartId?: string }) => {
            if (!userId) throw new Error("User not found");

            // 1. Identify all presets to be added (based on selection)
            const idsToApply = new Set(presetIds);

            // 2. Expand selection to include ANCESTORS. 
            // Only do this if we are NOT targeting a specific part. 
            // If targeting a specific part (targetPartId), we usually want to plant the selected roots directly under that part.
            // But if the user selected a child node and wants to move the whole tree, they probably selected the root of that tree.
            // If they selected a leaf node, maybe they just want that leaf node under the target part.

            // Actually, if a user explicitly selects a sub-chapter to add to a target part, 
            // they probably intend for that sub-chapter to become a child of the target part.
            // They don't necessarily want to recreate the original preset hierarchy ABOVE the selection.
            // So we should SKIP ancestor expansion if `targetPartId` is present?
            // User says: "created a part, insteed of subpart" -> they wanted hierarchy.
            // BUT now they are asking for "segs under cq". "cq" is an existing part. "segs" is the preset.
            // So they want "segs" (preset) -> child of "cq" (part).
            // In this case, we do NOT want to bring in "segs"'s original parent.

            const selectedPresets = commonPresets.filter(p => idsToApply.has(p.id));

            if (targetPartId === 'all-parts') {
                // Add selected presets to ALL top-level parts in the chapter
                const chapterParts = partsByChapter[chapterId] || [];
                const topLevelParts = chapterParts.filter(p => !p.parent_id);

                for (const part of topLevelParts) {
                    // We don't want to expand ancestors here because we are explicitly planting the preset tree under these parts
                    await ensurePartsForChapter(chapterId, selectedPresets, part.id);
                }
            } else if (!targetPartId) {
                let foundNew = true;
                while (foundNew) {
                    foundNew = false;
                    // Check all currently selected IDs
                    for (const id of Array.from(idsToApply)) {
                        const preset = commonPresets.find(p => p.id === id);
                        if (preset?.parent_id && !idsToApply.has(preset.parent_id)) {
                            idsToApply.add(preset.parent_id);
                            foundNew = true;
                        }
                    }
                }
                const expandedPresets = commonPresets.filter(p => idsToApply.has(p.id));
                await ensurePartsForChapter(chapterId, expandedPresets, null);
            } else {
                // Specific target part
                await ensurePartsForChapter(chapterId, selectedPresets, targetPartId);
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["study_parts"] });
            qc.invalidateQueries({ queryKey: ["study_chapters"] }); // Just in case
        }
    });

    // ── Aggregate stats ──────────────────────────────────────────────

    const totalParts = parts.length;
    const completedParts = parts.filter(p => p.status === "completed").length;
    const inProgressParts = parts.filter(p => p.status === "in-progress").length;
    const overallProgress = totalParts > 0 ? Math.round((completedParts / totalParts) * 100) : 0;

    return {
        // data
        subjects,
        chapters,
        parts,
        chaptersBySubject,
        partsByChapter,
        chapterProgress,
        subjectProgress,
        // stats
        totalParts,
        completedParts,
        inProgressParts,
        overallProgress,
        // loading
        isLoading: subjectsQuery.isLoading || chaptersQuery.isLoading || partsQuery.isLoading,
        // subject mutations
        addSubject,
        renameSubject,
        deleteSubject,
        // chapter mutations
        addChapter,
        renameChapter,
        deleteChapter,
        // part mutations
        addPart,
        updatePart,
        togglePartStatus,
        deletePart,

        commonPresets,
        addCommonPreset,
        deleteCommonPreset,
        applyPresetsToAllChapters,
        addPresetsToChapter
    };
}
