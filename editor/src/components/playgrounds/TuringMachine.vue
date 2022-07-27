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
				:instructions="tapeInstructions"
				ref="childComponentRef"
				@toggleShowButtons="
					showButtons = false;
					inputString = '';
				"
			></Tape>
			<form
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
			</form>
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
import { defineComponent, onMounted, ref } from "vue";
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
		const tapeInstructions = ref<Instructions[] | null>();

		const handleInputSubmit = () => {
			showButtons.value = true;
			childComponentRef.value.loadTM(inputString.value);
			// let testobj=new TestInput(inputstring,this.store.value.parseTree)
			// let strgen=testobj.CheckString();
	
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
.form {
	@apply flex flex-col items-center;
}

.input-box {
	@apply w-1/4 outline-none rounded text-center text-cyan-400 bg-cool-gray-600 p-2 placeholder-cyan-400 font-semibold text-md;
}

.submit-btn {
	@apply mt-2 bg-cyan-300 rounded text-blue-gray-800 px-4 py-2 font-semibold text-md shadow-lg text-shadow-none outline-none disabled:bg-cyan-600 disabled:cursor-not-allowed;
}
</style>
