const AdminStatsCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    purple: "bg-purple-500/20 text-purple-400",
    red: "bg-red-500/20 text-red-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
  };

  return (
    <div className="p-6 rounded-2xl bg-ds-surface/30 border border-ds-border/30 hover:border-ds-border transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-ds-muted text-sm">{title}</p>
          <p className="text-3xl font-bold text-ds-text mt-1">{value}</p>
          {subtitle && <p className="text-ds-border text-xs mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatsCard;
