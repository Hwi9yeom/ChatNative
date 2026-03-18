'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConversationStore } from '@/store/conversationStore';
import ReportView from '@/components/ReportView';
import type { ReportResponse } from '@/lib/types';

export default function ReportPage() {
  const router = useRouter();
  const { scenarioId, messages, allCorrections, reset } = useConversationStore();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if no conversation data
    if (!scenarioId || messages.length === 0) {
      router.replace('/');
      return;
    }

    const generateReport = async () => {
      try {
        const conversationHistory = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId,
            conversationHistory,
            corrections: allCorrections,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate report');
        }

        const data: ReportResponse = await response.json();
        setReport(data);
      } catch {
        setError('Failed to generate report. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, [scenarioId, messages, allCorrections, router]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Re-trigger the effect
    window.location.reload();
  };

  const handleTryAnother = () => {
    reset();
    router.push('/');
  };

  const handleRetryScenario = () => {
    const currentScenarioId = scenarioId;
    reset();
    router.push(`/chat/${currentScenarioId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Analyzing your conversation...</p>
          <p className="mt-1 text-sm text-gray-400">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-full text-sm hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Conversation Report</h1>
          <p className="text-sm text-gray-400 mt-0.5">대화 분석 리포트</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <ReportView report={report} />

        {/* Action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetryScenario}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Retry This Scenario
          </button>
          <button
            onClick={handleTryAnother}
            className="px-6 py-3 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Try Another Scenario
          </button>
        </div>
      </main>
    </div>
  );
}
