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
.footer {
	padding-block: var(--space-8);
	color: var(--color-text-muted);
	font-size: var(--fs-sm);
	text-align: center;
}
</style>
