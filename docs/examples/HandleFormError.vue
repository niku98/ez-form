<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit" @error="handleError">
			<EzFormItem label="Username" name="username" :rules="{ required: true }">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Password" name="password" :rules="{ required: true }">
				<input placeholder="Password" type="password" />
			</EzFormItem>

			<button type="submit">Submit</button>
		</EzForm>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem, ValidateError } from "../../src";

function handleSubmit(values: any) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleError(errors: ValidateError[]) {
	console.log("Form errors", errors);
}
</script>
