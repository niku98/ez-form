<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit">
			<EzFormItem label="Username" name="username">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Display name" name="displayName">
				<input placeholder="Enter Display name" />
			</EzFormItem>
			<button type="submit">Submit</button>
		</EzForm>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem } from "../../src";
export interface User {
	username: string;
	displayName: string;
}

function handleSubmit(values: User) {
	console.log(values); // {username: "test_user", displayName: "Tester"}
}
</script>
