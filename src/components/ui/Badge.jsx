import { useMemo } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const COLOR_MAP = {
  blue: "bg-primary-100 text-primary-700",
  purple: "bg-accent-100 text-accent-700",
  green: "bg-success-50 text-success-600",
  red: "bg-danger-50 text-danger-600",
  yellow: "bg-warning-50 text-warning-600",
  gray: "bg-surface-200 text-surface-600",
};

const OUTLINE_MAP = {
  blue: "border border-primary-300 text-primary-700",
  purple: "border border-accent-300 text-accent-700",
  green: "border border-success-300 text-success-600",
  red: "border border-danger-300 text-danger-600",
  yellow: "border border-warning-300 text-warning-600",
  gray: "border border-surface-300 text-surface-600",
};

const STATUS_COLORS = {
  open: "green",
  closed: "red",
  received: "blue",
  under_review: "yellow",
  accepted: "green",
  rejected: "red",
  online: "purple",
  onsite: "blue",
};

const SIZE_MAP = {
  xs: "px-2 py-0.5 text-[10px]",
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

export default function Badge({
  children,
  color,
  status,
  variant = "soft", // soft | outline | solid (future)
  size = "sm",
  icon: Icon,
  className = "",
  role = "status",
}) {
  // Resolve final color (priority: color > status > gray)
  const resolvedColor = useMemo(() => {
    if (color && COLOR_MAP[color]) return color;
    if (status && STATUS_COLORS[status]) return STATUS_COLORS[status];
    return "gray";
  }, [color, status]);

  const colorClasses = useMemo(() => {
    if (variant === "outline") return OUTLINE_MAP[resolvedColor];
    return COLOR_MAP[resolvedColor]; // default soft
  }, [variant, resolvedColor]);

  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.sm;

  return (
    <span
      role={role}
      className={cx(
        "inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap",
        "transition-colors",
        colorClasses,
        sizeClasses,
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  );
}