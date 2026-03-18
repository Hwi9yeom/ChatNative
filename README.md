# English AI Tutor (영어 회화 AI 튜터)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-LCEL-1C3C3C)](https://js.langchain.com/)

An AI-powered English conversation practice app built with scenario-based roleplay. Practice real-world English conversations with AI tutors that play different roles (barista, hotel receptionist, etc.) and get real-time grammar corrections and comprehensive feedback reports.

## Features

- **5 Scenario-Based Conversations**: Cafe ordering, airport check-in, clothes shopping, hotel check-in, restaurant dining
- **Real-Time Grammar Corrections**: AI identifies grammar, vocabulary, and expression errors during conversation
- **Voice Input**: Speak English using your microphone (Chrome, Web Speech API)
- **Text-to-Speech**: Listen to AI responses (browser SpeechSynthesis API)
- **Comprehensive Report**: Post-conversation analysis with score (0-100), error breakdown, and natural expression recommendations
- **Responsive UI**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React (Next.js 16, App Router)
- **Backend**: Node.js (Next.js API Routes)
- **AI/LLM**: LangChain + OpenAI GPT (gpt-4o-mini for chat, gpt-4o for reports)
- **Speech**: Web Speech API (STT), SpeechSynthesis API (TTS)
- **State**: Zustand with sessionStorage persistence
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

```bash
git clone https://github.com/Hwi9yeom/ChatNative.git
cd ChatNative
npm install
```

### Configuration

Copy the environment template and add your OpenAI API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome (recommended for voice input).

### Build

```bash
npm run build
npm start
```

## Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Scenario selection home
│   ├── chat/[scenarioId]/page.tsx # Chat interface
│   ├── report/page.tsx           # Post-conversation report
│   └── api/                      # Backend API routes
│       ├── chat/route.ts         # LangChain chat pipeline
│       └── report/route.ts       # LangChain report pipeline
├── components/                   # React components
├── hooks/                        # Custom hooks (STT, TTS)
├── lib/                          # Shared utilities
│   ├── langchain/                # LangChain LCEL pipelines
│   ├── scenarios.ts              # Scenario definitions
│   └── types.ts                  # TypeScript interfaces
└── store/                        # Zustand state management
```

## License

This project is licensed under the [MIT License](./LICENSE).

Copyright (c) 2026 Hwi9yeom
