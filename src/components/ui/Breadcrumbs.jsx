import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Breadcrumbs({ items = [], className = "" }) {
  const { i18n } = useTranslation();

  const isRTL = useMemo(() => (i18n.language || "fr") === "ar", [i18n.language]);

  const safeItems = useMemo(() => {
    const arr = Array.isArray(items) ? items : [];
    // Remove falsy / empty labels
    return arr.filter((x) => x && typeof x.label === "string" && x.label.trim());
  }, [items]);

  if (safeItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cx("mb-6", className)} dir={isRTL ? "rtl" : "ltr"}>
      <ol className="flex items-center gap-2 text-sm text-surface-500 flex-wrap">
        {safeItems.map((item, idx) => {
          const isLast = idx === safeItems.length - 1;
          const key = item.id || item.href || item.label;

          return (
            <li key={key} className="flex items-center gap-2">
              {idx > 0 && (
                <ChevronRight
                  className={cx(
                    "h-4 w-4 text-surface-400",
                    // In RTL, chevron should point left visually:
                    isRTL && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              )}

              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-primary-600 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cx(
                    "text-surface-800 font-medium",
                    isLast && "truncate"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}