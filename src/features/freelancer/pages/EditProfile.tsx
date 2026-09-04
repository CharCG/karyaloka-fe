import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useGetMe, useUpdateProfile } from "../../client/api/user";
import { useGetPortfolios, useCreatePortfolio, useDeletePortfolio, type PortfolioItem } from "../api/portfolio";
import { apiClient } from "../../../shared/lib/client";

import HeaderBar from "../../../shared/components/HeaderBar";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import SkillsPicker from "../../../shared/components/SkillsPicker";
import SectionHeader from "../../../shared/components/SectionHeader";
import ProfileAvatarEditor from "../../../shared/components/ProfileAvatarEditor";

import XIcon from "../../../assets/icons/x.svg?react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioImageInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading: isUserLoading } = useGetMe();
  const updateProfile = useUpdateProfile();

  const { data: portfolios } = useGetPortfolios();
  const createPortfolio = useCreatePortfolio();
  const deletePortfolio = useDeletePortfolio();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    avatarUrl: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newPortfolio, setNewPortfolio] = useState({
    description: "",
    externalUrl: "",
    imageUrl: "",
    imagePreview: "",
  });
  const [portfolioError, setPortfolioError] = useState("");
  const [isUploadingPortfolioImage, setIsUploadingPortfolioImage] = useState(false);

  if (user && !hasInitialized) {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      description: user.freelancerProfile?.description || "",
      avatarUrl: user.avatarUrl || "",
    });
    setSkills(user.freelancerProfile?.skills || []);
    setAvatarPreview(user.avatarUrl || null);
    setHasInitialized(true);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImageFile = async (file: File, folder: "avatars" | "portfolios"): Promise<string | null> => {
    const uploadUrlRes = await apiClient.post("/storage/signed-upload-url", {
      fileName: file.name,
      folder,
    });
    const uploadData = uploadUrlRes.data?.data || uploadUrlRes.data;
    if (uploadData?.signedUrl) {
      await axios.put(uploadData.signedUrl, file, {
        headers: { "Content-Type": file.type },
      });
      const publicUrlRes = await apiClient.get("/storage/public-read-url", {
        params: { folder, path: uploadData.path },
      });
      const publicData = publicUrlRes.data?.data || publicUrlRes.data;
      return publicData?.publicUrl || null;
    }
    return null;
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Image size must be less than 5 MB.");
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setErrorMessage("");

    try {
      setIsUploading(true);
      const publicUrl = await uploadImageFile(file, "avatars");
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, avatarUrl: publicUrl }));
      }
    } catch {
      setErrorMessage("Failed to upload image. Please try again.");
      setAvatarPreview(formData.avatarUrl || null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    try {
      await updateProfile.mutateAsync({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        description: formData.description.trim() || undefined,
        avatarUrl: formData.avatarUrl || null,
        skills,
      });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => navigate("/freelancer/profile"), 800);
    } catch {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  const handlePortfolioImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPortfolioError("Please select a valid image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setPortfolioError("Image size must be less than 5 MB.");
      return;
    }

    try {
      setIsUploadingPortfolioImage(true);
      setPortfolioError("");
      setNewPortfolio((prev) => ({ ...prev, imagePreview: URL.createObjectURL(file) }));
      const publicUrl = await uploadImageFile(file, "portfolios");
      if (publicUrl) {
        setNewPortfolio((prev) => ({ ...prev, imageUrl: publicUrl }));
      }
    } catch {
      setPortfolioError("Failed to upload portfolio image.");
      setNewPortfolio((prev) => ({ ...prev, imagePreview: "" }));
    } finally {
      setIsUploadingPortfolioImage(false);
      if (portfolioImageInputRef.current) portfolioImageInputRef.current.value = "";
    }
  };

  const handleAddPortfolio = async () => {
    if (!newPortfolio.description.trim()) {
      setPortfolioError("Description is required.");
      return;
    }
    if (!newPortfolio.externalUrl.trim()) {
      setPortfolioError("Project link is required.");
      return;
    }

    try {
      setPortfolioError("");
      await createPortfolio.mutateAsync({
        description: newPortfolio.description.trim(),
        externalUrl: newPortfolio.externalUrl.trim(),
        imageUrl: newPortfolio.imageUrl || undefined,
      });
      setNewPortfolio({ description: "", externalUrl: "", imageUrl: "", imagePreview: "" });
    } catch {
      setPortfolioError("Failed to add portfolio item.");
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deletePortfolio.mutateAsync(id);
    } catch {
      setPortfolioError("Failed to delete portfolio item.");
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background-base pb-12">
        <HeaderBar title="Edit Profile" showBack variant="surface" />
        <div className="px-5 py-6 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <Skeleton circle width={96} height={96} />
            <Skeleton width={120} height={16} />
          </div>
          <Skeleton height={52} borderRadius={8} />
          <Skeleton height={52} borderRadius={8} />
          <Skeleton height={100} borderRadius={8} />
          <Skeleton height={52} borderRadius={8} />
        </div>
      </div>
    );
  }

  const initials = (formData.name || user.name || "F")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-12">
      <HeaderBar title="Edit Profile" showBack variant="surface" />

      <div className="px-5 py-6 flex flex-col gap-6">

        {errorMessage && (
          <div className="p-3 bg-error-bg text-error text-body-sm rounded-lg border border-error-border">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3 bg-success-bg text-success text-body-sm rounded-lg border border-success-border">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <ProfileAvatarEditor
            previewUrl={avatarPreview}
            initials={initials}
            isUploading={isUploading}
            hasAvatar={!!formData.avatarUrl}
            fileInputRef={fileInputRef}
            onFileChange={handleAvatarChange}
            onRemove={handleRemoveAvatar}
          />

          <Input label="Email Address" name="email" value={user.email || ""} disabled readOnly />

          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            requiredMark
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Bio / Description"
            name="description"
            placeholder="Enter your description"
            isTextArea
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />

          <SkillsPicker
            label="Skills (add up to 10)"
            selectedSkills={skills}
            onChange={(newSkills) => setSkills(newSkills)}
          />

          <Button type="submit" disabled={updateProfile.isPending || isUploading}>
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>

        <div className="bg-background-surface rounded-lg border border-border flex flex-col gap-4 p-5">
          <SectionHeader title="Portfolio" />

          {portfolios && portfolios.length > 0 && (
            <div className="flex flex-col gap-2">
              {portfolios.map((item: PortfolioItem) => (
                <div
                  key={item.id}
                  className="p-3 border border-border rounded-lg bg-background-base flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt="Portfolio thumbnail"
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border"
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-body-sm font-semibold text-text-primary truncate">
                        {item.description}
                      </span>
                      {item.externalUrl && (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-caption text-primary truncate"
                        >
                          {item.externalUrl}
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary active:text-error active:bg-error-bg cursor-pointer shrink-0"
                    title="Remove portfolio item"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4 pt-2 border-t border-border">
            <p className="text-body-sm font-semibold text-text-primary">Add New Project</p>

            {portfolioError && (
              <p className="text-caption text-error">{portfolioError}</p>
            )}

            <Input
              label="Description"
              placeholder="Briefly describe what you built"
              isTextArea
              rows={2}
              value={newPortfolio.description}
              onChange={(e) => setNewPortfolio((prev) => ({ ...prev, description: e.target.value }))}
              requiredMark
            />

            <Input
              label="Project Link"
              placeholder="https://"
              value={newPortfolio.externalUrl}
              onChange={(e) => setNewPortfolio((prev) => ({ ...prev, externalUrl: e.target.value }))}
              requiredMark
            />

            <div className="flex flex-col gap-2">
              <label className="text-body-sm font-semibold text-text-primary">
                Project Thumbnail <span className="text-text-tertiary font-normal">(optional)</span>
              </label>

              <input
                type="file"
                ref={portfolioImageInputRef}
                onChange={handlePortfolioImageChange}
                accept="image/*"
                className="hidden"
                aria-hidden="true"
              />

              {newPortfolio.imagePreview ? (
                <div className="relative w-fit">
                  <img
                    src={newPortfolio.imagePreview}
                    alt="Thumbnail preview"
                    className="w-20 h-20 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewPortfolio((prev) => ({ ...prev, imageUrl: "", imagePreview: "" }));
                      if (portfolioImageInputRef.current) portfolioImageInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center cursor-pointer"
                    title="Remove image"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => portfolioImageInputRef.current?.click()}
                  disabled={isUploadingPortfolioImage}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background-base text-body-sm text-text-secondary w-fit cursor-pointer active:bg-background-surface disabled:opacity-50"
                >
                  {isUploadingPortfolioImage ? "Uploading..." : "Upload image"}
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddPortfolio}
              disabled={createPortfolio.isPending || isUploadingPortfolioImage}
            >
              {createPortfolio.isPending ? "Adding..." : "Add to Portfolio"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
