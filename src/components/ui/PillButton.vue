<template>
	<a
		v-if="href"
		:href="href"
		:class="classes"
		v-bind="external ? { target: '_blank', rel: 'noopener' } : {}"
	>
		<slot />
		<span v-if="external && newTabLabel" class="sr-only">({{ newTabLabel }})</span>
	</a>
	<button v-else type="button" :class="classes">
		<slot />
	</button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	href: { type: String, default: '' },
	variant: { type: String, default: 'primary' }, // 'primary' | 'ghost'
	size: { type: String, default: 'md' }, // 'md' | 'sm'
	newTabLabel: { type: String, default: '' }
})

const external = computed(() => /^https?:\/\//.test(props.href))
const classes = computed(() => ['pill', `pill--${props.variant}`, `pill--${props.size}`])
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.pill {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-3);
	border: var(--border-thin) solid var(--color-primary-dark);
	border-radius: var(--radius-pill);
	color: var(--color-text);
	font-weight: var(--fw-semibold);
	line-height: var(--lh-tight);
	white-space: nowrap;
	transition: background-color var(--transition-fast), border-color var(--transition-fast);
	@include focus-ring;

	&--md {
		height: var(--control-height);
		padding-inline: var(--space-7);
		font-size: var(--fs-nav);
	}

	&--sm {
		height: var(--control-height-sm);
		padding-inline: var(--space-6);
		font-size: var(--fs-sm);
	}

	&--primary {
		background: var(--color-primary-dark);

		&:hover {
			background: var(--color-accent);
			border-color: var(--color-accent);
		}
	}

	&--ghost {
		background: transparent;

		&:hover {
			border-color: var(--color-accent);
		}
	}
}
</style>
