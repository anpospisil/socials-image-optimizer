"use client";

import { useCallback, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  previewUrl: string | null;
  disabled?: boolean;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function DropZone({ onFile, previewUrl, disabled }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    if (!ACCEPTED.includes(file.type))
      return "Use a JPEG, PNG, or WebP file.";
    if (file.size > 50 * 1024 * 1024)
      return "File is too large. Maximum size is 50 MB.";
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) { setError(err); return; }
      setError(null);
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={[
          "flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer",
          "min-h-48 px-6 py-8 text-center",
          disabled ? "opacity-50 pointer-events-none" : "",
          dragging
            ? "border-stone-400 bg-stone-100"
            : previewUrl
            ? "border-stone-200 bg-stone-50"
            : "border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50",
        ].join(" ")}
      >
        <input
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
        />

        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Uploaded image preview"
            className="max-h-48 max-w-full rounded-lg object-contain shadow-sm"
          />
        ) : (
          <>
            <div className="mb-3 rounded-full bg-stone-100 p-3">
              <svg className="h-6 w-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-700">
              Drop your image here, or <span className="text-stone-900 underline underline-offset-2">browse</span>
            </p>
            <p className="mt-1 text-xs text-stone-400">JPEG, PNG, WebP · up to 50 MB</p>
          </>
        )}
      </label>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {previewUrl && (
        <p className="text-xs text-stone-400 text-center">
          Drop a new image to replace
        </p>
      )}
    </div>
  );
}
