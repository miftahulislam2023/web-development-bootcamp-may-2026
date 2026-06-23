import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ICategory } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CategoryTableProps {
  data: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

export function CategoryTable({ data, onEdit, onDelete }: CategoryTableProps) {


 

  return (
    <div className="border border-muted rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-8">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!data || data.length === 0 ? (
            <div className="border border-muted rounded-md py-16 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No categories found.
              </p>
            </div>
          ) : (
            data?.map((item, index) => (
              <TableRow key={item._id}>
                {/* Serial */}
                <TableCell className="text-muted-foreground text-sm">
                  {index + 1}
                </TableCell>

                {/* Name */}
                <TableCell className="font-medium">{item.name}</TableCell>

                {/* Type badge */}
                <TableCell>
                  <Badge
                    variant={item.type === "income" ? "default" : "secondary"}
                    className={
                      item.type === "income"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100"
                    }
                  >
                    {item.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </TableCell>

                {/* Color swatch */}
                <TableCell>
                  {item.colorHex ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-4 w-4 rounded-full border border-muted-foreground/20"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {item.colorHex}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                {/* System vs Custom */}
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {item.isSystem ? "System" : "Custom"}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
