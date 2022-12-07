<template>
	<div class="example-box">
		<EzForm @submit="handleSubmit" @error="handleError">
			<EzFormItem
				label="Username"
				name="user.username"
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

			<EzFormList
				label="Addresses"
				name="user.addresses"
				v-slot="{ fields, add, remove }"
			>
				<div
					v-for="field in fields"
					:key="field.key"
					style="margin-bottom: 1rem"
				>
					<h4>Address {{ field.index + 1 }}</h4>
					<EzFormItem
						label="Detail"
						:name="field.getNamePath('detail')"
						:rules="[{ required: true }]"
					>
						<input />
					</EzFormItem>
					<EzFormItem
						label="District"
						:name="field.getNamePath('district')"
						:rules="[{ required: true }]"
					>
						<select>
							<option value="d-1">District 1</option>
							<option value="d-2">District 2</option>
							<option value="d-3">District 3</option>
							<option value="d-4">District 4</option>
							<option value="d-5">District 5</option>
						</select>
					</EzFormItem>

					<button type="button" class="danger" @click="remove(field.index)">
						Remove address
					</button>
				</div>

				<button type="button" @click="add()">Add address</button>
			</EzFormList>
			<button type="submit">Submit</button>
		</EzForm>
		<p>Click submit then check console tab in devtool.</p>
	</div>
</template>

<script lang="ts" setup>
import { EzForm, EzFormItem, EzFormList } from "../../src";

function handleSubmit(values: any) {
	console.log(values); // {username: "tester", password: "123456"}
}

function handleError(errors) {
	console.log(errors); // List of errors of fields
}
</script>
