'use client';

import { useState } from 'react';
import type { Correction } from '@/lib/types';
import { useTTS } from '@/hooks/useTTS';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  corrections?: Correction[];
}

export default function ChatBubble({ role, content, corrections }: ChatBubbleProps) {
  const [showCorrections, setShowCorrections] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isUser = role === 'user';
  const hasCorrections = corrections && corrections.length > 0;
  const { speak, isSpeaking, isSupported, cancel } = useTTS();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-primary-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {content}
          {!isUser && isSupported && (
            <button
              onClick={() => (isSpeaking ? cancel() : speak(content))}
              aria-label={isSpeaking ? 'Stop speaking' : 'Speak message'}
              className={`absolute -right-8 top-1/2 -translate-y-1/2 text-base transition-opacity duration-150 ${
                hovered || isSpeaking ? 'opacity-100' : 'opacity-0'
              } text-gray-400 hover:text-gray-600`}
            >
              {isSpeaking ? '🔇' : '🔊'}
            </button>
          )}
        </div>
        {isUser && hasCorrections && (
          <div className="mt-1.5">
            <button
              onClick={() => setShowCorrections(!showCorrections)}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
            >
              <span className="inline-flex items-center justify-center w-4 h-4 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                {corrections.length}
              </span>
              {corrections.length === 1 ? 'correction' : 'corrections'}
              <span className={`transition-transform ${showCorrections ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            {showCorrections && (
              <div className="mt-2 space-y-2">
                {corrections.map((c, i) => (
                  <div
                    key={i}
                    className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 line-through">{c.original}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">{c.corrected}</span>
                    </div>
                    <div className="mt-1 text-gray-500 italic">
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-[10px] uppercase font-medium text-gray-600 mr-1">
                        {c.type}
                      </span>
                      {c.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
