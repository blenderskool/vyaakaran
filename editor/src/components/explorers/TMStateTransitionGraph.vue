<template>
	<div v-show="!isVisLoading" class="h-full" ref="outputRef" />
</template>

<script lang="ts">
import {
	defineComponent,
	onMounted,
	onUnmounted,
	onUpdated,
	PropType,
	ref,
	watch,
} from "vue";
import { edgeConfig, getNodeConfig, tmEdgeConfig } from "../../config/graph";
import { fillBg } from "../../utils/canvas";
import useVisNetwork from "../../utils/useVisNetwork";

export default defineComponent({
	name: "TMStateTransitionGraph",
	props: {
		name: { type: String as PropType<string> },
		getGraph: { required: true },
	},
	setup({ getGraph }) {
		const outputRef = ref<HTMLElement>();
		const canvasRef = ref<HTMLCanvasElement>();
		const [isVisLoading, networkLib, dataLib] = useVisNetwork();

		let network: any;

		const generateVisGraph = () => {
			if (isVisLoading.value) return;

			const graph: any = getGraph;
			const nodes = [
				...Object.keys(graph).map((node) => {
					return node;
				}),
			];

			const edges: any[] = [];
			Object.keys(graph).map((node) => {
				graph[node].map((inst: any) => {
					if (!nodes.includes(inst.nextState)) {
						nodes.push(inst.nextState);
					}

					let i;
					for (i = 0; i < edges.length; ++i) {
						if (
							edges[i].from === node &&
							edges[i].to ===
								(inst.nextState[0] === "*"
									? inst.nextState.slice(1)
									: inst.nextState)
						) {
							edges[i].label =
								edges[i].label +
								`*_(${inst.readSymbol}/${inst.writeSymbol},${
									inst.transition === ">" ? "R" : "L"
								})_*\n`;
							break;
						}
					}

					if (i === edges.length) {
						edges.push({
							...tmEdgeConfig,
							from: node,
							to:
								inst.nextState[0] === "*"
									? inst.nextState.slice(1)
									: inst.nextState,
							label: `*_(${inst.readSymbol}/${inst.writeSymbol},${
								inst.transition === ">" ? "R" : "L"
							})_*\n`,
						});
					}
				});
			});

			const finalNodes = [
				...nodes.map((node) => {
					if (node[0] === "*") {
						return getNodeConfig(node.slice(1), true);
					} else {
						return getNodeConfig(node, false);
					}
				}),
			];

			if (network) {
				network.destroy();
			}

			network = new networkLib.value.Network(
				outputRef.value,
				{
					nodes: new dataLib.value.DataSet([
						{ id: "_START", opacity: 0 },
						...finalNodes,
					]),
					edges: new dataLib.value.DataSet([
						{
							from: "_START",
							to: "S",
							...edgeConfig,
							length: 10,
						},
						...edges,
					]),
				},
				{}
			);
			network.on("beforeDrawing", (ctx: CanvasRenderingContext2D) => {
				canvasRef.value = ctx.canvas;
				fillBg(ctx);
			});
		};

		onUpdated(generateVisGraph);
		watch(() => isVisLoading, generateVisGraph);
		onUnmounted(() => network && network.destroy());

		return { outputRef, isVisLoading };
	},
});
</script>
