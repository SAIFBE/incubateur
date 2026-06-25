import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, ChevronDown, Shield, Moon, Sun } from "lucide-react";
import { useUI } from "../../contexts/UIContext";
import BrandLogo from "../ui/BrandLogo";

const LANGUAGES = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
];

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { adminUser, logoutAdmin, theme, toggleTheme } = useUI();

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
            { path: "/impact", label: t("nav.impactShort"), mobileLabel: t("impact.badge") },
            { path: "/submit", label: t("nav.submitShort"), mobileLabel: t("nav.submit") },
            { path: "/suivi", label: t("nav.trackingShort"), mobileLabel: t("nav.tracking") },
            { path: "/faq", label: t("nav.faq") },
            { path: "/contact", label: t("nav.contact") },
        ],
        [t]
    );

    const applyLangToDocument = useCallback((code) => {
        document.documentElement.lang = code;
        document.documentElement.dir = "ltr";
    }, []);

    useEffect(() => {
        // Keep html lang/dir synced on refresh or external lang set
        applyLangToDocument(i18n.language || "fr");
    }, [i18n.language, applyLangToDocument]);

    const changeLanguage = useCallback(
        async (code) => {
            localStorage.setItem("i18nextLng", code);
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

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const baseLink = "topbar-link rounded-lg text-sm font-medium transition-colors hover-underline whitespace-nowrap";
    const activeLink = "text-highlight active";
    const idleLink = "text-surface-700 hover:text-highlight";

    return (
        <header className={cx(
            "fixed top-0 w-full z-50 transition-all duration-300",
            scrolled ? "glass-panel shadow-glow py-2" : "bg-transparent py-4"
        )}>
            <div className="topbar-container">
                <div className="flex items-center justify-between gap-4 h-14">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 font-bold text-xl tracking-tight group"
                        aria-label="CMC BMK Home"
                    >
                        <BrandLogo className="brand-logo-navbar" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center justify-center min-w-0 flex-1" aria-label="Main navigation">
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
                    <div className="flex items-center gap-2.5 shrink-0">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                ref={langBtnRef}
                                type="button"
                                onClick={() => setLangOpen((v) => !v)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-700 hover:text-highlight hover:bg-white/5 transition-colors whitespace-nowrap"
                                aria-label={t("common.language")}
                                aria-haspopup="menu"
                                aria-expanded={langOpen}
                            >
                                <Globe className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {currentLang.code.toUpperCase()}
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
                                    className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-card rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 py-1 z-20"
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
                                                        ? "bg-primary-500/10 text-highlight font-medium"
                                                        : "text-surface-700 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                <span>{lang.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                            aria-label={theme === "light" ? t("common.switchToDark") : t("common.switchToLight")}
                            title={theme === "light" ? t("common.switchToDark") : t("common.switchToLight")}
                        >
                            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </button>

                        {/* Admin actions */}
                        {adminUser ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary-500/10 text-primary-300 hover:bg-primary-500/20 hover:text-white border border-primary-500/30 transition-colors"
                                >
                                    <Shield className="h-4 w-4" />
                                    {t("nav.admin")}
                                </Link>
                                <button
                                    type="button"
                                    onClick={logoutAdmin}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-surface-700 hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
                                >
                                    {t("nav.logout")}
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin"
                                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-white/10 text-white hover:border-highlight hover:text-highlight transition-all duration-300"
                            >
                                <Shield className="h-4 w-4" />
                                <span className="hidden sm:inline">Admin</span>
                            </Link>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
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
                    className="lg:hidden glass-panel absolute w-full"
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
                                        "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary-500/20 text-highlight border border-primary-500/30"
                                            : "text-surface-700 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    {link.mobileLabel || link.label}
                                </Link>
                            );
                        })}

                        <Link
                            to="/admin"
                            className="block px-4 py-3 rounded-lg text-sm font-medium text-surface-700 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            {t("nav.admin")}
                        </Link>

                        {adminUser && (
                            <button
                                type="button"
                                onClick={logoutAdmin}
                                className="block w-full text-left rtl:text-right px-4 py-3 rounded-lg text-sm font-medium text-danger-400 hover:bg-danger-500/10 transition-colors"
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
