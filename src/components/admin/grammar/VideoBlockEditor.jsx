import { useState } from "react";
import { HiOutlinePlay, HiOutlineExternalLink } from "react-icons/hi";

const VideoBlockEditor = ({ data, onChange }) => {
  const [previewError, setPreviewError] = useState(false);

  const videoData = {
    url: data.url || "",
    title_en: data.title_en || "",
    title_bn: data.title_bn || "",
    start_time: data.start_time || 0,
  };

  const updateVideo = (updates) => {
    onChange({ ...videoData, ...updates });
    setPreviewError(false);
  };

  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeId(videoData.url);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}${
        videoData.start_time ? `?start=${videoData.start_time}` : ""
      }`
    : null;

  return (
    <div className="space-y-4">
      {/* YouTube URL */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          YouTube URL <span className="text-red-400">*</span>
        </label>
        <input
          type="url"
          value={videoData.url}
          onChange={(e) => updateVideo({ url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
        />
        <p className="text-xs text-ds-muted mt-1">
          Supports: youtube.com/watch, youtu.be, or just the video ID
        </p>
      </div>

      {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Title (English) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={videoData.title_en}
            onChange={(e) => updateVideo({ title_en: e.target.value })}
            placeholder="e.g., German Pronunciation Guide"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
          />
        </div>
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Title (Bengali) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={videoData.title_bn}
            onChange={(e) => updateVideo({ title_bn: e.target.value })}
            placeholder="যেমন: জার্মান উচ্চারণ গাইড"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border font-bangla"
          />
        </div>
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Start Time (seconds) <span className="text-ds-muted font-normal">- optional</span>
        </label>
        <input
          type="number"
          value={videoData.start_time}
          onChange={(e) => updateVideo({ start_time: parseInt(e.target.value) || 0 })}
          min="0"
          placeholder="0"
          className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border max-w-xs"
        />
        <p className="text-xs text-ds-muted mt-1">Video will start playing from this time</p>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">Preview</label>
        {embedUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-ds-border/30 bg-black aspect-video">
            {!previewError ? (
              <iframe
                src={embedUrl}
                title="Video preview"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setPreviewError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ds-muted">
                <p>Unable to load preview</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-ds-border/30 rounded-xl">
            <HiOutlinePlay className="w-12 h-12 text-ds-muted mb-3" />
            <p className="text-ds-muted">Enter a YouTube URL to see preview</p>
          </div>
        )}
      </div>

      {/* Video ID Info */}
      {videoId && (
        <div className="flex items-center justify-between p-3 bg-ds-bg/30 rounded-lg">
          <span className="text-sm text-ds-muted">
            Video ID: <code className="text-ds-text">{videoId}</code>
          </span>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-ds-muted hover:text-ds-text transition-colors"
          >
            <HiOutlineExternalLink className="w-4 h-4" />
            Open on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoBlockEditor;
