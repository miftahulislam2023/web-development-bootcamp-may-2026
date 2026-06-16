import { FormField } from "@/components/shared/form-field"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Room } from "@/lib/types/room"

interface RoomFormFieldsProps {
  /** Unique prefix for element IDs (e.g. "create-room", "edit-room") */
  idPrefix: string
  /** Existing room data to populate defaults — omit for create */
  defaultValues?: Room
  fieldErrors: {
    title?: string
    description?: string
    slowModeInterval?: string
  }
}

const DESCRIPTION_MAX_LENGTH = 500
const SLOW_MODE_MIN = 1
const SLOW_MODE_MAX = 60

/**
 * Shared form fields for both Create and Edit room dialogs.
 * Renders: title, description, slow mode interval, guest chat toggle.
 * Uncontrolled — relies on native FormData via name attributes.
 */
function RoomFormFields({ idPrefix, defaultValues, fieldErrors }: RoomFormFieldsProps) {
  return (
    <>
      <FormField
        id={`${idPrefix}-title`}
        name="title"
        label="Room Title"
        placeholder="My awesome stream"
        defaultValue={defaultValues?.title}
        required
        error={fieldErrors.title}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-description`}>
          Description{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id={`${idPrefix}-description`}
          name="description"
          placeholder="What's this stream about?"
          defaultValue={defaultValues?.description ?? ""}
          maxLength={DESCRIPTION_MAX_LENGTH}
          rows={3}
          aria-invalid={!!fieldErrors.description}
          aria-describedby={
            fieldErrors.description
              ? `${idPrefix}-description-error`
              : undefined
          }
        />
        {fieldErrors.description && (
          <p
            id={`${idPrefix}-description-error`}
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldErrors.description}
          </p>
        )}
      </div>

      <FormField
        id={`${idPrefix}-slow-mode`}
        name="slowModeInterval"
        type="number"
        label="Slow Mode (seconds)"
        placeholder="Off"
        defaultValue={defaultValues?.slowModeInterval ?? ""}
        min={SLOW_MODE_MIN}
        max={SLOW_MODE_MAX}
        step={1}
        error={fieldErrors.slowModeInterval}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor={`${idPrefix}-guest-chat`}>Guest Chat</Label>
          <p className="text-xs text-muted-foreground">
            Allow non-logged-in viewers to send messages
          </p>
        </div>
        <Switch
          id={`${idPrefix}-guest-chat`}
          name="guestChatEnabled"
          defaultChecked={defaultValues?.guestChatEnabled ?? true}
        />
      </div>
    </>
  )
}

export { RoomFormFields }
export type { RoomFormFieldsProps }
