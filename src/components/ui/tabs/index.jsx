import { Plus } from "lucide-react";
import { useState } from "react";

export const Tabs = ({
  tabs,
  onAddRow,
  defaultTab = 0,
  className = "",
  tabClassName = "",
  contentClassName = "",
  onChangeTab,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    onChangeTab?.(index);
  };

  const handleAddRow = () => {
    if (onAddRow) {
      onAddRow(activeTab);
    }
  };

  return (
    <div className={`w-full ${className} h-[300px] mt-1`}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 justify-between items-center">
        <div>
          {tabs.map((tab, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`
                px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out 
                outline-none focus:outline-none relative whitespace-nowrap border-b-2
                ${isActive
                    ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500"
                  }
                ${tabClassName}
              `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${index}`}
                id={`tab-${index}`}
              >
                {/* Icon support */}
                {tab.icon && <span className="mr-2 flex-shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>

                {/* Badge support */}
                {tab.badge && (
                  <span
                    className={`
                  ml-2 px-1.5 py-0.5 text-xs rounded-full
                  ${isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                      }
                `}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1 px-1 text-xs font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200 border border-blue-700 h-8"
        >
          <Plus size={12} />
          Thêm
        </button>
      </div>

      {/* Tab Content */}
      <div
        className={`mt-4 ${contentClassName}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        id={`tabpanel-${activeTab}`}
      >
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};