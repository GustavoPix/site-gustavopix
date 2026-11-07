import { nextTick, ref, watchEffect } from 'vue'

const STORAGE_KEY = 'theme'
export const THEMES = ['midnight', 'dracula', 'nord', 'forest', 'red']

function initialTheme() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (THEMES.includes(saved)) return saved
	} catch {
		// localStorage indisponível
	}
	return THEMES[0]
}

const FIRE_THEME = 'red'

const theme = ref(initialTheme())
// Chamas do tema Inferno (FireMatrix.vue): ligadas na primeira abertura do DevTools
// ou clicando de novo no Inferno já ativo; qualquer troca de tema as desliga.
const fire = ref(false)

watchEffect(() => {
	document.documentElement.dataset.theme = theme.value
	// theme-color acompanha o fundo do tema ativo
	const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
	if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
})

watchEffect(() => {
	try {
		localStorage.setItem(STORAGE_KEY, theme.value)
	} catch {
		// ignora: a preferência só não persiste
	}
})

// Troca com cross-fade da página inteira (View Transitions API; duração em --duration-theme).
// Sem suporte ou com prefers-reduced-motion, a troca é instantânea.
function transition(apply) {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (!document.startViewTransition || reducedMotion) {
		apply()
		return
	}
	document.startViewTransition(async () => {
		apply()
		await nextTick() // espera o watchEffect aplicar o data-theme
	})
}

// Escolher o Inferno com ele já ativo liga/desliga as chamas
function setTheme(id) {
	if (!THEMES.includes(id)) return
	if (id === theme.value) {
		if (id === FIRE_THEME) fire.value = !fire.value
		return
	}
	fire.value = false
	transition(() => {
		theme.value = id
	})
}

// Inferno + chamas (easter egg do DevTools)
function ignite() {
	setTheme(FIRE_THEME)
	fire.value = true
}

export function useTheme() {
	return { theme, fire, setTheme, ignite }
}
