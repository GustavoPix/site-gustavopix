import { reactive } from 'vue'
import fallback from '@/data/fallback.js'

const FILES = ['site', 'stacks', 'experiencias', 'projetos']
const TIMEOUT_MS = 8000

const state = reactive({
	status: 'loading', // 'loading' | 'ready' | 'fallback'
	data: null
})

async function fetchJson(name, signal) {
	const res = await fetch(`${import.meta.env.BASE_URL}data/${name}.json`, { signal, cache: 'no-cache' })
	if (!res.ok) throw new Error(`${name}.json: HTTP ${res.status}`)
	return res.json()
}

function shouldSimulateFailure() {
	return import.meta.env.DEV && new URLSearchParams(window.location.search).has('dataFail')
}

export async function loadSiteData() {
	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

	try {
		if (shouldSimulateFailure()) throw new Error('falha simulada (?dataFail)')
		const [site, stacks, experiencias, projetos] = await Promise.all(
			FILES.map((name) => fetchJson(name, controller.signal))
		)
		state.data = { ...site, stacks, experiencias, projetos }
		state.status = 'ready'
	} catch (error) {
		console.error('[site] dados não carregados, usando fallback:', error)
		state.data = fallback
		state.status = 'fallback'
	} finally {
		clearTimeout(timer)
	}
}

export function useSiteData() {
	return state
}
