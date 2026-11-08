import { computed, reactive } from 'vue'
import { validate } from './fieldRules.js'

export const FILES = [
	{ name: 'site', label: 'Site' },
	{ name: 'stacks', label: 'Stacks' },
	{ name: 'experiencias', label: 'Experiências' },
	{ name: 'projetos', label: 'Projetos' }
]

const endpoint = (name) => `/__admin/data/${name}`
const fileLabel = (name) => FILES.find((file) => file.name === name).label

async function readError(res) {
	const body = await res.json().catch(() => null)
	return body?.error ?? `HTTP ${res.status}`
}

async function fetchFile(name) {
	const res = await fetch(endpoint(name), { cache: 'no-store' })
	if (!res.ok) throw new Error(`${name}.json: ${await readError(res)}`)
	return res.text()
}

async function putFile(name, body) {
	const res = await fetch(endpoint(name), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body
	})
	if (!res.ok) throw new Error(`${name}.json: ${await readError(res)}`)
}

export function useAdminData() {
	const state = reactive({
		status: 'loading', // 'loading' | 'ready' | 'error'
		saveStatus: 'idle', // 'idle' | 'saving' | 'saved' | 'invalid' | 'error'
		error: '',
		problems: [],
		originals: {}, // texto normalizado do que está em disco
		drafts: {}
	})

	const dirtyFiles = computed(() =>
		state.status === 'ready'
			? FILES.map((file) => file.name).filter(
				(name) => JSON.stringify(state.drafts[name]) !== state.originals[name]
			)
			: []
	)

	async function load() {
		state.status = 'loading'
		try {
			const contents = await Promise.all(FILES.map((file) => fetchFile(file.name)))
			FILES.forEach(({ name }, index) => {
				const data = JSON.parse(contents[index])
				state.drafts[name] = data
				state.originals[name] = JSON.stringify(data)
			})
			state.status = 'ready'
		} catch (error) {
			state.error = error.message
			state.status = 'error'
		}
	}

	async function save() {
		const targets = dirtyFiles.value
		if (!targets.length) return

		state.problems = targets.flatMap((name) =>
			validate(name, state.drafts[name]).map((problem) => `${fileLabel(name)} › ${problem}`)
		)
		if (state.problems.length) {
			state.saveStatus = 'invalid'
			return
		}

		state.saveStatus = 'saving'
		try {
			for (const name of targets) {
				const body = JSON.stringify(state.drafts[name])
				await putFile(name, body)
				state.originals[name] = body
			}
			state.saveStatus = 'saved'
		} catch (error) {
			state.error = error.message
			state.saveStatus = 'error'
		}
	}

	function discard() {
		FILES.forEach(({ name }) => {
			state.drafts[name] = JSON.parse(state.originals[name])
		})
		state.problems = []
		state.saveStatus = 'idle'
	}

	return { state, dirtyFiles, load, save, discard }
}
