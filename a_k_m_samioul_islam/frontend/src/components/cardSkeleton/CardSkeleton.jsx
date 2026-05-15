import React from "react";

const CardSkeleton = ({ variant = "list", lines = 3, i = 0 }) => {
	// For statistics card

	if (variant === "stat")
		return (
			<div className="w-full min-w-0 p-5 rounded-lg shadow-lg flex flex-col gap-2 box-border border border-gray-100 animate-pulse">
				<div className="flex gap-2 items-center">
					<div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0"></div>
					<div className="h-4 w-28 bg-gray-200 rounded"></div>
				</div>

				<div className="h-8 w-16 bg-gray-300 rounded"></div>
			</div>
		);

	if (variant === "chart")
		return (
			<div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-5 min-h-[240px] animate-pulse">
				<div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
				<div className="h-[170px] w-full bg-gray-100 rounded-xl"></div>
			</div>
		);

	if (variant === "budget")
		return (
			<div className="w-full flex flex-col gap-5 animate-pulse">
				<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
					<div className="flex flex-col gap-2">
						<div className="h-6 w-40 rounded bg-gray-300"></div>
						<div className="h-4 w-56 rounded bg-gray-200"></div>
					</div>

					<div className="h-9 w-28 rounded-full bg-gray-200"></div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="h-3 w-28 rounded bg-gray-200"></div>
						<div className="mt-4 h-8 w-24 rounded bg-gray-300"></div>
					</div>

					<div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="h-3 w-16 rounded bg-gray-200"></div>
						<div className="mt-4 h-8 w-20 rounded bg-gray-300"></div>
					</div>

					<div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="h-3 w-24 rounded bg-gray-200"></div>
						<div className="mt-4 h-8 w-24 rounded bg-gray-300"></div>
					</div>
				</div>

				<div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
					<div className="mb-4 flex items-center justify-between">
						<div className="h-4 w-28 rounded bg-gray-200"></div>
						<div className="h-4 w-10 rounded bg-gray-300"></div>
					</div>

					<div className="h-3 w-full rounded-full bg-gray-100">
						<div className="h-full w-1/3 rounded-full bg-gray-300"></div>
					</div>

					<div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
						<div className="h-4 w-56 rounded bg-gray-200"></div>
						<div className="h-4 w-40 rounded bg-gray-200"></div>
					</div>
				</div>
			</div>
		);

	if (variant === "ai")
		return (
			<div className="w-full mb-5 animate-pulse">
				<div className="bg-white border border-base-300 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div className="h-6 w-3/4 rounded bg-gray-200"></div>
						<div className="h-5 w-5 rounded bg-gray-200"></div>
					</div>
				</div>
			</div>
		);

	// For cards inside a container

	return (
		<div className="w-full p-5 rounded-lg border border-gray-200 animate-pulse space-y-3">
			<div className="h-5 bg-gray-300 rounded w-1/2"></div>
			{Array.from({ length: lines }).map((_, i) => (
				<div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
			))}
		</div>
	);
};

export default CardSkeleton;
