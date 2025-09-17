import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SearchableSelect = ({
    value,
    onChange,
    options = [],
    placeholder = "Chọn loại tài khoản",
    searchPlaceholder = "Tìm kiếm...",
    loading = false,
    onSearch,
    displayKey = "value",
    valueKey = "value",
    className = "",
    onEnterPress,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedOption = options.find(option => option[valueKey] === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchTerm && onSearch) {
            const timeoutId = setTimeout(() => {
                onSearch(searchTerm);
            }, 300);
            return () => clearTimeout(timeoutId);
        } else if (!searchTerm && onSearch) {
            onSearch('');
        }
    }, [searchTerm, onSearch]);

    const handleToggle = () => {
        const nextOpen = !isOpen;
        setIsOpen(nextOpen);
        if (!nextOpen) {
            setSearchTerm('');
        } else {
            setHighlightedIndex(0);
        }
    };

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(0);
    };

    const handleButtonKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(0);
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(options.length - 1, 0)));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const option = options[highlightedIndex];
            if (option) {
                handleSelect(option);
            } else {
                // Không có dữ liệu để chọn -> đóng và bắn sự kiện Enter ra ngoài
                setIsOpen(false);
                setSearchTerm('');
                if (typeof onEnterPress === 'function') {
                    onEnterPress();
                }
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (highlightedIndex > Math.max(options.length - 1, 0)) {
            setHighlightedIndex(0);
        }
    }, [options, highlightedIndex]);

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Select Button */}
            <button
                type="button"
                onClick={handleToggle}
                onKeyDown={handleButtonKeyDown}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 flex items-center justify-between ${className}`}
            >
                <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
                    {selectedOption ? `${selectedOption[valueKey]} - ${selectedOption[displayKey]}` : placeholder}
                </span>
                <div className="flex items-center gap-2">
                    {selectedOption && (
                        <X size={16} className="text-gray-400 hover:text-gray-600" onClick={handleClear} />
                    )}
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder={searchPlaceholder}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto" role="listbox">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin"></div>
                                <span className="ml-2">Đang tải...</span>
                            </div>
                        ) : options.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                {searchTerm ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}
                            </div>
                        ) : (
                            options.map((option, idx) => (
                                <button
                                    key={option[valueKey]}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    role="option"
                                    aria-selected={idx === highlightedIndex}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${idx === highlightedIndex ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'} ${value === option[valueKey] ? 'font-medium' : ''} text-gray-800 dark:text-white`}
                                >
                                    {option[valueKey]} - {option[displayKey]}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
