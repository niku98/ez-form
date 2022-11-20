<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit">
			<EzFormItem label="Username" :name="['user', 'username']">
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem label="First name" :name="['user', 'firstName']">
				<input placeholder="Enter your First name" />
			</EzFormItem>
			<EzFormItem label="First name" :name="['user', 'lastName']">
				<input placeholder="Enter your Last name" />
			</EzFormItem>
			<EzFormItem label="Password" :name="['user', 'password']">
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
	console.log(values); // {user: {username: "tester", firstName: "Johnny", lastName: "Pham", password: "123456"}}
}
</script>
