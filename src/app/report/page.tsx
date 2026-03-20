'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConversationStore } from '@/store/conversationStore';
import ReportView from '@/components/ReportView';
import type { ReportResponse } from '@/lib/types';

export default function ReportPage() {
  const router = useRouter();
  const { reset } = useConversationStore();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const hasRequested = useRef(false);

  useEffect(() => {
    const unsub = useConversationStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useConversationStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (hasRequested.current) return;

    const { scenarioId, messages, allCorrections } = useConversationStore.getState();

    if (!scenarioId || messages.length === 0) {
      router.replace('/');
      return;
    }

    hasRequested.current = true;

    const controller = new AbortController();

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
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to generate report');
        }

        const data: ReportResponse = await response.json();
        setReport(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Failed to generate report. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();

    return () => {
      controller.abort();
    };
  }, [hydrated, router, retryCount]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setReport(null);
    hasRequested.current = false;
    setRetryCount((c) => c + 1);
  };

  const handleTryAnother = () => {
    reset();
    router.push('/');
  };

  const handleRetryScenario = () => {
    const { scenarioId } = useConversationStore.getState();
    reset();
    router.push(`/chat/${scenarioId}`);
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
