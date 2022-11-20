<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit">
			<EzFormItem label="Username" name="username">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="Password" name="password">
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<button type="submit">Submit</button>
		</EzForm>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem } from "../../src";

function handleSubmit(values: any) {
	console.log(values); // {username: "tester", password: "123456"}
}
</script>
