// hooks/useProfile.js
// FIXED: no infinite loading, stable fetch callbacks, auth+firestore resolved together.

import { useState, useEffect, useRef, useCallback } from "react";
import { auth, db, storage } from "../firebase/firebase.init";
import { updateProfile } from "firebase/auth";
import {
  doc, getDoc, setDoc, collection,
  query, where, orderBy, limit,
  getDocs, serverTimestamp,
} from "firebase/firestore";
import {
  ref as sRef, uploadBytesResumable, getDownloadURL,
} from "firebase/storage";

export const EMPTY_FORM = {
  displayName: "", phone: "", location: "",
  occupation: "", bio: "",
  website: "", twitter: "", linkedin: "", github: "",
};

export function useProfile() {
  // undefined = auth not yet resolved (shows loader)
  // null      = resolved, user not logged in
  // object    = resolved, user logged in
  const [user, setUser]           = useState(undefined);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saved, setSaved]         = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [toast, setToast]         = useState(null);
  const fileRef                   = useRef(null);

  // Stable uid ref — fetch callbacks use this instead of `user` in deps
  // This breaks the callback→user→callback re-creation cycle completely.
  const uidRef = useRef(null);

  // ── Auth + Firestore resolved TOGETHER ────────
  // Key fix: setUser() is called AFTER Firestore data is loaded.
  // This means loading flips to false exactly once, with all data ready.
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        uidRef.current = u.uid;
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          const data = snap.exists() ? snap.data() : {};
          const merged = {
            displayName: u.displayName || data.displayName || "",
            phone:       data.phone       || "",
            location:    data.location    || "",
            occupation:  data.occupation  || "",
            bio:         data.bio         || "",
            website:     data.website     || "",
            twitter:     data.twitter     || "",
            linkedin:    data.linkedin    || "",
            github:      data.github      || "",
          };
          setForm(merged);
          setSaved(merged);
        } catch (_) { /* first-time user, no doc yet */ }
        setUser(u); // ← set AFTER firestore resolves
      } else {
        uidRef.current = null;
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Derived loading state — no separate useState needed
  const loading = user === undefined;

  // ── Field setter (stable) ──────────────────────
  const set = useCallback(
    (key) => (val) => setForm((prev) => ({ ...prev, [key]: val })),
    []
  );

  // ── Save profile ───────────────────────────────
  // Accepts the current form as param — avoids stale closure on `form`.
  const saveProfile = useCallback(async (currentForm) => {
    const uid = uidRef.current;
    const authUser = auth.currentUser;
    if (!uid || !authUser || !currentForm) return false;
    setSaving(true);
    try {
      if (currentForm.displayName !== authUser.displayName) {
        await updateProfile(authUser, { displayName: currentForm.displayName });
      }
      await setDoc(
        doc(db, "users", uid),
        {
          ...currentForm,
          email:     authUser.email,
          photoURL:  authUser.photoURL || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSaved(currentForm);
      setUser((prev) => prev ? { ...prev, displayName: currentForm.displayName } : prev);
      setToast({ msg: "Profile saved successfully!", type: "success" });
      return true;
    } catch (err) {
      setToast({ msg: "Save failed: " + err.message, type: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  }, []); // ✅ no user/form in deps — uses uidRef + auth.currentUser

  // ── Cancel edit ────────────────────────────────
  const cancelEdit = useCallback(() => {
    setSaved((s) => { setForm(s); return s; });
  }, []);

  // ── Avatar pick + upload ───────────────────────
  const pickAvatar = useCallback(() => fileRef.current?.click(), []);

  const handleFileChange = useCallback((e) => {
    const file    = e.target.files?.[0];
    const uid     = uidRef.current;
    const authUser = auth.currentUser;
    if (!file || !uid) return;
    if (file.size > 5 * 1024 * 1024) {
      setToast({ msg: "Image must be under 5 MB", type: "error" });
      return;
    }
    setUploading(true);
    setProgress(0);
    const storageRef = sRef(storage, `avatars/${uid}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => { setToast({ msg: "Upload failed", type: "error" }); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await updateProfile(authUser, { photoURL: url });
        await setDoc(doc(db, "users", uid), { photoURL: url }, { merge: true });
        setUser((prev) => prev ? { ...prev, photoURL: url } : prev);
        setUploading(false);
        setToast({ msg: "Photo updated!", type: "success" });
      }
    );
  }, []); // ✅ stable — uses uidRef

  // ── Fetch recent transactions ──────────────────
  // Uses uidRef → stable reference, no user in deps → no re-render loop
  const fetchRecentTransactions = useCallback(async (count = 5) => {
    const uid = uidRef.current;
    if (!uid) return [];
    try {
      const q = query(
        collection(db, "users", uid, "transactions"),
        orderBy("date", "desc"),
        limit(count)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      return [];
    }
  }, []); // ✅ no user dep

  // ── Fetch monthly summary ──────────────────────
  const fetchMonthlySummary = useCallback(async () => {
    const uid = uidRef.current;
    if (!uid) return { totalExpense: 0, totalIncome: 0, count: 0 };
    try {
      const now   = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
      const q = query(
        collection(db, "users", uid, "transactions"),
        where("date", ">=", start),
        where("date", "<=", end)
      );
      const snap = await getDocs(q);
      let totalExpense = 0, totalIncome = 0;
      snap.docs.forEach((d) => {
        const { amount, type } = d.data();
        if (type === "expense") totalExpense += Number(amount) || 0;
        else                    totalIncome  += Number(amount) || 0;
      });
      return { totalExpense, totalIncome, count: snap.size };
    } catch {
      return { totalExpense: 0, totalIncome: 0, count: 0 };
    }
  }, []); // ✅ no user dep

  return {
    user,      // undefined|null|object
    form, saved,
    loading,   // true only while auth state unknown
    saving, uploading, progress, toast,
    fileRef,
    set,
    saveProfile,
    cancelEdit,
    pickAvatar,
    handleFileChange,
    setToast, setForm,
    fetchRecentTransactions,
    fetchMonthlySummary,
  };
}