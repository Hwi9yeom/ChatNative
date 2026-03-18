'use client';

import Link from 'next/link';
import { Scenario } from '@/lib/types';

interface ScenarioCardProps {
  scenario: Scenario;
}

export default function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <Link href={`/chat/${scenario.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:border-primary-300 transition-all duration-200 cursor-pointer h-full flex flex-col">
        <div className="text-4xl mb-4">{scenario.emoji}</div>
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {scenario.title}
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">{scenario.titleKo}</p>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-grow">
          {scenario.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              scenario.difficulty === 'beginner'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {scenario.difficulty === 'beginner' ? 'Beginner' : 'Intermediate'}
          </span>
          <span className="text-xs text-gray-400 group-hover:text-primary-500 transition-colors">
            Start →
          </span>
        </div>
      </div>
    </Link>
  );
}
