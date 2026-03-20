import { MAX_TURNS, WARN_TURNS } from '@/lib/constants';

interface TurnIndicatorProps {
  turnCount: number;
}

export default function TurnIndicator({ turnCount }: TurnIndicatorProps) {
  if (turnCount < WARN_TURNS) return null;

  const remaining = MAX_TURNS - turnCount;

  if (remaining <= 0) {
    return (
      <div className="text-center py-2 px-4 bg-red-50 text-red-600 text-xs font-medium rounded-lg mx-4">
        You&apos;ve reached the conversation limit. Please end the conversation to see your report!
      </div>
    );
  }

  return (
    <div className="text-center py-2 px-4 bg-amber-50 text-amber-600 text-xs font-medium rounded-lg mx-4">
      Your conversation is wrapping up — {remaining} {remaining === 1 ? 'turn' : 'turns'} remaining
    </div>
  );
}
