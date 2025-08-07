import { AlertCircle, Calculator, CheckCircle } from 'lucide-react';

export default function LoadingModal({
    showModal,
    progress,
    currentTask,
    isCompleted,
    hasError,
    errorMessage,
    onClose,
    onRetry
}) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calculator className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Tính giá trung bình tháng</h3>
                            <p className="text-sm text-gray-600">
                                {hasError ? 'Có lỗi xảy ra' : isCompleted ? 'Hoàn thành' : 'Đang xử lý dữ liệu...'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {!hasError ? (
                        <>
                            {/* Progress Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Tiến trình</span>
                                    <span className="text-sm font-bold text-blue-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Current Task */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <div className="w-5 h-5 flex-shrink-0">
                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <span className={`text-sm ${isCompleted ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                                    {currentTask}
                                </span>
                            </div>

                            {/* Success Message */}
                            {isCompleted && (
                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                    <p className="text-green-800 font-semibold">Tính giá thành công!</p>
                                    <p className="text-green-600 text-sm mt-1">Dữ liệu đã được cập nhật vào hệ thống.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Error State */
                        <div className="text-center p-6 space-y-4">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <div>
                                <h4 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h4>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-700 text-sm whitespace-pre-wrap">
                                        {errorMessage || currentTask || 'Không thể thực hiện tính giá. Vui lòng thử lại.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onRetry}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Thử lại
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Close button for successful completion */}
                    {isCompleted && !hasError && (
                        <div className="text-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}