<template>
	<Transition name="fade" mode="out-in">
		<AppLoader v-if="site.status === 'loading'" :label="t(fallback.ui.loading)" />

		<div v-else class="app">
			<StarField />
			<NyanCat />
			<FireMatrix v-if="fire" />
			<AppHeader :nav="data.nav" />
			<main>
				<HeroSection :hero="data.hero" />
				<template v-if="site.status === 'ready'">
					<SobreSection :sobre="data.sobre" />
					<StacksSection :stacks="data.stacks" />
					<ExperienciasSection :experiencias="data.experiencias" />
					<ProjetosSection :projetos="data.projetos" :ui="data.ui" />
				</template>
				<ContatosSection :contatos="data.contatos" :ui="data.ui" />
			</main>
			<AppFooter :footer="data.footer" />
		</div>
	</Transition>
</template>

<script setup>
import { computed, onMounted, watch, watchEffect } from 'vue'
import { loadSiteData, useSiteData } from '@/composables/useSiteData.js'
import { useLang } from '@/composables/useLang.js'
import { useTheme } from '@/composables/useTheme.js'
import { useDevtools } from '@/composables/useDevtools.js'
import FireMatrix from '@/components/layout/FireMatrix.vue'
import fallback from '@/data/fallback.js'
import AppLoader from '@/components/layout/AppLoader.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import StarField from '@/components/layout/StarField.vue'
import NyanCat from '@/components/ui/NyanCat.vue'
import HeroSection from '@/sections/HeroSection.vue'
import SobreSection from '@/sections/SobreSection.vue'
import StacksSection from '@/sections/StacksSection.vue'
import ExperienciasSection from '@/sections/ExperienciasSection.vue'
import ProjetosSection from '@/sections/ProjetosSection.vue'
import ContatosSection from '@/sections/ContatosSection.vue'

const site = useSiteData()
const data = computed(() => site.data)
const { t } = useLang()

onMounted(loadSiteData)

// Easter egg: na primeira abertura do DevTools (por carregamento), tema Inferno + chamas
// e aviso no console. Depois disso o usuário troca o tema normalmente pelo seletor.
const { fire, ignite } = useTheme()
const { open: devtoolsOpen } = useDevtools()
let triggered = false
watch(devtoolsOpen, (open) => {
	if (!open || triggered) return
	triggered = true
	ignite()
	const devtools = data.value?.devtools ?? fallback.devtools
	const styles = getComputedStyle(document.documentElement)
	const css = (name) => styles.getPropertyValue(name).trim()
	console.log(
		`%c${t(devtools.message)}`,
		`color: ${css('--fire-text')}; font-size: ${css('--fs-md')}; font-weight: ${css('--fw-extrabold')};`
	)
})

watchEffect(() => {
	const meta = data.value?.meta
	if (!meta) return
	document.title = t(meta.title)
	document.querySelector('meta[name="description"]')?.setAttribute('content', t(meta.description))
})
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
	transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
	.fade-enter-active,
	.fade-leave-active {
		transition: none;
	}
}
</style>
