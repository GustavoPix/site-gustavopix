<template>
	<section id="projetos" class="section" aria-labelledby="projetos-title">
		<div class="container">
			<SectionLabel id="projetos-title">{{ t(projetos.label) }}</SectionLabel>
			<p class="projetos__intro">{{ t(projetos.intro) }}</p>

			<div class="projetos">
				<Card v-for="item in projetos.items" :key="item.id" spotlight class="projetos__card">
					<h3 class="projetos__title">{{ t(item.title) }}</h3>
					<p class="projetos__description">{{ t(item.description) }}</p>
					<ul v-if="item.tags?.length" class="projetos__tags">
						<Chip v-for="tag in item.tags" :key="tag" variant="outline">{{ tag }}</Chip>
					</ul>
					<div class="projetos__action">
						<PillButton :href="item.url" size="sm" :new-tab-label="t(ui.newTab)">
							{{ t(ui.visit) }}
						</PillButton>
					</div>
				</Card>
			</div>
		</div>
	</section>
</template>

<script setup>
import { useLang } from '@/composables/useLang.js'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import Card from '@/components/ui/Card.vue'
import Chip from '@/components/ui/Chip.vue'
import PillButton from '@/components/ui/PillButton.vue'

defineProps({
	projetos: { type: Object, required: true },
	ui: { type: Object, required: true }
})

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

// Mesmo padrão dos cards de Stacks: spotlight, chips outline e espaçamentos
.projetos {
	display: grid;
	gap: var(--space-6);

	@include bp(md) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@include bp(lg) {
		gap: var(--space-7);
	}

	@include bp(xl) {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	&__card {
		gap: calc(var(--space-5) + var(--space-2));
	}

	&__intro {
		max-width: var(--text-max);
		margin-block-end: var(--space-8);
		color: var(--color-text-muted);
		font-size: var(--fs-lg);
		line-height: var(--lh-body);
	}

	&__title {
		font-size: var(--fs-lg);
		font-weight: var(--fw-semibold);
		line-height: var(--lh-tight);
	}

	&__description {
		color: var(--color-text-muted);
		font-size: var(--fs-md);
		line-height: var(--lh-body);
	}

	&__tags {
		display: flex;
		flex-wrap: wrap;
		gap: calc(var(--space-3) + var(--space-1));
	}

	&__action {
		margin-block-start: auto;
		padding-block-start: var(--space-5);
	}
}
</style>
