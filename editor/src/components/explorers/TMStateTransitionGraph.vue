<template>
	<div v-show="!isVisLoading" class="h-full" ref="outputRef" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { useRouter } from "vue-router";
import useVisNetwork from "../../utils/useVisNetwork";

export default defineComponent({
	name: "TMStateTransitionGraph",
	props: {
		name: { type: String as PropType<string> },
		// getGraph: { type: Function as PropType<Function>, required: true },
	},
	setup() {
		const outputRef = ref<HTMLElement | null>(null);
		const canvasRef = ref<HTMLCanvasElement | null>(null);
		const [isVisLoading, networkLib, dataLib] = useVisNetwork();
		const router = useRouter();
		return { outputRef, isVisLoading };
	},
});
</script>
