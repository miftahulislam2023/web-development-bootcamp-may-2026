import { Profile } from "@/types/user";
import { Key, Mail, User } from "lucide-react";
import InputField from "./ui/InputField";
import FormCancelBtn from "./ui/FormCancelBtn";
import FormSaveBtn from "./ui/FormSaveBtn";
import InputColorField from "./ui/InputColorField";

type Props = {
    isEditing: boolean;
    isSaving: boolean;
    register: any;
    handleSubmit: any;
    setIsEditing: (value: boolean) => void;
    errors: any;
    submitProfile: (data: Profile) => void;
}

const ProfileForm = ({ isEditing, isSaving, register, handleSubmit, setIsEditing, errors, submitProfile }: Props) => {
    return (
        <form onSubmit={handleSubmit(submitProfile)}>
            <div className="p-6 space-y-6">

                <div className="space-y-4">
                    <InputField
                        id="name"
                        label="Name"
                        icon={<User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
                        register={register("name", { required: "Name is required" })}
                        error={errors.name}
                        isEditing={isEditing}
                    />

                    <InputField
                        id="email"
                        label="Email"
                        icon={<Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
                        register={register("email", { required: "Email is required" })}
                        error={errors.email}
                        isEditing={isEditing}
                    />

                    <InputColorField
                        register={register("color", { required: "Color is required" })}
                        isEditing={isEditing}
                        error={errors.color}
                    />
                </div>

                {isEditing && (
                    <>
                        <div className="flex items-center justify-between">
                            <div className="grow border-b border-slate-300"></div>
                            <p className="text-slate-600 px-4">Or change password</p>
                            <div className="grow border-b border-slate-300"></div>
                        </div>

                        <div className="space-y-4">
                            <InputField
                                id="currentPassword"
                                label="Current Password"
                                placeholder="Your current password"
                                type="password"
                                icon={<Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
                                register={register("currentPassword")}
                                error={errors.currentPassword}
                                isEditing={isEditing}
                            />

                            <InputField
                                id="newPassword"
                                label="New Password"
                                placeholder="Enter new password"
                                type="password"
                                icon={<Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
                                register={register("newPassword")}
                                error={errors.newPassword}
                                isEditing={isEditing}
                            />

                            <InputField
                                id="confirmNewPassword"
                                label="Confirm New Password"
                                placeholder="Confirm new password"
                                type="password"
                                icon={<Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
                                register={register("confirmNewPassword")}
                                error={errors.confirmNewPassword}
                                isEditing={isEditing}
                            />

                        </div>
                    </>
                )}

            </div>
            {isEditing && (
                <div className="flex gap-3 pt-4">
                    <FormCancelBtn onClick={() => setIsEditing(false)} />
                    <FormSaveBtn isSaving={isSaving} />
                </div>
            )}
        </form>
    )
}

export default ProfileForm