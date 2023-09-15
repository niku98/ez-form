/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import type { FieldInstance, FormInstance } from "@niku/ez-form-core";
import {
	Children,
	Fragment,
	cloneElement,
	isValidElement,
	useMemo,
	type ReactNode,
} from "react";
import useFieldContext from "src/hooks/useFieldContext";
import { useFormContext } from "src/index";

export type BindingFieldInputProps = {
	children?:
		| ReactNode
		| ((helpers: {
				form: FormInstance<any>;
				field: FieldInstance<any, any>;
		  }) => ReactNode);
	inputIndex?: number;
};

export default function BindingFieldInput({
	children,
	inputIndex = 0,
}: BindingFieldInputProps) {
	const form = useFormContext();
	const field = useFieldContext();
	field.useFieldValue();

	const childNodes = useMemo(
		() =>
			Children.toArray(
				typeof children === "function" ? children({ field, form }) : children
			),
		[children, form, field]
	);

	return (
		<>
			{childNodes.map((node, index) => {
				return (
					<Fragment key={index}>
						{index !== inputIndex
							? node
							: isValidElement(node)
							? cloneElement(node, field.getInputProps(node))
							: node}
					</Fragment>
				);
			})}
		</>
	);
}

BindingFieldInput.displayName = "BindingFieldInput";
