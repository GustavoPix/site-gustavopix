<template>
	<h2 :id="id" class="section-label">
		<slot />
	</h2>
</template>

<script setup>
defineProps({
	id: { type: String, required: true }
})
</script>

<style lang="scss" scoped>
.section-label {
	margin-block-end: var(--space-8);
	color: var(--color-accent);
	font-size: var(--fs-sm);
	font-weight: var(--fw-semibold);
	line-height: var(--lh-tight);
	letter-spacing: 0.04em;
	text-transform: uppercase;
}
</style>
