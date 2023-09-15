<template>
	<Form>
		<form v-bind="form.getFormProps()">
			<div>
				<Observe v-slot="{ values }" :selector="(values) => values">{{
					values
				}}</Observe>
			</div>

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
					{{ errors }}
					<span data-testid="passwordErrors">
						<template
							v-for="message in errors.flatMap(({ messages }) => messages)"
							>{{ message }}</template
						>
					</span>
				</FieldErrors>
			</Field>

			<div>
				<AddressField
					v-for="(field, index) in fields"
					:key="index"
					:index="field.index"
					name="city"
				>
					<input />
				</AddressField>
				<button @click="addressField.push({ city: '' })">Push</button>
				<button @click="addressField.replace(0, { city: 'abc' })">
					Replace
				</button>
				<button @click="addressField.swap(0, 1)">Replace</button>
			</div>
		</form>
	</Form>
</template>

<script lang="ts" setup>
import {
	EzFieldErrors as FieldErrors,
	useForm,
	type FieldValidationSchema,
	type ValidationSchema,
} from "@niku/ez-form-vue";
import { watchEffect } from "vue";

export interface LoginForm {
	username: string;
	password: number;
	addresses: { city: string }[];
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
const { Form, Field, Observe, useFieldArray } = form;
const addressField = useFieldArray({ name: "addresses" });
const { Field: AddressField, useFieldsInfo } = addressField;
const fields = useFieldsInfo();

watchEffect(() => {
	console.log(fields.value);
});
</script>
