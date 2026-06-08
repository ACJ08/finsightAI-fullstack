import React from "react";

export const Button = ({
	children,
	variant = "default",
	size = "md",
	className = "",
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:cursor-pointer";

	const variantStyles = {
		default: "bg-blue-600 text-white hover:bg-blue-700",
		outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100",
		rerun:
			"border border-purple-300 text-purple-700 bg-white hover:bg-purple-100",
		delete: "border border-red-300 text-red-700 bg-white hover:bg-red-100",
		ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
		secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
	};

	const sizeStyles = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-5 py-2.5 text-lg",
	};

	const combinedClassName = [
		baseStyles,
		variantStyles[variant] || variantStyles.default,
		sizeStyles[size] || sizeStyles.md,
		className,
	].join(" ");

	return (
		<button className={combinedClassName} {...props}>
			{children}
		</button>
	);
};

export default Button;
