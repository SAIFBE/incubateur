import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, ChevronDown, Shield } from "lucide-react";
import { useUI } from "../../contexts/UIContext";

const LANGUAGES = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "ar", label: "العربية", flag: "🇲🇦" },
    { code: "en", label: "English", flag: "🇬🇧" },
];

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { adminUser, logoutAdmin } = useUI();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const langBtnRef = useRef(null);
    const langMenuRef = useRef(null);

    const currentLang = useMemo(
        () => LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0],
        [i18n.language]
    );

    const isActive = useCallback(
        (path) => {
            if (path === "/") return location.pathname === "/";
            return location.pathname.startsWith(path);
        },
        [location.pathname]
    );

    const navLinks = useMemo(
        () => [
            { path: "/", label: t("nav.home") },
            { path: "/about", label: t("nav.about") },
            { path: "/opportunities", label: t("nav.opportunities") },
            { path: "/events", label: t("nav.events") },
            { path: "/submit", label: t("nav.submit") },
            { path: "/my-submissions", label: t("nav.mySubmissions") },
            { path: "/faq", label: t("nav.faq") },
            { path: "/contact", label: t("nav.contact") },
        ],
        [t]
    );

    const applyLangToDocument = useCallback((code) => {
        document.documentElement.lang = code;
        document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    }, []);

    useEffect(() => {
        // Keep html lang/dir synced on refresh or external lang set
        applyLangToDocument(i18n.language || "fr");
    }, [i18n.language, applyLangToDocument]);

    const changeLanguage = useCallback(
        async (code) => {
            await i18n.changeLanguage(code);
            applyLangToDocument(code);
            setLangOpen(false);
        },
        [i18n, applyLangToDocument]
    );

    // Close menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setLangOpen(false);
    }, [location.pathname]);

    // Close language dropdown on outside click + Escape
    useEffect(() => {
        if (!langOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                setLangOpen(false);
                langBtnRef.current?.focus();
            }
        };

        const onPointerDown = (e) => {
            const menu = langMenuRef.current;
            const btn = langBtnRef.current;
            if (!menu || !btn) return;

            if (menu.contains(e.target) || btn.contains(e.target)) return;
            setLangOpen(false);
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [langOpen]);

    // Optional: prevent body scroll when mobile menu is open
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    const baseLink =
        "px-3 py-2 rounded-lg text-sm font-medium transition-colors";
    const activeLink = "bg-primary-50 text-primary-700";
    const idleLink =
        "text-surface-600 hover:text-surface-900 hover:bg-surface-100";

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-surface-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-bold text-lg text-primary-700"
                        aria-label="CMC BMK Home"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            C
                        </div>
                        <span className="hidden sm:inline">CMC BMK</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    aria-current={active ? "page" : undefined}
                                    className={cx(baseLink, active ? activeLink : idleLink)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                ref={langBtnRef}
                                type="button"
                                onClick={() => setLangOpen((v) => !v)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 transition-colors"
                                aria-label={t("common.language")}
                                aria-haspopup="menu"
                                aria-expanded={langOpen}
                            >
                                <Globe className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {currentLang.flag} {currentLang.label}
                                </span>
                                <ChevronDown
                                    className={cx(
                                        "h-3 w-3 transition-transform",
                                        langOpen && "rotate-180"
                                    )}
                                />
                            </button>

                            {langOpen && (
                                <div
                                    ref={langMenuRef}
                                    role="menu"
                                    aria-label="Language menu"
                                    className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-surface-200 py-1 z-20"
                                >
                                    {LANGUAGES.map((lang) => {
                                        const selected = i18n.language === lang.code;
                                        return (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                role="menuitem"
                                                onClick={() => changeLanguage(lang.code)}
                                                className={cx(
                                                    "w-full text-left rtl:text-right px-4 py-2 text-sm transition-colors flex items-center gap-2",
                                                    selected
                                                        ? "bg-primary-50 text-primary-700 font-medium"
                                                        : "text-surface-700 hover:bg-surface-50"
                                                )}
                                            >
                                                <span aria-hidden="true">{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Admin actions */}
                        {adminUser ? (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors"
                                >
                                    <Shield className="h-4 w-4" />
                                    {t("nav.admin")}
                                </Link>
                                <button
                                    type="button"
                                    onClick={logoutAdmin}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 transition-colors"
                                >
                                    {t("nav.logout")}
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 transition-colors"
                                aria-label={t("nav.admin")}
                            >
                                <Shield className="h-4 w-4" />
                            </Link>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-600"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <nav
                    id="mobile-nav"
                    className="lg:hidden border-t border-surface-200 bg-white/95 backdrop-blur-lg"
                    aria-label="Mobile navigation"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cx(
                                        "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary-50 text-primary-700"
                                            : "text-surface-600 hover:bg-surface-100"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        <Link
                            to="/admin"
                            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 transition-colors"
                        >
                            {t("nav.admin")}
                        </Link>

                        {adminUser && (
                            <button
                                type="button"
                                onClick={logoutAdmin}
                                className="block w-full text-left rtl:text-right px-4 py-2.5 rounded-lg text-sm font-medium text-danger-500 hover:bg-surface-100 transition-colors"
                            >
                                {t("nav.logout")}
                            </button>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}