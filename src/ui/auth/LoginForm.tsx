import React, { useState } from "react";
import Button from "../Button";
import Input, { PasswordInput } from "../Input";
import Card, { CardBody, CardHeader } from "../Card";
import { cn } from "../../utils/cn";

export interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  // onForgotPassword,
  onSignUp,
  loading = false,
  className,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (field: string, value: string) => {
    let error = "";

    if (field === "username" && (!value || value.length < 3)) {
      error = "Username must be at least 3 characters";
    } else if (field === "password" && (!value || value.length < 4)) {
      error = "Password must be at least 4 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = Object.keys(formData).every((field) =>
      validate(field, formData[field as keyof typeof formData]),
    );

    if (isValid && !Object.values(errors).some(Boolean)) {
      await onSubmit(formData);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader
        title="Welcome Back"
        subtitle="Sign in to continue to Wartalaap"
      />

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6 px-4 pt-4">
          <Input
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            error={errors.username}
            disabled={loading}
            autoComplete="username"
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            disabled={loading}
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="font-mono rounded-4xl"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {onSignUp && (
            <div className="text-center">
              <span className="text-sm text-terminal-light-gray font-mono">
                Don't have an account?{" "}
              </span>
              <button
                type="button"
                onClick={onSignUp}
                className="text-sm font-mono font-bold text-accent-green hover:text-accent-green-hover underline"
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
};

export default LoginForm;
