import { useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useLanguage from "../../hooks/useLanguage";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineGlobe,
  HiOutlineTrash,
  HiOutlineExclamation,
  HiOutlineShieldCheck,
  HiOutlineLogout,
} from "react-icons/hi";
import toast from "react-hot-toast";
import ChangePassword from "../../components/profile/ChangePassword";

const Profile = () => {
  const { t } = useTranslation();
  const { user, dbUser, updateUserProfile, logOut } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { currentLanguage, isBengali, changeLanguage } = useLanguage();
  const fileInputRef = useRef(null);

  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(dbUser?.name || user?.displayName || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString(isBengali ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Get member since date (prefer dbUser, fallback to Firebase)
  const getMemberSince = () => {
    if (dbUser?.createdAt) return formatDate(dbUser.createdAt);
    if (user?.metadata?.creationTime) return formatDate(user.metadata.creationTime);
    return "N/A";
  };

  // Get last updated date
  const getLastUpdated = () => {
    if (dbUser?.updatedAt) return formatDate(dbUser.updatedAt);
    if (user?.metadata?.lastSignInTime) return formatDate(user.metadata.lastSignInTime);
    return "N/A";
  };

  // Handle name update
  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      toast.error(t("common.error"));
      return;
    }

    setSaving(true);
    try {
      // Update Firebase profile
      await updateUserProfile(newName.trim(), user?.photoURL);

      // Update MongoDB
      await axiosSecure.patch("/users/me", { name: newName.trim() });

      toast.success(t("toast.nameUpdated"));
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error(t("toast.errorOccurred"));
    } finally {
      setSaving(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      // Upload to ImgBB
      const formData = new FormData();
      formData.append("image", file);

      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=446d95b69eeba860e1a251a61f3a5998`,
        { method: "POST", body: formData }
      );

      const imgbbData = await imgbbResponse.json();

      if (!imgbbData.success) {
        throw new Error("Failed to upload image");
      }

      const photoURL = imgbbData.data.display_url;

      // Update Firebase profile
      await updateUserProfile(user?.displayName, photoURL);

      // Update MongoDB
      await axiosSecure.patch("/users/me", { photoURL });

      toast.success(t("toast.photoUpdated"));
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(t("toast.errorOccurred"));
    } finally {
      setUploading(false);
    }
  };

  // Handle language change
  const handleLanguageChange = async (language) => {
    try {
      await axiosSecure.patch("/users/me/language", { language });
      changeLanguage(language);
      toast.success(t("toast.languageChanged"));
    } catch (error) {
      console.error("Error changing language:", error);
      toast.error(t("toast.errorOccurred"));
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await axiosSecure.delete("/users/me");
      toast.success("Account deleted successfully");
      logOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(t("toast.errorOccurred"));
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
            {t("profile.title")}
          </h1>
          <p className={`text-ds-muted mt-1 ${isBengali ? "font-bangla" : ""}`}>{t("profile.subtitle")}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden mb-6">
          {/* Cover & Avatar */}
          <div className="h-32 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-ds-bg overflow-hidden bg-ds-surface">
                  {user?.photoURL || dbUser?.photoURL ? (
                    <img
                      src={dbUser?.photoURL || user?.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ds-border/30">
                      <HiOutlineUser className="w-12 h-12 text-ds-muted" />
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-ds-text text-ds-bg hover:bg-ds-muted transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-ds-bg border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <HiOutlineCamera className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-16 pb-6 px-6">
            {/* Name */}
            <div className="flex items-center gap-3 mb-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text text-xl font-bold focus:outline-none focus:border-ds-muted"
                    autoFocus
                  />
                  <button
                    onClick={handleNameUpdate}
                    disabled={saving}
                    className="p-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  >
                    <HiOutlineCheck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(dbUser?.name || user?.displayName || "");
                    }}
                    className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-ds-text">
                    {dbUser?.name || user?.displayName || "User"}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded-lg hover:bg-ds-surface text-ds-muted hover:text-ds-text transition-colors"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-ds-muted">
              <HiOutlineMail className="w-4 h-4" />
              <span>{dbUser?.email || user?.email}</span>
              {user?.emailVerified && (
                <span
                  className={`flex items-center gap-1 text-xs text-green-400 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  <HiOutlineShieldCheck className="w-3 h-3" />
                  {t("profile.verified")}
                </span>
              )}
            </div>

            {/* Role Badge */}
            {dbUser?.role === "admin" && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 mb-6">
          <h3
            className={`text-lg font-semibold text-ds-text mb-4 flex items-center gap-2 ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineUser className="w-5 h-5" />
            {t("profile.accountDetails")}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-ds-border/20">
              <div className={`flex items-center gap-3 text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                <HiOutlineCalendar className="w-5 h-5" />
                <span>{t("profile.memberSince")}</span>
              </div>
              <span className="text-ds-text">{getMemberSince()}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-ds-border/20">
              <div className={`flex items-center gap-3 text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                <HiOutlineCalendar className="w-5 h-5" />
                <span>{t("profile.lastUpdated")}</span>
              </div>
              <span className="text-ds-text">{getLastUpdated()}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className={`flex items-center gap-3 text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                <HiOutlineShieldCheck className="w-5 h-5" />
                <span>{t("profile.accountStatus")}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                {t("profile.active")}
              </span>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 mb-6">
          <h3
            className={`text-lg font-semibold text-ds-text mb-4 flex items-center gap-2 ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineGlobe className="w-5 h-5" />
            {t("profile.language.title")}
          </h3>

          <p className={`text-ds-muted text-sm mb-4 ${isBengali ? "font-bangla" : ""}`}>
            {t("profile.language.subtitle")}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                currentLanguage === "en"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-ds-border/30 text-ds-muted hover:border-ds-border"
              }`}
            >
              <span className="text-2xl mb-1">🇺🇸</span>
              <p className="font-medium">{t("profile.language.english")}</p>
            </button>
            <button
              onClick={() => handleLanguageChange("bn")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                currentLanguage === "bn"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-ds-border/30 text-ds-muted hover:border-ds-border"
              }`}
            >
              <span className="text-2xl mb-1">🇧🇩</span>
              <p className="font-medium font-bangla">{t("profile.language.bengali")}</p>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <ChangePassword />
        </div>
        {/* Danger Zone */}
        <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
          <h3
            className={`text-lg font-semibold text-red-400 mb-4 flex items-center gap-2 ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineExclamation className="w-5 h-5" />
            {t("profile.danger.title")}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                  {t("profile.danger.signOut")}
                </p>
                <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                  {t("profile.danger.signOutDesc")}
                </p>
              </div>
              <button
                onClick={logOut}
                className={`px-4 py-2 rounded-xl border border-ds-border/30 text-ds-muted hover:text-ds-text hover:bg-ds-surface transition-all flex items-center gap-2 ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <HiOutlineLogout className="w-4 h-4" />
                {t("profile.danger.signOut")}
              </button>
            </div>

            <div className="border-t border-red-500/20 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                    {t("profile.danger.deleteAccount")}
                  </p>
                  <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {t("profile.danger.deleteDesc")}
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className={`px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-ds-surface rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <HiOutlineExclamation className="w-6 h-6 text-red-400" />
                </div>
                <h3 className={`text-xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                  {t("profile.danger.deleteAccount")}
                </h3>
              </div>

              <p className={`text-ds-muted mb-4 ${isBengali ? "font-bangla" : ""}`}>
                {t("profile.danger.deleteConfirm")}
              </p>

              <p className={`text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
                {t("profile.danger.typeDelete")}
              </p>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-ds-bg border border-ds-border/30 text-ds-text mb-4"
                placeholder="Type DELETE"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className={`flex-1 py-3 rounded-xl border border-ds-border/30 text-ds-text hover:bg-ds-bg transition-colors ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE"}
                  className={`flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("profile.danger.deleteForever")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
