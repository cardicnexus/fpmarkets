// Format currency for Philippines (PHP)
export const naira = (n: number | string) =>
	new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		maximumFractionDigits: 2,
	}).format(Number(n || 0));
