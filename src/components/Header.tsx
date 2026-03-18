'use client';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          English AI Tutor
        </h1>
        <p className="mt-1 text-lg text-gray-500">영어 회화 AI 튜터</p>
        <p className="mt-2 text-sm text-gray-400">
          Practice English conversation with AI-powered scenario roleplay
        </p>
      </div>
    </header>
  );
}
