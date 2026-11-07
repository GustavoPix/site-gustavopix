import { onBeforeUnmount, onMounted, ref } from 'vue'

// Detecta o DevTools aberto. Não existe API para isso, então são heurísticas:
// 1. Tamanho: DevTools acoplado reduz a viewport em relação à janela.
// 2. Getter: o console do Chromium lê propriedades do objeto logado para montar
//    a pré-visualização, mas só quando está aberto (pega o DevTools desacoplado).
//    O log usa console.debug, que fica oculto no nível padrão ("Verbose" desligado).
// Zoom do navegador ou navegadores diferentes podem gerar falso positivo/negativo.
const CHECK_MS = 1000
const GAP = 160 // px de diferença entre janela e viewport

const open = ref(false)
let users = 0
let timer = 0

function bySize() {
	return window.outerWidth - window.innerWidth > GAP || window.outerHeight - window.innerHeight > GAP
}

function byGetter() {
	let hit = false
	const probe = new Error()
	Object.defineProperty(probe, 'stack', {
		get() {
			hit = true
			return ''
		}
	})
	const el = document.createElement('div')
	Object.defineProperty(el, 'id', {
		get() {
			hit = true
			return ''
		}
	})
	console.debug(probe, el)
	return hit
}

function check() {
	open.value = bySize() || byGetter()
}

export function useDevtools() {
	onMounted(() => {
		if (users++ === 0) {
			check()
			timer = window.setInterval(check, CHECK_MS)
			window.addEventListener('resize', check)
		}
	})

	onBeforeUnmount(() => {
		if (--users === 0) {
			window.clearInterval(timer)
			window.removeEventListener('resize', check)
		}
	})

	return { open }
}
