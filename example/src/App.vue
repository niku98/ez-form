<template>
	<EzForm @submit="handleSubmit">
		<EzFormItem label="Test" name="test" validate-first no-style>
			<input />
		</EzFormItem>
		<EzFormItem label="First name" :rules="[{ required: true }]">
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
		<button type="submit">Submit</button>
	</EzForm>
</template>

<script lang="ts" setup>
import { EzForm } from "@niku/ez-form";

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
