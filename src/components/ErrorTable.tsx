import type { Correction } from '@/lib/types';

interface ErrorTableProps {
  errors: Correction[];
}

export default function ErrorTable({ errors }: ErrorTableProps) {
  if (errors.length === 0) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-xl border border-green-200">
        <p className="text-green-600 font-medium">Great job! No errors found.</p>
        <p className="text-green-500 text-sm mt-1">Your English was very accurate in this conversation.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Your Expression</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Corrected</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error, i) => (
            <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="px-4 py-3 text-red-500 line-through">{error.original}</td>
              <td className="px-4 py-3 text-green-600 font-medium">{error.corrected}</td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  error.type === 'grammar' ? 'bg-blue-100 text-blue-700' :
                  error.type === 'expression' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {error.type}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{error.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
