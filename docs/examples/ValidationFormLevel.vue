<template>
	<div class="example-box">
		<EzForm
			:rules="{
				'user.username': [{ type: 'string', min: 3 }],
				'user.firstName': { type: 'string', min: 3 },
			}"
			@submit="handleSubmit"
			@error="handleError"
		>
			<EzFormItem
				label="Username"
				:name="['user', 'username']"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter Username" />
			</EzFormItem>
			<EzFormItem
				label="First name"
				name="user.firstName"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter your First name" />
			</EzFormItem>
			<EzFormItem
				label="First name"
				name="user.lastName"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter your Last name" />
			</EzFormItem>
			<EzFormItem
				label="Password"
				name="user.password"
				:rules="[{ required: true }]"
			>
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<button type="submit">Submit</button>
		</EzForm>
		<p>Fill form and submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem } from "../../src";

function handleSubmit(values: any) {
	console.log(values); // {user: {username: "tester", firstName: "Johnny", lastName: "Pham", password: "123456"}}
}

function handleError(errors) {
	console.log(errors); // List of errors of fields
}
</script>
