<template>
	<Form>
		<form v-bind="form.getFormProps()">
			<Field name="username">
				<input data-testid="usernameInput" />
				<FieldErrors v-slot="{ errors }">
					<span data-testid="usernameErrors">
						<template
							v-for="message in errors.flatMap(({ messages }) => messages)"
							>{{ message }}</template
						>
					</span>
				</FieldErrors>
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
		</form>
	</Form>
</template>

<script lang="ts" setup>
import {
	EzFieldErrors as FieldErrors,
	useForm,
	type FieldValidationSchema,
	type ValidationSchema,
} from "src/index";
export interface LoginForm {
	username: string;
	password: string;
}

const props = defineProps<{
	initialValues?: LoginForm;
	validationSchema?: ValidationSchema;
	passwordValidationSchema?: FieldValidationSchema;
}>();

const form = useForm<LoginForm>({
	initialValues: props.initialValues,
	validationSchema: props.validationSchema,
});
const { Form, Field } = form;
</script>
