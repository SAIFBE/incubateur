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
        <footer className="bg-surface-900 text-surface-300 mt-auto" aria-label="Footer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4" aria-label="CMC BMK Home">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                C
                            </div>
                            <span className="text-white font-bold text-lg">CMC BMK</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-surface-300">
                            {t("footer.description")}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h3>
                        <ul className="space-y-2 text-sm">
                            {quickLinks.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 rounded"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t("footer.contact")}</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                <span className="text-surface-300">{t("contact.info.address")}</span>
                            </li>

                            <li className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                {/* If you have real phone, replace text + href: `tel:+212...` */}
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 rounded"
                                >
                                    {t("contact.info.phone")}
                                </a>
                            </li>

                            <li className="flex items-start gap-2">
                                <Mail className="h-4 w-4 text-primary-400 flex-shrink-0 mt-0.5" />
                                {/* If you have real email, replace href: `mailto:incubateur@...` */}
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 rounded"
                                >
                                    {t("contact.info.email")}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Follow / Hours */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t("footer.followUs")}</h3>
                        <p className="text-sm text-surface-300">{t("contact.info.hours")}</p>

                        <div className="flex gap-3 mt-4" aria-label="Social links">
                            {socialLinks.map(({ name, href, Icon }) => (
                                <a
                                    key={name}
                                    href={href}
                                    className={cx(
                                        "w-10 h-10 rounded-lg bg-surface-800",
                                        "hover:bg-primary-600",
                                        "flex items-center justify-center",
                                        "text-surface-300 hover:text-white transition-colors",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900"
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

                {/* Bottom bar */}
                <div className="border-t border-surface-800 mt-10 pt-6 text-center text-sm text-surface-500">
                    <span>{t("footer.rights")} </span>
                    <span className="text-surface-500">• {year}</span>
                </div>
            </div>
        </footer>
    );
}