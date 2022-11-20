<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit" @reset="handleReset">
			<EzFormItem label="Username" name="username">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Password" name="password">
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</EzForm>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem } from "../../src";

function handleSubmit(values: any) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}
</script>
