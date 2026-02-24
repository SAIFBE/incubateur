function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Card({
  children,
  className = "",
  hover = true,
  onClick,
  disabled = false,
}) {
  const clickable = typeof onClick === "function" && !disabled;

  const handleKeyDown = (e) => {
    if (!clickable) return;
    if (e.key === "Enter") onClick(e);
    if (e.key === " ") {
      e.preventDefault(); // avoid page scroll
      onClick(e);
    }
  };

  return (
    <div
      className={cx(
        "card",
        hover && "card--hover",
        clickable && "card--clickable",
        disabled && "card--disabled",
        className
      )}
      onClick={clickable ? onClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-disabled={disabled ? "true" : undefined}
    >
      {children}
    </div>
  );
}