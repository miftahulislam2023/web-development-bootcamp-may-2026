/**
 * RecurringForm — reusable sub-form for recurrence settings.
 *
 * Usage:
 *   • Inside AddEditTransactionModal (shown when isRecurring = true)
 *   • Inside a dedicated RecurringPage (standalone)
 *
 * The parent is responsible for providing the react-hook-form `control` and
 * field-name prefix so this component stays decoupled.
 */
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RECURRENCE_FREQUENCY } from "@/types";
import { Control, FieldValues, Path } from "react-hook-form";


// ─── Props ────────────────────────────────────────────────────────────────────

interface RecurringFormProps<T extends FieldValues> {
  control: Control<T>;
  // Field name paths — parent passes these so the component stays reusable
  frequencyField: Path<T>;
  intervalField: Path<T>;
  startDateField: Path<T>;
  endDateField: Path<T>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RecurringForm<T extends FieldValues>({
  control,
  frequencyField,
  intervalField,
  startDateField,
  endDateField,
}: RecurringFormProps<T>) {
  return (
    <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 p-4 space-y-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Recurring Settings
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frequency */}
        <FormField
          control={control}
          name={frequencyField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Frequency <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={RECURRENCE_FREQUENCY.DAILY}>Daily</SelectItem>
                  <SelectItem value={RECURRENCE_FREQUENCY.WEEKLY}>Weekly</SelectItem>
                  <SelectItem value={RECURRENCE_FREQUENCY.MONTHLY}>Monthly</SelectItem>
                  <SelectItem value={RECURRENCE_FREQUENCY.YEARLY}>Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="sr-only">How often to repeat.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interval */}
        <FormField
          control={control}
          name={intervalField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interval</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Every <strong>{field.value || 1}</strong> {" "}
                period(s). E.g. interval=2, frequency=monthly → every 2 months.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={control}
          name={startDateField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Start Date <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Date the first recurrence fires.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date (optional) */}
        <FormField
          control={control}
          name={endDateField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Leave blank to repeat indefinitely.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}