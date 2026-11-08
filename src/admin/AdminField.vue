<template>
	<div v-if="kind === 'bilingual'" class="field">
		<span class="field__label">{{ label }}</span>
		<div class="field__pair">
			<AdminField v-model="model.pt" label="PT" :path="`${path}.pt`" />
			<AdminField v-model="model.en" label="EN" :path="`${path}.en`" />
		</div>
	</div>

	<div v-else-if="kind === 'array'" class="list">
		<span v-if="label" class="field__label">{{ label }}</span>
		<ul class="list__items">
			<li
				v-for="(item, index) in model"
				:key="index"
				class="list__item"
				:class="{ 'list__item--text': !hasObjects }"
			>
				<p v-if="hasObjects" class="list__summary">
					<span class="list__index">{{ index + 1 }}</span>
					{{ itemSummary(item) }}
				</p>
				<div v-if="!fixed" class="list__actions">
					<button
						type="button"
						class="list__action"
						:disabled="index === 0"
						:aria-label="`Mover item ${index + 1} para cima`"
						@click="move(index, -1)"
					>
						↑
					</button>
					<button
						type="button"
						class="list__action"
						:disabled="index === model.length - 1"
						:aria-label="`Mover item ${index + 1} para baixo`"
						@click="move(index, 1)"
					>
						↓
					</button>
					<button
						type="button"
						class="list__action"
						:disabled="!canRemove"
						:aria-label="`Remover item ${index + 1}`"
						@click="remove(index)"
					>
						✕
					</button>
				</div>
				<AdminField
					v-model="model[index]"
					class="list__child"
					:label="hasObjects ? '' : `${label} ${index + 1}`"
					:hide-label="!hasObjects"
					:path="`${path}[]`"
				/>
			</li>
		</ul>
		<PillButton v-if="!fixed" variant="ghost" size="sm" class="list__add" @click="add">Adicionar</PillButton>
	</div>

	<div v-else-if="kind === 'object'" class="group">
		<AdminField
			v-for="key in Object.keys(model)"
			:key="key"
			v-model="model[key]"
			:label="fieldLabel(key)"
			:path="`${path}.${key}`"
		/>
	</div>

	<label v-else-if="kind === 'select'" class="field">
		<span class="field__label">{{ label }}</span>
		<select v-model="model" class="field__control">
			<option v-for="option in options" :key="option" :value="option">{{ option }}</option>
		</select>
	</label>

	<label v-else-if="kind === 'boolean'" class="field field--inline">
		<input v-model="model" type="checkbox" />
		<span class="field__label">{{ label }}</span>
	</label>

	<label v-else-if="kind === 'number'" class="field">
		<span class="field__label">{{ label }}</span>
		<input v-model.number="model" type="number" class="field__control" />
	</label>

	<label v-else-if="kind === 'text'" class="field">
		<span class="field__label" :class="{ 'sr-only': hideLabel }">{{ label }}</span>
		<textarea
			v-model="model"
			rows="1"
			class="field__control"
			:readonly="readOnly"
			@keydown.enter="blockLineBreak"
		></textarea>
	</label>

	<p v-else class="field__label">{{ label }}: valor não editável</p>
</template>

<script setup>
import { computed } from 'vue'
import PillButton from '@/components/ui/PillButton.vue'
import {
	allowsLineBreak,
	blankFrom,
	fieldLabel,
	isBilingual,
	isFixedLength,
	isObject,
	isReadOnly,
	itemSummary,
	selectOptions
} from './fieldRules.js'

const model = defineModel({ type: null, required: true })
const props = defineProps({
	label: { type: String, default: '' },
	hideLabel: { type: Boolean, default: false },
	path: { type: String, required: true }
})

const options = computed(() => selectOptions(props.path))
const readOnly = computed(() => isReadOnly(props.path))
const fixed = computed(() => isFixedLength(props.path))

const kind = computed(() => {
	const value = model.value
	if (options.value) return 'select'
	if (Array.isArray(value)) return 'array'
	if (isBilingual(value)) return 'bilingual'
	if (isObject(value)) return 'object'
	if (['string', 'number', 'boolean'].includes(typeof value)) {
		return typeof value === 'string' ? 'text' : typeof value
	}
	return 'unknown'
})

const hasObjects = computed(() => kind.value === 'array' && isObject(model.value[0]))
// Listas de objetos mantêm um item, que serve de molde para novos itens
const canRemove = computed(() => !hasObjects.value || model.value.length > 1)

function add() {
	const list = model.value
	list.push(list.length ? blankFrom(list[0], `${props.path}[]`) : '')
}

function remove(index) {
	model.value.splice(index, 1)
}

function move(index, delta) {
	const list = model.value
	const [item] = list.splice(index, 1)
	list.splice(index + delta, 0, item)
}

// O campo cresce como textarea, mas Enter só quebra linha onde o texto usa quebras
function blockLineBreak(event) {
	if (!allowsLineBreak(props.path) && !model.value.includes('\n')) event.preventDefault()
}
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.field {
	display: grid;
	gap: var(--space-2);
	min-width: 0;

	&--inline {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	&__label {
		color: var(--color-text-soft);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
	}

	&__pair {
		display: grid;
		gap: var(--space-4);

		@include bp(md) {
			grid-template-columns: 1fr 1fr;
		}
	}

	&__control {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		border: var(--border-thin) solid var(--color-control-line);
		border-radius: var(--radius-option);
		background: var(--color-bg);
		color: var(--color-text);
		font: inherit;
		field-sizing: content;
		resize: none;
		transition: border-color var(--transition-fast);

		&:hover {
			border-color: var(--color-accent-line);
		}

		&:focus-visible {
			outline: var(--border-thick) solid var(--color-accent);
			outline-offset: 0;
		}

		&:read-only:not(select) {
			border-style: dashed;
			color: var(--color-text-soft);
		}
	}
}

.group {
	display: grid;
	gap: var(--space-5);
}

.list {
	display: grid;
	gap: var(--space-3);

	&__items {
		display: grid;
		gap: var(--space-3);
	}

	&__item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-5);
		border: var(--border-thin) solid var(--color-border);
		border-radius: var(--radius-option);
		background: var(--color-option);

		&--text {
			padding: 0;
			border: 0;
			background: none;
		}
	}

	&__child {
		grid-column: 1 / -1;
	}

	&__item--text &__child {
		grid-column: 1;
		grid-row: 1;
	}

	&__summary {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-width: 0;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	&__index {
		color: var(--color-accent);
	}

	&__actions {
		display: flex;
		gap: var(--space-1);
	}

	&__action {
		width: var(--control-height-sm);
		height: var(--control-height-sm);
		border-radius: var(--radius-pill);
		transition: background-color var(--transition-fast);
		@include focus-ring;

		&:hover:not(:disabled) {
			background: var(--color-active);
		}

		&:disabled {
			color: var(--color-text-faint);
			cursor: not-allowed;
		}
	}

	&__add {
		justify-self: start;
	}
}
</style>
