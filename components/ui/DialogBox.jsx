'use client';
import { useEffect } from 'react';

export default function DialogBox({ 
  type = 'error',         // 'error' | 'confirm' | 'info' | ...
  message, 
  onClose, 
  onConfirm, 
  autoClose = type === 'error' ? 4000 : null // خطا بعد از چند ثانیه می‌بنده خودش
}) {
  useEffect(() => {
    if (!message || !autoClose) return;
    const timer = setTimeout(() => onClose?.(), autoClose);
    return () => clearTimeout(timer);
  }, [message, autoClose, onClose]);

  if (!message) return null;

  // رنگ‌بندی و آیکن بر اساس نوع
  const color =
    type === 'error' ? 'red' :
    type === 'confirm' ? 'blue' :
    type === 'info' ? 'emerald' : 
    'gray';


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 text-center space-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`text-${color}-600 font-bold text-lg`}>
          {type === 'error' ? 'خطا' : type === 'confirm' ? 'تأیید عملیات' : 'پیغام'}
        </div>

        <div className="text-slate-700 text-sm leading-relaxed">{message}</div>

        {type === 'confirm' ? (
          <div className="flex justify-center gap-3 mt-3">
            <button
              onClick={() => { onConfirm?.(); onClose?.(); }}
              className={`px-4 py-2 rounded-lg bg-${color}-600 text-white hover:bg-${color}-700 text-sm`}
            >
              تأیید
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
            >
              انصراف
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 text-sm`}
          >
            بستن
          </button>
        )}
      </div>
    </div>
  );
}
