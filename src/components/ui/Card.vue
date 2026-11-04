<template>
	<component
		:is="tag"
		class="card"
		:class="{ 'card--spotlight': spotlight }"
		:style="spotStyle"
		@pointermove="onPointerMove"
		@pointerleave="onPointerLeave"
	>
		<slot />
	</component>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	tag: { type: String, default: 'article' },
	// Brilho que segue o mouse, como os cards "receipts" de devhasibulislam.vercel.app
	spotlight: { type: Boolean, default: false }
})

const spotStyle = ref(null)

function onPointerMove(event) {
	if (!props.spotlight || event.pointerType !== 'mouse') return
	const rect = event.currentTarget.getBoundingClientRect()
	spotStyle.value = {
		'--spot-x': `${event.clientX - rect.left}px`,
		'--spot-y': `${event.clientY - rect.top}px`
	}
}

// Ao sair, o brilho volta suavemente para o canto superior direito
function onPointerLeave() {
	spotStyle.value = null
}
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.card {
	display: flex;
	flex-direction: column;
	gap: var(--space-6);
	padding: var(--space-6);
	border: var(--border-thin) solid var(--color-border);
	border-radius: var(--radius-card);
	background: var(--color-bg);

	@include bp(lg) {
		padding: var(--space-7);
	}

	// --spot-x/--spot-y são registradas com @property em main.scss para poderem transicionar
	&--spotlight {
		background:
			radial-gradient(var(--spot-size) circle at var(--spot-x) var(--spot-y), var(--color-spot), transparent 55%),
			var(--color-bg);
		transition:
			--spot-x var(--transition-spot),
			--spot-y var(--transition-spot);

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}
}
</style>
