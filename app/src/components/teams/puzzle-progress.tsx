"use client";

/**
 * Puzzle Progress Visualization
 * Shows team/project progress as puzzle pieces fitting together.
 * Each completed task fills in a piece of the puzzle.
 */

interface PuzzleProgressProps {
  total: number;
  completed: number;
  label?: string;
}

export function PuzzleProgress({ total, completed, label }: PuzzleProgressProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const pieces = Math.min(total, 12); // Max 12 pieces in the visual
  const filledPieces = total === 0 ? 0 : Math.round((completed / total) * pieces);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm text-slate-500">
            {completed}/{total} pieces ({percentage}%)
          </span>
        </div>
      )}
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: pieces }).map((_, i) => (
          <div
            key={i}
            className={`
              w-8 h-8 rounded-sm transition-all duration-500 ease-out
              ${i < filledPieces
                ? "bg-indigo-500 shadow-sm scale-100"
                : "bg-slate-100 border border-dashed border-slate-300 scale-95 opacity-60"
              }
            `}
            style={{
              clipPath: getPuzzlePiecePath(i, pieces),
              transitionDelay: `${i * 50}ms`,
            }}
            title={i < filledPieces ? "Completed" : "In progress"}
          />
        ))}
      </div>
      {total > 0 && percentage === 100 && (
        <p className="text-sm text-indigo-600 font-medium">
          The puzzle is complete!
        </p>
      )}
    </div>
  );
}

function getPuzzlePiecePath(index: number, total: number): string {
  // Alternate between different puzzle piece shapes for visual variety
  const shapes = [
    "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%)",
    "polygon(15% 0%, 100% 0%, 85% 50%, 100% 100%, 15% 100%, 0% 50%)",
    "polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)",
    "polygon(0% 15%, 50% 0%, 100% 15%, 100% 100%, 0% 100%)",
  ];

  // Simple pieces for small counts
  if (total <= 4) return "";

  return shapes[index % shapes.length];
}
