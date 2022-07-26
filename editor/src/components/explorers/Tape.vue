<template>
	<div class="container">
		<svg class="tm-tape" width="800" viewBox="0 0 870 70">
			<g class="wrapper" transform="translate(0 10)">
				<g
					class="tape-cell"
					v-for="ele in TArray"
					:transform="ele.transVal"
					:key="ele.val"
				>
					<rect width="50" height="50"></rect>
					<text x="25" y="33">{{ ele.val }}</text>
				</g>
			</g>
			<rect id="tape-head" width="70" height="70" x="400" y="0"></rect>
		</svg>
	</div>
	<div class="flex" v-if="showButtons">
		<button class="btn ml-auto" @click="resetHandler">
			Reset
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-7"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</button>
		<button class="btn mx-5" @click="nextStepHandler" :disabled="isDone()">
			<span>Next Step</span>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-7"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"
					/>
				</svg>
			</span>
		</button>

		<button class="btn mr-auto" @click="pauseHandler" v-if="isPlaying">
			Pause
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-7"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</button>
		<button
			class="btn mr-auto"
			@click="playHandler"
			v-else
			:disabled="isDone()"
		>
			Play
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-7"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</button>
	</div>
	<div @click="anotherInputHandler" v-if="showButtons" class="re-enter-input">
		Want to enter another string?
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";

interface itType {
	transVal: string;
	val: string;
}
interface Instructions {
	charArray: string[];
	moveDir: number;
}

