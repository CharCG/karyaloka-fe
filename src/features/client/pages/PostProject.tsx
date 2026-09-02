import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useClientJobStore } from "../store/jobStore";

import HeaderBar from "../../../shared/components/HeaderBar";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import SkillsPicker from "../components/SkillsPicker";

import CalendarIcon from "../../../assets/icons/calendar.svg?react";

export default function PostProject() {
  const navigate = useNavigate();
  const addProject = useClientJobStore((state) => state.addProject);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const [skills, setSkills] = useState<string[]>(["UI/UX", "Figma"]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.budget.trim() ||
      !formData.deadline.trim() ||
      skills.length === 0
    ) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      addProject({
        title: formData.title,
        description: formData.description,
        skills,
        budget: formData.budget,
        deadline: formData.deadline,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/client");
      }, 300);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Failed to post project. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base">
      <HeaderBar title="Post Project" showBack variant="surface" />

      <div className="px-5 py-8 flex flex-col">
        {error && (
          <div className="mb-8 p-4 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Project Title"
            name="title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={handleChange}
            requiredMark
          />

          <Input
            label="Description"
            name="description"
            placeholder="Enter project description"
            isTextArea
            value={formData.description}
            onChange={handleChange}
            requiredMark
          />

          <SkillsPicker
            label="Skills (add up to 10)"
            selectedSkills={skills}
            onChange={(newSkills) => setSkills(newSkills)}
            required
          />

          <Input
            label="Budget"
            name="budget"
            placeholder="Enter project budget"
            prefix="Rp"
            value={formData.budget}
            onChange={handleChange}
            requiredMark
          />

          <Input
            label="Deadline"
            type="date"
            name="deadline"
            placeholder="Enter project deadline"
            value={formData.deadline}
            onChange={handleChange}
            requiredMark
            leftIcon={<CalendarIcon className="w-6 h-6" />}
          />

          <div className="mt-16">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
