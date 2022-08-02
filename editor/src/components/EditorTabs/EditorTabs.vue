<template>
	<header
		class="h-7 relative z-20 flex items-center justify-between bg-gray-850 border-b border-gray-900"
	>
		<ul
			class="h-full flex overflow-y-hidden overflow-x-auto max-w-full space-x-1.5 tabs"
		>
			<Tab
				v-for="(tab, i) in tabs"
				:key="i"
				:to="String(i)"
				:name="tab.name"
				:isActive="tabIdx === i"
				:showRemove="tabs.length > 1"
				:lang="tab.lang"
				@rename="(name) => renameTab(i, name)"
				@remove="() => removeTab(i)"
			/>
			<Tab class="!opacity-100">
				<button
					class="h-full px-2 text-blue-gray-600 focus:outline-none"
					@click="() => $emit('new-playground')"
					title="Add a new tab [Shift + N]"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
				</button>
			</Tab>
		</ul>

		<div class="flex justify-between items-center">
			<Menu
				as="div"
				class="relative inline-block text-left mr-5"
				v-if="store.value.type === 'TM'"
			>
				<div>
					<MenuButton
						class="inline-flex justify-center w-full rounded-md border text-xs border-cyan-300 outline-none hover:outline-none p-1 text-cyan-300 bg-cyan-400 bg-opacity-10 hover:bg-opacity-20"
					>
						Select Example
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							aria-hidden="true"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</MenuButton>
				</div>

				<transition
					enter-active-class="transition ease-out duration-100"
					enter-from-class="transform opacity-0 scale-95"
					enter-to-class="transform opacity-100 scale-100"
					leave-active-class="transition ease-in duration-75"
					leave-from-class="transform opacity-100 scale-100"
					leave-to-class="transform opacity-0 scale-95"
				>
					<MenuItems
						class="origin-top-right absolute right-0 mt-2 w-56 rounded shadow-lg bg-black focus:outline-none"
					>
						<div class="py-1">
							<MenuItem
								v-slot="{ active }"
								v-for="item in dropdownData"
								:key="item.name"
								@click="store.value.program = item.code"
							>
								<div
									:class="[
										active
											? 'bg-cyan-400 text-cyan-300 bg-opacity-10'
											: 'text-cool-gray-400',
										'block px-4 py-2 text-xs cursor-pointer',
									]"
								>
									{{ item.name }}
								</div>
							</MenuItem>
						</div>
					</MenuItems>
				</transition>
			</Menu>

			<nav class="mx-2 flex-shrink-0 text-xs text-cyan-300 font-medium">
				<a
					href="https://vyaakaran.vercel.app/docs/syntax"
					target="_blank"
				>
					Learn Syntax
				</a>
				<a
					class="mx-3"
					href="https://vyaakaran.vercel.app/feedback"
					target="_blank"
				>
					Feedback
				</a>
			</nav>
		</div>
	</header>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { playgrounds, Playground, getActivePlayground } from "../../store/code";
import { dropDownData } from "../../utils/dropDownData.ts";
import useKeyShortcut from "../../utils/useKeyShortcut";
import Tab from "./Tab.vue";

export default defineComponent({
	name: "EditorTabs",
	components: {
		Tab,
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
	},
	emits: ["new-playground"],
	inject: ["store"],
	setup() {
		const tabs = computed(() =>
			playgrounds.map((p) => ({ name: p.name, lang: p.type }))
		);
		const router = useRouter();
		const tabIdx = computed(
			() => Number(router.currentRoute.value.params.id) || 0
		);

		const dropdownData = ref(dropDownData);

		const removeTab = (i: number) => {
			const mutate = () => {
				playgrounds.splice(i, 1);
			};

			if (i <= tabIdx.value) {
				router
					.replace(
						`${
							tabIdx.value - 1 >= 0
								? tabIdx.value - 1
								: tabIdx.value
						}`
					)
					.then(mutate);
			} else {
				mutate();
			}
		};

		const renameTab = (i: number, name: string) => {
			if (!name) return;

			// NOTE: This assumes that the tab being renamed is the active tab. Might change later
			(getActivePlayground() as Playground).name = name;
			// Update page title
			document.title = `${name} | Vyaakaran Playground`;
		};

		// Next tab navigate hotkey
		useKeyShortcut(
			(e) => e.shiftKey && e.altKey && e.code === "ArrowRight",
			() => {
				if (tabIdx.value !== playgrounds.length - 1) {
					router.replace(`${tabIdx.value + 1}`);
				}
			}
		);

		// Previous tab navigate hotkey
		useKeyShortcut(
			(e) => e.shiftKey && e.altKey && e.code === "ArrowLeft",
			() => {
				if (tabIdx.value !== 0) {
					router.replace(`${tabIdx.value - 1}`);
				}
			}
		);

		return { tabs, tabIdx, removeTab, renameTab, dropdownData };
	},
});
</script>

<style scoped>
.tabs::-webkit-scrollbar {
	height: 3px;
}
</style>
