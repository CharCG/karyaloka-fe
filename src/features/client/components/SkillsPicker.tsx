import { useState, type KeyboardEvent } from "react";

interface SkillsPickerProps {
  label?: string;
  required?: boolean;
  maxSkills?: number;
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  error?: string;
  suggestedSkills?: string[];
}

export default function SkillsPicker({
  label = "Skills (add up to 10)",
  required = true,
  maxSkills = 10,
  selectedSkills,
  onChange,
  error,
  suggestedSkills = [
    "UI/UX",
    "Figma",
    "React",
    "Tailwind CSS",
    "Node.js",
    "Mobile App",
    "Graphic Design",
    "TypeScript",
  ],
}: SkillsPickerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (selectedSkills.includes(trimmed)) {
      setInputValue("");
      setIsAdding(false);
      return;
    }
    if (selectedSkills.length >= maxSkills) return;

    onChange([...selectedSkills, trimmed]);
    setInputValue("");
    setIsAdding(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(inputValue);
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setInputValue("");
    }
  };

  const filteredSuggestions = suggestedSkills.filter(
    (s) =>
      !selectedSkills.includes(s) &&
      s.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-body-sm font-semibold text-text-primary flex items-center gap-1">
          {label}
          {required && <span className="text-error font-bold">*</span>}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Selected skills pills */}
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-body-sm text-text-primary font-medium group transition-colors"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="w-4 h-4 rounded-full flex items-center justify-center text-text-tertiary hover:text-error hover:bg-gray-200 cursor-pointer"
              aria-label={`Remove ${skill}`}
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}

        {/* Add Skill Button or Input */}
        {selectedSkills.length < maxSkills && (
          <>
            {isAdding ? (
              <div className="relative inline-flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (inputValue.trim()) {
                      handleAddSkill(inputValue);
                    } else {
                      setIsAdding(false);
                    }
                  }}
                  autoFocus
                  placeholder="Type skill..."
                  className="px-3 py-1.5 text-body-sm bg-white border border-primary rounded-full outline-none focus:ring-2 focus:ring-primary/20 w-32"
                />
                {filteredSuggestions.length > 0 && inputValue && (
                  <div className="absolute top-full left-0 mt-1 w-44 bg-background-surface border border-border rounded-xl shadow-lg z-20 max-h-36 overflow-y-auto py-1">
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddSkill(s);
                        }}
                        className="w-full text-left px-3 py-1.5 text-body-sm hover:bg-info-bg hover:text-primary cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-info-bg text-primary text-body-sm font-semibold hover:bg-primary/15 transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add Skill</span>
              </button>
            )}
          </>
        )}
      </div>

      {error && <span className="text-caption text-error font-medium">{error}</span>}
    </div>
  );
}
