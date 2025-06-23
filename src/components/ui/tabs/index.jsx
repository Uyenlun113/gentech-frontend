import React, { useState } from "react";

export const Tabs = ({
  tabs,
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

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`
              px-6 py-3.5 text-sm font-medium transition-all duration-200 ease-in-out outline-none focus:outline-none rounded-xl
              ${
                activeTab === index
                  ? "text-brand-500 bg-brand-50 dark:text-blue-400 dark:border-blue-400 dark:bg-blue-900/20"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }
              ${tabClassName}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className={`mt-4 ${contentClassName}`}>{tabs[activeTab]?.content}</div>
    </div>
  );
};
