import Header from '@/components/Header';
import ScenarioCard from '@/components/ScenarioCard';
import { SCENARIOS } from '@/lib/scenarios';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Choose a Scenario</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a conversation scenario to start practicing
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCENARIOS.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
        <footer className="mt-16 text-center text-xs text-gray-400">
          Powered by OpenAI GPT &amp; LangChain
        </footer>
      </main>
    </div>
  );
}
