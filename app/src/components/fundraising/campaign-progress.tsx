"use client";

/**
 * Campaign progress shown as a puzzle being assembled.
 * Each donation fills in more of the picture.
 */

interface CampaignProgressProps {
  currentAmount: number; // in cents
  goalAmount: number;    // in cents
  donationCount: number;
}

export function CampaignProgress({ currentAmount, goalAmount, donationCount }: CampaignProgressProps) {
  const percentage = goalAmount === 0 ? 0 : Math.min(100, Math.round((currentAmount / goalAmount) * 100));
  const current = (currentAmount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  const goal = (goalAmount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Generate puzzle pieces based on percentage
  const totalPieces = 20;
  const filledPieces = Math.round((percentage / 100) * totalPieces);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-indigo-600">{current}</p>
          <p className="text-sm text-slate-500">raised of {goal} goal</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">{percentage}%</p>
          <p className="text-sm text-slate-500">{donationCount} donation{donationCount !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Puzzle bar visualization */}
      <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Puzzle piece notches along the bar */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: totalPieces }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 border-r border-white/30 ${
                i < filledPieces ? "" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {percentage >= 100 && (
        <p className="text-center text-indigo-600 font-semibold text-sm">
          Goal reached! The puzzle is complete!
        </p>
      )}
    </div>
  );
}
