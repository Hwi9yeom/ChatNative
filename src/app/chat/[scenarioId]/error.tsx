'use client';

export default function ChatError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">문제가 발생했습니다</h2>
        <p className="text-gray-500 mb-6">대화 중 오류가 발생했습니다.</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
