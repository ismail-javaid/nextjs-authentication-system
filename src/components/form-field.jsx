"use client";

export function FormField({
  name,
  label,
  type = "text",
  register,
  errors,
}) {
  const message = errors[name]?.message;
  const errorId = `${name}-error`;

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        aria-invalid={!!message}
        aria-describedby={message ? errorId : undefined}
        className="border rounded p-2 w-full aria-[invalid=true]:border-red-500"
        {...register(name)}
      />

      {message && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600"
        >
          {message}
        </p>
      )}
    </div>
  );
}