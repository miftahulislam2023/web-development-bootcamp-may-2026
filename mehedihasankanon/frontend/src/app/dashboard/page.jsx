"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Folder,
  FolderOpen,
  LogOut,
  Search,
  Plus,
  Inbox,
  FolderPlus,
  MoreHorizontal,
  Mail,
  User,
  Eye,
  EyeOff,
  Lock,
  X,
} from "lucide-react";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { UploadModal } from "@/components/upload-modal";
import { FileTable } from "@/components/file-table";
import { fieldClass } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FILES_API_BASE = "/files";
const FOLDERS_API_BASE = "/folders";

const checkRequirements = (pw) => ({
  length: pw.length >= 8,
  uppercase: /[A-Z]/.test(pw),
  lowercase: /[a-z]/.test(pw),
  number: /[0-9]/.test(pw),
});

const meetsAll = (pw) => {
  const r = checkRequirements(pw);
  return r.length && r.uppercase && r.lowercase && r.number;
};

export default function DashboardPage() {
  const { logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [error, setError] = useState("");
  const [folderFetchError, setFolderFetchError] = useState("");
  const [folderFormError, setFolderFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newSubfolderOpen, setNewSubfolderOpen] = useState(false);
  const [folderOptionsOpen, setFolderOptionsOpen] = useState(null);
  const [folderSubmitting, setFolderSubmitting] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [subfolderName, setSubfolderName] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profile, setProfile] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toastTimer = useRef(null);
  const optionsRef = useRef(null);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const fetchFiles = async (folderId = currentFolderId) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`${FILES_API_BASE}/get-all`, {
        params: { folderId: folderId || "root" },
      });
      const fetched = Array.isArray(response.data) ? response.data : [];
      setFiles((prev) => {
        const map = new Map(prev.map((f) => [f.id, f]));
        fetched.forEach((f) => map.set(f.id, f));
        return Array.from(map.values());
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not load your files. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async (parentId = currentFolderId) => {
    setFoldersLoading(true);
    setFolderFetchError("");

    try {
      const response = await api.get(`${FOLDERS_API_BASE}/get-all`, {
        params: { parentId: parentId || "root" },
      });
      const fetched = Array.isArray(response.data) ? response.data : [];
      setFolders((prev) => {
        const map = new Map(prev.map((f) => [f.id, f]));
        fetched.forEach((f) => map.set(f.id, f));
        return Array.from(map.values());
      });
    } catch (err) {
      setFolderFetchError(
        err?.response?.data?.message ||
          "Could not load folders. Please try again.",
      );
    } finally {
      setFoldersLoading(false);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError("");

    try {
      const response = await api.get("/auth/profile");
      setProfile(response?.data?.user ?? null);
    } catch (err) {
      setProfileError(
        err?.response?.data?.message ||
          "Could not load profile. Please try again.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const createFolder = async ({ name, parentId, onClose }) => {
    if (!name.trim()) {
      setFolderFormError("Folder name is required.");
      return;
    }

    setFolderSubmitting(true);
    setFolderFormError("");

    try {
      await api.post(`${FOLDERS_API_BASE}/create`, {
        name: name.trim(),
        parentId: parentId || null,
      });
      showToast(parentId ? "Subfolder created." : "Folder created.");
      fetchFolders();
      onClose();
    } catch (err) {
      setFolderFormError(
        err?.response?.data?.message || "Could not create folder.",
      );
    } finally {
      setFolderSubmitting(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordSubmitted(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }

    if (!meetsAll(newPassword)) {
      setPasswordError("Password does not meet requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    try {
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      showToast("Password updated.");
      setPasswordOpen(false);
    } catch (err) {
      setPasswordError(
        err?.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentFolderId);
    fetchFolders(currentFolderId);
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, [currentFolderId]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setOptionsOpen(false);
      }
      if (!event.target.closest(".folder-options-container")) {
        setFolderOptionsOpen(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (profileOpen) {
      fetchProfile();
    }
  }, [profileOpen]);

  useEffect(() => {
    if (!newFolderOpen) {
      setFolderName("");
      setFolderFormError("");
      setFolderSubmitting(false);
    }
  }, [newFolderOpen]);

  useEffect(() => {
    if (!newSubfolderOpen) {
      setSubfolderName("");
      setFolderFormError("");
      setFolderSubmitting(false);
    }
  }, [newSubfolderOpen]);

  useEffect(() => {
    if (!passwordOpen) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setPasswordLoading(false);
      setPasswordSubmitted(false);
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [passwordOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setIsSearching(false);
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await api.get(`${FILES_API_BASE}/search`, {
          params: { q: searchQuery },
        });
        setSearchResults(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const folderById = useMemo(() => {
    return new Map(folders.map((folder) => [folder.id, folder]));
  }, [folders]);

  const currentFolder = currentFolderId
    ? folderById.get(currentFolderId)
    : null;

  const folderPath = useMemo(() => {
    if (!currentFolderId) return [];
    const path = [];
    let cursor = folderById.get(currentFolderId);
    while (cursor) {
      path.unshift(cursor);
      cursor = cursor.parentId ? folderById.get(cursor.parentId) : null;
    }
    return path;
  }, [currentFolderId, folderById]);

  const visibleFolders = useMemo(() => {
    const parentId = currentFolderId || null;
    return folders.filter((folder) => (folder.parentId || null) === parentId);
  }, [folders, currentFolderId]);

  const visibleFiles = useMemo(() => {
    const parentId = currentFolderId || null;
    return files.filter((file) => (file.folderId || null) === parentId);
  }, [files, currentFolderId]);

  const filteredFolders = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return visibleFolders;
    return visibleFolders.filter((folder) =>
      (folder.name || "").toLowerCase().includes(term),
    );
  }, [visibleFolders, searchQuery]);

  const filteredFiles = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return visibleFiles;
    return visibleFiles.filter((file) =>
      (file.name || "").toLowerCase().includes(term),
    );
  }, [visibleFiles, searchQuery]);

  const passwordReqs = checkRequirements(newPassword);
  const passwordValid = meetsAll(newPassword);
  const confirmFilled = confirmPassword.length > 0;
  const mismatch = confirmFilled && confirmPassword !== newPassword;
  const oldPasswordError = passwordSubmitted && !oldPassword;
  const newPasswordError = passwordSubmitted && !passwordValid;
  const confirmPasswordError = passwordSubmitted && mismatch;

  const Req = ({ met, label }) => (
    <li className="flex items-center gap-1.5">
      {met ? (
        <Check className="h-3 w-3 text-white" />
      ) : (
        <X className="h-3 w-3 text-zinc-600" />
      )}
      <span className={met ? "text-zinc-300" : "text-zinc-600"}>
        {label}
      </span>
    </li>
  );

  const handleCopyLink = async (file) => {
    const link = `${window.location.origin}/s/${file.id}`;

    try {
      await navigator.clipboard.writeText(link);
      showToast("Share link copied.");
    } catch (err) {
      showToast("Could not copy link.", "error");
    }
  };

  const handleToggleAccess = async (file) => {
    const previous = files;
    const nextAccess = file.access === "PUBLIC" ? "PRIVATE" : "PUBLIC";

    setFiles((prev) =>
      prev.map((item) =>
        item.id === file.id ? { ...item, access: nextAccess } : item,
      ),
    );

    try {
      const response = await api.patch(
        `${FILES_API_BASE}/toggle-access/${file.id}`,
      );
      const updatedAccess = response?.data?.access || nextAccess;
      setFiles((prev) =>
        prev.map((item) =>
          item.id === file.id ? { ...item, access: updatedAccess } : item,
        ),
      );
      setSearchResults((prev) =>
        prev.map((item) =>
          item.id === file.id ? { ...item, access: updatedAccess } : item,
        ),
      );
      showToast("Access updated.");
    } catch (err) {
      setFiles(previous);
      showToast("Failed to update access.", "error");
    }
  };

  const handleRenameFile = async (file, newName) => {
    try {
      const response = await api.patch(`${FILES_API_BASE}/rename/${file.id}`, { name: newName });
      setFiles((prev) =>
        prev.map((item) => (item.id === file.id ? { ...item, name: response?.data?.name || newName } : item)),
      );
      setSearchResults((prev) =>
        prev.map((item) => (item.id === file.id ? { ...item, name: response?.data?.name || newName } : item)),
      );
      showToast("File renamed.");
    } catch (err) {
      showToast(err?.response?.data?.error || "Failed to rename file.", "error");
    }
  };

  const handleRenameFolder = async (folder, newName) => {
    try {
      const response = await api.patch(`${FOLDERS_API_BASE}/rename/${folder.id}`, { name: newName });
      setFolders((prev) =>
        prev.map((item) => (item.id === folder.id ? { ...item, name: response?.data?.name || newName } : item)),
      );
      showToast("Folder renamed.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to rename folder.", "error");
    }
  };

  const handleDeleteFolder = async (folder) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${folder.name}" and ALL its contents? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`${FOLDERS_API_BASE}/delete/${folder.id}`);
      setFolders((prev) => prev.filter((item) => item.id !== folder.id));
      showToast("Folder deleted.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete folder.", "error");
    }
  };

  const handleDelete = async (file) => {
    const previousFiles = files;
    const previousSearch = searchResults;

    setFiles((prev) => prev.filter((item) => item.id !== file.id));
    setSearchResults((prev) => prev.filter((item) => item.id !== file.id));

    try {
      await api.delete(`${FILES_API_BASE}/delete/${file.id}`);
      showToast("File deleted.");
    } catch (err) {
      setFiles(previousFiles);
      setSearchResults(previousSearch);
      showToast("Failed to delete file.", "error");
    }
  };
  
  const handleViewFile = async (file) => {
    try {
      // get the freshest link from the share API
      const response = await api.get(`${FILES_API_BASE}/share/${file.id}`);
      const freshFile = response.data;
      if (freshFile && freshFile.url) {
        window.open(freshFile.url, "_blank");
      }
    } catch (err) {
      showToast("Could not open file.", "error");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="flex w-72 flex-col border-r border-zinc-800 bg-black/40 px-6 py-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Fylestash
            </h1>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-600">
              dashboard
            </p>
          </div>

          <nav className="mt-10 space-y-2 text-sm">
            <button
              type="button"
              onClick={() => setCurrentFolderId(null)}
              className="flex w-full items-center gap-3 rounded-lg border border-zinc-800 bg-black/50 px-3 py-2 text-left text-sm text-white"
            >
              <FolderOpen className="h-4 w-4 text-zinc-200" />
              Change Folder
            </button>
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="flex w-full items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:border-white/40"
            >
              <Plus className="h-4 w-4" />
              Stash New File
            </button>
            <button
              type="button"
              onClick={() => setNewFolderOpen(true)}
              className="flex w-full items-center gap-3 rounded-lg border border-zinc-800 bg-black/30 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-white/40 hover:text-white"
            >
              <FolderPlus className="h-4 w-4" />
              New Folder
            </button>
          </nav>
        </aside>

        <section className="flex flex-1 flex-col">
          <div className="border-b border-zinc-800 bg-black/20 px-8 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search all files..."
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/40"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative" ref={optionsRef}>
                <button
                  type="button"
                  onClick={() => setOptionsOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/40 hover:text-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  Options
                </button>
                {optionsOpen && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-zinc-800 bg-black/90 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(true);
                        setOptionsOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOptionsOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 px-8 py-8">
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <button
                type="button"
                onClick={() => setCurrentFolderId(null)}
                className="transition hover:text-white"
              >
                My Stash
              </button>
              {folderPath.map((folder) => (
                <div key={folder.id} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                  <button
                    type="button"
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="transition hover:text-white"
                  >
                    {folder.name}
                  </button>
                </div>
              ))}
            </div>

            {loading && (
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-8 text-sm text-zinc-400">
                Loading your stash...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-500/40 bg-black/30 p-6 text-sm text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-8">
                {isSearching ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">
                      Search Results
                    </p>
                    <div className="mt-4">
                      {searchResults.length > 0 ? (
                        <FileTable
                          files={searchResults}
                          onCopyLink={handleCopyLink}
                          onToggleAccess={handleToggleAccess}
                          onRename={handleRenameFile}
                          onDelete={handleDelete}
                          onView={handleViewFile}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-black/30 px-6 py-14 text-center">
                          <Inbox className="h-8 w-8 text-white" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              No files match your search
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              Try a different keyword.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {foldersLoading && (
                      <p className="text-xs text-zinc-500">Loading folders...</p>
                    )}
                    {!foldersLoading && folderFetchError && (
                      <p className="text-xs text-red-400">{folderFetchError}</p>
                    )}

                    {!foldersLoading && !folderFetchError && filteredFolders.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">
                          Folders
                        </p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredFolders.map((folder) => (
                            <div
                              key={folder.id}
                              className="relative flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 transition hover:border-white/40 group"
                            >
                              <button
                                type="button"
                                onClick={() => setCurrentFolderId(folder.id)}
                                className="flex flex-1 items-center gap-3 text-left"
                              >
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-black/40">
                                  <Folder className="h-5 w-5 text-zinc-200" />
                                </span>
                                <div>
                                  <p className="text-sm font-semibold text-white">
                                    {folder.name}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    {folder.parentId ? "Subfolder" : "Folder"}
                                  </p>
                                </div>
                              </button>
                              <div className="relative folder-options-container">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFolderOptionsOpen(folderOptionsOpen === folder.id ? null : folder.id);
                                  }}
                                  className="p-2 text-zinc-500 hover:text-white transition"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                                {folderOptionsOpen === folder.id && (
                                  <div className="absolute right-0 top-full mt-2 w-32 z-10 overflow-hidden rounded-lg border border-zinc-800 bg-black/90 shadow-lg">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFolderOptionsOpen(null);
                                        const newName = window.prompt("Enter new folder name:", folder.name);
                                        if (newName && newName.trim() !== folder.name) {
                                          handleRenameFolder(folder, newName.trim());
                                        }
                                      }}
                                      className="flex w-full items-center px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                      Rename
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFolderOptionsOpen(null);
                                        handleDeleteFolder(folder);
                                      }}
                                      className="flex w-full items-center px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!foldersLoading &&
                      !folderFetchError &&
                      filteredFolders.length === 0 &&
                      filteredFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-black/30 px-6 py-14 text-center">
                          <Inbox className="h-8 w-8 text-white" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {searchQuery.trim()
                                ? "No items match your search"
                                : "This folder is empty"}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {searchQuery.trim()
                                ? "Try a different keyword."
                                : "Upload or create a folder to get started."}
                            </p>
                          </div>
                        </div>
                      )}

                    {filteredFiles.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">
                          Files
                        </p>
                        <div className="mt-4">
                          <FileTable
                            files={filteredFiles}
                            onCopyLink={handleCopyLink}
                            onToggleAccess={handleToggleAccess}
                            onRename={handleRenameFile}
                            onDelete={handleDelete}
                            onView={handleViewFile}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={fetchFiles}
        onToast={showToast}
        folderId={currentFolderId}
      />

      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>
              {currentFolder
                ? `Create a folder inside ${currentFolder.name}.`
                : "Create a root folder."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Folder name
              </label>
              <input
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40"
                placeholder="e.g. Project assets"
              />
            </div>
            {folderFormError && (
              <p className="text-xs text-red-400">{folderFormError}</p>
            )}
            <div className="flex justify-end gap-2">
              <DialogClose className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-400 transition hover:border-white/40 hover:text-white">
                Cancel
              </DialogClose>
              <button
                type="button"
                onClick={() =>
                  createFolder({
                    name: folderName,
                    parentId: currentFolderId || null,
                    onClose: () => setNewFolderOpen(false),
                  })
                }
                disabled={folderSubmitting}
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {folderSubmitting ? "Creating..." : "Create folder"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={newSubfolderOpen} onOpenChange={setNewSubfolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New subfolder</DialogTitle>
            <DialogDescription>
              {currentFolder
                ? `Inside ${currentFolder.name}`
                : "Pick a parent folder first."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Subfolder name
              </label>
              <input
                value={subfolderName}
                onChange={(event) => setSubfolderName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-white/40"
                placeholder="e.g. Drafts"
              />
            </div>
            {folderFormError && (
              <p className="text-xs text-red-400">{folderFormError}</p>
            )}
            <div className="flex justify-end gap-2">
              <DialogClose className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-400 transition hover:border-white/40 hover:text-white">
                Cancel
              </DialogClose>
              <button
                type="button"
                onClick={() =>
                  createFolder({
                    name: subfolderName,
                    parentId: currentFolderId,
                    onClose: () => setNewSubfolderOpen(false),
                  })
                }
                disabled={folderSubmitting || !currentFolderId}
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {folderSubmitting ? "Creating..." : "Create subfolder"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="mx-auto w-full max-w-sm border-zinc-800 bg-black p-8 shadow-none">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>Your account details.</DialogDescription>
          </DialogHeader>
          {profileLoading && (
            <p className="text-sm text-zinc-400">Loading profile...</p>
          )}
          {!profileLoading && profileError && (
            <p className="text-sm text-red-400">{profileError}</p>
          )}
          {!profileLoading && !profileError && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Username"
                  value={profile?.name || ""}
                  readOnly
                  className={fieldClass(false)}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={profile?.email || ""}
                  readOnly
                  className={fieldClass(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => setPasswordOpen(true)}
                className="w-full mt-2 py-2.5 text-sm font-semibold tracking-tighter text-black bg-white border border-white transition-all duration-300 hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] hover:bg-white"
              >
                Change password
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="mx-auto w-full max-w-sm border-zinc-800 bg-black p-8 shadow-none">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Enter your new credentials.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <p className="text-xs text-red-500 text-center">
                {passwordError}
              </p>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old password"
                value={oldPassword}
                onChange={(event) => {
                  setOldPassword(event.target.value);
                  setPasswordError("");
                }}
                className={fieldClass(oldPasswordError) + " pr-10"}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setPasswordError("");
                }}
                className={fieldClass(newPasswordError) + " pr-10"}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <ul className="text-xs space-y-1 pl-1">
              <Req met={passwordReqs.length} label="At least 8 characters" />
              <Req met={passwordReqs.uppercase} label="One uppercase letter" />
              <Req met={passwordReqs.lowercase} label="One lowercase letter" />
              <Req met={passwordReqs.number} label="One number" />
            </ul>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Retype new password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setPasswordError("");
                }}
                className={fieldClass(confirmPasswordError) + " pr-10"}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {confirmPasswordError && (
                <p className="mt-1 ml-1 text-xs text-red-500">
                  Passwords do not match.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full mt-2 py-2.5 text-sm font-semibold tracking-tighter text-black bg-white border border-white transition-all duration-300 hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              {passwordLoading ? "Updating..." : "Update password"}
            </button>

            <DialogClose className="w-full text-xs text-zinc-500 transition hover:text-white">
              Cancel
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition ${
            toast.tone === "error"
              ? "border-red-500/50 bg-black/80 text-red-200"
              : "border-white/20 bg-black/80 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
