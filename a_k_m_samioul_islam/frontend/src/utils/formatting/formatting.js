export const formatCurrency = (
	value,
	currency = "BDT",
) => `${Number(value || 0)} ${currency}`;

export const formatDate = (value) =>
	new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		timeZone: "Asia/Dhaka"
	}).format(new Date(value));

export const formatName = (name) => {
	if (!name) 
		return "";
	return name
		.split(/([ .])/g)
		.map((part) => {
			if (part === " " || part === ".") return part;
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join("");
};
