const ComponentCard = ({ title, children, className = "", desc = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      {title && (
        <div className="px-6 py-5 flex gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
        </div>
      )}

      {/* Card Body */}
      <div className="p-2 border-t border-gray-100 dark:border-gray-800 sm:p-4">
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
