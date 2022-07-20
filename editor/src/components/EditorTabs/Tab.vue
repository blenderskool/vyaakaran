<template>
	<li
		class="flex items-center border-t-2 bg-gray-900 shadow"
		:class="{
			'border-transparent opacity-50': !isActive,
			'border-cyan-300': isActive,
		}"
	>
		<slot>
			<component
				:is="!to || isEditing ? 'div' : 'router-link'"
				:to="to"
				@dblclick="() => setEditing(true)"
				class="flex items-center h-7 px-4 text-xs whitespace-nowrap font-medium"
			>
				<span
					class="mr-2 inline"
					:class="{
						'text-blue-gray-600': !isActive,
						'text-cyan-300': isActive,
					}"
				>
					<svg
						v-if="lang === 'RG'"
						width="16"
						height="16"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 17 11"
					>
						<path
							d="M.516 9.208l.732-.108V4.588L.54 4.372v-.936l1.992-.264h.036l.336.252v.288l-.036.996h.036c.056-.184.184-.396.384-.636.2-.248.452-.46.756-.636a1.95 1.95 0 011.008-.276c.208 0 .368.028.48.084v2.088a1.642 1.642 0 00-.42-.228 1.582 1.582 0 00-.564-.084c-.288 0-.548.04-.78.12a1.983 1.983 0 00-.552.252V9.1l1.32.12V10H.516v-.792zM6.788 10.056a.6.6 0 01-.42-.168.55.55 0 01-.175-.413c0-.187.067-.338.203-.455a.727.727 0 01.504-.182.583.583 0 01.609.588c0 .196-.066.35-.196.462-.13.112-.306.168-.525.168zM12.548 10.132c-.896 0-1.664-.196-2.304-.588a3.765 3.765 0 01-1.452-1.608C8.464 7.256 8.3 6.484 8.3 5.62c0-.992.188-1.836.564-2.532a3.677 3.677 0 011.608-1.572c.704-.36 1.536-.54 2.496-.54.552 0 1.1.04 1.644.12.544.08 1.004.164 1.38.252l-.144 2.316h-1.44l-.336-1.584c-.072-.08-.204-.148-.396-.204-.184-.064-.436-.096-.756-.096-.712 0-1.264.316-1.656.948-.392.624-.588 1.532-.588 2.724 0 1.184.164 2.124.492 2.82.336.688.856 1.032 1.56 1.032.288 0 .548-.036.78-.108.24-.08.42-.18.54-.3V6.388l-1.116-.12v-.876h3.744v.876l-.6.096V9.52c-.136.008-.452.072-.948.192-.488.128-.928.228-1.32.3-.392.08-.812.12-1.26.12z"
							fill="currentColor"
						/>
					</svg>
					<svg
						v-else-if="lang === 'CFG'"
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 26 12"
					>
						<path
							d="M4.548 11.132c-1.384 0-2.436-.4-3.156-1.2C.672 9.124.312 8.02.312 6.62c0-.944.192-1.764.576-2.46a3.933 3.933 0 011.584-1.608c.672-.376 1.432-.564 2.28-.564.336 0 .66.02.972.06.312.032.688.08 1.128.144.344.056.58.088.708.096l-.144 2.676H6.132l-.408-1.836c-.176-.192-.544-.288-1.104-.288-.616 0-1.104.308-1.464.924-.352.608-.528 1.504-.528 2.688 0 1.152.172 2.076.516 2.772.352.696.86 1.044 1.524 1.044.328 0 .576-.032.744-.096.176-.064.324-.156.444-.276l.54-1.284 1.176.108-.216 1.956a3.883 3.883 0 00-.852.18 9.08 9.08 0 01-.912.204 6.33 6.33 0 01-1.044.072zM8.967 11.056a.6.6 0 01-.42-.168.55.55 0 01-.175-.413c0-.187.068-.338.203-.455a.727.727 0 01.504-.182.583.583 0 01.61.588c0 .196-.066.35-.197.462-.13.112-.305.168-.525.168zM11.415 5.336h-.936v-.744l.936-.24v-.504c0-.536.144-1.024.432-1.464.288-.44.672-.788 1.152-1.044a3.334 3.334 0 011.572-.384c.296 0 .564.04.804.12v1.74c-.088-.096-.26-.188-.516-.276a2.143 2.143 0 00-.756-.144c-.264 0-.452.068-.564.204-.112.136-.168.36-.168.672V4.34h1.44v.996h-1.44V10.1l1.212.108V11h-4.092v-.792l.924-.108V5.336zM16.098 11.056a.6.6 0 01-.42-.168.55.55 0 01-.175-.413c0-.187.068-.338.203-.455a.727.727 0 01.504-.182.583.583 0 01.61.588c0 .196-.066.35-.197.462-.13.112-.306.168-.525.168zM21.858 11.132c-.896 0-1.664-.196-2.304-.588a3.765 3.765 0 01-1.452-1.608c-.328-.68-.492-1.452-.492-2.316 0-.992.188-1.836.564-2.532a3.677 3.677 0 011.608-1.572c.704-.36 1.536-.54 2.496-.54.552 0 1.1.04 1.644.12.544.08 1.004.164 1.38.252l-.144 2.316h-1.44l-.336-1.584c-.072-.08-.204-.148-.396-.204-.184-.064-.436-.096-.756-.096-.712 0-1.264.316-1.656.948-.392.624-.588 1.532-.588 2.724 0 1.184.164 2.124.492 2.82.336.688.856 1.032 1.56 1.032.288 0 .548-.036.78-.108.24-.08.42-.18.54-.3V7.388l-1.116-.12v-.876h3.744v.876l-.6.096v3.156c-.136.008-.452.072-.948.192-.488.128-.928.228-1.32.3-.392.08-.812.12-1.26.12z"
							fill="currentColor"
						/>
					</svg>
					<h1
						v-else-if="lang === 'TM'"
						class="font-merri text-[11px]"
					>
						T.M
					</h1>
				</span>
				<input
					v-if="isEditing"
					ref="inputRef"
					class="bg-transparent text-steel-blue-100 focus:outline-none border-none w-20 text-xs"
					:value="name"
					@change="(e) => $emit('rename', e.target.value.trim())"
					@blur="() => setEditing(false)"
					@keydown.enter="() => setEditing(false)"
				/>
				<span
					class="max-w-20 overflow-ellipsis overflow-x-hidden"
					v-else
					>{{ name }}</span
				>
			</component>
			<button
				class="w-4 h-4 mr-2 text-blue-gray-600 focus:outline-none"
				v-if="showRemove"
				@click="() => $emit('remove')"
				:title="`Remove ${name}`"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</slot>
	</li>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType, readonly, ref } from "vue";
import useKeyShortcut from "../../utils/useKeyShortcut";

export default defineComponent({
	name: "Tab",
	props: {
		name: {
			type: String as PropType<string>,
			required: false,
		},
		to: {
			type: String as PropType<string>,
			required: false,
		},
		isActive: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: false,
		},
		showRemove: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: true,
		},
		lang: {
			type: String as PropType<string>,
			required: false,
		},
	},
	setup() {
		const inputRef = ref<HTMLInputElement>(null);
		const isEditing = ref<boolean>(false);

		const setEditing = async (state) => {
			isEditing.value = state;
			if (state) {
				await nextTick();
				inputRef.value.focus();
			}
		};

		// Rename tab shortcut
		useKeyShortcut(
			(e) => e.key === "F2",
			() => setEditing(true)
		);
		// Cancel renaming tab shortcut
		useKeyShortcut(
			(e) => e.key === "Escape" && isEditing.value,
			() => setEditing(false)
		);

		return {
			inputRef,
			setEditing,
			isEditing: readonly(isEditing),
		};
	},
});
</script>
