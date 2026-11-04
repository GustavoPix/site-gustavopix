import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'lang'
const LANGS = ['pt', 'en']
const HTML_LANG = { pt: 'pt-BR', en: 'en' }

function initialLang() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (LANGS.includes(saved)) return saved
	} catch {
		// localStorage indisponível (modo privado, bloqueio de cookies)
	}
	return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

const lang = ref(initialLang())

watchEffect(() => {
	document.documentElement.lang = HTML_LANG[lang.value]
	try {
		localStorage.setItem(STORAGE_KEY, lang.value)
	} catch {
		// ignora: a preferência só não persiste
	}
})

// Resolve um campo bilíngue { pt, en } ou devolve strings simples como estão
function t(field) {
	if (field == null) return ''
	if (typeof field !== 'object') return field
	return field[lang.value] ?? field.pt ?? ''
}

function toggleLang() {
	lang.value = lang.value === 'pt' ? 'en' : 'pt'
}

export function useLang() {
	return { lang, t, toggleLang }
}
