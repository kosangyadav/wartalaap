import React from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = "btn-neu animate-press focus-ring";

    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
      danger: "btn-danger",
    };

    const sizeClasses = {
      sm: "btn-sm px-3 py-1.5 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "btn-lg px-8 py-4 text-base",
      icon: "btn-icon p-3 min-w-0 w-12 h-12 rounded-full",
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      (loading || disabled) && "opacity-50 cursor-not-allowed",
      className,
    );

    return (
      <button
        className={classes}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <div className="spinner mr-2" />}
        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        )}
        {size !== "icon" && children && (
          <span className="font-medium">{children}</span>
        )}
        {size === "icon" && !loading && children}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;

// Icon Button specific component
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "size"> & { icon: React.ReactNode; tooltip?: string }
>(({ icon, tooltip, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      size="icon"
      className={cn("relative group", className)}
      {...props}
    >
      {icon}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-terminal-black text-cream-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </Button>
  );
});

IconButton.displayName = "IconButton";

// Button Group component
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
};

ButtonGroup.displayName = "ButtonGroup";
