<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit">
			<EzFormItem label="Username" :name="['user.fullName']">
				<input placeholder="Enter Username" />
			</EzFormItem>

			<button type="submit">Submit</button>
		</EzForm>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem } from "../../src";

function handleSubmit(values: any) {
	console.log(values); // {"user.fullName": "Johnny Pham"}
}
</script>
