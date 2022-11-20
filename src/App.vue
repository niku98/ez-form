<template>
	<img alt="Vue logo" src="/logo.png" />
	<EzForm :form="form">
		<EzFormItem label="Test" name="test[0].title" validate-first no-style>
			<input />
		</EzFormItem>
		<EzFormItem
			label="First name"
			name="firstName"
			:rules="[{ required: true }]"
		>
			<input />
		</EzFormItem>

		<EzFormList
			label="Users"
			name="users"
			:default-value="defaultList"
			v-slot="{ namePaths, add }"
		>
			<div v-for="(namePath, index) in namePaths" :key="index">
				<EzFormItem
					label="Display name"
					:name="[...namePath, 'displayName']"
					:rules="[{ required: true }]"
				>
					<input />
				</EzFormItem>
				<EzFormItem
					label="Age"
					:name="[...namePath, 'age']"
					:rules="[{ required: true }]"
				>
					<input type="number" />
				</EzFormItem>
			</div>

			<button type="button" @click="add()">Add new user</button>
		</EzFormList>
		<input
			:value="formItem.meta.transformedValue"
			@input="formItem.handleChange"
		/>
		<br />
		<br />
		<button type="button" @click="useFormSubmit">Submit</button>
		<button type="reset">Reset</button>
	</EzForm>
</template>

<script lang="ts" setup>
import EzForm from "@/components/EzForm.vue";
import EzFormItem from "@/components/EzFormItem.vue";
import EzFormList from "@/components/EzFormList.vue";
import { useForm, useFormItem } from "@/composables";
import { watch } from "vue";

const defaultList = new Array(2).fill({ displayName: "test", age: 20 });
const form = useForm();
const formItem = useFormItem({
	name: "test_field",
	rules: [{ required: true }],
});

formItem.registerFormField(form);
watch(
	() => formItem.meta.rawValue,
	() => {
		console.log(formItem.meta.rawValue);
	}
);

function useFormSubmit() {
	form
		.submit(
			(values) => {
				console.log("useForm submit", values);
			},
			(errors) => {
				console.log("useForm error", errors);
			}
		)
		.then((values) => {
			console.log("Promise values", values);
		});
}

function handleSubmit(values: any) {
	console.log(values);
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
