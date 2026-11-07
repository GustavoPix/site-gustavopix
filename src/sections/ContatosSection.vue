<template>
	<section id="contatos" class="section" aria-labelledby="contatos-title">
		<div class="container">
			<SectionLabel id="contatos-title">{{ t(contatos.label) }}</SectionLabel>

			<!-- Ícones surgem de cima para baixo; depois, tipo e valor entram da esquerda (useReveal) -->
			<ul
				ref="root"
				class="contatos reveal"
				:class="{ 'is-revealed': revealed }"
				:style="{ '--count': contatos.items.length }"
			>
				<li v-for="(item, index) in contatos.items" :key="item.url" :style="{ '--i': index }">
					<!-- A linha inteira é o link -->
					<a
						:href="item.url"
						class="contatos__row"
						v-bind="item.url.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}"
					>
						<span class="contatos__type">
							<ContactIcon :name="item.icon" class="contatos__icon reveal-pop" />
							<span class="reveal-info">{{ t(item.type) }}</span>
						</span>
						<span class="contatos__value reveal-info">{{ item.value }}</span>
						<span v-if="item.url.startsWith('http')" class="sr-only">({{ t(ui.newTab) }})</span>
					</a>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup>
import { useLang } from '@/composables/useLang.js'
import { useReveal } from '@/composables/useReveal.js'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import ContactIcon from '@/components/ui/ContactIcon.vue'

defineProps({
	contatos: { type: Object, required: true },
	ui: { type: Object, required: true }
})

const { t } = useLang()
const { root, revealed } = useReveal()
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.contatos {
	display: flex;
	flex-direction: column;
	gap: var(--space-6);

	&__row {
		display: grid;
		gap: var(--space-2);
		@include focus-ring;

		@include bp(sm) {
			grid-template-columns: var(--space-11) minmax(0, 1fr);
			align-items: center;
			gap: var(--space-5);
		}
	}

	&__type {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		color: var(--color-text-muted);
		font-size: var(--fs-sm);
		line-height: var(--lh-tight);
		transition: color var(--transition-fast);

		.contatos__row:hover & {
			color: var(--color-text);
		}
	}

	// Ícone acende no accent junto com o valor, como na referência
	&__icon {
		color: var(--color-text-dim);
		transition: color var(--transition-fast);

		.contatos__row:hover & {
			color: var(--color-accent);
		}
	}

	&__value {
		font-size: var(--fs-lg);
		line-height: var(--lh-tight);
		overflow-wrap: anywhere;
		transition: color var(--transition-fast);

		.contatos__row:hover & {
			color: var(--color-accent);
		}
	}
}
</style>
