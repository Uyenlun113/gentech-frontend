import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface ListItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isLink?: boolean;
  path?: string;
}

type ListWithButtonProps = {
  items: ListItem[];
};

const ListWithButton: React.FC<ListWithButtonProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-200">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.isLink && item.path) {
              navigate(item.path);
            } else {
              item.onClick?.();
            }
          }}
          className={`
            group w-full flex items-center justify-between px-6 py-4 text-left
            text-gray-600 hover:bg-gray-50 hover:text-brand-500
            transition-colors duration-200 focus:outline-none
          `}
        >
          <div className="flex items-center gap-4">
            <div className="text-gray-500 group-hover:text-brand-500">{item.icon}</div>
            <span className="text-sm font-normal">{item.label}</span>
          </div>
          {item.isLink && <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />}
        </button>
      ))}
    </div>
  );
};

export default ListWithButton;
