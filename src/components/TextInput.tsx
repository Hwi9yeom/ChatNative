'use client';

import { useState, FormEvent } from 'react';

interface TextInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  transcript: string;
  onTranscriptClear: () => void;
}

export default function TextInput({ onSend, disabled, transcript, onTranscriptClear }: TextInputProps) {
  const [text, setText] = useState('');

  const currentText = transcript || text;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const messageText = currentText.trim();
    if (!messageText || disabled) return;
    onSend(messageText);
    setText('');
    onTranscriptClear();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
      <input
        type="text"
        value={currentText}
        onChange={(e) => {
          setText(e.target.value);
          if (transcript) onTranscriptClear();
        }}
        disabled={disabled}
        placeholder={disabled ? 'Conversation ended' : 'Type in English...'}
        className="flex-1 px-4 py-3 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
      />
      <button
        type="submit"
        disabled={disabled || !currentText.trim()}
        className="px-5 py-3 bg-primary-500 text-white text-sm font-medium rounded-full hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </form>
  );
}
