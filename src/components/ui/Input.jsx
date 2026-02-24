import { forwardRef, useId } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = "",
      id,
      as = "input", // "input" | "textarea"
      type = "text",
      required = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      inputClassName = "",
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId =
      id ||
      (label ? `field-${label.toLowerCase().replace(/\s+/g, "-")}-${autoId}` : `field-${autoId}`);

    const describedById = helperText || error ? `${inputId}-help` : undefined;

    const base =
      "w-full px-4 py-2.5 rounded-xl border bg-white text-surface-800 transition-all duration-200 placeholder:text-surface-400 focus:outline-none";
    const focusOk = "focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
    const focusErr = "focus:ring-2 focus:ring-danger-500 focus:border-danger-500";
    const borderOk = "border-surface-300";
    const borderErr = "border-danger-500";
    const withIcons = (LeftIcon || RightIcon) ? "pl-11 pr-11" : "";
    const textareaExtra = "resize-y min-h-[110px]";

    const fieldClasses = cx(
      base,
      withIcons,
      error ? cx(borderErr, focusErr) : cx(borderOk, focusOk),
      as === "textarea" && textareaExtra,
      inputClassName
    );

    return (
      <div className={cx("space-y-1", className)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-700">
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <span className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-surface-400">
              <LeftIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}

          {as === "textarea" ? (
            <textarea
              ref={ref}
              id={inputId}
              className={fieldClasses}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={describedById}
              {...props}
            />
          ) : (
            <input
              ref={ref}
              id={inputId}
              type={type}
              className={fieldClasses}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={describedById}
              {...props}
            />
          )}

          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
              aria-label="Input action"
              tabIndex={0}
            >
              <RightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {(error || helperText) && (
          <p
            id={describedById}
            className={cx("text-sm", error ? "text-danger-500" : "text-surface-500")}
            role={error ? "alert" : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;