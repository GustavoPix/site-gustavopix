<template>
	<div class="loader" role="status" aria-live="polite">
		<span class="spinner" aria-hidden="true"></span>
		<span class="sr-only">{{ label }}</span>
	</div>
</template>

<script setup>
defineProps({
	label: { type: String, required: true }
})
</script>

<style lang="scss" scoped>
// Mesmo visual do loader estático do index.html, para a troca ser imperceptível
.loader {
	position: fixed;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--color-bg);
}

.spinner {
	width: var(--spinner-size);
	height: var(--spinner-size);
	border: var(--border-thick) solid var(--color-primary-dark);
	border-top-color: var(--color-accent);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;

	@media (prefers-reduced-motion: reduce) {
		animation-duration: 2.4s;
	}
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
