"use client"

import Navbar from "@/components/ui/Navbar"
import useProfile from "@/hooks/useProfile"
import Header from "./_components/Header";
import ProfileForm from "./_components/ProfileForm";


export default function ProfilePage() {
  const {
    profile,
    isEditing,
    isSaving,
    register,
    handleSubmit,
    setIsEditing,
    formState: { errors },
    submitProfile,
    handleLogout
  } = useProfile();


  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

          <Header
            profile={profile}
            handleLogout={handleLogout}
            setIsEditing={setIsEditing}
          />

          <ProfileForm
            isEditing={isEditing}
            isSaving={isSaving}
            register={register}
            handleSubmit={handleSubmit}
            setIsEditing={setIsEditing}
            errors={errors}
            submitProfile={submitProfile}
          />

        </div>
      </div>
    </main >
  )
}