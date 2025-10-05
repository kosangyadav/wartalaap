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

export interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onSignUp,
  loading = false,
  error,
  className,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<LoginFormData>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginFormData, boolean>>
  >({});

  const validateUsername = (username: string): string | undefined => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (username.length < 4) {
      return "Username must be at least 4 characters";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 4) {
      return "Password must be at least 4 characters";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate field on blur
    let error: string | undefined;
    if (field === "username") {
      error = validateUsername(formData.username);
    } else if (field === "password") {
      error = validatePassword(formData.password);
    }

    if (error) {
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("not validated...");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Login form submission error:", error);
    }

    // Mark all fields as touched
    setTouched({ username: true, password: true });

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handling is managed by parent component
      console.error("Login failed:", err);
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
          {error && (
            <div className="toast-error p-3 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <Input
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            onBlur={() => handleInputBlur("username")}
            error={touched.username ? validationErrors.username : undefined}
            disabled={loading}
            // leftIcon={
            //   <svg
            //     className="w-4 h-4"
            //     fill="none"
            //     stroke="currentColor"
            //     viewBox="0 0 24 24"
            //   >
            //     <path
            //       strokeLinecap="round"
            //       strokeLinejoin="round"
            //       strokeWidth={2}
            //       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            //     />
            //   </svg>
            // }
            autoComplete="username"
            className="pl-10"
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onBlur={() => handleInputBlur("password")}
            error={touched.password ? validationErrors.password : undefined}
            disabled={loading}
            // leftIcon={
            //   <svg
            //     className="w-4 h-4"
            //     fill="none"
            //     stroke="currentColor"
            //     viewBox="0 0 24 24"
            //   >
            //     <path
            //       strokeLinecap="round"
            //       strokeLinejoin="round"
            //       strokeWidth={2}
            //       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            //     />
            //   </svg>
            // }
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between">
            {/*<label className="flex items-center gap-2 text-sm font-mono">
              <input
                type="checkbox"
                className="w-4 h-4 border-2 border-terminal-black rounded focus:ring-2 focus:ring-accent-green"
              />
              <span>Remember me</span>
            </label>*/}

            {/*{onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-mono text-accent-blue hover:text-accent-blue-hover underline focus:outline-none focus:ring-2 focus:ring-accent-blue rounded"
                disabled={loading}
              >
                Forgot password?
              </button>
            )}*/}
          </div>

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
                className="text-sm font-mono font-bold text-accent-green hover:text-accent-green-hover underline focus:outline-none focus:ring-2 focus:ring-accent-green rounded"
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
