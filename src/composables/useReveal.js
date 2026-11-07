import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// Revelação disparada uma única vez, quando o topo do bloco passa de 75% da viewport.
// O root recebe a classe .is-revealed; as animações em si ficam em main.scss (.reveal-*).
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useReveal() {
	const root = ref(null)
	const revealed = ref(false)
	let observer = null

	onMounted(() => {
		if (reducedMotion() || !('IntersectionObserver' in window) || !root.value) {
			revealed.value = true
			return
		}
		observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return
				revealed.value = true
				observer.disconnect()
			},
			{ rootMargin: '0px 0px -25% 0px' }
		)
		observer.observe(root.value)
	})

	onBeforeUnmount(() => observer?.disconnect())

	return { root, revealed }
}

// Cards que começam empilhados sobre o primeiro e seguem para suas posições.
// O deslocamento usa offsetLeft/offsetTop, que ignoram transforms e refletem a posição real no grid.
export function useStackReveal() {
	const { root, revealed } = useReveal()
	const cards = []
	const offsets = ref([])

	const setCard = (index) => (el) => {
		cards[index] = el?.$el ?? el
	}

	function measure() {
		if (revealed.value) return
		const els = cards.filter(Boolean)
		const [first] = els
		if (!first) return
		offsets.value = els.map((el) => ({
			x: first.offsetLeft - el.offsetLeft,
			y: first.offsetTop - el.offsetTop
		}))
	}

	onMounted(() => {
		measure()
		window.addEventListener('resize', measure)
	})

	onBeforeUnmount(() => window.removeEventListener('resize', measure))

	// O primeiro card fica por cima da pilha
	const count = computed(() => offsets.value.length)
	const cardStyle = (index) => ({
		'--from-x': `${offsets.value[index]?.x ?? 0}px`,
		'--from-y': `${offsets.value[index]?.y ?? 0}px`,
		zIndex: count.value - index
	})

	return { root, revealed, setCard, cardStyle }
}
