import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import BackButton from "../../../shared/components/BackButton";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import SkillsPicker from "../components/SkillsPicker";
import { useClientJobStore } from "../store/jobStore";

interface FormErrors {
  title?: string;
  description?: string;
  skills?: string;
  budget?: string;
  deadline?: string;
}

export default function PostProject() {
  const navigate = useNavigate();
  const addProject = useClientJobStore((state) => state.addProject);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>(["UI/UX", "Figma"]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (skills.length === 0) {
      newErrors.skills = "Please add at least 1 skill";
    }

    if (!budget.trim()) {
      newErrors.budget = "Budget is required";
    }

    if (!deadline.trim()) {
      newErrors.deadline = "Deadline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Add project to store so it immediately shows in Recent Jobs & updates Overview stats
    addProject({
      title,
      description,
      skills,
      budget,
      deadline,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/client");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background-surface pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 bg-background-surface/95 backdrop-blur-md z-20 pt-12 pb-4 px-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <BackButton variant="surface" className="w-10 h-10 shadow-none" />
          <h1 className="text-h3 font-bold text-text-primary">Post Project</h1>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="px-5 py-6 flex flex-col gap-5 max-w-md mx-auto">
        {/* 1. Job Title */}
        <Input
          label="Job Title"
          placeholder="Enter job title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          error={errors.title}
          requiredMark
        />

        {/* 2. Description */}
        <Input
          label="Description"
          placeholder="Enter job description"
          isTextArea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          error={errors.description}
          requiredMark
        />

        {/* 3. Skills */}
        <SkillsPicker
          label="Skills (add up to 10)"
          selectedSkills={skills}
          onChange={(newSkills) => {
            setSkills(newSkills);
            if (errors.skills) setErrors((prev) => ({ ...prev, skills: undefined }));
          }}
          error={errors.skills}
          required
        />

        {/* 4. Budget */}
        <Input
          label="Budget"
          placeholder="Enter job budget"
          prefix="Rp"
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            if (errors.budget) setErrors((prev) => ({ ...prev, budget: undefined }));
          }}
          error={errors.budget}
          requiredMark
        />

        {/* 5. Deadline */}
        <Input
          label="Deadline"
          type="date"
          placeholder="Enter job deadline"
          value={deadline}
          onChange={(e) => {
            setDeadline(e.target.value);
            if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
          }}
          leftIcon={
            <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          error={errors.deadline}
          requiredMark
        />

        {/* 6. Submit Button */}
        <div className="mt-4">
          <Button type="submit" disabled={isSubmitting} className="rounded-xl shadow-md shadow-primary/20">
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
