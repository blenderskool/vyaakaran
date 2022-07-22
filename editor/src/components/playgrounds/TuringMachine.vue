<template>
	<Splitpanes horizontal class="h-full" :dbl-click-splitter="false">
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
				<button type="submit" class="submit-btn">submit</button>
			</form>
		</Pane>
		<Pane size="55" max-size="95" class="bg-gray-900">
			<PaneHeader>State Transitions</PaneHeader>
			<TMStateTransitionGraph
				:key="`TM ${store.value.progKey}`"
			></TMStateTransitionGraph>
		</Pane>
	</Splitpanes>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Pane, Splitpanes } from "splitpanes";
import PaneHeader from "../ui/PaneHeader.vue";
import Tape from "../explorers/Tape.vue";
import TMStateTransitionGraph from "../explorers/TMStateTransitionGraph.vue";

interface Instructions {
	charArray: string[];
	move: "left" | "right" | "dont";
}

export default defineComponent({
	name: "TuringMachinePlayground",
	components: {
		Splitpanes,
		Pane,
		PaneHeader,
		Tape,
		TMStateTransitionGraph,
	},
	inject: ["store"],
	setup() {
		const childComponentRef = ref();
		const showButtons = ref<boolean>(false);
		const inputString = ref<string>("");
		const tapeInstructions = ref<Instructions[] | null>([
			{ charArray: ["a", "b", "b", "a"], move: "right" },
			{ charArray: ["a", "a", "b", "a"], move: "right" },
			{ charArray: ["a", "a", "a", "a"], move: "left" },
			{ charArray: ["a", "a", "a", "a"], move: "left" },
			{ charArray: ["a", "a", "a", "a"], move: "left" },
		]);

		const handleInputSubmit = () => {
			showButtons.value = true;
			childComponentRef.value.loadTM(inputString.value);
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
	@apply w-1/4 outline-none rounded-lg text-center text-black bg-white p-2 placeholder-cyan-400 text-md;
}

.submit-btn {
	@apply bg-cyan-300 text-black mt-3 rounded-lg w-1/8 p-2 shadow-2xl shadow-cyan-400;
}
</style>
