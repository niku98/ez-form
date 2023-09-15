<template>
	<Form>
		<form v-bind="form.getFormProps()">
			<Field name="username">
				<input data-testid="usernameInput" />
			</Field>
			<Field name="password" :validationSchema="passwordValidationSchema">
				<input data-testid="passwordInput" type="password" />
				<FieldErrors v-slot="{ errors }">
					<span data-testid="passwordErrors">
						<template
							v-for="message in errors.flatMap(({ messages }) => messages)"
							>{{ message }}</template
						>
					</span>
				</FieldErrors>
			</Field>
			<Field
				name="confirmPassword"
				:validationSchema="confirmPasswordValidationSchema"
			>
				<input data-testid="confirmPasswordInput" type="password" />
				<FieldErrors v-slot="{ errors }">
					<span data-testid="confirmPasswordErrors">
						<template
							v-for="message in errors.flatMap(({ messages }) => messages)"
							>{{ message }}</template
						>
					</span>
				</FieldErrors>
			</Field>
			<Field name="address.lineOne">
				<input data-testid="addressLineOneInput" type="address" />
			</Field>
			<Field name="address.lineTwo">
				<input data-testid="addressLineTwoInput" type="address" />
			</Field>
			<ObserveField name="username" v-slot="{ value }">
				<span data-testid="observeUsername">{{ value }}</span>
			</ObserveField>
			<Observe v-slot="{ values }">
				<span data-testid="observeForm">{{ values }}</span>
			</Observe>
		</form>
	</Form>
</template>

<script lang="ts" setup>
import type { FieldValidationSchema } from "@niku/ez-form-core";
import { EzFieldErrors as FieldErrors, useForm } from "src/index";
export interface RegisterForm {
	username: string;
	password: string;
	confirmPassword: string;
	address: {
		lineOne: string;
		lineTwo: string;
	};
}

const props = defineProps<{
	initialValues?: RegisterForm;
	passwordValidationSchema?: FieldValidationSchema;
	confirmPasswordValidationSchema?: FieldValidationSchema;
}>();

const form = useForm<RegisterForm>({
	initialValues: props.initialValues,
});

const { Form, Field, ObserveField, Observe } = form;
</script>
