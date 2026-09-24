// Reusable labeled input for auth forms with inline error display.

export default function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink dark:text-white/85">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition
          focus:ring-2 focus:ring-brand/40 dark:bg-night-card dark:text-white dark:placeholder-white/40 ${
            error
              ? 'border-red-400'
              : 'border-black/10 focus:border-brand dark:border-white/15 dark:focus:border-brand'
          }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
