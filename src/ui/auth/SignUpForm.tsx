import React, { useState } from "react";
import Button from "../Button";
import Input, { PasswordInput } from "../Input";
import Card, { CardBody, CardHeader } from "../Card";
import { cn } from "../../utils/cn";

export interface SignUpFormProps {
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }) => Promise<void>;
  onSignIn?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onSignIn,
  loading = false,
  error,
  className,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (field: string, value: string | boolean) => {
    let error = "";

    switch (field) {
      case "username":
        if (!value || (value as string).length < 3) {
          error = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value as string)) {
          error = "Username can only contain letters, numbers, and underscores";
        }
        break;
      case "email":
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value || (value as string).length < 4) {
          error = "Password must be at least 4 characters";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "acceptTerms":
        if (!value) {
          error = "You must accept the terms and conditions";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange = (field: string, value: string | boolean) => {
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
        title="Join Wartalaap"
        subtitle="Create your account to start chatting"
      />

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-4">
          <Input
            type="text"
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            error={errors.username}
            disabled={loading}
            autoComplete="username"
            required
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            disabled={loading}
            autoComplete="email"
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            disabled={loading}
            autoComplete="new-password"
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            disabled={loading}
            autoComplete="new-password"
            required
            showPasswordToggle={false}
          />

          <div className="space-y-3">
            <label className="flex gap-3 text-sm font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                className="w-4 h-4 mt-3 border-2 border-terminal-black rounded focus:ring-2 focus:ring-accent-green"
                disabled={loading}
              />
              <span className="leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-accent-blue hover:text-accent-blue-hover underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-accent-blue hover:text-accent-blue-hover underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.acceptTerms && (
              <div className="text-xs text-center text-red-700 font-mono">
                {errors.acceptTerms}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="font-mono rounded-4xl"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          {onSignIn && (
            <div className="text-center">
              <span className="text-sm text-terminal-light-gray font-mono">
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={onSignIn}
                className="text-sm font-mono font-bold text-accent-green hover:text-accent-green-hover underline"
                disabled={loading}
              >
                Sign In
              </button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
};

export default SignUpForm;
