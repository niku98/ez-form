<template>
	<img alt="Vue logo" src="/logo.png" />
	<h3>Form 1</h3>
	<EzForm
		:form="form"
		name="form-1"
		:initial-values="{ firstName: 'abc', firstName_2: 'def' }"
		@submit="handleSubmit"
	>
		<EzFormItem
			label="First name"
			name="firstName"
			:rules="[{ required: true }]"
		>
			<input />
		</EzFormItem>
		<EzFormItem
			label="First name 2"
			name="firstName_2"
			:rules="[{ required: true }]"
		>
			<input />
		</EzFormItem>

		<EzFormList
			label="Users"
			name="users"
			:default-value="defaultList"
			v-slot="{ fields, remove, add }"
		>
			<div v-for="(field, index) in fields" :key="field.key">
				<EzFormItem
					label="Display name"
					:name="field.getNamePath('displayName')"
					:rules="[{ required: true }]"
				>
					<input />
				</EzFormItem>
				<EzFormItem
					label="Age"
					:name="field.getNamePath('age')"
					:rules="[{ required: true }]"
				>
					<input type="number" />
				</EzFormItem>

				<button type="button" @click="remove(index)">Remove item</button>
			</div>

			<button type="button" @click="add()">Add new user</button>
		</EzFormList>
		<br />
		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
		<!-- <button type="button" @click="formItem.clearValidate">
			Test form item
		</button> -->
	</EzForm>

	<h3>Form 2</h3>
	<EzForm
		:form="form2"
		name="form-2"
		:initial-values="{ firstName: 'abc', firstName_2: 'def' }"
		@submit="handleSubmit"
	>
		<EzFormItem
			label="First name"
			name="firstName"
			:rules="[{ required: true }]"
		>
			<input />
		</EzFormItem>
		<EzFormItem
			:form-item="formItem"
			label="First name 2"
			name="firstName_2"
			:rules="[{ required: true }]"
		>
			<input />
		</EzFormItem>

		<EzFormList
			label="Users"
			name="users"
			:default-value="defaultList"
			v-slot="{ fields, remove, add }"
		>
			<div v-for="(field, index) in fields" :key="field.key">
				<EzFormItem
					label="Display name"
					:name="field.getNamePath('displayName')"
					:rules="[{ required: true }]"
				>
					<input />
				</EzFormItem>
				<EzFormItem
					label="Age"
					:name="field.getNamePath('age')"
					:rules="[{ required: true }]"
				>
					<input type="number" />
				</EzFormItem>

				<button type="button" @click="remove(index)">Remove item</button>
			</div>

			<button type="button" @click="add()">Add new user</button>
		</EzFormList>
		<br />
		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
		<button type="button" @click="foo">Test form item</button>
	</EzForm>
</template>

<script lang="ts" setup>
import { getFormListInstance, useForm, useFormItem } from "@niku/ez-form";

const defaultList = new Array(2).fill({ displayName: "test", age: 20 });

function handleSubmit(values: any) {
	console.log(values);
}

const form = useForm();

const form2 = useForm();

// const formList = useFormList({});

const formItem = useFormItem();

const form2Computed = getFormListInstance("form-2", "users", true);

function foo() {
	form2Computed.value?.add();
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
