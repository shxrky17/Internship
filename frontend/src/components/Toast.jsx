import React, { useEffect, useState } from 'react';

const ICONS = {
  success: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

const STYLES = {
  success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
  error:   'bg-red-50 border-red-300 text-red-800',
  warning: 'bg-amber-50 border-amber-300 text-amber-800',
};

const ICON_COLORS = {
  success: 'text-emerald-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
};

/**
 * Toast — floating notification.
 * Props: message (string), type ('success'|'error'|'warning'), onClose (fn), duration (ms, default 3500)
 */
const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for slide-out animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-5 right-5 z-[9999] flex items-start gap-3
        border rounded-xl px-4 py-3 shadow-lg max-w-sm w-full
        transition-all duration-300
        ${STYLES[type] || STYLES.success}
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
      `}
    >
      <span className={ICON_COLORS[type] || ICON_COLORS.success}>
        {ICONS[type] || ICONS.success}
      </span>
      <p className="text-sm font-medium flex-1 leading-snug">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="text-current opacity-50 hover:opacity-100 transition-opacity ml-1 -mt-0.5 flex-shrink-0"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
