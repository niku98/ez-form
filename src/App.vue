<template>
	<img alt="Vue logo" src="./assets/logo.png" />
	<SmartForm @submit="handleSubmit">
		<FormItem
			label="Test"
			name="test"
			:rules="[
				{ required: true },
				{ type: 'string', pattern: /test/ },
				{ pattern: /abc/ },
			]"
			validate-first
			no-style
		>
			<input />
		</FormItem>
		<FormItem label="First name" name="firstName" :rules="[{ required: true }]">
			<input />
		</FormItem>

		<FormList
			label="Users"
			name="users"
			:default-value="defaultList"
			v-slot="{ namePaths, add }"
		>
			<div :style="{ maxHeight: '500px', overflow: 'auto' }">
				<div v-for="(namePath, index) in namePaths" :key="index">
					<FormItem
						label="Display name"
						:name="[...namePath, 'displayName']"
						:rules="[{ required: true }]"
					>
						<input />
					</FormItem>
					<FormItem
						label="Age"
						:name="[...namePath, 'age']"
						:rules="[{ required: true }]"
					>
						<input type="number" />
					</FormItem>
				</div>
			</div>
			<button type="button" @click="add()">Add new user</button>
		</FormList>
		<button type="submit">Submit</button>
	</SmartForm>
</template>

<script lang="ts" setup>
import FormItem from "@/components/FormItem.vue";
import FormList from "@/components/FormList.vue";
import SmartForm from "./components/Form.vue";

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
