import { useState } from "react";
import Button from "../../../shared/components/Button";

export interface FilterValues {
  jobType: string[];
  category: string;
  minBudget: number;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

const JOB_TYPES = ["Full-time", "Contract", "Freelance", "Remote", "Part-time"];
const CATEGORIES = ["All Categories", "UI/UX Design", "Web Development", "Mobile App", "Branding", "Copywriting"];

export default function FilterPanel({
  isOpen,
  onClose,
  onApply,
  initialFilters = { jobType: ["Remote"], category: "All Categories", minBudget: 1000 },
}: FilterPanelProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.jobType);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters.category);
  const [minBudget, setMinBudget] = useState<number>(initialFilters.minBudget);

  if (!isOpen) return null;

  const toggleJobType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleApply = () => {
    onApply({
      jobType: selectedTypes,
      category: selectedCategory,
      minBudget,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedCategory("All Categories");
    setMinBudget(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-background-surface rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
        {/* Handle indicator */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3 font-bold text-text-primary">Filter Jobs</h2>
          <button
            type="button"
            onClick={handleReset}
            className="text-body-sm font-semibold text-text-secondary hover:text-primary cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="text-body-sm font-bold text-text-primary block mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-body-sm font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Type */}
        <div className="mb-6">
          <label className="text-body-sm font-bold text-text-primary block mb-2">Job Type</label>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => {
              const isSelected = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleJobType(type)}
                  className={`px-3.5 py-1.5 rounded-full text-body-sm font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimum Budget */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label className="text-body-sm font-bold text-text-primary">Minimum Budget</label>
            <span className="text-body-sm font-bold text-primary">${minBudget}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="250"
            value={minBudget}
            onChange={(e) => setMinBudget(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleApply} className="rounded-xl shadow-md">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
