import { HiOutlineX } from "react-icons/hi";

const AdminModal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-ds-surface rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-ds-border/30 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-ds-text">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-ds-bg text-ds-muted hover:text-ds-text transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default AdminModal;
