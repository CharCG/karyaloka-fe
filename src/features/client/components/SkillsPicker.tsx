import { useState, type KeyboardEvent } from "react";

import XIcon from "../../../assets/icons/x.svg?react";
import PlusIcon from "../../../assets/icons/plus.svg?react";

interface SkillsPickerProps {
  label?: string;
  isRequired?: boolean;
  maxSkills?: number;
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  error?: string;
}

export default function SkillsPicker({
  label = "Skills (add up to 10)",
  isRequired = true,
  maxSkills = 10,
  selectedSkills,
  onChange,
  error,
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

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-body-sm font-semibold text-text-primary flex items-center gap-1">
          {label}
          {isRequired && <span className="text-error font-bold">*</span>}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-border text-body-sm text-text-primary group transition-colors"
          >
            {skill}
            <button type="button" onClick={() => handleRemoveSkill(skill)} className="cursor-pointer">
              <XIcon className="w-4 h-4 text-text-secondary" />
            </button>
          </span>
        ))}

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
                  placeholder="Add your skill"
                  className="px-4 py-2 text-body-sm bg-white border border-primary rounded-full outline-none focus:ring-primary"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-1 border-primary text-primary text-body-sm font-semibold cursor-pointer"
              >
                <PlusIcon className="w-4 h-4" />
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
