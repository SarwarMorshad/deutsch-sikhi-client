import { useState } from "react";
import { HiOutlinePhotograph, HiOutlineUpload, HiOutlineX, HiOutlineExternalLink } from "react-icons/hi";
import toast from "react-hot-toast";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "446d95b69eeba860e1a251a61f3a5998";

const ImageBlockEditor = ({ data, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const imageData = {
    url: data.url || "",
    caption_en: data.caption_en || "",
    caption_bn: data.caption_bn || "",
    alt: data.alt || "",
  };

  const updateImage = (updates) => {
    onChange({ ...imageData, ...updates });
  };

  const uploadToImgBB = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        updateImage({
          url: result.data.display_url,
          alt: imageData.alt || file.name.replace(/\.[^/.]+$/, ""),
        });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadToImgBB(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadToImgBB(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeImage = () => {
    updateImage({ url: "", alt: "" });
  };

  return (
    <div className="space-y-4">
      {/* Image Upload / Preview */}
      {imageData.url ? (
        <div className="relative">
          {/* Image Preview */}
          <div className="relative rounded-xl overflow-hidden border border-ds-border/30 bg-ds-bg/50">
            <img
              src={imageData.url}
              alt={imageData.alt || "Uploaded image"}
              className="w-full max-h-64 object-contain"
            />
            {/* Overlay Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <a
                href={imageData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-ds-bg/80 backdrop-blur-sm rounded-lg text-ds-muted hover:text-ds-text transition-colors cursor-pointer"
                title="Open in new tab"
              >
                <HiOutlineExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={removeImage}
                className="p-2 bg-ds-bg/80 backdrop-blur-sm rounded-lg text-ds-muted hover:text-red-400 transition-colors cursor-pointer"
                title="Remove image"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Change Image Button */}
          <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-ds-border/30 text-ds-text rounded-lg hover:bg-ds-border/50 transition-colors cursor-pointer">
            <HiOutlineUpload className="w-4 h-4" />
            Change Image
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>
      ) : (
        /* Upload Zone */
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragOver
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-ds-border/30 hover:border-ds-border hover:bg-ds-bg/50"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {uploading ? (
            <>
              <div className="w-10 h-10 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin mb-3"></div>
              <p className="text-ds-muted">Uploading...</p>
            </>
          ) : (
            <>
              <HiOutlinePhotograph className="w-12 h-12 text-ds-muted mb-3" />
              <p className="text-ds-text font-medium mb-1">
                {dragOver ? "Drop image here" : "Click to upload or drag & drop"}
              </p>
              <p className="text-ds-muted text-sm">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {/* Alt Text */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Alt Text <span className="text-ds-muted font-normal">- for accessibility</span>
        </label>
        <input
          type="text"
          value={imageData.alt}
          onChange={(e) => updateImage({ alt: e.target.value })}
          placeholder="Describe the image for screen readers..."
          className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
        />
      </div>

      {/* Captions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Caption (English) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={imageData.caption_en}
            onChange={(e) => updateImage({ caption_en: e.target.value })}
            placeholder="Image caption in English..."
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
          />
        </div>
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Caption (Bengali) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={imageData.caption_bn}
            onChange={(e) => updateImage({ caption_bn: e.target.value })}
            placeholder="ছবির ক্যাপশন..."
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border font-bangla"
          />
        </div>
      </div>

      {/* URL Input (alternative to upload) */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">Or paste image URL</label>
        <input
          type="url"
          value={imageData.url}
          onChange={(e) => updateImage({ url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
        />
      </div>
    </div>
  );
};

export default ImageBlockEditor;
