import {
  HiOutlineDocumentText,
  HiOutlineViewGrid,
  HiOutlinePhotograph,
  HiOutlineChatAlt,
  HiOutlineLightBulb,
  HiOutlineSwitchHorizontal,
  HiOutlinePlay,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

// Block type configuration - All 8 blocks enabled
export const BLOCK_TYPES = {
  text: {
    icon: HiOutlineDocumentText,
    label: "Text/Paragraph",
    description: "Rich text explanations",
  },
  table: {
    icon: HiOutlineViewGrid,
    label: "Table",
    description: "Conjugation tables, declensions",
  },
  image: {
    icon: HiOutlinePhotograph,
    label: "Image",
    description: "Visual explanations",
  },
  examples: {
    icon: HiOutlineChatAlt,
    label: "Examples",
    description: "Example sentences",
  },
  tip: {
    icon: HiOutlineLightBulb,
    label: "Tip/Note",
    description: "Highlighted tips & warnings",
  },
  comparison: {
    icon: HiOutlineSwitchHorizontal,
    label: "Comparison",
    description: "Side-by-side comparison",
  },
  video: {
    icon: HiOutlinePlay,
    label: "Video",
    description: "YouTube embed",
  },
  quiz: {
    icon: HiOutlineQuestionMarkCircle,
    label: "Quiz",
    description: "Mini quiz question",
  },
};

// Helper to generate unique block ID
export const generateBlockId = () => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
