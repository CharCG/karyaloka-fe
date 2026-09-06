import type { ChangeEvent, RefObject } from "react";
import PenIcon from "../../assets/icons/pen.svg?react";

export interface ProfileAvatarEditorProps {
  previewUrl: string | null;
  initials: string;
  isUploading: boolean;
  hasAvatar: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export default function ProfileAvatarEditor({
  previewUrl,
  initials,
  isUploading,
  hasAvatar,
  fileInputRef,
  onFileChange,
  onRemove,
}: ProfileAvatarEditorProps) {
  const triggerPicker = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-2 border-border bg-background-surface"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-h1 font-semibold text-white select-none">
            {initials}
          </div>
        )}

        <button
          type="button"
          onClick={triggerPicker}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-2 border-background-surface flex items-center justify-center cursor-pointer disabled:opacity-50 active:opacity-80"
          title="Change profile picture"
          aria-label="Change profile picture"
        >
          <PenIcon className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        aria-label="Upload profile picture"
        className="hidden"
      />

      <div className="flex items-center gap-3 text-body-sm">
        <button
          type="button"
          onClick={triggerPicker}
          disabled={isUploading}
          className="text-primary font-medium cursor-pointer disabled:opacity-50 active:opacity-70"
        >
          {isUploading ? "Uploading..." : hasAvatar ? "Change Photo" : "Upload Photo"}
        </button>

        {hasAvatar && !isUploading && (
          <>
            <span className="text-border select-none">•</span>
            <button
              type="button"
              onClick={onRemove}
              className="text-error font-medium cursor-pointer active:opacity-70"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
