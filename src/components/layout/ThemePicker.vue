<template>
	<div ref="root" class="theme-picker">
		<button
			type="button"
			class="theme-picker__button"
			:class="{ 'is-open': open }"
			:aria-label="t(themes.button)"
			:aria-expanded="open"
			aria-controls="theme-panel"
			@click="open = !open"
		>
			<svg class="theme-picker__icon" viewBox="0 0 24 24" aria-hidden="true">
				<path d="m2 22 1-1h3l9-9" />
				<path d="M3 21v-3l9-9" />
				<path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
			</svg>
		</button>

		<Transition name="panel">
			<div v-if="open" id="theme-panel" class="theme-picker__panel">
				<div class="theme-picker__head">
					<p class="theme-picker__title">{{ t(themes.title) }}</p>
				</div>

				<ul class="theme-picker__list">
					<li v-for="item in themes.items" :key="item.id">
						<button
							type="button"
							class="theme-picker__option"
							:class="{ 'is-active': item.id === theme }"
							:aria-pressed="item.id === theme"
							@click="choose(item.id)"
						>
							<span class="theme-picker__swatch" :data-theme="item.id" aria-hidden="true"></span>
							<span class="theme-picker__text">
								<span class="theme-picker__name">{{ t(item.name) }}</span>
								<span class="theme-picker__description">{{ t(item.description) }}</span>
							</span>
							<svg v-if="item.id === theme" class="theme-picker__check" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</button>
					</li>
				</ul>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLang } from '@/composables/useLang.js'
import { useTheme } from '@/composables/useTheme.js'

defineProps({
	themes: { type: Object, required: true }
})

const { t } = useLang()
const { theme, setTheme } = useTheme()
const open = ref(false)
const root = ref(null)

function choose(id) {
	setTheme(id)
}

function onPointerDown(event) {
	if (open.value && !root.value?.contains(event.target)) open.value = false
}

function onKeydown(event) {
	if (event.key === 'Escape') open.value = false
}

onMounted(() => {
	document.addEventListener('pointerdown', onPointerDown)
	window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
	document.removeEventListener('pointerdown', onPointerDown)
	window.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

// No mobile o painel se ancora no shell do header (que já é containing block
// por causa do backdrop-filter), para não sair da tela
.theme-picker {
	position: static;

	@include bp(md) {
		position: relative;
	}

	&__button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--header-control);
		height: var(--header-control);
		border: var(--border-thin) solid transparent;
		border-radius: 50%;
		color: var(--color-accent);
		transition: border-color var(--transition-fast), background-color var(--transition-fast);
		@include focus-ring;

		&:hover {
			background: var(--color-hover);
		}

		&.is-open {
			border-color: var(--color-accent-line);
			background: var(--color-accent-soft);
		}
	}

	&__icon,
	&__check {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	&__icon {
		width: var(--icon-size);
		height: var(--icon-size);
	}

	&__panel {
		position: absolute;
		top: calc(100% + var(--space-4));
		right: 0;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		width: var(--panel-width);
		max-width: calc(100vw - var(--space-7));
		padding: var(--space-5);
		border: var(--border-thin) solid var(--color-border);
		border-radius: var(--radius-card);
		background: var(--color-bg);
		box-shadow: var(--shadow-panel);
	}

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block-end: var(--space-4);
		border-block-end: var(--border-thin) solid var(--color-hover);
	}

	&__title {
		font-size: var(--nav-fs);
		font-weight: var(--fw-extrabold);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	&__option {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		width: 100%;
		padding: var(--space-3);
		border: var(--border-thin) solid transparent;
		border-radius: var(--radius-option);
		background: var(--color-option);
		text-align: start;
		transition: background-color var(--transition-fast), border-color var(--transition-fast);
		@include focus-ring;

		&:hover {
			background: var(--color-hover);
		}

		&.is-active {
			border-color: var(--color-accent-line);
			background: var(--color-accent-soft);

			.theme-picker__name {
				color: var(--color-accent);
			}
		}
	}

	// Amostra: círculo dividido ao meio em 45°, fundo do tema em cima/esquerda e accent embaixo/direita
	&__swatch {
		flex-shrink: 0;
		width: var(--swatch-size);
		height: var(--swatch-size);
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-bg) 50%, var(--color-accent) 50%);
		box-shadow: 0 0 0 var(--border-thick) var(--color-border);
	}

	&__text {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	&__name {
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		line-height: var(--lh-tight);
		transition: color var(--transition-fast);
	}

	&__description {
		color: var(--color-text-muted);
		font-size: var(--nav-fs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-wide);
		line-height: var(--lh-tight);
		text-transform: uppercase;
	}

	&__check {
		flex-shrink: 0;
		width: var(--icon-size-sm);
		height: var(--icon-size-sm);
		color: var(--color-accent);
	}
}

.panel-enter-active,
.panel-leave-active {
	transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.panel-enter-from,
.panel-leave-to {
	opacity: 0;
	transform: translateY(calc(var(--space-2) * -1));
}

@media (prefers-reduced-motion: reduce) {
	.panel-enter-active,
	.panel-leave-active {
		transition: none;
	}
}
</style>
