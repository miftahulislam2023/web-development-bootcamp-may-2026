import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { formatName } from "../../utils/formatting/formatting";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoCameraOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axiosSecure from "../../utils/axios/axioshelper";

// Edit profile validation

const editSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	currency: z
		.string()
		.min(3, "Currency must be at least 3 characters")
		.max(6, "Currency must be less than or equal 6 characters"),
	photo: z
		.any()
		.optional()
		.refine(
			(files) => !files?.length || files?.[0]?.size <= 2 * 1024 * 1024,
			"Max photo size is 2MB",
		)
		.refine(
			(files) =>
				!files?.length ||
				["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
					files?.[0]?.type,
				),
			"Only jpg, png or webp allowed",
		),
});

const MyProfile = () => {
	const { userData, setUserData, passwordReset, updateUser } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm({
		resolver: zodResolver(editSchema),

		defaultValues: {
			name: userData?.name || "",
			currency: userData?.currency || "",
		},
	});

	const [loading, setLoading] = useState(false);

	const modalRef = useRef(null);
	const resetPasswordRef = useRef(null);

	// Profile update related

	const handleOpenUpdateModal = () => {
		reset({
			name: formatName(userData?.name) || "",
			currency: userData?.currency || "",
			photo: undefined
		});
		modalRef.current.showModal();
	};

	const handleCloseUpdateModal = () => {
		modalRef.current.close();
	};

	const handleOpenResetPasswordModal = () => {
		resetPasswordRef.current.showModal();
	};

	const handleCloseResetPasswordModal = () => {
		resetPasswordRef.current.close();
	};

	const handleProfileUpdate = async (data) => {
		try {
			let updatedFields = {};

			if (data.name !== userData?.name) updatedFields.name = data.name;

			if (data.currency !== userData?.currency)
				updatedFields.currency = data.currency;

			// Image upload

			if (data.photo?.[0]) {
				const formData = new FormData();

				formData.append("image", data.photo[0]);

				const res = await fetch(
					`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
					{
						method: "POST",
						body: formData,
					},
				);

				const imgData = await res.json();

				if (!imgData.success) {
					toast.error("Image upload failed");
					return;
				}

				updatedFields.photoURL = imgData.data.url;
			}

			if (Object.keys(updatedFields).length === 0) {
				handleCloseUpdateModal();
				toast.info("No changes detected");
				return;
			}

			const res = await axiosSecure.patch("/users/me", updatedFields);

			if (!res.data.success) {
				toast.error("Profile update failed");
				return;
			}

			if (updatedFields.name)
				await updateUser({
					displayName: updatedFields.name,
				});

			if (updatedFields.photoURL)
				await updateUser({
					photoURL: updatedFields.photoURL,
				});

			setUserData((prev) => ({
				...prev,
				...updatedFields,
			}));

			handleCloseUpdateModal();

			toast.success("Profile updated successfully");
		} catch (error) {
			// console.log(error.message);
			toast.error("Profile update failed");
		}
	};

	const handleResetPassword = () => {
		passwordReset(userData.email)
			.then(() => {
				handleCloseResetPasswordModal();
				toast.success("Password reset email sent. Check your inbox");
			})
			.catch((error) => {
				handleCloseResetPasswordModal();
				toast.error("Password reset link cannot be sent");
			});
	};

	// console.log(userData);
	return (
		<div className="w-full flex flex-col inter">

			{/* Heading */}

			<div className="flex flex-col items-start gap-2 mb-10">
				<p className="text-4xl font-bold lobster">My Profile</p>
				<p className="text-sm font-medium text-gray-400">
					View and manage your profile information
				</p>
			</div>
			<div className="w-full flex flex-col p-5 shadow-lg rounded-lg gap-5">
				<div className="flex flex-col items-center md:flex-row gap-5 flex-wrap">

					{/* Profile Image */}

					<div className="relative w-32 h-32 rounded-full group cursor-pointer overflow-hidden shadow-md">
						<img
							className="w-32 h-32 rounded-full object-cover"
							src={userData?.photoURL}
							alt={userData?.name}
						/>
					</div>

					<div className="flex flex-col items-center md:items-start gap-2">
						<p className="text-xl md:text-2xl font-bold">
							{formatName(userData?.name)}
						</p>
						<div className="flex gap-10">
							<div className="flex items-center gap-1 text-gray-500 text-sm">
								<MdOutlineEmail /> {userData?.email}
							</div>
						</div>
						<div className="flex items-center gap-1 text-gray-500 text-sm">
							<BsCurrencyDollar /> {userData?.currency}
						</div>
					</div>
					<div className="flex flex-col gap-5 md:ml-auto">
						<button
							className="w-full flex gap-2 rounded-lg items-center justify-center font-medium cursor-pointer text-lg bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500 p-2"
							onClick={handleOpenUpdateModal}
						>
							<FaRegEdit /> Edit Profile
						</button>
						<button
							className="w-full flex gap-2 rounded-lg items-center justify-center font-medium cursor-pointer text-lg bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500 p-2"
							onClick={handleOpenResetPasswordModal}
						>
							<FiLock /> Reset Password
						</button>
					</div>
				</div>
			</div>

			{/* Modal for update */}

			<dialog
				ref={modalRef}
				className="modal modal-bottom sm:modal-middle"
			>
				<div className="modal-box max-w-xl p-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-2xl font-bold graphik">
							Update Profile
						</h3>
						<button
							onClick={handleCloseUpdateModal}
							className="btn btn-sm btn-circle btn-ghost"
						>
							✕
						</button>
					</div>

					<p className="text-sm text-gray-500 mb-6">
						Update your basic profile information below
					</p>

					<form
						onSubmit={handleSubmit(handleProfileUpdate)}
						className="flex flex-col gap-4"
					>
						{/* Name */}

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Full Name
							</label>
							<input
								type="text"
								placeholder="New name"
								{...register("name")}
								className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
							/>
							{errors.name && (
								<p className="text-sm text-red-500">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Currency */}

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Currency
							</label>
							<input
								type="text"
								placeholder="BDT"
								{...register("currency")}
								className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
							/>
							{errors.currency && (
								<p className="text-sm text-red-500">
									{errors.currency.message}
								</p>
							)}
						</div>

						{/* Photo */}

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Photo
							</label>
							<input
								type="file"
								accept="image/*"
								className="file-input file-input-bordered w-full"
								{...register("photo")}
							/>

							{errors.photo && (
								<p className="text-sm text-red-500">
									{errors.photo.message}
								</p>
							)}
						</div>

						{/* Buttons */}
						<div className="flex justify-end gap-3 mt-4">
							<button
								type="button"
								onClick={handleCloseUpdateModal}
								className="btn btn-soft px-5 py-2 rounded-lg w-40"
							>
								Cancel
							</button>

							<button
								disabled={loading}
								type="submit"
								className="w-40 px-5 py-2 rounded-lg cursor-pointer text-center bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<span className="loading loading-dots loading-md"></span>
								) : (
									"Save Changes"
								)}
							</button>
						</div>
					</form>
					<div className="mt-5 text-center">
						<p className="text-xs text-red-500">
							You can update your name, currency and profile
							image
						</p>
					</div>
				</div>
			</dialog>

			{/* Modal for reset password */}

			<dialog
				ref={resetPasswordRef}
				className="modal modal-bottom sm:modal-middle"
			>
				<div className="modal-box">
					<h3 className="font-bold text-lg">Reset Password</h3>

					<p className="py-4 text-gray-600">
						A password reset link will be sent to your email
						address. Are you sure you want to continue?
					</p>

					<div className="modal-action">
						<button
							onClick={handleResetPassword}
							disabled={loading}
							className=" px-5 py-2 rounded-lg cursor-pointer text-center bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
						>
							{loading ? (
								<span className="loading loading-dots loading-sm"></span>
							) : (
								"Yes, Send Link"
							)}
						</button>

						<button
							onClick={handleCloseResetPasswordModal}
							className="btn"
						>
							Cancel
						</button>
					</div>
				</div>
			</dialog>
		</div>
	);
};

export default MyProfile;
