<template>
	<div class="example-box">
		<EzForm :form="form" @submit="handleSubmit" @reset="handleReset">
			<EzFormItem label="Username" name="username">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Password" name="password">
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="button" @click="form.submit()">Submit</button>
				<button type="button" @click="form.reset()">Reset</button>
			</div>
		</EzForm>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem, useForm } from "../../src";

const form = useForm();

function handleSubmit(values) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}
</script>
