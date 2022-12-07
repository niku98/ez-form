<template>
	<slot :errors="errors"> </slot>
</template>

<script lang="ts" setup>
import useFormErrors from "@/composables/useFormErrors";
import { NamePath } from "@/models";
import { toRef } from "vue";

const props = defineProps<{
	name?: NamePath;
}>();

const errors = useFormErrors(toRef(props, "name"));
</script>
