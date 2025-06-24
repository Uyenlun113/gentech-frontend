import { useMemo, useState } from "react";
import Input from "../form/input/InputField";

const AutocompleteInput = ({
    value,
    onChange,
    onSelect,
    suggestions = [],
    placeholder,
    displayKey,
    searchKey,
    className = "",
    onPopupOpen
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value || "");

    // Ensure suggestions is always an array
    const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

    const filteredSuggestions = useMemo(() => {
        if (!searchTerm) return [];
        return safeSuggestions.filter(item =>
            item[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item[displayKey]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [safeSuggestions, searchTerm, searchKey, displayKey]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);
        onChange(inputValue);
        setIsOpen(inputValue.length > 0);
    };

    const handleSelect = (item) => {
        setSearchTerm(item[searchKey]);
        onChange(item[searchKey]);
        onSelect?.(item);
        setIsOpen(false);
    };

    const handleInputFocus = () => {
        // Open popup instead of dropdown when focused
        if (onPopupOpen) {
            onPopupOpen();
        } else if (searchTerm && filteredSuggestions.length > 0) {
            setIsOpen(true);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => setIsOpen(false), 200);
    };

    return (
        <div className="relative">
            <Input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={placeholder}
                className={className}
            />

            {isOpen && filteredSuggestions.length > 0 && !onPopupOpen && (
                <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <div className="font-medium text-gray-900">{item[searchKey]}</div>
                            <div className="text-sm text-gray-500">{item[displayKey]}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteInput;