import { SearchIcon } from "lucide-react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({ title, children, className = "", desc = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
        {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}

        <form className="flex items-center space-x-2">
          <span className="text-gray-400 dark:text-gray-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700
                     dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
