<template>
	<div class="example-box">
		<EzForm
			:initial-values="initialValues"
			@submit="handleSubmit"
			enableReinitialize
		>
			<EzFormItem label="Username" name="username" :rules="{ required: true }">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Display name" name="name" :rules="{ required: true }">
				<input placeholder="Enter Display name" />
			</EzFormItem>

			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="submit">Submit</button>
				<button type="button" @click="fetchUser()">Fetch user</button>
			</div>
		</EzForm>
		<div v-if="loading">Loading...</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { EzForm, EzFormItem } from "../../src";

export interface UserRequest {
	username: string;
	name: string;
}

const initialValues = reactive<UserRequest>({
	username: "",
	name: "",
});

const loading = ref(false);

function fetchUser() {
	loading.value = true;
	fetch("https://jsonplaceholder.typicode.com/users/1")
		.then((res) => res.json())
		.then((data) => {
			Object.assign(initialValues, data);
			loading.value = false;
		});
}

function handleSubmit(values: UserRequest) {
	console.log(values); // {username: "tester", displayName: "Tester"}
}
</script>
