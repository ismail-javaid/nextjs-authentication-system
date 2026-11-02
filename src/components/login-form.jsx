"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { login } from "@/actions/auth";
import { FormField } from "@/components/form-field";

export function LoginForm({ callbackUrl }) {
  const [formMessage, setFormMessage] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setFormMessage(null);

    const result = await login(data, callbackUrl);

    if (result && !result.success) {
      for (const [field, messages] of Object.entries(
        result.fieldErrors ?? {}
      )) {
        setError(field, {
          type: "server",
          message: messages[0],
        });
      }

      setFormMessage(result.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 max-w-sm"
    >
      <FormField
        name="email"
        label="Email"
        type="email"
        register={register}
        errors={errors}
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        register={register}
        errors={errors}
      />

      {formMessage && (
        <p role="alert" className="text-sm text-red-600">
          {formMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        {isSubmitting ? "Signing in..." : "Log in"}
      </button>
    </form>
  );
}