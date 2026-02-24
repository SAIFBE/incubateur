import { forwardRef } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VARIANTS = {
  primary:
    "bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg active:translate-y-[0.5px]",
  secondary:
    "bg-surface-200 text-surface-800 hover:bg-surface-300 active:translate-y-[0.5px]",
  accent:
    "bg-accent-600 text-white shadow-md hover:bg-accent-700 hover:shadow-lg active:translate-y-[0.5px]",
  danger:
    "bg-danger-500 text-white shadow-md hover:bg-danger-600 active:translate-y-[0.5px]",
  ghost:
    "bg-transparent text-surface-700 hover:bg-surface-100 active:translate-y-[0.5px]",
  outline:
    "border-2 border-primary-600 text-primary-700 hover:bg-primary-50 active:translate-y-[0.5px]",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      disabled = false,
      loading = false,
      loadingText,
      icon: Icon,
      iconPosition = "left", // left | right
      fullWidth = false,
      type,
      ...props
    },
    ref
  ) => {
    const v = VARIANTS[variant] ? variant : "primary";
    const s = SIZES[size] ? size : "md";

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={cx(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-xl",
          "transition-all duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:translate-y-0",
          fullWidth && "w-full",
          VARIANTS[v],
          SIZES[s],
          className
        )}
        {...props}
      >
        {/* Left icon/spinner */}
        {iconPosition === "left" && (
          <>
            {loading ? (
              <Spinner />
            ) : Icon ? (
              <Icon className="h-4 w-4" aria-hidden="true" />
            ) : null}
          </>
        )}

        <span className={cx(loading && "opacity-90")}>
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Right icon/spinner */}
        {iconPosition === "right" && (
          <>
            {loading ? (
              <Spinner />
            ) : Icon ? (
              <Icon className="h-4 w-4" aria-hidden="true" />
            ) : null}
          </>
        )}
      </button>
    );
  }
);

function Spinner() {
  return (
    <span className="inline-flex items-center" role="status" aria-live="polite">
      <svg
        className="animate-spin h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">Loading</span>
    </span>
  );
}

Button.displayName = "Button";
export default Button;