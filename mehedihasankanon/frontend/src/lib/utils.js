/**
 * Shared utility for form field classes in the auth section.
 */
export const fieldClass = (hasError) =>
  [
    'w-full bg-transparent border text-white text-sm rounded-none px-3 py-2.5 pl-9 placeholder-zinc-500 outline-none transition-colors',
    hasError
      ? 'border-red-500 focus:border-red-400'
      : 'border-zinc-700 focus:border-white',
  ].join(' ')
