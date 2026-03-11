import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone, Facebook, Linkedin, Twitter } from "lucide-react";

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Footer() {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    const quickLinks = [
        { to: "/about", label: t("nav.about") },
        { to: "/opportunities", label: t("nav.opportunities") },
        { to: "/events", label: t("nav.events") },
        { to: "/submit", label: t("nav.submit") },
        { to: "/faq", label: t("nav.faq") },
    ];

    // If you don't have real URLs yet, keep href as "#"
    const socialLinks = [
        { name: "Facebook", href: "#", Icon: Facebook },
        { name: "Twitter", href: "#", Icon: Twitter },
        { name: "LinkedIn", href: "#", Icon: Linkedin },
    ];

    return (
        <footer className="bg-bg-primary border-t border-white/5 text-surface-400 mt-auto relative overflow-hidden" aria-label="Footer">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-glow opacity-20 blur-md"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 flex-col items-start" aria-label="CMC BMK Home">
                            <div className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)] group-hover:scale-105 transition-transform duration-300">
                                    C
                                </div>
                                <span className="text-white font-bold text-xl tracking-tight">CMC <span className="text-gradient">BMK</span></span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-surface-400 max-w-sm">
                            {t("footer.description")}
                        </p>
                    </div>

                    {/* Quick Links */}
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

                    {/* Contact Info & Socials */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 tracking-wide">{t("footer.contact")}</h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-primary-500 transition-colors">
                                        <MapPin className="h-4 w-4 text-primary-400" />
                                    </div>
                                    <span className="text-surface-400 mt-1">{t("contact.info.address")}</span>
                                </li>

                                <li className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-primary-500 transition-colors">
                                        <Phone className="h-4 w-4 text-primary-400 group-hover:text-highlight transition-colors" />
                                    </div>
                                    <a href="#" className="text-surface-400 hover:text-white transition-colors mt-1">
                                        {t("contact.info.phone")}
                                    </a>
                                </li>

                                <li className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-primary-500 transition-colors">
                                        <Mail className="h-4 w-4 text-primary-400 group-hover:text-highlight transition-colors" />
                                    </div>
                                    <a href="#" className="text-surface-400 hover:text-white transition-colors mt-1">
                                        {t("contact.info.email")}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Follow / Hours */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 tracking-wide">{t("footer.followUs")}</h3>
                            <p className="text-sm text-surface-400 mb-6">{t("contact.info.hours")}</p>

                            <div className="flex gap-4" aria-label="Social links">
                                {socialLinks.map(({ name, href, Icon }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        className={cx(
                                            "w-10 h-10 rounded-xl bg-bg-card border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)]",
                                            "hover:-translate-y-1 hover:border-primary-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]",
                                            "flex items-center justify-center",
                                            "text-surface-400 hover:text-white transition-all duration-300"
                                        )}
                                        aria-label={name}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        <span className="sr-only">{name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 mt-16 pt-8 text-center text-sm text-surface-500 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span>{t("footer.rights")}</span>
                    <div className="flex items-center gap-4 text-surface-500">
                        <Link to="/about" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                        <span>•</span>
                        <Link to="/about" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}