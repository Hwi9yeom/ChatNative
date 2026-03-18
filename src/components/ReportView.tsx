'use client';

import ScoreGauge from './ScoreGauge';
import ErrorTable from './ErrorTable';
import type { ReportResponse } from '@/lib/types';

interface ReportViewProps {
  report: ReportResponse;
}

export default function ReportView({ report }: ReportViewProps) {
  return (
    <div className="space-y-8">
      {/* Score */}
      <section className="text-center">
        <ScoreGauge score={report.score} />
        <p className="mt-4 text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          {report.summary}
        </p>
      </section>

      {/* Strengths */}
      {report.strengths.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-green-500">✓</span> What You Did Well
          </h3>
          <ul className="space-y-2">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 rounded-lg px-4 py-3">
                <span className="text-green-500 mt-0.5 shrink-0">•</span>
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Errors */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-amber-500">✎</span> Corrections
        </h3>
        <ErrorTable errors={report.errors} />
      </section>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-blue-500">💡</span> Sound More Natural
          </h3>
          <div className="space-y-3">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                  <span className="text-gray-600">You said: <span className="font-medium">&ldquo;{rec.userExpression}&rdquo;</span></span>
                  <span className="text-gray-400 hidden sm:inline">→</span>
                  <span className="text-blue-700">Try: <span className="font-medium">&ldquo;{rec.naturalExpression}&rdquo;</span></span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 italic">{rec.context}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
