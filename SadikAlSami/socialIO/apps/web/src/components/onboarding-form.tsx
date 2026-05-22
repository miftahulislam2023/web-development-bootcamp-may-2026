"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Camera } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@socialIO/ui/components/button";
import { Input } from "@socialIO/ui/components/input";
import { Label } from "@socialIO/ui/components/label";
import { useCreateProfile } from "@/hooks/use-create-profile";

const onboardingSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingForm() {
  const router = useRouter();
  const { mutateAsync: createProfile } = useCreateProfile();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: "",
      bio: "",
    },
  });

  const displayNameValue = watch("displayName");

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.substring(0, 2).toUpperCase();
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary object URL for the preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // TODO: Later, wire this up to use Cloudinary signed uploads
    }
  };

  const onSubmit = async (data: OnboardingValues) => {
    try {
      // In the future, if an avatar is selected, upload to Cloudinary here
      // and get the resulting URL before calling createProfile.

      await createProfile({
        displayName: data.displayName,
        bio: data.bio || undefined,
        avatarUrl: undefined, // Replace with Cloudinary URL later
      });

      toast.success("Profile created successfully!");
      router.push("/chat" as any);
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-[#27272A] border border-[#E4E4E7] dark:border-[#3F3F46]"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-[#27272A] dark:text-[#F4F4F5]">Set up your profile</h2>
        <p className="mt-2 text-sm text-[#71717A] dark:text-[#A1A1AA]">
          Add a photo and some details to help friends find you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Label
            htmlFor="avatar-upload"
            className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F4F4F5] dark:bg-[#3F3F46] hover:ring-2 hover:ring-[#E07A5F] hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-[#27272A] transition-all"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-[#71717A] dark:text-[#A1A1AA]">
                {getInitials(displayNameValue)}
              </span>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </Label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            Click to upload a profile picture
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-[#27272A] dark:text-[#F4F4F5]">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="How should we call you?"
            className="border-[#E4E4E7] dark:border-[#3F3F46] focus-visible:ring-[#E07A5F]"
            {...register("displayName")}
          />
          {errors.displayName && (
            <p className="text-xs text-[#E63946]">{errors.displayName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-[#27272A] dark:text-[#F4F4F5]">Bio (Optional)</Label>
          <Input
            id="bio"
            type="text"
            placeholder="A short bio about yourself"
            className="border-[#E4E4E7] dark:border-[#3F3F46] focus-visible:ring-[#E07A5F]"
            {...register("bio")}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#E07A5F] hover:bg-[#c96c53] text-white transition-colors duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
