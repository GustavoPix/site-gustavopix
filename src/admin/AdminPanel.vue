<template>
	<div class="admin">
		<aside class="admin__side">
			<h1 class="admin__title">Painel de conteúdo</h1>
			<nav aria-label="Arquivos de dados">
				<ul class="admin__files">
					<li v-for="file in FILES" :key="file.name">
						<button
							type="button"
							class="admin__file"
							:class="{ 'is-active': file.name === active }"
							:aria-current="file.name === active ? 'page' : null"
							@click="active = file.name"
						>
							{{ file.label }}
							<span v-if="dirtyFiles.includes(file.name)" class="admin__dot">
								<span class="sr-only">(não salvo)</span>
							</span>
						</button>
					</li>
				</ul>
			</nav>
		</aside>

		<main class="admin__main">
			<div class="admin__bar">
				<p class="admin__status" :class="{ 'is-error': hasError }" role="status">{{ statusText }}</p>
				<div class="admin__actions">
					<PillButton href="/" target="_blank" rel="noopener" variant="ghost" size="sm">Ver site</PillButton>
					<PillButton variant="ghost" size="sm" :disabled="!isDirty || isSaving" @click="discard">Descartar</PillButton>
					<PillButton size="sm" :disabled="!isDirty || isSaving" @click="save">Salvar</PillButton>
				</div>
			</div>

			<ul v-if="state.problems.length" class="admin__problems">
				<li v-for="problem in state.problems" :key="problem">{{ problem }}</li>
			</ul>

			<p v-if="state.status === 'loading'">Carregando…</p>
			<p v-else-if="state.status === 'error'" class="admin__status is-error">{{ state.error }}</p>

			<div v-else-if="active === 'site'" class="admin__blocks">
				<details
					v-for="key in Object.keys(state.drafts.site)"
					:key="key"
					class="admin__block"
					:open="key === 'hero'"
				>
					<summary class="admin__summary">{{ fieldLabel(key) }}</summary>
					<AdminField v-model="state.drafts.site[key]" class="admin__fields" :path="`site.${key}`" />
				</details>
			</div>

			<div v-else class="admin__block">
				<AdminField :key="active" v-model="state.drafts[active]" class="admin__fields" :path="active" />
			</div>
		</main>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import PillButton from '@/components/ui/PillButton.vue'
import AdminField from './AdminField.vue'
import { fieldLabel } from './fieldRules.js'
import { FILES, useAdminData } from './useAdminData.js'

const { state, dirtyFiles, load, save, discard } = useAdminData()
const active = ref(FILES[0].name)

const isDirty = computed(() => dirtyFiles.value.length > 0)
const isSaving = computed(() => state.saveStatus === 'saving')
const hasError = computed(() => ['invalid', 'error'].includes(state.saveStatus))

const statusText = computed(() => {
	if (isSaving.value) return 'Salvando…'
	if (state.saveStatus === 'invalid') return 'Corrija os itens abaixo para salvar.'
	if (state.saveStatus === 'error') return `Erro ao salvar: ${state.error}`
	if (isDirty.value) {
		const names = FILES.filter((file) => dirtyFiles.value.includes(file.name)).map((file) => file.label)
		return `Alterações não salvas: ${names.join(', ')}`
	}
	return state.saveStatus === 'saved' ? 'Salvo.' : 'Sem alterações.'
})

function warnUnsaved(event) {
	if (isDirty.value) event.preventDefault()
}

onMounted(() => {
	document.title = 'Painel · Gustavo Carvalho'
	window.addEventListener('beforeunload', warnUnsaved)
	load()
})

onBeforeUnmount(() => window.removeEventListener('beforeunload', warnUnsaved))
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.admin {
	display: grid;
	min-height: 100dvh;

	@include bp(lg) {
		grid-template-columns: var(--panel-width) minmax(0, 1fr);
	}

	&__side {
		display: grid;
		align-content: start;
		gap: var(--space-5);
		padding: var(--space-6) var(--container-pad);
		border-block-end: var(--border-thin) solid var(--color-border);

		@include bp(lg) {
			position: sticky;
			top: 0;
			height: 100dvh;
			padding-inline: var(--space-6);
			border-block-end: 0;
			border-inline-end: var(--border-thin) solid var(--color-border);
		}
	}

	&__title {
		font-size: var(--fs-md);
		font-weight: var(--fw-semibold);
		line-height: var(--lh-tight);
	}

	&__files {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);

		@include bp(lg) {
			flex-direction: column;
		}
	}

	&__file {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		width: 100%;
		height: var(--control-height-sm);
		padding-inline: var(--space-5);
		border-radius: var(--radius-pill);
		color: var(--color-text-soft);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		transition: background-color var(--transition-fast), color var(--transition-fast);
		@include focus-ring;

		&:hover {
			background: var(--color-hover);
		}

		&.is-active {
			background: var(--color-primary-dark);
			color: var(--color-text);
		}
	}

	&__dot {
		width: var(--dot-size-sm);
		height: var(--dot-size-sm);
		border-radius: var(--radius-pill);
		background: var(--color-accent);
	}

	&__main {
		display: grid;
		align-content: start;
		gap: var(--space-5);
		width: 100%;
		max-width: var(--hero-max);
		margin-inline: auto;
		padding: 0 var(--container-pad) var(--space-8);
	}

	&__bar {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding-block: var(--space-5);
		background: var(--color-bg-translucent);
		backdrop-filter: blur(var(--blur));
	}

	&__status {
		font-size: var(--fs-sm);
		color: var(--color-text-soft);

		&.is-error {
			color: var(--color-accent);
		}
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);

		:deep(.pill:disabled) {
			background: transparent;
			border-color: var(--color-border);
			color: var(--color-text-muted);
			cursor: not-allowed;
		}
	}

	&__problems {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-5);
		border: var(--border-thin) solid var(--color-accent-line);
		border-radius: var(--radius-option);
		background: var(--color-accent-soft);
		font-size: var(--fs-sm);
	}

	&__blocks {
		display: grid;
		gap: var(--space-4);
	}

	&__block {
		padding: var(--space-5);
		border: var(--border-thin) solid var(--color-border);
		border-radius: var(--radius-card);

		@include bp(md) {
			padding: var(--space-6);
		}
	}

	&__summary {
		font-weight: var(--fw-semibold);
		cursor: pointer;
		@include focus-ring;
	}

	details[open] > &__fields {
		margin-block-start: var(--space-5);
	}
}
</style>
