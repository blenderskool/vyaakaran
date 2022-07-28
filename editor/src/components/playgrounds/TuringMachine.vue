<template>
	<Splitpanes
		horizontal
		:dbl-click-splitter="false"
		v-if="store.value.progKey && !store.value.compiled.errors.length"
	>
		<Pane size="45" class="bg-gray-900">
			<PaneHeader>Turing Machine</PaneHeader>
			<Tape
				:showButtons="showButtons"
				ref="childComponentRef"
				:instructions="tapeInstructions"
				@toggleShowButtons="
					showButtons = false;
					inputString = '';
				"
			></Tape>
			<form
				class="form"
				@submit.prevent="handleInputSubmit"
				v-if="!showButtons"
			>
				<div class="input-container">
					<input
						class="input-box"
						type="text"
						placeholder="Enter the string"
						v-model="inputString"
					/>
					<button type="submit" class="submit-btn">Submit</button>
				</div>
			</form>
			<!-- <form
				@submit.prevent="handleInputSubmit"
				v-if="!showButtons"
				class="form"
			>
				<input
					type="text"
					v-model="inputString"
					placeholder="Enter the input string"
					class="input-box"
				/>
				<button type="submit" class="submit-btn">Submit</button>
			</form> -->
		</Pane>
		<Pane size="55" max-size="95" class="bg-gray-900">
			<PaneHeader>State Transitions</PaneHeader>
			<TMStateTransitionGraph
				:key="`TM ${store.value.progKey}`"
				:getGraph="store.value.compiled.parseTree"
			></TMStateTransitionGraph>
		</Pane>
	</Splitpanes>
	<Empty v-else />
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import { Pane, Splitpanes } from "splitpanes";
import PaneHeader from "../ui/PaneHeader.vue";
import Tape from "../explorers/Tape.vue";
import TMStateTransitionGraph from "../explorers/TMStateTransitionGraph.vue";
import Empty from "./Empty.vue";
import { TestInput } from "../../../../compiler/src/turing-machine/input";

interface Instructions {
	charArray: string[];
	moveDir: number;
}

export default defineComponent({
	name: "TuringMachinePlayground",
	components: {
		Splitpanes,
		Pane,
		PaneHeader,
		Tape,
		TMStateTransitionGraph,
		Empty,
	},
	inject: ["store"],
	setup() {
		const childComponentRef = ref();
		const showButtons = ref<boolean>(false);
		const inputString = ref<string>("");
		const tapeInstructions = ref<Instructions[]>([]);
		const store: any = inject("store");

		const handleInputSubmit = () => {
			showButtons.value = true;
			childComponentRef.value.loadTM(inputString.value);
			let testobj = new TestInput(
				"aabb#",
				store.value.compiled.parseTree
			);

			let strgen = testobj.CheckString();
			let tmp = new Array();
			do {
				let tr = strgen.next();
				tmp.push(JSON.parse(JSON.stringify(tr)));
			} while (!strgen.next().done);

			console.log(tmp);

			let testInst = [
				{
					value: { moveDir: 0, string: ["a", "a", "b", "b", "#"] },
					done: false,
				},
				{
					value: { moveDir: 1, string: ["x", "a", "b", "b", "#"] },
					done: false,
				},
				{
					value: { moveDir: 1, string: ["x", "a", "b", "b", "#"] },
					done: false,
				},
				{
					value: { moveDir: 1, string: ["x", "a", "b", "b", "#"] },
					done: false,
				},
				{
					value: { moveDir: -1, string: ["x", "a", "b", "y", "#"] },
					done: false,
				},
				{
					value: { moveDir: -1, string: ["x", "a", "b", "y", "#"] },
					done: false,
				},
				{
					value: { moveDir: 1, string: ["x", "x", "b", "y", "#"] },
					done: false,
				},
				{
					value: { moveDir: -1, string: ["x", "x", "y", "y", "#"] },
					done: false,
				},
				{
					value: { moveDir: 1, string: ["x", "x", "y", "y", "#"] },
					done: false,
				},
			];
			tapeInstructions.value = testInst.map((inst) => {
				return {
					moveDir: inst.value.moveDir,
					charArray: inst.value.string,
				};
			});
		};

		return {
			showButtons,
			inputString,
			handleInputSubmit,
			tapeInstructions,
			childComponentRef,
		};
	},
});
</script>

<style scoped>
/* .form {
	@apply flex flex-col items-center;
}

.input-box {
	@apply w-1/4 outline-none rounded text-center text-cyan-400 bg-cool-gray-600 p-2 placeholder-cyan-400 font-semibold text-md;
} */

.form {
	@apply flex justify-center;
}

.input-container {
	@apply flex items-center border-b-[1.5px] border-cyan-300 py-2;
}

.input-box {
	@apply appearance-none bg-transparent border-none w-full text-cyan-300 mr-3 py-1 px-2 placeholder-cool-gray-500 leading-tight text-lg outline-none;
}

.submit-btn {
	@apply rounded border-1 border-solid border-cyan-300 bg-cyan-500 bg-opacity-10 text-cyan-300 px-3 py-2 font-semibold outline-none;
}
</style>
