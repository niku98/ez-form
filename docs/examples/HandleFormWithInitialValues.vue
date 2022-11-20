<template>
	<div class="example-box">
		<EzForm :initial-values="initialValues" @submit="handleSubmit">
			<EzFormItem label="Username" name="username" :rules="{ required: true }">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem
				label="Display name"
				name="displayName"
				:rules="{ required: true }"
			>
				<input placeholder="Enter Display name" />
			</EzFormItem>
			<button type="submit">Submit</button>
		</EzForm>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { EzForm, EzFormItem } from "../../src";

export interface UserRequest {
	username: string;
	displayName: string;
}

const initialValues = reactive<UserRequest>({
	username: "tester",
	displayName: "Tester",
});

function handleSubmit(values: UserRequest) {
	console.log(values); // {username: "tester", displayName: "Tester"}
}
</script>
