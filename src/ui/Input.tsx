import React, { useState } from "react";
import { cn } from "../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses = "input-neu focus-ring";
    const errorClasses = error ? "border-accent-red ring-accent-red" : "";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    const classes = cn(
      baseClasses,
      errorClasses,
      disabledClasses,
      leftIcon ? "pl-20" : "",
      rightIcon ? "pr-10" : "",
      fullWidth ? "w-full" : "",
      className,
    );

    return (
      <div className={cn("form-group", fullWidth && "w-full")}>
        {label && <label className="form-label">{label}</label>}
        <div className="input-group relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-light-gray">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={classes}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-terminal-light-gray">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <div className="form-error">{error}</div>}
        {helperText && !error && (
          <div className="text-xs text-terminal-light-gray mt-1 font-mono">
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// Password Input with toggle visibility
export interface PasswordInputProps
  extends Omit<InputProps, "type" | "rightIcon"> {
  showPasswordToggle?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ showPasswordToggle = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const eyeIcon = showPassword ? (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
      />
    </svg>
  ) : (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  return (
    <Input
      ref={ref}
      type={showPassword ? "text" : "password"}
      rightIcon={
        showPasswordToggle && (
          <button
            type="button"
            onClick={togglePassword}
            className="hover:text-terminal-black transition-colors"
            tabIndex={-1}
          >
            {eyeIcon}
          </button>
        )
      }
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";

// Textarea Component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = true,
      resize = "vertical",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses = "textarea-neu"; //"textarea-neu focus-ring";
    const errorClasses = error ? "border-accent-red ring-accent-red" : "";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const classes = cn(
      baseClasses,
      errorClasses,
      disabledClasses,
      resizeClasses[resize],
      fullWidth && "w-full",
      className,
    );

    return (
      <div className={cn("flex items-center", fullWidth && "w-full")}>
        {/*form-group */}
        {label && <label className="form-label">{label}</label>}
        <textarea
          className={classes}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {error && <div className="form-error">{error}</div>}
        {helperText && !error && (
          <div className="text-xs text-terminal-light-gray font-mono">
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

// Search Input Component
export interface SearchInputProps
  extends Omit<InputProps, "leftIcon" | "type"> {
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, value, className, ...props }, ref) => {
    const searchIcon = (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );

    const clearIcon = (
      <button
        type="button"
        onClick={onClear}
        className="hover:text-terminal-black transition-colors"
        tabIndex={-1}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    );

    return (
      <Input
        ref={ref}
        type="search"
        // leftIcon={searchIcon}
        // rightIcon={showClearButton && value && clearIcon}
        value={value}
        className={cn("input-search", className)}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

export default Input;