export default defineComponent({
	name: "Tape",
	emits: ["toggleShowButtons"],
	props: {
		showButtons: { type: Boolean as PropType<boolean>, required: true },
		instructions: {
			type: Array as PropType<Instructions[]>,
			required: true,
		},
	},
	setup(props, { emit }) {
		const array = ref<number[]>([
			-10140, -10090, -10040, -9990, -9940, -9890, -9840, -9790, -9740,
			-9690, -9640, -9590, -9540, -9490, -9440, -9390, -9340, -9290,
			-9240, -9190, -9140, -9090, -9040, -8990, -8940, -8890, -8840,
			-8790, -8740, -8690, -8640, -8590, -8540, -8490, -8440, -8390,
			-8340, -8290, -8240, -8190, -8140, -8090, -8040, -7990, -7940,
			-7890, -7840, -7790, -7740, -7690, -7640, -7590, -7540, -7490,
			-7440, -7390, -7340, -7290, -7240, -7190, -7140, -7090, -7040,
			-6990, -6940, -6890, -6840, -6790, -6740, -6690, -6640, -6590,
			-6540, -6490, -6440, -6390, -6340, -6290, -6240, -6190, -6140,
			-6090, -6040, -5990, -5940, -5890, -5840, -5790, -5740, -5690,
			-5640, -5590, -5540, -5490, -5440, -5390, -5340, -5290, -5240,
			-5190, -5140, -5090, -5040, -4990, -4940, -4890, -4840, -4790,
			-4740, -4690, -4640, -4590, -4540, -4490, -4440, -4390, -4340,
			-4290, -4240, -4190, -4140, -4090, -4040, -3990, -3940, -3890,
			-3840, -3790, -3740, -3690, -3640, -3590, -3540, -3490, -3440,
			-3390, -3340, -3290, -3240, -3190, -3140, -3090, -3040, -2990,
			-2940, -2890, -2840, -2790, -2740, -2690, -2640, -2590, -2540,
			-2490, -2440, -2390, -2340, -2290, -2240, -2190, -2140, -2090,
			-2040, -1990, -1940, -1890, -1840, -1790, -1740, -1690, -1640,
			-1590, -1540, -1490, -1440, -1390, -1340, -1290, -1240, -1190,
			-1140, -1090, -1040, -990, -940, -890, -840, -790, -740, -690, -640,
			-590, -540, -490, -440, -390, -340, -290, -240, -190, -140, -90,
			-40, 10, 60, 110, 160, 210, 260, 310, 360, 410, 460, 510, 560, 610,
			660, 710, 760, 810, 860, 910, 960, 1010, 1060, 1110, 1160, 1210,
			1260, 1310, 1360, 1410, 1460, 1510, 1560, 1610, 1660, 1710, 1760,
			1810, 1860, 1910, 1960, 2010, 2060, 2110, 2160, 2210, 2260, 2310,
			2360, 2410, 2460, 2510, 2560, 2610, 2660, 2710, 2760, 2810, 2860,
			2910, 2960, 3010, 3060, 3110, 3160, 3210, 3260, 3310, 3360, 3410,
			3460, 3510, 3560, 3610, 3660, 3710, 3760, 3810, 3860, 3910, 3960,
			4010, 4060, 4110, 4160, 4210, 4260, 4310, 4360, 4410, 4460, 4510,
			4560, 4610, 4660, 4710, 4760, 4810, 4860, 4910, 4960, 5010, 5060,
			5110, 5160, 5210, 5260, 5310, 5360, 5410, 5460, 5510, 5560, 5610,
			5660, 5710, 5760, 5810, 5860, 5910, 5960, 6010, 6060, 6110, 6160,
			6210, 6260, 6310, 6360, 6410, 6460, 6510, 6560, 6610, 6660, 6710,
			6760, 6810, 6860, 6910, 6960, 7010, 7060, 7110, 7160, 7210, 7260,
			7310, 7360, 7410, 7460, 7510, 7560, 7610, 7660, 7710, 7760, 7810,
			7860, 7910, 7960, 8010, 8060, 8110, 8160, 8210, 8260, 8310, 8360,
			8410, 8460, 8510, 8560, 8610, 8660, 8710, 8760, 8810, 8860, 8910,
			8960, 9010, 9060, 9110, 9160, 9210, 9260, 9310, 9360, 9410, 9460,
			9510, 9560, 9610, 9660, 9710, 9760, 9810, 9860, 9910, 9960, 10010,
			10060, 10110, 10160, 10210, 10260, 10310, 10360, 10410, 10460,
			10510, 10560, 10610, 10660, 10710, 10760, 10810, 10860, 10910,
			10960, 11010, 11060, 11110, 11160, 11210, 11260, 11310, 11360,
			11410, 11460, 11510, 11560, 11610, 11660, 11710, 11760, 11810,
			11860, 11910, 11960, 12010, 12060, 12110, 12160, 12210, 12260,
			12310, 12360, 12410, 12460, 12510, 12560, 12610, 12660, 12710,
			12760, 12810, 12860, 12910, 12960, 13010, 13060, 13110, 13160,
			13210, 13260, 13310, 13360, 13410, 13460, 13510, 13560, 13610,
			13660, 13710, 13760, 13810, 13860, 13910, 13960, 14010, 14060,
			14110, 14160, 14210, 14260, 14310, 14360, 14410, 14460, 14510,
			14560, 14610, 14660, 14710, 14760, 14810,
		]);
		const TArray = ref<itType[]>([]);
		const stepCount = ref<number>(1);
		const inputString = ref<string>("");
		const isPlaying = ref<boolean>(false);

		onMounted(() => {
			for (let i = 0; i < array.value.length; ++i) {
				let transVal = `translate(${array.value[i]})`;
				let val = "";

				TArray.value.push({ transVal, val });
			}
		});

		const generateTArray = () => {
			for (let i = 0; i < array.value.length; ++i) {
				TArray.value[i].transVal = `translate(${array.value[i]})`;
			}
		};

		const accumulateString = (indexOfInstruction: number) => {
			for (let i = 0; i < array.value.length; ++i) {
				if (
					i >= 211 &&
					i <
						210 +
							props.instructions[indexOfInstruction].charArray
								.length
				) {
					TArray.value[i].val =
						props.instructions[indexOfInstruction].charArray[
							i - 211
						];
				} else {
					TArray.value[i].val = "";
				}
			}
		};

		const changeArray = (move: number, indexOfInstruction: number) => {
			if (move === 0) {
				accumulateString(indexOfInstruction);
			} else if (move === 1) {
				accumulateString(indexOfInstruction);
				for (let i = 0; i < array.value.length; ++i) {
					array.value[i] -= 50;
				}
				generateTArray();
			} else {
				accumulateString(indexOfInstruction);
				for (let i = 0; i < array.value.length; ++i) {
					array.value[i] += 50;
				}
				generateTArray();
			}
		};

		const nextStepHandler = () => {
			if (isPlaying.value) isPlaying.value = false;
			changeArray(
				props.instructions[stepCount.value].moveDir,
				stepCount.value
			);
			stepCount.value += 1;
		};

		const playHandler = () => {
			isPlaying.value = true;
			const intervalID = setInterval(() => {
				changeArray(
					props.instructions[stepCount.value].moveDir,
					stepCount.value
				);
				stepCount.value += 1;
				if (
					stepCount.value === props.instructions.length ||
					isPlaying.value === false
				) {
					isPlaying.value = false;
					clearInterval(intervalID);
				}
			}, 1000);
		};
		const resetHandler = () => {
			isPlaying.value = false;
			stepCount.value = 1;
			array.value = [
				-10140, -10090, -10040, -9990, -9940, -9890, -9840, -9790,
				-9740, -9690, -9640, -9590, -9540, -9490, -9440, -9390, -9340,
				-9290, -9240, -9190, -9140, -9090, -9040, -8990, -8940, -8890,
				-8840, -8790, -8740, -8690, -8640, -8590, -8540, -8490, -8440,
				-8390, -8340, -8290, -8240, -8190, -8140, -8090, -8040, -7990,
				-7940, -7890, -7840, -7790, -7740, -7690, -7640, -7590, -7540,
				-7490, -7440, -7390, -7340, -7290, -7240, -7190, -7140, -7090,
				-7040, -6990, -6940, -6890, -6840, -6790, -6740, -6690, -6640,
				-6590, -6540, -6490, -6440, -6390, -6340, -6290, -6240, -6190,
				-6140, -6090, -6040, -5990, -5940, -5890, -5840, -5790, -5740,
				-5690, -5640, -5590, -5540, -5490, -5440, -5390, -5340, -5290,
				-5240, -5190, -5140, -5090, -5040, -4990, -4940, -4890, -4840,
				-4790, -4740, -4690, -4640, -4590, -4540, -4490, -4440, -4390,
				-4340, -4290, -4240, -4190, -4140, -4090, -4040, -3990, -3940,
				-3890, -3840, -3790, -3740, -3690, -3640, -3590, -3540, -3490,
				-3440, -3390, -3340, -3290, -3240, -3190, -3140, -3090, -3040,
				-2990, -2940, -2890, -2840, -2790, -2740, -2690, -2640, -2590,
				-2540, -2490, -2440, -2390, -2340, -2290, -2240, -2190, -2140,
				-2090, -2040, -1990, -1940, -1890, -1840, -1790, -1740, -1690,
				-1640, -1590, -1540, -1490, -1440, -1390, -1340, -1290, -1240,
				-1190, -1140, -1090, -1040, -990, -940, -890, -840, -790, -740,
				-690, -640, -590, -540, -490, -440, -390, -340, -290, -240,
				-190, -140, -90, -40, 10, 60, 110, 160, 210, 260, 310, 360, 410,
				460, 510, 560, 610, 660, 710, 760, 810, 860, 910, 960, 1010,
				1060, 1110, 1160, 1210, 1260, 1310, 1360, 1410, 1460, 1510,
				1560, 1610, 1660, 1710, 1760, 1810, 1860, 1910, 1960, 2010,
				2060, 2110, 2160, 2210, 2260, 2310, 2360, 2410, 2460, 2510,
				2560, 2610, 2660, 2710, 2760, 2810, 2860, 2910, 2960, 3010,
				3060, 3110, 3160, 3210, 3260, 3310, 3360, 3410, 3460, 3510,
				3560, 3610, 3660, 3710, 3760, 3810, 3860, 3910, 3960, 4010,
				4060, 4110, 4160, 4210, 4260, 4310, 4360, 4410, 4460, 4510,
				4560, 4610, 4660, 4710, 4760, 4810, 4860, 4910, 4960, 5010,
				5060, 5110, 5160, 5210, 5260, 5310, 5360, 5410, 5460, 5510,
				5560, 5610, 5660, 5710, 5760, 5810, 5860, 5910, 5960, 6010,
				6060, 6110, 6160, 6210, 6260, 6310, 6360, 6410, 6460, 6510,
				6560, 6610, 6660, 6710, 6760, 6810, 6860, 6910, 6960, 7010,
				7060, 7110, 7160, 7210, 7260, 7310, 7360, 7410, 7460, 7510,
				7560, 7610, 7660, 7710, 7760, 7810, 7860, 7910, 7960, 8010,
				8060, 8110, 8160, 8210, 8260, 8310, 8360, 8410, 8460, 8510,
				8560, 8610, 8660, 8710, 8760, 8810, 8860, 8910, 8960, 9010,
				9060, 9110, 9160, 9210, 9260, 9310, 9360, 9410, 9460, 9510,
				9560, 9610, 9660, 9710, 9760, 9810, 9860, 9910, 9960, 10010,
				10060, 10110, 10160, 10210, 10260, 10310, 10360, 10410, 10460,
				10510, 10560, 10610, 10660, 10710, 10760, 10810, 10860, 10910,
				10960, 11010, 11060, 11110, 11160, 11210, 11260, 11310, 11360,
				11410, 11460, 11510, 11560, 11610, 11660, 11710, 11760, 11810,
				11860, 11910, 11960, 12010, 12060, 12110, 12160, 12210, 12260,
				12310, 12360, 12410, 12460, 12510, 12560, 12610, 12660, 12710,
				12760, 12810, 12860, 12910, 12960, 13010, 13060, 13110, 13160,
				13210, 13260, 13310, 13360, 13410, 13460, 13510, 13560, 13610,
				13660, 13710, 13760, 13810, 13860, 13910, 13960, 14010, 14060,
				14110, 14160, 14210, 14260, 14310, 14360, 14410, 14460, 14510,
				14560, 14610, 14660, 14710, 14760, 14810,
			];
			generateTArray();
			loadTM(inputString.value);
		};

		const pauseHandler = () => {
			isPlaying.value = !isPlaying.value;
		};

		const anotherInputHandler = () => {
			emit("toggleShowButtons");
			inputString.value = "";
			resetHandler();
			for (let i = 0; i < array.value.length; ++i) {
				TArray.value[i].val = "";
			}
		};

		const loadTM = (input: string) => {
			inputString.value = input;
			for (let i = 211; i < 211 + input.length; ++i) {
				TArray.value[i].val = input[i - 211];
			}
		};

		const isDone = () => {
			return stepCount.value === props.instructions.length;
		};

		return {
			array,
			TArray,
			generateTArray,
			changeArray,
			nextStepHandler,
			resetHandler,
			playHandler,
			loadTM,
			isPlaying,
			pauseHandler,
			isDone,
			anotherInputHandler,
		};
	},
});
</script>

<style scoped>
.container {
	@apply bg-gray-900 border-transparent border-2 p-8 mt-5;
}

.tm-tape {
	@apply mx-auto max-w-full;
}
.tape-cell > rect {
	@apply fill-transparent stroke-cool-gray-600 stroke-2;
}

.tape-cell > text {
	@apply text-2xl  fill-cyan-300;
	text-anchor: middle;
}

#tape-head {
	@apply fill-none stroke-cyan-300 stroke-3;
}

.btn {
	@apply flex bg-cyan-300 rounded text-blue-gray-800 pl-5 pr-3 py-2 font-semibold text-sm shadow-lg text-shadow-none outline-none disabled:bg-cyan-600 disabled:cursor-not-allowed;
}

.re-enter-input {
	@apply flex justify-center text-cyan-300 mt-7 text-md font-semibold hover:underline hover:cursor-pointer;
}
</style>
