<template>
	<div
		class="example-box"
		style="display: grid; grid-template-columns: repeat(2, 1fr)"
	>
		<div>
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
		<div>
			<EzForm :form="form2" @submit="handleSubmit2" @reset="handleReset2">
				<EzFormItem label="Username" name="username">
					<input placeholder="Enter Username" />
				</EzFormItem>
				<EzFormItem label="Password" name="password">
					<input placeholder="Password" type="password" />
				</EzFormItem>
				<div :style="{ display: 'flex', gap: '0.5rem' }">
					<button type="button" @click="form2.submit()">Submit</button>
					<button type="button" @click="form2.reset()">Reset</button>
				</div>
			</EzForm>
			<p>Click submit then check console tab in devtool.</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem, useForm } from "../../src";

const form = useForm();
const form2 = useForm();

function handleSubmit(values) {
	console.log("Form 1 submit", values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}

function handleSubmit2(values) {
	console.log("Form 2 submit", values); // {username: "tester", password: "123456"}
}

function handleReset2() {
	console.log("Form 2 reset");
}
</script>
