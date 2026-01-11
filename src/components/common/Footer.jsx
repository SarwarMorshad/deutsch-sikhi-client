import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineHeart, HiOutlineMail, HiOutlineGlobeAlt } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ds-surface/50 border-t border-ds-border/30">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-ds-text">
              Deutsch<span className="text-ds-muted">Shikhi</span>
            </Link>
            <p className={`mt-3 text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "জার্মান ভাষা শিখুন সহজে বাংলা ও ইংরেজিতে।"
                : "Learn German easily in Bengali & English."}
            </p>
            <p className={`mt-1 text-ds-muted text-sm ${isBengali ? "" : "font-bangla"}`}>
              {isBengali
                ? "Learn German easily in Bengali & English."
                : "জার্মান ভাষা শিখুন সহজে বাংলা ও ইংরেজিতে।"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-ds-text font-semibold mb-4 ${isBengali ? "font-bangla" : ""}`}>
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses"
                  className={`text-ds-muted hover:text-ds-text transition-colors text-sm ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("nav.courses")}
                </Link>
              </li>
              <li>
                <Link
                  to="/vocabulary"
                  className={`text-ds-muted hover:text-ds-text transition-colors text-sm ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("nav.vocabulary")}
                </Link>
              </li>
              <li>
                <Link
                  to="/practice"
                  className={`text-ds-muted hover:text-ds-text transition-colors text-sm ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("nav.practice")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Levels */}
          <div>
            <h3 className={`text-ds-text font-semibold mb-4 ${isBengali ? "font-bangla" : ""}`}>
              {t("footer.levels")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses?level=A1"
                  className={`text-ds-muted hover:text-ds-text transition-colors text-sm ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  A1 - {isBengali ? "শুরু" : "Beginner"}
                </Link>
              </li>
              <li>
                <Link
                  to="/courses?level=A2"
                  className={`text-ds-muted hover:text-ds-text transition-colors text-sm ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  A2 - {isBengali ? "প্রাথমিক" : "Elementary"}
                </Link>
              </li>
              <li>
                <span className={`text-ds-border text-sm ${isBengali ? "font-bangla" : ""}`}>
                  B1 - {t("courses.comingSoon")}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className={`text-ds-text font-semibold mb-4 ${isBengali ? "font-bangla" : ""}`}>
              {t("footer.connect")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@deutschshikhi.com"
                  className="flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors text-sm"
                >
                  <HiOutlineMail className="w-4 h-4" />
                  contact@deutschshikhi.com
                </a>
              </li>
            </ul>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/SarwarMorshad"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-ds-bg text-ds-muted hover:text-ds-text hover:bg-ds-border/30 transition-colors"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/sarwarmorshad"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-ds-bg text-ds-muted hover:text-ds-text hover:bg-ds-border/30 transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-ds-bg text-ds-muted hover:text-ds-text hover:bg-ds-border/30 transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ds-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
              © {currentYear} DeutschShikhi. {t("footer.allRights")}
            </p>
            <p className={`text-ds-muted text-sm flex items-center gap-1 ${isBengali ? "font-bangla" : ""}`}>
              {t("footer.madeWith")} <HiOutlineHeart className="w-4 h-4 text-red-400" /> {t("footer.by")}{" "}
              <a
                href="https://github.com/SarwarMorshad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ds-text hover:underline"
              >
                Shovon
              </a>
            </p>
            <p className={`text-ds-border text-xs ${isBengali ? "font-bangla" : ""}`}>
              {t("footer.dataSource")}
            </p>
          </div>
        </div>
      </div>

      {/* German Flag Stripe at bottom */}
      <div className="german-stripe"></div>
    </footer>
  );
};

export default Footer;
