<template>
	<Form>
		<div>
			<div v-for="field in fieldsInfo" :key="field.key">
				<Field :index="field.index" name="username">
					<EzBindingFieldInput>
						<input :data-testid="`users.username.${field.index}`" />
					</EzBindingFieldInput>
				</Field>
				<Field :index="field.index" name="password">
					<EzBindingFieldInput>
						<input :data-testid="`users.password.${field.index}`" />
					</EzBindingFieldInput>
				</Field>
			</div>

			<p data-testid="users_length">
				{{ fieldsInfo.length }}
			</p>

			<button data-testid="action_btn" @click="doAction">Action</button>
		</div>
	</Form>
</template>
<script lang="ts" setup>
import { useForm } from "@niku/ez-form-vue";

export interface User {
	username: string;
	password: string;
}

export interface UsersForm {
	users: User[];
}

const formData: UsersForm = {
	users: Array(10)
		.fill(0)
		.map((_, index) => {
			return {
				username: `user_${index + 1}`,
				password: "secret_password_" + (index + 1),
			};
		}),
};

const { Form, useFieldArray } = useForm({ initialValues: formData });
const fieldArray = useFieldArray({ name: "users" });
const { Field } = fieldArray;
const fieldsInfo = fieldArray.useFieldsInfo();

function doAction() {
	fieldArray.move(0, 9);
}
</script>
