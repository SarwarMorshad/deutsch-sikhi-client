import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import {
  HiOutlinePlay,
  HiOutlineBookOpen,
  HiOutlineLightBulb,
  HiOutlinePuzzle,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
} from "react-icons/hi";

const SectionNav = ({ activeSection, onSectionChange }) => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  const sections = [
    { id: "warmup", labelKey: "warmup", icon: HiOutlinePlay },
    { id: "vocabulary", labelKey: "vocabulary", icon: HiOutlineBookOpen },
    { id: "grammar", labelKey: "grammar", icon: HiOutlineLightBulb },
    { id: "practice", labelKey: "practice", icon: HiOutlinePuzzle },
    { id: "conversation", labelKey: "conversation", icon: HiOutlineChatAlt2 },
    { id: "quiz", labelKey: "quiz", icon: HiOutlineClipboardCheck },
  ];

  return (
    <div className="flex gap-1 mb-6 p-1 bg-ds-surface/30 rounded-xl overflow-x-auto">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 rounded-lg font-medium transition-all ${
            activeSection === section.id
              ? "bg-ds-text text-ds-bg"
              : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
          }`}
        >
          <section.icon className="w-5 h-5" />
          <span className={`text-xs ${isBengali ? "font-bangla" : ""}`}>
            {t(`lesson.sections.${section.labelKey}`)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SectionNav;
