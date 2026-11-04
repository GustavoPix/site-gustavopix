<template>
	<section id="sobre" class="section" aria-labelledby="sobre-title">
		<div class="container">
			<SectionLabel id="sobre-title">{{ t(sobre.label) }}</SectionLabel>

			<div class="sobre">
				<div class="sobre__text">
					<p class="sobre__lead">{{ t(sobre.lead) }}</p>
					<p class="sobre__body">{{ t(sobre.text) }}</p>
				</div>

				<dl class="sobre__stats">
					<Card
						v-for="(stat, index) in sobre.stats"
						:key="index"
						tag="div"
						spotlight
						class="sobre__stat"
					>
						<dt class="sobre__stat-label">{{ t(stat.label) }}</dt>
						<dd class="sobre__stat-value">{{ t(stat.value) }}</dd>
					</Card>
				</dl>
			</div>
		</div>
	</section>
</template>

<script setup>
import { useLang } from '@/composables/useLang.js'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import Card from '@/components/ui/Card.vue'

defineProps({
	sobre: { type: Object, required: true }
})

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.sobre {
	display: grid;
	gap: var(--space-9);

	@include bp(lg) {
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: start;
		gap: var(--space-10);
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		max-width: var(--text-max);
	}

	&__lead,
	&__body {
		font-size: var(--fs-lg);
		line-height: var(--lh-body);
	}

	&__body {
		color: var(--color-text-muted);
	}

	// Mesmo espaçamento entre cards da seção Stacks
	&__stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-6);

		@include bp(lg) {
			gap: var(--space-7);
		}
	}

	&__stat {
		container-type: inline-size;
		flex-direction: column-reverse;
		justify-content: flex-end;
		gap: var(--space-3);
	}

	// O número encolhe com a largura do card (até --fs-stat) para valores como "99.9%" caberem
	&__stat-value {
		color: var(--color-accent);
		font-size: min(var(--fs-stat), 34cqi);
		overflow-wrap: anywhere;
		font-weight: var(--fw-semibold);
		line-height: var(--lh-tight);
	}

	&__stat-label {
		color: var(--color-text-muted);
		font-size: var(--fs-md);
		font-weight: var(--fw-semibold);
		line-height: var(--lh-tight);
	}
}
</style>
