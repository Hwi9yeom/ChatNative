'use client';

interface MicButtonProps {
  isListening: boolean;
  isSupported: boolean;
  disabled: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function MicButton({
  isListening,
  isSupported,
  disabled,
  onStart,
  onStop,
}: MicButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : isListening
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
          : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
      }`}
      title={isListening ? 'Stop recording' : 'Start recording'}
    >
      {isListening ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      )}
    </button>
  );
}
