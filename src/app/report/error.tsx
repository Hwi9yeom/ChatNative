'use client';

export default function ReportError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">리포트 생성 실패</h2>
        <p className="text-gray-500 mb-6">리포트 생성 중 오류가 발생했습니다.</p>
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
