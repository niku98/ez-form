<template>
	<div class="example-box">
		<AntForm :layout="layout" @submit="handleSubmit" @reset="handleReset">
			<AntFormItem label="Username" name="username">
				<a-input />
			</AntFormItem>
			<AntFormItem label="Password" name="password">
				<a-input-password />
			</AntFormItem>

			<a-space>
				<a-button html-type="submit" type="primary"> Submit </a-button>
				<a-button html-type="reset" type="default"> Reset </a-button>
				<a-button
					html-type="button"
					type="primary"
					@click="toggleLayout()"
					danger
				>
					Toggle layout
				</a-button>
			</a-space>
		</AntForm>
	</div>
</template>

<script lang="ts" setup>
import {
	Button as AButton,
	Input as AInput,
	InputPassword as AInputPassword,
	Space as ASpace,
} from "ant-design-vue";
import { ref } from "vue";
import AntForm from "./AntForm.vue";
import AntFormItem from "./AntFormItem.vue";

const handleSubmit = (values: any) => {
	console.log("Form submit", values);
};

const handleReset = () => {
	console.log("Form reset");
};

// Toggle layout
const layout = ref<"vertical" | "horizontal">("vertical");

function toggleLayout() {
	layout.value = layout.value === "horizontal" ? "vertical" : "horizontal";
}
</script>

<style lang="css">
@import "ant-design-vue/es/grid/style/index.css";
@import "ant-design-vue/es/input/style/index.css";
@import "ant-design-vue/es/form/style/index.css";
@import "ant-design-vue/es/form/style/index.css";
@import "ant-design-vue/es/button/style/index.css";
@import "ant-design-vue/es/space/style/index.css";

.dark .ant-form-item-label > label,
.dark .ant-input-password-icon {
	color: white;
}

.dark .ant-input {
	background-color: transparent;
	color: white;
}

.dark .ant-input-affix-wrapper {
	background-color: transparent;
	color: white;
}
</style>
