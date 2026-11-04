<template>
	<li class="chip" :class="`chip--${variant}`">
		<slot />
	</li>
</template>

<script setup>
defineProps({
	// 'solid': padrão do Penpot | 'outline': estilo da seção #skills de portfolio-sweandrew
	variant: { type: String, default: 'solid' }
})
</script>

<style lang="scss" scoped>
.chip {
	display: inline-flex;
	align-items: center;
	border-radius: var(--radius-pill);
	line-height: var(--lh-tight);
	white-space: nowrap;

	&--solid {
		height: var(--chip-height);
		padding-inline: var(--space-6);
		background: var(--color-surface);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	&--outline {
		height: var(--chip-height-sm);
		padding-inline: var(--chip-pad-sm);
		border: var(--border-thin) solid var(--color-border);
		background: var(--color-chip);
		color: var(--color-text-dim);
		font-size: var(--nav-fs);
		letter-spacing: var(--tracking-chip);
	}
}
</style>
