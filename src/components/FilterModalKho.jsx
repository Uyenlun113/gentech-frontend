import { Building2, Calendar, CreditCard, Filter, Loader, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getFilterConfig, validateSubmitData } from "./UISearch_and_formData/UISearch_and_formData"

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function FilterModalKho({
  isOpen,
  onClose,
  selectedItem,
  // defaultValues = {},
  onSubmit,
  isSubmitting = false,
  // Tên cấu hình filter để lấy từ getFilterConfig
  configName,
  // Callback để xử lý tìm kiếm (cho lookup fields)
  onSearch,
  // Cấu hình tiêu đề
  title = "Bộ lọc dữ liệu"
}) {
  // State cho cấu hình từ getFilterConfig
  const [filterConfig, setFilterConfig] = useState(null);
  const [filterData, setFilterData] = useState({});

  // State cho các trường lookup
  const [searchStates, setSearchStates] = useState({});
  const [popupStates, setPopupStates] = useState({});
  const [focusStates, setFocusStates] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // State cho validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Debounced search values
  const [debouncedSearches, setDebouncedSearches] = useState({});
  // Tạo allFields từ filterConfig.searchFields object (không còn fallback array)
  let allFields = [];
  if (filterConfig && filterConfig.searchFields && typeof filterConfig.searchFields === 'object') {
    allFields = [
      ...(filterConfig.searchFields.mainFieldKeys || []),
      ...(filterConfig.searchFields.rightBox1Keys || []),
      ...(filterConfig.searchFields.rightBox2Keys || [])
    ];
  }

  // Load filter configuration khi component mount hoặc configName thay đổi
  useEffect(() => {
    if (configName) {
      try {
        const config = getFilterConfig(configName);
        setFilterConfig(config);
      } catch (error) {
        console.error("Error loading filter config:", error);
        setFilterConfig(null);
      }
    }
  }, [configName]);

  // Setup debounced values for search fields
  useEffect(() => {
    if (!allFields.length) return;

    const newDebouncedSearches = {};
    allFields.forEach(field => {
      if (field.type === 'lookup' && searchStates[field.key]) {
        newDebouncedSearches[field.key] = useDebounce(searchStates[field.key], 300);
      }
    });
    setDebouncedSearches(newDebouncedSearches);
  }, [searchStates, filterConfig]);

  // Handle search API calls
  useEffect(() => {
    if (!allFields.length) return;

    Object.keys(debouncedSearches).forEach(fieldKey => {
      const searchValue = debouncedSearches[fieldKey];
      const field = allFields.find(f => f.key === fieldKey);

      if (searchValue && focusStates[fieldKey] && onSearch && field) {
        setLoadingStates(prev => ({ ...prev, [fieldKey]: true }));

        onSearch(fieldKey, searchValue, field.searchConfig)
          .then(results => {
            setSearchResults(prev => ({ ...prev, [fieldKey]: results }));
            setLoadingStates(prev => ({ ...prev, [fieldKey]: false }));
          })
          .catch(() => {
            setSearchResults(prev => ({ ...prev, [fieldKey]: [] }));
            setLoadingStates(prev => ({ ...prev, [fieldKey]: false }));
          });
      }
    });
  }, [debouncedSearches, focusStates, onSearch, filterConfig]);

  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (isOpen && filterConfig) {
      // Merge defaultFormData từ config với defaultValues từ props
      const initialData = {
        ...(filterConfig.defaultFormData || {}),
      };
      setFilterData(initialData);
      setValidationErrors({});
    } else if (!isOpen) {
      // Reset states khi đóng modal
      setSearchStates({});
      setPopupStates({});
      setFocusStates({});
      setSearchResults({});
      setLoadingStates({});
      setValidationErrors({});
    }
  }, [isOpen, filterConfig]);

  // Xử lý hiển thị popup cho lookup fields
  useEffect(() => {
    Object.keys(debouncedSearches).forEach(fieldKey => {
      const searchValue = debouncedSearches[fieldKey];
      const originalSearch = searchStates[fieldKey];

      if (searchValue && focusStates[fieldKey]) {
        setPopupStates(prev => ({ ...prev, [fieldKey]: true }));
      } else if (!originalSearch) {
        setPopupStates(prev => ({ ...prev, [fieldKey]: false }));
      }
    });
  }, [debouncedSearches, focusStates, searchStates]);

  const handleInputChange = useCallback((field, value) => {
    setFilterData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleSearchInputChange = useCallback((fieldKey, value) => {
    setSearchStates(prev => ({ ...prev, [fieldKey]: value }));

    // Clear the actual field value if search value changes
    if (value !== filterData[fieldKey]) {
      setFilterData(prev => ({ ...prev, [fieldKey]: "" }));
    }

    // Clear validation error
    if (validationErrors[fieldKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [filterData, validationErrors]);

  const handleLookupSelect = useCallback((fieldKey, selectedItem, field) => {
    const value = selectedItem[field.valueKey] || "";
    setFilterData(prev => ({
      ...prev,
      [fieldKey]: value,
    }));
    setSearchStates(prev => ({ ...prev, [fieldKey]: value }));
    setPopupStates(prev => ({ ...prev, [fieldKey]: false }));
    setFocusStates(prev => ({ ...prev, [fieldKey]: false }));

    // Clear validation error
    if (validationErrors[fieldKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleLookupInputFocus = useCallback((fieldKey) => {
    setFocusStates(prev => ({ ...prev, [fieldKey]: true }));
    if (searchStates[fieldKey]) {
      setPopupStates(prev => ({ ...prev, [fieldKey]: true }));
    }
  }, [searchStates]);

  const handleLookupInputBlur = useCallback((fieldKey) => {
    // Delay để cho phép click vào popup
    setTimeout(() => {
      setFocusStates(prev => ({ ...prev, [fieldKey]: false }));
    }, 200);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!filterConfig) {
      console.error("Filter config not loaded");
      return;
    }

    try {
      // Merge filter data với search states cho các lookup fields
      const submitData = { ...filterData };

      // Đối với các lookup fields, sử dụng giá trị đã chọn hoặc giá trị search
      allFields.forEach(field => {
        if (field.type === 'lookup') {
          submitData[field.key] = filterData[field.key] || searchStates[field.key]?.trim() || "";
        }
      });

      // Validate dữ liệu với validateSubmitData
      const validation = validateSubmitData(configName, submitData);

      if (!validation.isValid) {
        // Hiển thị lỗi validation
        setValidationErrors(validation.errors || {});
        console.log("Validation errors:", validation.errors);
        return;
      }

      // Clear validation errors và submit
      setValidationErrors({});
      console.log("Filter data:", submitData);
      onSubmit(submitData);

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // Có thể hiển thị thông báo lỗi cho user
    }
  }, [filterData, searchStates, filterConfig, configName, onSubmit]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [isSubmitting, onClose]);

  // Xử lý ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, isSubmitting, onClose]);

  const renderField = (field) => {
    const value = filterData[field.key] || "";
    const hasError = validationErrors[field.key];
    const errorMessage = hasError ? validationErrors[field.key] : "";

    // Giảm chiều cao input
    const inputClasses = `w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 ${hasError
      ? 'border-red-300 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500'
      }`;

    const renderInput = () => {
      switch (field.type) {
        case 'text':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
              placeholder={field.placeholder}
            />
          );

        case 'date':
          const formatDateForInput = (dateStr) => {
            if (!dateStr) return "";
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
          };

          const formatDateForState = (dateStr) => {
            if (!dateStr) return "";
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
          };

          return (
            <input
              type="date"
              value={formatDateForInput(value)}
              onChange={(e) => {
                const formatted = formatDateForState(e.target.value);
                handleInputChange(field.key, formatted);
              }}
              className={inputClasses}
              disabled={isSubmitting}
            />
          );

        case 'select':
          return (
            <select
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'lookup':
          const searchValue = searchStates[field.key] || "";
          return (
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchInputChange(field.key, e.target.value)}
                onFocus={() => handleLookupInputFocus(field.key)}
                onBlur={() => handleLookupInputBlur(field.key)}
                className={inputClasses}
                disabled={isSubmitting}
                placeholder={field.placeholder}
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          );

        case 'number':
          return (
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
            />
          );
        case 'text_disabled':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={true}
              placeholder={field.placeholder}
            />
          );

        default:
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
              placeholder={field.placeholder}
            />
          );
      }
    };

    return (
      <div>
        {renderInput()}
        {hasError && (
          <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  // Loading state khi chưa có config
  if (!filterConfig) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  const searchFields = filterConfig.searchFields || {};
  const advancedFields = filterConfig.advancedFields || [];
  const modalTitle = filterConfig.title || title;



  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-auto transform transition-all rounded-t-xl">
        {/* Header - ĐƯA RA NGOÀI scrollview */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-blue-500 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{modalTitle}</h3>
              <p className="text-blue-100 text-sm mt-1">Thiết lập các tiêu chí lọc dữ liệu</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body scrollable */}
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            {/* Basic filters section */}
            {filterConfig && filterConfig.searchFields && (() => {
              const mainFields = filterConfig.searchFields.mainFieldKeys || [];
              const rightBox1Fields = filterConfig.searchFields.rightBox1Keys || [];
              const rightBox2Fields = filterConfig.searchFields.rightBox2Keys || [];
              return (
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Khung trái lớn: mainFields */}
                  <div className="md:w-[65%] w-full">
                    <div className="border rounded-xl p-4 bg-white max-h-[300px] h-full flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {mainFields.map(field => (
                          <div key={field.key} className="flex items-center gap-3">
                            <label className="text-xs text-gray-600 min-w-[100px] text-left">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="flex-1">
                              {renderField(field)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Khung phải: 2 box nhỏ dọc */}
                  <div className="md:w-[35%] w-full flex flex-col gap-4">
                    {/* Box 1 */}
                    <div className="border rounded-xl p-4 bg-white max-h-[140px] flex-1">
                      <div className="h-full flex flex-col justify-start">
                        {rightBox1Fields.map((field, index) => (
                          <div key={field.key} className={`flex items-center gap-3 ${index < rightBox1Fields.length - 1 ? 'mb-3' : ''}`}>
                            <label className="text-xs text-gray-600 min-w-[80px] text-left">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="flex-1">
                              {renderField(field)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Box 2 */}
                    <div className="border rounded-xl p-4 bg-white max-h-[140px] flex-1">
                      <div className="h-full flex flex-col justify-start">
                        {rightBox2Fields.map((field, index) => (
                          <div key={field.key} className={`flex items-center gap-3 ${index < rightBox2Fields.length - 1 ? 'mb-3' : ''}`}>
                            <label className="text-xs text-gray-600 min-w-[80px] text-left">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="flex-1">
                              {renderField(field)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            {/* Advanced filters section */}
            {advancedFields.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-orange-900 mb-4">Điều kiện lọc nâng cao</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Trường lọc</th>
                        <th className="text-left p-2 font-medium">Phép so sánh</th>
                        <th className="text-left p-2 font-medium">Giá trị 1</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advancedFields.map((item, index) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">
                            <span>{item.name}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-blue-600 cursor-pointer hover:underline">
                              {item.operator || 'like'}
                            </span>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              className="border px-2 py-0.5 text-sm rounded w-full"
                              value={item.value1 || ''}
                              onChange={(e) => {
                                const updated = [...advancedFields];
                                updated[index].value1 = e.target.value;
                                setAdvancedFields(updated);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty state */}
            {allFields.length === 0 && advancedFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có trường lọc nào được cấu hình</p>
              </div>
            )}
            {/* Validation errors summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">Vui lòng kiểm tra lại:</h4>
                <ul className="text-sm text-red-600">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <li key={field} className="mb-1">• {message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* Footer giữ nguyên */}
        <div className="flex justify-end items-center p-4 border-full border-gray-300 bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Áp dụng lọc
                </>
              )}
            </button>
          </div>
        </div>
        {/* Lookup Selection Popups giữ nguyên */}
        {Object.keys(popupStates).map(fieldKey => {
          const showPopup = popupStates[fieldKey];
          const field = allFields.find(f => f.key === fieldKey);
          const results = searchResults[fieldKey] || [];
          const isLoading = loadingStates[fieldKey];
          if (!showPopup || !field || field.type !== 'lookup') return null;
          return (
            <div key={fieldKey} className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
              <div className="bg-white rounded-xl shadow-xl w-96 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-medium">{field.popupTitle || `Chọn ${field.label}`}</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <Loader className="w-6 h-6 animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div>
                      {results.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 border-gray-100"
                          onClick={() => handleLookupSelect(fieldKey, item, field)}
                        >
                          <div className="font-medium">{item[field.valueKey]}</div>
                          {field.displayKey && item[field.displayKey] && (
                            <div className="text-sm text-gray-600">{item[field.displayKey]}</div>
                          )}
                        </div>
                      ))}
                      {results.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          {field.emptyMessage || "Không tìm thấy dữ liệu"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4 border-t">
                  <button
                    onClick={() => setPopupStates(prev => ({ ...prev, [fieldKey]: false }))}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}