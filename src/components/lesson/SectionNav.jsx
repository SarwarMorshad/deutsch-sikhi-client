import {
  HiOutlinePlay,
  HiOutlineBookOpen,
  HiOutlineLightBulb,
  HiOutlinePuzzle,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
} from "react-icons/hi";

const sections = [
  { id: "warmup", label: "Warm-up", icon: HiOutlinePlay },
  { id: "vocabulary", label: "Vocabulary", icon: HiOutlineBookOpen },
  { id: "grammar", label: "Grammar", icon: HiOutlineLightBulb },
  { id: "practice", label: "Practice", icon: HiOutlinePuzzle },
  { id: "conversation", label: "Conversation", icon: HiOutlineChatAlt2 },
  { id: "quiz", label: "Quiz", icon: HiOutlineClipboardCheck },
];

const SectionNav = ({ activeSection, onSectionChange }) => {
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
          <span className="text-xs">{section.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SectionNav;
