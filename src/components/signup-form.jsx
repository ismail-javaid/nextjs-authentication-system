"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/schemas";
import { signup } from "@/actions/auth";
import { FormField } from "@/components/form-field";

export function SignupForm() {
  const [formMessage, setFormMessage] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    setFormMessage(null);

    const result = await signup(data);

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
        name="name"
        label="Name"
        register={register}
        errors={errors}
      />

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

      <FormField
        name="confirmPassword"
        label="Confirm password"
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
        {isSubmitting ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}