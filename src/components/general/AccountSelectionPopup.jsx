import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const AccountSelectionPopup = ({
  isOpen,
  onClose,
  onSelect,
  accounts = [],
  searchValue = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const popupRef = useRef(null);

  const filteredAccounts = useMemo(() => {
    if (!Array.isArray(accounts)) return [];
    if (!searchTerm) return accounts;
    return accounts.filter(account =>
      account.tk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.ten_tk?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(searchValue);
      setSelectedAccountId(null);
    }
  }, [isOpen, searchValue]);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedAccountId(prev => {
            const currentIndex = filteredAccounts.findIndex(acc => acc.id === prev);
            const nextIndex = currentIndex < filteredAccounts.length - 1 ? currentIndex + 1 : 0;
            return filteredAccounts[nextIndex]?.id || null;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedAccountId(prev => {
            const currentIndex = filteredAccounts.findIndex(acc => acc.id === prev);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredAccounts.length - 1;
            return filteredAccounts[prevIndex]?.id || null;
          });
          break;
        case 'Enter':
          event.preventDefault();
          const selectedAccount = filteredAccounts.find(acc => acc.id === selectedAccountId);
          if (selectedAccount) {
            handleSelectAccount(selectedAccount);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, filteredAccounts, selectedAccountId, onClose]);

  const handleSelectAccount = (account) => {
    onSelect(account);
    onClose();
  };

  const handleDoubleClick = (account) => {
    handleSelectAccount(account);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chọn tài khoản</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã tài khoản hoặc tên..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Account List */}
        <div className="overflow-y-auto max-h-96">
          {filteredAccounts.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Mã TK
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Tên tài khoản
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id || account.tk}
                    onClick={() => handleSelectAccount(account)}
                    onDoubleClick={() => handleDoubleClick(account)}
                    className={`cursor-pointer transition-colors ${selectedAccountId === account.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    <td className="px-8 py-3 text-sm font-medium text-gray-900">
                      {account.tk}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      {account.ten_tk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy tài khoản nào</p>
              {searchTerm && (
                <p className="text-sm mt-2">
                  Thử tìm kiếm với từ khóa khác
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredAccounts.length > 0 && (
                <>Tìm thấy {filteredAccounts.length} tài khoản</>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              {selectedAccountId && (
                <button
                  onClick={() => {
                    const account = filteredAccounts.find(acc => acc.id === selectedAccountId);
                    if (account) handleSelectAccount(account);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Chọn
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelectionPopup;