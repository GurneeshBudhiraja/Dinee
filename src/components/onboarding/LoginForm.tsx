"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onLogin(email, password);
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurant Call Management
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your AI agent calls
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {errors.general && (
                <div
                  className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.general}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={errors.email}
                placeholder="Enter your email"
                required
                autoComplete="email"
                autoFocus
                disabled={isSubmitting || loading}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isSubmitting || loading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting || loading}
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
