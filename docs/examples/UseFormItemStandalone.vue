<template>
	<div class="example-box">
		<div class="ez-form">
			<div class="ez-form-item">
				<label>Username</label>
				<div class="ez-form-item-input">
					<input
						:value="formItem.value"
						placeholder="Enter Username"
						@input="formItem.handleChange"
						@blur="formItem.handleBlur"
					/>
				</div>
			</div>
			<EzFormItem label="Password" name="password">
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="button" @click="handleSubmit()">Submit</button>
				<button type="button" @click="handleReset()">Reset</button>
			</div>
		</div>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { EzFormItem, useForm, useFormItem } from "../../src";

const form = useForm();
const formItem = useFormItem({
	name: "username",
});

function handleSubmit() {
	form.submit().then(({ values, errors }) => {
		if (!errors) {
			console.log("Form values", values);
		} else {
			console.log("Form errors", errors);
		}
	});
}

function handleReset() {
	form.reset();
	console.log("Form reset");
}
</script>
