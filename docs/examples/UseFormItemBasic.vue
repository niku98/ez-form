<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit" @reset="handleReset">
			<EzFormItem
				:formItem="formItem"
				label="Username"
				name="username"
				:rules="[{ required: true }]"
			>
				<input placeholder="Enter Username" />
				<span
					@click="formItem.validate()"
					:style="{
						display: 'inline-block',
						marginLeft: '10px',
						cursor: 'pointer',
					}"
					>Validate</span
				>
			</EzFormItem>
			<EzFormItem label="Password" name="password">
				<input placeholder="Password" type="password" />
			</EzFormItem>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="submit">Submit</button>
				<button type="reset">Reset</button>
			</div>
		</EzForm>
		<p>Try click validate.</p>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem, useFormItem } from "../../src";

const formItem = useFormItem();

function handleSubmit(values) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleReset() {
	console.log("Form reset");
}
</script>
