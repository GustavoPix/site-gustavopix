<template>
	<section id="contatos" class="section" aria-labelledby="contatos-title">
		<div class="container">
			<SectionLabel id="contatos-title">{{ t(contatos.label) }}</SectionLabel>

			<dl class="contatos">
				<div v-for="item in contatos.items" :key="item.url" class="contatos__row">
					<dt class="contatos__type">
						<ContactIcon :name="item.icon" class="contatos__icon" />
						{{ t(item.type) }}
					</dt>
					<dd>
						<a
							:href="item.url"
							class="contatos__link"
							v-bind="item.url.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}"
						>
							{{ item.value }}
							<span v-if="item.url.startsWith('http')" class="sr-only">({{ t(ui.newTab) }})</span>
						</a>
					</dd>
				</div>
			</dl>

			<div v-if="contatos.support" class="contatos__support">
				<p>{{ t(contatos.support.text) }}</p>
				<PillButton
					:href="contatos.support.url"
					variant="ghost"
					size="sm"
					:new-tab-label="t(ui.newTab)"
				>
					{{ t(contatos.support.label) }}
				</PillButton>
			</div>
		</div>
	</section>
</template>

<script setup>
import { useLang } from '@/composables/useLang.js'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import PillButton from '@/components/ui/PillButton.vue'
import ContactIcon from '@/components/ui/ContactIcon.vue'

defineProps({
	contatos: { type: Object, required: true },
	ui: { type: Object, required: true }
})

const { t } = useLang()
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
	}

	// Ícone acende no accent junto com o link, como na referência
	&__icon {
		color: var(--color-text-dim);
		transition: color var(--transition-fast);

		.contatos__row:hover & {
			color: var(--color-accent);
		}
	}

	&__link {
		font-size: var(--fs-lg);
		line-height: var(--lh-tight);
		overflow-wrap: anywhere;
		border-block-end: var(--border-thin) solid transparent;
		transition: border-color var(--transition-fast), color var(--transition-fast);
		@include focus-ring;

		&:hover {
			color: var(--color-accent);
			border-color: var(--color-accent);
		}
	}

	&__support {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-5);
		margin-block-start: var(--space-9);
		color: var(--color-text-muted);
		font-size: var(--fs-md);
	}
}
</style>
