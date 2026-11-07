<template>
	<footer class="footer">
		<div class="container">
			<small>{{ text }}</small>
		</div>
	</footer>
</template>

<script setup>
import { computed } from 'vue'
import { useLang } from '@/composables/useLang.js'

const props = defineProps({
	footer: { type: Object, required: true }
})

const { t } = useLang()
const text = computed(() => t(props.footer.text).replace('{year}', new Date().getFullYear()))
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.footer {
	margin-block-start: var(--space-footer-mobile);
	padding-block: var(--space-8);

	@include bp(lg) {
		margin-block-start: 0;
	}

	color: var(--color-text-muted);
	font-size: var(--fs-sm);
	text-align: center;
}
</style>
