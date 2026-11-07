<template>
	<section id="stacks" class="section" aria-labelledby="stacks-title">
		<div class="container">
			<SectionLabel id="stacks-title">{{ t(stacks.label) }}</SectionLabel>

			<div ref="root" class="stacks reveal" :class="{ 'is-revealed': revealed }">
				<Card
					v-for="(group, index) in stacks.groups"
					:key="index"
					:ref="setCard(index)"
					spotlight
					class="stacks__card reveal-card"
					:style="cardStyle(index)"
				>
					<h3 class="stacks__title">{{ t(group.title) }}</h3>
					<ul class="stacks__chips">
						<Chip
							v-for="(item, chipIndex) in group.items"
							:key="item"
							variant="outline"
							class="reveal-bullet"
							:style="{ '--i': chipIndex }"
						>
							{{ item }}
						</Chip>
					</ul>
				</Card>
			</div>
		</div>
	</section>
</template>

<script setup>
import { useLang } from '@/composables/useLang.js'
import { useStackReveal } from '@/composables/useReveal.js'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import Card from '@/components/ui/Card.vue'
import Chip from '@/components/ui/Chip.vue'

defineProps({
	stacks: { type: Object, required: true }
})

const { t } = useLang()
const { root, revealed, setCard, cardStyle } = useStackReveal()
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.stacks {
	display: grid;
	gap: var(--space-6);

	@include bp(md) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@include bp(lg) {
		gap: var(--space-7);
	}

	// Proporções da seção #skills de portfolio-sweandrew: título a 20px dos chips, chips a 10px
	&__card {
		gap: calc(var(--space-5) + var(--space-2));
	}

	&__title {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--color-text-muted);
		transition: color var(--transition-base);

		.stacks__card:hover & {
			color: var(--color-text);
		}
		font-size: var(--nav-fs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-label);
		line-height: var(--lh-tight);
		text-transform: uppercase;

		&::before {
			content: '';
			flex-shrink: 0;
			width: var(--dot-size-sm);
			height: var(--dot-size-sm);
			border-radius: 50%;
			background: var(--color-accent);
		}
	}

	&__chips {
		display: flex;
		flex-wrap: wrap;
		gap: calc(var(--space-3) + var(--space-1));
	}
}
</style>
