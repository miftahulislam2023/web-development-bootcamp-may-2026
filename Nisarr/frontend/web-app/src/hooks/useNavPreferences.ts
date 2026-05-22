import { useState, useCallback } from "react";
import {
    LayoutDashboard,
    ListTodo,
    Wallet,
    StickyNote,
    Target,
    Package,
    GraduationCap,
    Settings,
    LucideIcon,
} from "lucide-react";

export interface NavItem {
    id: string;
    icon: LucideIcon;
    label: string;
    path: string;
}

// All available navigation items
export const ALL_NAV_ITEMS: NavItem[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Home", path: "/dashboard" },
    { id: "tasks", icon: ListTodo, label: "Tasks", path: "/tasks" },
    { id: "finance", icon: Wallet, label: "Finance", path: "/finance" },
    { id: "notes", icon: StickyNote, label: "Notes", path: "/notes" },
    { id: "habits", icon: Target, label: "Habits", path: "/habits" },
    { id: "inventory", icon: Package, label: "Inventory", path: "/inventory" },
    { id: "study", icon: GraduationCap, label: "Study", path: "/study" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
];

const STORAGE_KEY = "lifeos-nav-shortcuts";
const DEFAULT_SHORTCUTS = ["dashboard", "tasks", "finance", "notes"];
const MAX_SHORTCUTS = 4;

function getStoredShortcuts(): string[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length >= 1 && parsed.length <= MAX_SHORTCUTS) {
                // Validate all IDs exist
                const validIds = ALL_NAV_ITEMS.map(item => item.id);
                if (parsed.every((id: string) => validIds.includes(id))) {
                    return parsed;
                }
            }
        }
    } catch {
        // ignore
    }
    return DEFAULT_SHORTCUTS;
}

export function useNavPreferences() {
    const [shortcutIds, setShortcutIds] = useState<string[]>(getStoredShortcuts);

    const mainNavItems = shortcutIds
        .map(id => ALL_NAV_ITEMS.find(item => item.id === id))
        .filter(Boolean) as NavItem[];

    const moreNavItems = ALL_NAV_ITEMS.filter(
        item => !shortcutIds.includes(item.id)
    );

    const toggleShortcut = useCallback((id: string) => {
        setShortcutIds(prev => {
            let next: string[];
            if (prev.includes(id)) {
                // Remove it — but don't go below 1
                if (prev.length <= 1) return prev;
                next = prev.filter(s => s !== id);
            } else {
                // Add it — if already at max, replace the last one
                if (prev.length >= MAX_SHORTCUTS) {
                    return prev; // Can't add more, must deselect one first
                }
                next = [...prev, id];
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const setShortcuts = useCallback((ids: string[]) => {
        const validIds = ALL_NAV_ITEMS.map(item => item.id);
        const validated = ids.filter(id => validIds.includes(id)).slice(0, MAX_SHORTCUTS);
        if (validated.length === MAX_SHORTCUTS) {
            setShortcutIds(validated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
        }
    }, []);

    return {
        shortcutIds,
        mainNavItems,
        moreNavItems,
        toggleShortcut,
        setShortcuts,
        allNavItems: ALL_NAV_ITEMS,
        maxShortcuts: MAX_SHORTCUTS,
    };
}
