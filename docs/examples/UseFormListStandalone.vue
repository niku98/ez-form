<template>
	<div class="example-box">
		<div class="ez-form">
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

			<div class="ez-form-item ez-form-list">
				<label>Username</label>
				<div class="ez-form-item-input">
					<div
						v-for="field in formList.fields.value"
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

						<button
							type="button"
							class="danger"
							@click="formList.remove(field.index)"
						>
							Remove address
						</button>
					</div>

					<button type="button" @click="formList.add()">Add address</button>
				</div>
			</div>
			<div :style="{ display: 'flex', gap: '0.5rem' }">
				<button type="button" @click="handleSubmit()">Submit</button>
				<button type="button" @click="handleReset()">Reset</button>
				<button type="button" class="danger" @click="formList.pop()">
					Remove last address
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { EzFormItem, useForm, useFormList } from "../../src";

const form = useForm();
const formList = useFormList({
	name: "user.addresses",
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
