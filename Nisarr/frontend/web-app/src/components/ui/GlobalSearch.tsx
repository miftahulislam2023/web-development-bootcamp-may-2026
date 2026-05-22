import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    LayoutDashboard,
    ListTodo,
    Wallet,
    StickyNote,
    Package,
    GraduationCap,
    Target,
    Settings,
    Search,
    MoveRight
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useTasks } from "@/hooks/useTasks";
import { useNotes } from "@/hooks/useNotes";

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { items: inventoryItems } = useInventory();
    const { tasks } = useTasks();
    const { notes } = useNotes();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const openSearch = () => setOpen(true);
        window.addEventListener("openGlobalSearch", openSearch);
        document.addEventListener("keydown", down);

        return () => {
            window.removeEventListener("openGlobalSearch", openSearch);
            document.removeEventListener("keydown", down);
        };
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Pages">
                    <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/tasks"))}>
                        <ListTodo className="mr-2 h-4 w-4" />
                        Tasks
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/inventory"))}>
                        <Package className="mr-2 h-4 w-4" />
                        Inventory
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/finance"))}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Finance
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/notes"))}>
                        <StickyNote className="mr-2 h-4 w-4" />
                        Notes
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Inventory">
                    {inventoryItems?.slice(0, 5).map((item) => (
                        <CommandItem
                            key={item.id}
                            onSelect={() => runCommand(() => navigate("/inventory", { state: { highlight: item.id } }))}
                        >
                            <Package className="mr-2 h-4 w-4 text-orange-500" />
                            <span>{item.item_name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">x{item.quantity}</span>
                        </CommandItem>
                    ))}
                    <CommandItem onSelect={() => runCommand(() => navigate("/inventory"))}>
                        <MoveRight className="mr-2 h-4 w-4" />
                        View all inventory
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Tasks">
                    {tasks?.filter(t => t.status !== 'done').slice(0, 3).map((task) => (
                        <CommandItem
                            key={task.id}
                            onSelect={() => runCommand(() => navigate("/tasks"))}
                        >
                            <ListTodo className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{task.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Notes">
                    {notes?.slice(0, 3).map((note) => (
                        <CommandItem
                            key={note.id}
                            onSelect={() => runCommand(() => navigate("/notes"))}
                        >
                            <StickyNote className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>{note.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

            </CommandList>
        </CommandDialog>
    );
}
