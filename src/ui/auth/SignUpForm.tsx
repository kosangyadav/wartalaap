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

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onSignIn,
  loading = false,
  error,
  className,
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignUpFormData, boolean>>
  >({});

  const validateUsername = (username: string): string | undefined => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (username.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
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
    // if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    //   return "Password must contain at least one uppercase and lowercase letter";
    // }
    return undefined;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string,
  ): string | undefined => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return undefined;
  };

  const validateTerms = (acceptTerms: boolean): string | undefined => {
    if (!acceptTerms) {
      return "You must accept the terms and conditions";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof SignUpFormData, string>> = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password,
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    const termsError = validateTerms(formData.acceptTerms);
    if (termsError) errors.acceptTerms = termsError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    field: keyof SignUpFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: keyof SignUpFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate field on blur
    let error: string | undefined;
    if (field === "username") {
      error = validateUsername(formData.username);
    } else if (field === "email") {
      error = validateEmail(formData.email);
    } else if (field === "password") {
      error = validatePassword(formData.password);
    } else if (field === "confirmPassword") {
      error = validateConfirmPassword(
        formData.confirmPassword,
        formData.password,
      );
    } else if (field === "acceptTerms") {
      error = validateTerms(formData.acceptTerms);
    }

    if (error) {
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handling is managed by parent component
      console.error("Sign up failed:", err);
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
            placeholder="Choose a username"
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
            required
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => handleInputBlur("email")}
            error={touched.email ? validationErrors.email : undefined}
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
            //       d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            //     />
            //   </svg>
            // }
            autoComplete="email"
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Create a password"
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
            autoComplete="new-password"
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            onBlur={() => handleInputBlur("confirmPassword")}
            error={
              touched.confirmPassword
                ? validationErrors.confirmPassword
                : undefined
            }
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
            //       d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            //     />
            //   </svg>
            // }
            autoComplete="new-password"
            required
          />

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  handleInputChange("acceptTerms", e.target.checked)
                }
                onBlur={() => handleInputBlur("acceptTerms")}
                className="w-4 h-4 mt-0.5 border-2 border-terminal-black rounded focus:ring-2 focus:ring-accent-green"
                disabled={loading}
              />
              <span className="leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-accent-blue hover:text-accent-blue-hover underline focus:outline-none focus:ring-2 focus:ring-accent-blue rounded"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-accent-blue hover:text-accent-blue-hover underline focus:outline-none focus:ring-2 focus:ring-accent-blue rounded"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
            {touched.acceptTerms && validationErrors.acceptTerms && (
              <div className="text-xs text-accent-red font-mono mt-1">
                {validationErrors.acceptTerms}
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
                className="text-sm font-mono font-bold text-accent-green hover:text-accent-green-hover underline focus:outline-none focus:ring-2 focus:ring-accent-green rounded"
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
