import { useState, type KeyboardEvent } from "react";
import Input from "./Input";
import PlusIcon from "../../assets/icons/plus.svg?react";
import XIcon from "../../assets/icons/x.svg?react";

export interface SkillsPickerProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  label?: string;
  maxSkills?: number;
  isRequired?: boolean;
}

export default function SkillsPicker({
  selectedSkills,
  onChange,
  label = "Skills",
  maxSkills = 10,
  isRequired = false,
}: SkillsPickerProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (selectedSkills.includes(trimmed)) {
      setInputValue("");
      return;
    }

    if (selectedSkills.length >= maxSkills) {
      return;
    }

    onChange([...selectedSkills, trimmed]);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-body-sm font-semibold text-text-primary flex items-center gap-1">
          {label}
          {isRequired && <span className="text-error font-semibold">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Type a skill and press Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={selectedSkills.length >= maxSkills}
          />
        </div>

        <button
          type="button"
          onClick={handleAddSkill}
          disabled={!inputValue.trim() || selectedSkills.length >= maxSkills}
          className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:opacity-90"
          title="Add skill"
        >
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-border text-body-sm text-text-primary"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="cursor-pointer active:opacity-70"
              >
                <XIcon className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
