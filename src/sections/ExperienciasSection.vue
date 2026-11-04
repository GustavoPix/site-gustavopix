<template>
	<section id="experiencias" class="section" aria-labelledby="experiencias-title">
		<div class="container">
			<SectionLabel id="experiencias-title">{{ t(experiencias.label) }}</SectionLabel>

			<div ref="timeline" class="timeline" :style="{ '--progress': progress }">
				<div class="timeline__track" aria-hidden="true">
					<span class="timeline__fill"></span>
					<span class="timeline__head"></span>
				</div>

				<ol class="timeline__list">
					<li
						v-for="(item, index) in experiencias.items"
						:key="index"
						:ref="(el) => (itemEls[index] = el)"
						class="timeline__item"
						:class="{ 'is-active': active[index], 'is-current': index === currentIndex }"
					>
						<span class="timeline__marker" aria-hidden="true"></span>
						<p class="timeline__period">{{ t(item.period) }}</p>
						<h3 class="timeline__title">
							<span>{{ t(item.role) }}</span>
							<span class="timeline__sep" aria-hidden="true"></span>
							<span>{{ t(item.company) }}</span>
						</h3>
						<p class="timeline__description">{{ t(item.description) }}</p>
					</li>
				</ol>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLang } from '@/composables/useLang.js'
import SectionLabel from '@/components/ui/SectionLabel.vue'

const props = defineProps({
	experiencias: { type: Object, required: true }
})

// Timeline guiada pelo scroll, como a seção #experience de portfolio-sweandrew:
// o preenchimento avança até a "cabeça" (meio da viewport) e os itens logo acima dela ficam ativos
const HEAD = 0.5 // posição da cabeça na viewport (0 = topo)
const BAND = 0.35 // faixa acima da cabeça em que um item fica ativo

const { t } = useLang()
const timeline = ref(null)
const itemEls = []
const progress = ref(0)
const active = ref(props.experiencias.items.map(() => false))
const currentIndex = computed(() => active.value.lastIndexOf(true))

// Cálculo leve (poucos getBoundingClientRect), feito direto no scroll
function update() {
	if (!timeline.value) return
	const viewport = window.innerHeight
	const headY = viewport * HEAD
	const rect = timeline.value.getBoundingClientRect()

	progress.value = Math.min(1, Math.max(0, (headY - rect.top) / rect.height))
	active.value = itemEls.map((el) => {
		const markerY = el.getBoundingClientRect().top
		return markerY <= headY && markerY >= headY - viewport * BAND
	})
}

onMounted(() => {
	update()
	window.addEventListener('scroll', update, { passive: true })
	window.addEventListener('resize', update)
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', update)
	window.removeEventListener('resize', update)
})
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.timeline {
	// Centro do marcador: a linha e a cabeça passam exatamente por ele
	--marker-center: calc(var(--space-1) + var(--dot-size) / 2);
	position: relative;
	max-width: calc(var(--text-max) + var(--space-8));

	&__track {
		position: absolute;
		top: var(--marker-center);
		bottom: 0;
		left: calc((var(--dot-size) - var(--border-thick)) / 2);
		width: var(--border-thick);
		background: var(--color-border);
	}

	&__fill {
		position: absolute;
		inset: 0;
		background: var(--color-accent);
		transform: scaleY(var(--progress));
		transform-origin: top;
	}

	&__head {
		position: absolute;
		top: calc(var(--progress) * 100%);
		left: 50%;
		width: var(--dot-head);
		height: var(--dot-head);
		border-radius: 50%;
		background: var(--color-accent);
		box-shadow: 0 0 var(--space-4) var(--space-2) var(--color-accent-glow);
		transform: translate(-50%, -50%);
		opacity: clamp(0, calc(var(--progress) * 100), 1);
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	&__item {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding-inline-start: var(--space-8);

		// Desativado: conteúdo a 50%; ativo: opacidade total
		> :not(.timeline__marker) {
			opacity: var(--timeline-inactive);
			transition: opacity var(--transition-timeline);
		}

		&.is-active > :not(.timeline__marker) {
			opacity: 1;
		}
	}

	&__marker {
		position: absolute;
		top: var(--space-1);
		left: 0;
		z-index: 1;
		width: var(--dot-size);
		height: var(--dot-size);
		border: var(--border-thin) solid var(--color-text-faint);
		border-radius: 50%;
		background: var(--color-bg);
		transition:
			background-color var(--transition-timeline),
			border-color var(--transition-timeline);

		.is-active & {
			border-color: var(--color-accent);
			background: var(--color-accent);
		}

		// Anel pulsante no item atual
		&::after {
			content: '';
			position: absolute;
			inset: calc(var(--border-thin) * -1);
			border-radius: 50%;
			background: var(--color-accent-glow);
			opacity: 0;
		}

		.is-current &::after {
			animation: timeline-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
		}
	}

	&__period {
		color: var(--color-accent);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		line-height: var(--lh-tight);
	}

	&__title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2) var(--space-5);
		font-size: var(--fs-lg);
		font-weight: var(--fw-semibold);
		line-height: var(--lh-tight);
	}

	&__sep {
		width: var(--space-2);
		height: var(--space-2);
		border-radius: 50%;
		background: var(--color-text-faint);
	}

	&__description {
		color: var(--color-text-muted);
		font-size: var(--fs-lg);
		line-height: var(--lh-body);
	}
}

@keyframes timeline-ping {
	0% {
		opacity: 1;
		transform: scale(1);
	}

	75%,
	100% {
		opacity: 0;
		transform: scale(2);
	}
}

@media (prefers-reduced-motion: reduce) {
	.timeline__item > *,
	.timeline__marker {
		transition: none;
	}

	.is-current .timeline__marker::after {
		animation: none;
	}
}
</style>
