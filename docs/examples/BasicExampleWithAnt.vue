<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit">
			<EzFormItem label="Username" name="username">
				<a-input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Display name" name="displayName">
				<a-input placeholder="Enter Display name" />
			</EzFormItem>
			<button type="submit">Submit</button>
		</EzForm>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { Input as AInput } from "ant-design-vue";
import { EzForm, EzFormItem } from "../../src";

export interface User {
	username: string;
	displayName: string;
}

function handleSubmit(values: User) {
	console.log(values); // {username: "test_user", displayName: "Tester"}
}
</script>

<style lang="css" scoped>
@import "ant-design-vue/es/input/style/index.css";

.dark .ant-input {
	background-color: transparent;
}
</style>
