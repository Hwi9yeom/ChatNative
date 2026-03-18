'use client';

import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConversationStore } from '@/store/conversationStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { SCENARIOS } from '@/lib/scenarios';
import ChatWindow from '@/components/ChatWindow';
import MicButton from '@/components/MicButton';
import TextInput from '@/components/TextInput';
import TurnIndicator from '@/components/TurnIndicator';
import type { ChatResponse } from '@/lib/types';

const MAX_TURNS = 20;

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.scenarioId as string;

  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  const {
    messages,
    isLoading,
    turnCount,
    setScenarioId,
    addMessage,
    updateLastUserCorrections,
    setLoading,
    incrementTurn,
    reset,
  } = useConversationStore();

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition();

  // Initialize scenario with hardcoded first message
  useEffect(() => {
    if (!scenario) return;

    // Only initialize if this is a new scenario (not a page refresh with existing messages)
    const store = useConversationStore.getState();
    if (store.scenarioId !== scenarioId || store.messages.length === 0) {
      reset();
      setScenarioId(scenarioId);
      addMessage({
        role: 'assistant',
        content: scenario.initialMessage,
      });
    }
  }, [scenarioId, scenario, reset, setScenarioId, addMessage]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || turnCount >= MAX_TURNS) return;

      // Build conversation history BEFORE adding the new message
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Add user message
      addMessage({ role: 'user', content: text });
      incrementTurn();
      setLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId,
            userMessage: text,
            conversationHistory: history,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data: ChatResponse = await response.json();

        // Update the last user message with corrections via store action
        if (data.corrections.length > 0) {
          updateLastUserCorrections(data.corrections);
        }

        // Add AI response
        addMessage({ role: 'assistant', content: data.reply });
      } catch (err) {
        console.error('[sendMessage] Failed to get chat response:', err);
        addMessage({
          role: 'assistant',
          content: "I'm sorry, I had trouble processing that. Could you try again?",
        });
      } finally {
        setLoading(false);
      }
    },
    [scenarioId, messages, isLoading, turnCount, addMessage, incrementTurn, setLoading, updateLastUserCorrections]
  );

  const handleEndConversation = () => {
    router.push('/report');
  };

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Scenario not found.</p>
      </div>
    );
  }

  const inputDisabled = isLoading || turnCount >= MAX_TURNS;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { reset(); router.push('/'); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {scenario.emoji} {scenario.title}
            </h1>
            <p className="text-xs text-gray-400">{scenario.titleKo}</p>
          </div>
        </div>
        <button
          onClick={handleEndConversation}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            turnCount >= MAX_TURNS
              ? 'bg-primary-500 text-white animate-pulse'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          End Conversation
        </button>
      </header>

      {/* Speech error banner */}
      {speechError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-600">
          {speechError}
        </div>
      )}

      {/* Turn indicator */}
      <TurnIndicator turnCount={turnCount} />

      {/* Messages */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <MicButton
            isListening={isListening}
            isSupported={isSupported}
            disabled={inputDisabled}
            onStart={startListening}
            onStop={stopListening}
          />
          <TextInput
            onSend={sendMessage}
            disabled={inputDisabled}
            transcript={transcript}
            onTranscriptClear={resetTranscript}
          />
        </div>
        {!isSupported && (
          <p className="text-xs text-gray-400 text-center mt-2">
            Voice input is not supported in your browser. Use Chrome for the best experience.
          </p>
        )}
      </div>
    </div>
  );
}
