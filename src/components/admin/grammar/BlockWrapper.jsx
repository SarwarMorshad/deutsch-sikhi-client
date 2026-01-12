import { useState } from "react";
import {
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineTrash,
  HiOutlineMenuAlt2,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { BLOCK_TYPES } from "./BlockTypes";
import TextBlockEditor from "./TextBlockEditor";
import TableBlockEditor from "./TableBlockEditor";
import ImageBlockEditor from "./ImageBlockEditor";
import ExamplesBlockEditor from "./ExamplesBlockEditor";
import TipBlockEditor from "./TipBlockEditor";
import ComparisonBlockEditor from "./ComparisonBlockEditor";
import VideoBlockEditor from "./VideoBlockEditor";
import QuizBlockEditor from "./QuizBlockEditor";

const BlockWrapper = ({ block, index, totalBlocks, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const BlockType = BLOCK_TYPES[block.type];
  const BlockIcon = BlockType?.icon || HiOutlineDocumentText;

  const renderBlockEditor = () => {
    switch (block.type) {
      case "text":
        return (
          <TextBlockEditor data={block.data} onChange={(newData) => onUpdate({ ...block, data: newData })} />
        );
      case "table":
        return (
          <TableBlockEditor data={block.data} onChange={(newData) => onUpdate({ ...block, data: newData })} />
        );
      case "image":
        return (
          <ImageBlockEditor data={block.data} onChange={(newData) => onUpdate({ ...block, data: newData })} />
        );
      case "examples":
        return (
          <ExamplesBlockEditor
            data={block.data}
            onChange={(newData) => onUpdate({ ...block, data: newData })}
          />
        );
      case "tip":
        return (
          <TipBlockEditor data={block.data} onChange={(newData) => onUpdate({ ...block, data: newData })} />
        );
      case "comparison":
        return (
          <ComparisonBlockEditor
            data={block.data}
            onChange={(newData) => onUpdate({ ...block, data: newData })}
          />
        );
      case "video":
        return (
          <VideoBlockEditor data={block.data} onChange={(newData) => onUpdate({ ...block, data: newData })} />
        );
      case "quiz":
        return (
          <QuizBlockEditor data={block.data} onChange={(newData) => onUpdate({ ...block, data: newData })} />
        );
      default:
        return (
          <div className="text-ds-muted text-center py-8">Block type "{block.type}" is not supported</div>
        );
    }
  };

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
      {/* Block Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-ds-surface/50 border-b border-ds-border/30 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-ds-muted">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={index === 0}
              className="p-1 hover:bg-ds-border/30 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiOutlineChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={index === totalBlocks - 1}
              className="p-1 hover:bg-ds-border/30 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiOutlineChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="w-8 h-8 rounded-lg bg-ds-border/20 flex items-center justify-center">
            <BlockIcon className="w-4 h-4 text-ds-muted" />
          </div>

          <div>
            <span className="font-medium text-ds-text">{BlockType?.label || block.type}</span>
            <span className="text-ds-muted text-sm ml-2">#{index + 1}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg text-ds-muted hover:text-red-400 transition-colors cursor-pointer"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
          <HiOutlineMenuAlt2
            className={`w-5 h-5 text-ds-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Block Content */}
      {isExpanded && <div className="p-4">{renderBlockEditor()}</div>}
    </div>
  );
};

export default BlockWrapper;
