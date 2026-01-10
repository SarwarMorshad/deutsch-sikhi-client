import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { HiOutlineSave, HiOutlineRefresh } from "react-icons/hi";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const axiosSecure = useAxiosSecure();
  const [settings, setSettings] = useState({
    minPassingScore: 70,
    allowRetakes: true,
    showCorrectAnswers: true,
    requireSequentialLessons: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosSecure.get("/settings");
      if (res.data.data) setSettings(res.data.data);
    } catch (error) {
      console.log("Using default settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosSecure.patch("/admin/settings", settings);
      toast.success("Settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-ds-muted border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ds-text">Settings</h1>
        <p className="text-ds-muted">Configure app behavior</p>
      </div>

      <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ds-text border-b border-ds-border/30 pb-4">
          Quiz Settings
        </h2>

        <div>
          <label className="block text-sm font-medium text-ds-text mb-2">Minimum Passing Score (%)</label>
          <input
            type="number"
            value={settings.minPassingScore}
            onChange={(e) => setSettings({ ...settings, minPassingScore: parseInt(e.target.value) })}
            min={0}
            max={100}
            className="w-32 px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text"
          />
          <p className="text-ds-muted text-sm mt-1">Users need this score to complete a lesson</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-ds-text font-medium">Allow Retakes</p>
            <p className="text-ds-muted text-sm">Let users retry failed quizzes</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, allowRetakes: !settings.allowRetakes })}
            className={`w-14 h-8 rounded-full transition-colors ${
              settings.allowRetakes ? "bg-green-500" : "bg-ds-border"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                settings.allowRetakes ? "translate-x-7" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-ds-text font-medium">Show Correct Answers</p>
            <p className="text-ds-muted text-sm">Show correct answers after quiz</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, showCorrectAnswers: !settings.showCorrectAnswers })}
            className={`w-14 h-8 rounded-full transition-colors ${
              settings.showCorrectAnswers ? "bg-green-500" : "bg-ds-border"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                settings.showCorrectAnswers ? "translate-x-7" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-ds-text font-medium">Sequential Lessons</p>
            <p className="text-ds-muted text-sm">Users must complete lessons in order</p>
          </div>
          <button
            onClick={() =>
              setSettings({ ...settings, requireSequentialLessons: !settings.requireSequentialLessons })
            }
            className={`w-14 h-8 rounded-full transition-colors ${
              settings.requireSequentialLessons ? "bg-green-500" : "bg-ds-border"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                settings.requireSequentialLessons ? "translate-x-7" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-ds-border/30 text-ds-text"
        >
          <HiOutlineRefresh className="w-5 h-5" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold disabled:opacity-50"
        >
          <HiOutlineSave className="w-5 h-5" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
