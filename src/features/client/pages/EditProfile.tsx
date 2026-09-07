import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useGetMe, useUpdateProfile, type UserProfile } from "../api/user";
import { apiClient } from "../../../shared/lib/client";

import HeaderBar from "../../../shared/components/HeaderBar";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import ProfileAvatarEditor from "../../../shared/components/ProfileAvatarEditor";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface EditProfileFormProps {
  user: UserProfile;
}

function EditProfileForm({ user }: EditProfileFormProps) {
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    description: user.description || user.clientProfile?.description || "",
    avatarUrl: user.avatarUrl || "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const initials = (formData.name || user.name || "User")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "C";

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setIsUploading(true);
    setAvatarPreview(URL.createObjectURL(file));

    try {
      const uploadUrlRes = await apiClient.post("/storage/signed-upload-url", {
        fileName: file.name,
        folder: "avatars",
      });

      const uploadData = uploadUrlRes.data?.data || uploadUrlRes.data;

      if (uploadData?.signedUrl) {
        await axios.put(uploadData.signedUrl, file, {
          headers: { "Content-Type": file.type },
        });

        const publicUrlRes = await apiClient.get("/storage/public-read-url", {
          params: { folder: "avatars", path: uploadData.path },
        });

        const publicData = publicUrlRes.data?.data || publicUrlRes.data;
        if (publicData?.publicUrl) {
          setFormData((prev) => ({ ...prev, avatarUrl: publicData.publicUrl }));
          setAvatarPreview(publicData.publicUrl);
        }
      }
    } catch {
      setError("Failed to upload image. Please try again.");
      setAvatarPreview(user.avatarUrl || null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setError("");
      setSuccess(false);

      const trimmedAvatar = formData.avatarUrl.trim();
      const hasOriginalAvatar = !!(user.avatarUrl);
      const avatarValue = trimmedAvatar ? trimmedAvatar : hasOriginalAvatar ? null : undefined;

      await updateProfile.mutateAsync({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        description: formData.description.trim() || undefined,
        avatarUrl: avatarValue,
      });

      setSuccess(true);
      setTimeout(() => navigate("/client/profile"), 1000);
    } catch (err: any) {
      const message = err.response?.data?.message;
      const errorMessage = Array.isArray(message) ? message[0] : message;
      setError(errorMessage || err.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="p-3 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-body-sm text-success bg-success-bg border border-success-border rounded-lg">
          Profile updated successfully.
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

        <Button type="submit" disabled={updateProfile.isPending || isUploading}>
          {updateProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

export default function EditProfile() {
  const { data: user, isLoading } = useGetMe();

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-12">
      <HeaderBar title="Edit Profile" showBack variant="surface" />

      <div className="px-5 py-6 flex flex-col gap-6">
        {isLoading || !user ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3">
              <Skeleton circle width={96} height={96} />
              <Skeleton width={100} height={14} />
            </div>
            <Skeleton height={48} borderRadius={8} />
            <Skeleton height={48} borderRadius={8} />
            <Skeleton height={48} borderRadius={8} />
            <Skeleton height={96} borderRadius={8} />
            <Skeleton height={52} borderRadius={8} />
          </div>
        ) : (
          <EditProfileForm key={user.id} user={user} />
        )}
      </div>
    </div>
  );
}
