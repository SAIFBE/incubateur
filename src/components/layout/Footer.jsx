import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, MapPin } from "lucide-react";
import BrandLogo from "../ui/BrandLogo";

export default function Footer() {
    const { t } = useTranslation();
    const quickLinks = [
        { to: "/about", label: t("nav.about") },
        { to: "/opportunities", label: t("nav.opportunities") },
        { to: "/events", label: t("nav.events") },
        { to: "/submit", label: t("nav.submit") },
        { to: "/faq", label: t("nav.faq") },
    ];

    return (
        <footer className="bg-bg-primary border-t border-white/5 text-surface-400 mt-auto relative overflow-hidden" aria-label="Footer">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-glow opacity-20 blur-md"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <Link to="/" className="inline-flex items-start gap-3 mb-6 flex-col" aria-label="CMC BMK Home">
                            <BrandLogo className="brand-logo-footer" />
                        </Link>
                        <p className="text-sm leading-relaxed text-surface-400 max-w-sm">
                            {t("footer.description")}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 tracking-wide">{t("footer.quickLinks")}</h3>
                        <ul className="space-y-3 text-sm">
                            {quickLinks.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="text-surface-400 hover:text-highlight transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-surface-600 group-hover:bg-highlight transition-colors"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6 tracking-wide">{t("footer.contact")}</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                    <MapPin className="h-4 w-4 text-primary-400" />
                                </div>
                                <span className="text-surface-400 mt-1">{t("contact.info.address")}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                    <Clock className="h-4 w-4 text-primary-400" />
                                </div>
                                <span className="text-surface-400 mt-1">{t("contact.info.hours")}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 text-center text-sm text-surface-500 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span>{t("footer.rights")}</span>
                    <div className="flex items-center gap-4 text-surface-500">
                        <Link to="/about" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
                        <span>|</span>
                        <Link to="/about" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
