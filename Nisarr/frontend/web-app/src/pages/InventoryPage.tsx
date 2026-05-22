import { useState, useMemo, useEffect } from "react";
import { SEO } from "@/components/seo/SEO";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Package, Store, Trash2, Edit2, LayoutGrid, List,
    DollarSign, Tag, Calendar, CheckCircle, AlertTriangle, Search, Filter,
    CreditCard, Wrench
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useInventory, InventoryItem } from "@/hooks/useInventory";
import { useTasks } from "@/hooks/useTasks";
import { SmartFillButton } from "@/components/ai/SmartFillButton";
import { useNavigate } from "react-router-dom";
import { useAI } from "@/contexts/AIContext";

const CATEGORIES = [
    "Electronics", "Furniture", "Clothing", "Tools", "Vehicles",
    "Books", "Home", "Appliances", "Other"
];

export default function InventoryPage() {
    const { items, totalValue, isLoading, addItem, updateItem, deleteItem, markAsSold } = useInventory();
    const navigate = useNavigate(); // For redirecting to tasks
    const { setPageContext, showBubble } = useAI();

    // Set Page Context


    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Set Page Context
    useEffect(() => {
        setPageContext(`User is on Inventory Page. 
        Total Items: ${items.length}, Total Value: ৳${totalValue.toLocaleString()}.
        Viewing: ${viewMode} mode.`);
    }, [items.length, totalValue, viewMode, setPageContext]);

    // Dialog States
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [saleItem, setSaleItem] = useState<InventoryItem | null>(null);

    // Form States
    const [newItem, setNewItem] = useState({
        item_name: "",
        category: "Other",
        quantity: 1,
        cost: "",
        purchase_date: new Date().toISOString().split('T')[0],
        store: "",
        notes: "",
        warranty_expiry: "",
        record_purchase: false,
    });

    const [saleData, setSaleData] = useState({
        salePrice: "",
        saleDate: new Date().toISOString().split('T')[0],
    });

    // Stats
    const stats = useMemo(() => {
        const totalItems = items.length;
        const activeItems = items.filter(i => i.status === "active").length;
        const soldItems = items.filter(i => i.status === "sold").length;
        const valueByCategory = items.reduce((acc, item) => {
            const cat = item.category || "Other";
            acc[cat] = (acc[cat] || 0) + (item.cost || 0);
            return acc;
        }, {} as Record<string, number>);

        return { totalItems, activeItems, soldItems, valueByCategory };
    }, [items]);

    // Filtering
    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: "asc" | "desc" }>({ key: "item_name", direction: "asc" });

    const handleSort = (key: keyof InventoryItem) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
        }));
    };

    // Filtering & Sorting
    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.store?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        // Apply Sorting
        return result.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;

            // Handle undefined/null values
            if (aValue === undefined || aValue === null) return 1;
            if (bValue === undefined || bValue === null) return -1;

            if (sortConfig.direction === "asc") {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });
    }, [items, searchTerm, categoryFilter, sortConfig]);

    const handleAddItem = async () => {
        if (!newItem.item_name.trim()) return;
        await addItem.mutateAsync({
            item_name: newItem.item_name,
            category: newItem.category,
            quantity: newItem.quantity,
            cost: newItem.cost ? parseFloat(newItem.cost) : undefined,
            purchase_date: newItem.purchase_date || undefined,
            store: newItem.store || undefined,
            notes: newItem.notes || undefined,
            status: "active",
            warranty_expiry: newItem.warranty_expiry || undefined,
            record_purchase: newItem.record_purchase, // Logic handled in hook
        });

        showBubble(
            newItem.record_purchase
                ? `Added ${newItem.item_name} and recorded expense of ৳${newItem.cost}!`
                : `Added ${newItem.item_name} to your inventory.`
        );

        setNewItem({
            item_name: "", category: "Other", quantity: 1, cost: "",
            purchase_date: new Date().toISOString().split('T')[0], store: "",
            notes: "", warranty_expiry: "", record_purchase: false
        });
        setIsAddOpen(false);
    };

    const handleUpdateItem = async () => {
        if (!editingItem) return;
        await updateItem.mutateAsync(editingItem);
        setEditingItem(null);
    };

    const handleSellItem = async () => {
        if (!saleItem) return;
        await markAsSold.mutateAsync({
            id: saleItem.id,
            salePrice: parseFloat(saleData.salePrice) || 0,
            saleDate: saleData.saleDate
        });
        setSaleItem(null);
        setSaleData({ salePrice: "", saleDate: new Date().toISOString().split('T')[0] });
    };

    const handleCreateMaintenanceTask = (item: InventoryItem) => {
        // We'll navigate to tasks with state to pre-fill the form
        // Need to make sure TasksPage accepts this state
        navigate("/tasks", {
            state: {
                newTask: {
                    title: `Maintain: ${item.item_name}`,
                    context_type: "general",
                    description: `Maintenance for inventory item: ${item.item_name}`,
                    priority: "medium"
                }
            }
        });
    };

    return (
        <AppLayout>
            <SEO title="Inventory" description="Manage your personal inventory and assets." />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 sm:space-y-6"
            >
                {/* Header & Stats */}
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Single-row controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="hidden md:block">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold font-display tracking-tight">Inventory</h1>
                            </div>
                            <p className="text-sm text-muted-foreground ml-14">Manage your assets and belongings</p>
                        </div>

                        <div className="top-toolbar sm:w-auto flex flex-wrap items-center gap-2 rounded-2xl border border-violet-500 bg-background/40 backdrop-blur-xl p-1.5 shadow-sm">
                            {/* View Toggle */}
                            <div className="flex bg-secondary rounded-lg p-0.5 shrink-0 border border-indigo-500/30">
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                    title="List View"
                                >
                                    <List className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Category Filter */}
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-auto min-w-[120px] h-8 text-xs bg-transparent border border-indigo-500/30 ring-0 focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Search */}
                            <div className="relative flex-1 min-w-[120px] max-w-[240px]">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 h-8 text-xs sm:text-sm bg-transparent border border-indigo-500/30 ring-0 focus-visible:ring-0"
                                />
                            </div>

                            {/* Add Item Button */}
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button size="icon" className="h-8 w-8 sm:w-auto sm:px-3 sm:gap-1.5 shadow-lg shadow-primary/20">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Item</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex justify-between items-center">
                                            Add New Item
                                            <SmartFillButton
                                                onFill={(data: any) => setNewItem(prev => ({ ...prev, ...data }))}
                                                schemaDescription={`
                                                    {
                                                        "item_name": "string (name of product)",
                                                        "category": "string (one of: Electronics, Furniture, Clothing, Tools, Vehicles, Books, Home, Appliances, Other)",
                                                        "cost": "number (price in BDT)",
                                                        "store": "string (where it was bought)",
                                                        "notes": "string (any extra details)",
                                                        "quantity": "number"
                                                    }
                                                `}
                                                exampleText="Bought a Samsung Monitor for 25000tk from Ryans Computers"
                                            />
                                        </DialogTitle>
                                        <DialogDescription>Add a new item to your inventory with details like category, cost, and warranty.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Item Name</label>
                                            <Input
                                                placeholder="MacBook Pro M1"
                                                value={newItem.item_name}
                                                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Category</label>
                                                <Select
                                                    value={newItem.category}
                                                    onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CATEGORIES.map(cat => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Quantity</label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={newItem.quantity}
                                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Cost (৳)</label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={newItem.cost}
                                                    onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Purchase Date</label>
                                                <DatePicker
                                                    value={newItem.purchase_date}
                                                    onChange={(date) => setNewItem({ ...newItem, purchase_date: date })}
                                                    placeholder="Purchase Date"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Store / Source</label>
                                            <Input
                                                placeholder="Amazon, Apple Store, etc."
                                                value={newItem.store}
                                                onChange={(e) => setNewItem({ ...newItem, store: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Notes / Serial No.</label>
                                            <Input
                                                placeholder="Serial: XYZ123..."
                                                value={newItem.notes}
                                                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Warranty Expiry</label>
                                            <DatePicker
                                                value={newItem.warranty_expiry}
                                                onChange={(date) => setNewItem({ ...newItem, warranty_expiry: date })}
                                                placeholder="Warranty Expiry"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2 pt-2">
                                            <Checkbox
                                                id="record-purchase"
                                                checked={newItem.record_purchase}
                                                onCheckedChange={(checked) => setNewItem({ ...newItem, record_purchase: !!checked })}
                                            />
                                            <label
                                                htmlFor="record-purchase"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Record as Expense in Finance
                                            </label>
                                        </div>

                                        <Button onClick={handleAddItem} className="w-full mt-4" disabled={addItem.isPending}>
                                            {addItem.isPending ? "Adding..." : "Add Item"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Spacer for fixed toolbar on mobile */}
                    <div className="h-8 md:hidden" aria-hidden="true" />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                        <div className="relative overflow-hidden rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                            <div className="bg-primary/20 p-1.5 sm:p-2 rounded-full text-primary">
                                <DollarSign className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Value</p>
                                <h3 className="text-sm sm:text-lg font-bold truncate">৳{totalValue.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20">
                            <div className="bg-blue-500/20 p-1.5 sm:p-2 rounded-full text-blue-500">
                                <Package className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Items</p>
                                <h3 className="text-sm sm:text-lg font-bold">{filteredItems.length}</h3>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20">
                            <div className="bg-green-500/20 p-1.5 sm:p-2 rounded-full text-green-500">
                                <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Active</p>
                                <h3 className="text-sm sm:text-lg font-bold">{stats.activeItems}</h3>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20">
                            <div className="bg-orange-500/20 p-1.5 sm:p-2 rounded-full text-orange-500">
                                <Tag className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Sold</p>
                                <h3 className="text-sm sm:text-lg font-bold">{stats.soldItems}</h3>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Content */}
                <div className="min-h-[500px]">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading inventory...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground glass-card">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No items found</p>
                            <p className="text-sm">Try adjusting filters or add your first item.</p>
                        </div>
                    ) : viewMode === "grid" ? (
                        // Grid View
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            <AnimatePresence>
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`relative overflow-hidden rounded-2xl p-3 flex flex-col justify-between group transition-all duration-300 border border-border/40 shadow-sm hover:shadow-md bg-gradient-to-br from-gray-500/5 via-gray-500/0 to-transparent ${item.status === 'sold' ? 'opacity-70 bg-secondary/20' : ''}`}
                                    >
                                        {item.status === 'sold' && (
                                            <div className="absolute top-1.5 right-1.5 z-10">
                                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200 text-[10px] px-1.5 py-0">Sold</Badge>
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.category || "Other"}</Badge>
                                                {item.quantity > 1 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">x{item.quantity}</Badge>}
                                            </div>
                                            <h3 className="font-semibold text-sm sm:text-base line-clamp-1 mt-1">{item.item_name}</h3>
                                            {item.store && (
                                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 line-clamp-1">
                                                    <Store className="w-3 h-3 shrink-0" /> {item.store}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-2 gap-1.5 text-xs mt-2">
                                                <div className="bg-secondary/30 p-1.5 rounded">
                                                    <p className="text-[10px] text-muted-foreground">Cost</p>
                                                    <p className="font-semibold text-xs">৳{(item.cost || 0).toLocaleString()}</p>
                                                </div>
                                                <div className="bg-secondary/30 p-1.5 rounded">
                                                    <p className="text-[10px] text-muted-foreground">Date</p>
                                                    <p className="font-semibold text-xs">{item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : "-"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t flex items-center justify-between gap-1 mt-auto">
                                            <div className="flex gap-0.5">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setEditingItem(item)}>
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-blue-500" onClick={() => handleCreateMaintenanceTask(item)}>
                                                    <Wrench className="w-3.5 h-3.5" />
                                                </Button>
                                                {item.status === 'active' && (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-green-500" onClick={() => setSaleItem(item)}>
                                                        <CreditCard className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteItem.mutate(item.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        // List View
                        <motion.div className="glass-card overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort("item_name")}
                                        >
                                            Item {sortConfig.key === "item_name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort("category")}
                                        >
                                            Category {sortConfig.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort("purchase_date")}
                                        >
                                            Purchased {sortConfig.key === "purchase_date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort("cost")}
                                        >
                                            Cost {sortConfig.key === "cost" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                        </TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <TableRow key={item.id} className={item.status === 'sold' ? 'opacity-60 bg-secondary/10' : ''}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{item.item_name}</div>
                                                    {item.store && <div className="text-xs text-muted-foreground">{item.store}</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                            <TableCell>
                                                {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell>৳{(item.cost || 0).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem.mutate(item.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </motion.div>
                    )}
                </div>

                {/* Edit Dialog */}
                <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                            <DialogDescription>Update the details of your inventory item.</DialogDescription>
                        </DialogHeader>
                        {editingItem && (
                            <div className="space-y-4 pt-4">
                                <Input
                                    placeholder="Item name"
                                    value={editingItem.item_name}
                                    onChange={(e) => setEditingItem({ ...editingItem, item_name: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        value={editingItem.category || "Other"}
                                        onValueChange={(val) => setEditingItem({ ...editingItem, category: val })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        placeholder="Cost"
                                        value={editingItem.cost || ""}
                                        onChange={(e) => setEditingItem({ ...editingItem, cost: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Notes</label>
                                    <Input
                                        value={editingItem.notes || ""}
                                        onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Purchase Date</label>
                                        <DatePicker
                                            value={editingItem.purchase_date || ""}
                                            onChange={(date) => setEditingItem({ ...editingItem, purchase_date: date })}
                                            placeholder="Purchase Date"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Warranty Expiry</label>
                                        <DatePicker
                                            value={editingItem.warranty_expiry || ""}
                                            onChange={(date) => setEditingItem({ ...editingItem, warranty_expiry: date })}
                                            placeholder="Warranty Expiry"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleUpdateItem} className="w-full" disabled={updateItem.isPending}>
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Sell Item Dialog */}
                <Dialog open={!!saleItem} onOpenChange={(open) => !open && setSaleItem(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Mark as Sold</DialogTitle>
                            <DialogDescription>Record the sale of this item to update your finances.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <p className="text-sm text-muted-foreground">
                                Use this to remove items from active inventory and record income.
                            </p>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sale Price (৳)</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={saleData.salePrice}
                                    onChange={(e) => setSaleData({ ...saleData, salePrice: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Sold</label>
                                <DatePicker
                                    value={saleData.saleDate}
                                    onChange={(date) => setSaleData({ ...saleData, saleDate: date })}
                                    placeholder="Select Date"
                                />
                            </div>
                            <Button onClick={handleSellItem} className="w-full bg-green-600 hover:bg-green-700">
                                Confirm Sale & Record Income
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div >
        </AppLayout >
    );
}
