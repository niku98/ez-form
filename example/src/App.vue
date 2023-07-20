<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Test" name="test" validate-first no-style>
			<Input />
			<Select>
				<SelectOption value="1">Test</SelectOption>
				<SelectOption value="2">Test 2</SelectOption>
				<SelectOption value="3">Test 3</SelectOption>
				<SelectOption value="4">Test 4</SelectOption>
			</Select>
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
			v-slot="{ fields, add }"
		>
			<div v-for="field in fields" :key="field.key">
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
			</div>
			<button type="button" @click="add()">Add new user</button>
		</EzFormList>
		<button type="submit">Submit</button>
	</EzForm>
</template>

<script lang="ts" setup>
import { EzForm } from "@niku/ez-form";
import { Input, Select, SelectOption } from "ant-design-vue";

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

function handleSubmit(values: any) {
	console.log(values);
}

const defaultList = new Array(200).fill({ displayName: "test", age: 20 });
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
