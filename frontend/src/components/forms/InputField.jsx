const InputField = ({
	label,
	type = "text",
	value,
	onChange,
	placeholder = "",
	required = true,
	className = "",
}) => {
	return (
		<div className="flex flex-col space-y-1">
			{label && (
				<label className="text-sm font-medium text-gray-700">{label}</label>
			)}
			<input
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm 
          focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
          ${className}`}
			/>
		</div>
	);
};

export default InputField;
