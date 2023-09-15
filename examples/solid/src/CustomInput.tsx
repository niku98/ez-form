interface CustomInputProps {
	value?: string;
	onChange?: (value: string) => void;
}

export default function CustomInput(props: CustomInputProps) {
	return (
		<input
			value={props.value}
			onInput={(e) => props.onChange?.(e.target.value)}
		/>
	);
}
