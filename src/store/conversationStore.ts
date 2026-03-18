'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatMessage, Correction } from '@/lib/types';

interface ConversationState {
  scenarioId: string | null;
  messages: ChatMessage[];
  allCorrections: Correction[];
  isLoading: boolean;
  turnCount: number;
  setScenarioId: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  addCorrections: (corrections: Correction[]) => void;
  updateLastUserCorrections: (corrections: Correction[]) => void;
  setLoading: (loading: boolean) => void;
  incrementTurn: () => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      scenarioId: null,
      messages: [],
      allCorrections: [],
      isLoading: false,
      turnCount: 0,
      setScenarioId: (id) => set({ scenarioId: id }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      addCorrections: (corrections) =>
        set((state) => ({
          allCorrections: [...state.allCorrections, ...corrections],
        })),
      updateLastUserCorrections: (corrections) =>
        set((state) => {
          const messages = [...state.messages];
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
              messages[i] = { ...messages[i], corrections };
              break;
            }
          }
          return { messages, allCorrections: [...state.allCorrections, ...corrections] };
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      incrementTurn: () =>
        set((state) => ({ turnCount: state.turnCount + 1 })),
      reset: () =>
        set({
          scenarioId: null,
          messages: [],
          allCorrections: [],
          isLoading: false,
          turnCount: 0,
        }),
    }),
    {
      name: 'conversation-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        scenarioId: state.scenarioId,
        messages: state.messages,
        allCorrections: state.allCorrections,
        turnCount: state.turnCount,
      }),
    }
  )
);
