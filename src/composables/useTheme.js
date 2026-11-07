import { nextTick, ref, watchEffect } from 'vue'

const STORAGE_KEY = 'theme'
export const THEMES = ['midnight', 'dracula', 'nord']

function initialTheme() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (THEMES.includes(saved)) return saved
	} catch {
		// localStorage indisponível
	}
	return THEMES[0]
}

const theme = ref(initialTheme())

watchEffect(() => {
	document.documentElement.dataset.theme = theme.value
	// theme-color acompanha o fundo do tema ativo
	const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
	if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
	try {
		localStorage.setItem(STORAGE_KEY, theme.value)
	} catch {
		// ignora: a preferência só não persiste
	}
})

// Troca com cross-fade da página inteira (View Transitions API; duração em --duration-theme).
// Sem suporte ou com prefers-reduced-motion, a troca é instantânea.
function setTheme(id) {
	if (!THEMES.includes(id) || id === theme.value) return
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (!document.startViewTransition || reducedMotion) {
		theme.value = id
		return
	}
	document.startViewTransition(async () => {
		theme.value = id
		await nextTick() // espera o watchEffect aplicar o data-theme
	})
}

export function useTheme() {
	return { theme, setTheme }
}
