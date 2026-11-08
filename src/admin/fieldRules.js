// Exceções do formulário, por caminho no JSON. O caminho começa pelo arquivo e usa [] para
// itens de lista: 'projetos.items[].url'. Campos fora destas listas são editáveis livremente.

// Dependem de âncoras e de temas no código, ou são gerados ao adicionar um item
const READ_ONLY = new Set([
	'site.nav.items[].id',
	'site.nav.cta.id',
	'site.nav.themes.items[].id',
	'projetos.items[].id'
])

// Cada item exige uma seção ou um tema no código
const FIXED_LENGTH = new Set(['site.nav.items', 'site.nav.themes.items'])

// Valores aceitos: os ícones de ContactIcon.vue
const SELECTS = {
	'site.contatos.items[].icon': ['email', 'linkedin', 'github', 'whatsapp']
}

const GENERATED_IDS = new Set(['projetos.items[].id'])
const REQUIRED = new Set(['projetos.items[].url', 'site.contatos.items[].url'])
const MULTILINE = new Set(['site.hero.name'])

const LABELS = {
	brand: 'Marca',
	button: 'Botão',
	company: 'Empresa',
	contatos: 'Contatos',
	cta: 'Botão de contato',
	description: 'Descrição',
	devtools: 'Aviso do console',
	footer: 'Rodapé',
	groups: 'Grupos',
	hero: 'Início',
	icon: 'Ícone',
	id: 'ID',
	intro: 'Introdução',
	items: 'Itens',
	label: 'Rótulo',
	langShort: 'Sigla do idioma',
	langToggle: 'Trocar idioma',
	lead: 'Parágrafo principal',
	loading: 'Carregando',
	menuClose: 'Fechar menu',
	menuOpen: 'Abrir menu',
	message: 'Mensagem',
	meta: 'Metadados',
	name: 'Nome',
	nav: 'Navegação',
	newTab: 'Nova aba',
	period: 'Período',
	role: 'Cargo',
	sobre: 'Sobre',
	stack: 'Stack',
	stackLabel: 'Rótulo da stack',
	stats: 'Números',
	tagline: 'Frase de apresentação',
	tags: 'Tags',
	text: 'Texto',
	themes: 'Temas',
	title: 'Título',
	type: 'Tipo',
	ui: 'Textos da interface',
	url: 'URL',
	value: 'Valor',
	visit: 'Visite'
}

export const isReadOnly = (path) => READ_ONLY.has(path)
export const isFixedLength = (path) => FIXED_LENGTH.has(path)
export const selectOptions = (path) => SELECTS[path] ?? null
export const allowsLineBreak = (path) => MULTILINE.has(path)
export const fieldLabel = (key) => LABELS[key] ?? key

export const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

export function isBilingual(value) {
	if (!isObject(value)) return false
	const keys = Object.keys(value)
	return keys.length === 2 && typeof value.pt === 'string' && typeof value.en === 'string'
}

// Texto curto que identifica um item recolhido numa lista
export function itemSummary(item) {
	if (!isObject(item)) return ''
	const value = item.title ?? item.role ?? item.label ?? item.name ?? item.type ?? item.period
	return typeof value === 'string' ? value : value?.pt ?? ''
}

// Item novo: mesma forma do exemplo, com os textos vazios
export function blankFrom(sample, path) {
	if (GENERATED_IDS.has(path)) return `projeto-${Date.now()}`
	if (SELECTS[path]) return SELECTS[path][0]
	if (typeof sample === 'string') return ''
	if (Array.isArray(sample)) {
		return isObject(sample[0]) ? [blankFrom(sample[0], `${path}[]`)] : []
	}
	if (isObject(sample)) {
		return Object.fromEntries(
			Object.entries(sample).map(([key, value]) => [key, blankFrom(value, `${path}.${key}`)])
		)
	}
	return sample
}

function validateStringList(list, where, problems) {
	const seen = new Set()
	list.forEach((item, index) => {
		const text = item.trim()
		if (!text) problems.push(`${where} › ${index + 1}: item em branco`)
		else if (seen.has(text)) problems.push(`${where} › ${index + 1}: "${text}" está duplicado`)
		seen.add(text)
	})
}

function walk(value, path, where, problems) {
	if (Array.isArray(value)) {
		if (value.every((item) => typeof item === 'string')) {
			validateStringList(value, where, problems)
			return
		}
		value.forEach((item, index) => walk(item, `${path}[]`, `${where} › ${index + 1}`, problems))
	} else if (isObject(value)) {
		Object.entries(value).forEach(([key, child]) => {
			walk(child, `${path}.${key}`, where ? `${where} › ${fieldLabel(key)}` : fieldLabel(key), problems)
		})
	} else if (REQUIRED.has(path) && !String(value ?? '').trim()) {
		problems.push(`${where}: campo obrigatório`)
	}
}

// Retorna a lista de problemas que impedem salvar o arquivo
export function validate(fileName, data) {
	const problems = []
	walk(data, fileName, '', problems)
	return problems
}
