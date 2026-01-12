import { HiOutlineX } from "react-icons/hi";
import { BLOCK_TYPES, generateBlockId } from "./BlockTypes";

const AddBlockModal = ({ onClose, onAddBlock }) => {
  const handleAddBlock = (type) => {
    const newBlock = {
      id: generateBlockId(),
      type,
      order: 0, // Will be set by parent
      data: {},
    };
    onAddBlock(newBlock);
    onClose();
  };

  // Separate enabled and disabled block types
  const enabledTypes = Object.entries(BLOCK_TYPES).filter(([_, config]) => !config.disabled);
  const disabledTypes = Object.entries(BLOCK_TYPES).filter(([_, config]) => config.disabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-ds-surface rounded-2xl border border-ds-border/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-ds-text">Add Block</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ds-border/30 rounded-lg text-ds-muted hover:text-ds-text cursor-pointer"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Enabled Block Types */}
          {enabledTypes.map(([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => handleAddBlock(type)}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-ds-bg/50 border border-ds-border/30 hover:border-ds-border transition-colors cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-ds-border/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-ds-muted" />
                </div>
                <div>
                  <div className="font-medium text-ds-text">{config.label}</div>
                  <div className="text-sm text-ds-muted">{config.description}</div>
                </div>
              </button>
            );
          })}

          {/* Coming Soon Section */}
          {disabledTypes.length > 0 && (
            <>
              <div className="pt-4 border-t border-ds-border/30 mt-4">
                <p className="text-xs text-ds-muted mb-3">Coming Soon</p>
              </div>
              {disabledTypes.map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <div
                    key={type}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-ds-border/20 opacity-50 cursor-not-allowed text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-ds-border/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-ds-muted/50" />
                    </div>
                    <div>
                      <div className="font-medium text-ds-muted">{config.label}</div>
                      <div className="text-sm text-ds-muted/70">{config.description}</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBlockModal;
