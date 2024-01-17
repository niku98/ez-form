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

			<button data-testid="action_btn" @click="emit('actionClick', fieldArray)">
				Add user
			</button>
		</div>
	</Form>
</template>
<script lang="ts" setup>
import {
	EzBindingFieldInput,
	useForm,
	type FieldArrayInstance,
} from "src/index";

export interface User {
	username: string;
	password: string;
}

export interface UsersForm {
	users: User[];
}

const props = defineProps<{
	initialValues: UsersForm;
}>();

const emit = defineEmits<{
	actionClick: [fieldArray: FieldArrayInstance<User[], UsersForm>];
}>();

const { Form, useFieldArray } = useForm({ initialValues: props.initialValues });
const fieldArray = useFieldArray({ name: "users" });
const { Field } = fieldArray;
const fieldsInfo = fieldArray.useFieldsInfo();
</script>
