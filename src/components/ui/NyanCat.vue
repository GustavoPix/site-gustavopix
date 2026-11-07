<template>
	<div v-if="active" ref="root" class="nyan" :style="{ width: `${WIDTH}px` }" aria-hidden="true">
		<svg class="nyan__svg" :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`" shape-rendering="crispEdges">
			<g
				v-for="(segment, i) in rainbow"
				:key="i"
				:class="['nyan__wave', i % 2 ? 'nyan__wave--odd' : 'nyan__wave--even']"
			>
				<rect
					v-for="(color, s) in RAINBOW"
					:key="s"
					:x="segment"
					:y="RAINBOW_TOP + s * STRIPE"
					:width="SEGMENT"
					:height="STRIPE"
					:fill="color"
				/>
			</g>
			<g class="nyan__cat">
				<rect
					v-for="(px, i) in sprite"
					:key="i"
					:x="TRAIL + px.x"
					:y="px.y"
					:width="px.w"
					height="1"
					:fill="px.fill"
				/>
			</g>
		</svg>
	</div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

// Nyan Cat: cruza a tela de um lado ao outro, sempre de fora da tela até fora da
// tela oposta, com Y inicial/final aleatórios (dentro da viewport) e velocidade aleatória.
// Só existe um por vez. Gatilhos: 2 min na página, mouse saindo da janela,
// clique em "Contatos" e 3 trocas de tema.
const STAY_MS = 2 * 60 * 1000
const THEME_CHANGES = 3
const PX = 2 // px de tela por pixel do sprite
const SPEED = [160, 520] // px por segundo
const CHANCE = 0.3 // chance de o gato aparecer a cada gatilho

// Sprite 34×21. Legenda: k contorno, t massa, p cobertura, m granulado,
// g pelo, w brilho do olho, c bochecha.
const SPRITE = [
	'.......kkkkkkkkkkkkkkkkk..........',
	'......ktttttttttttttttttk.........',
	'.....ktttttttttttttttttttk........',
	'.....ktttpppppppppppmptttk........',
	'.....kttppppppmppppppppttk........',
	'.....kttppmpppppppppkkpttk....kk..',
	'.....kttpppppppppmpkggkttk...kggk.',
	'.....kttpppppppppppkgggktk..kggggk',
	'kk...kttppppmppppppkggggkkkkgggggk',
	'kggk.kttpppppppppppkgggggggggggggk',
	'.kgggkttppppppppmppkgggggggggggggk',
	'..kggkttpmpppppppppkggwkgggggwkggk',
	'...kkkttpppppppppppkggkkgggggkkggk',
	'.....kttpppppmpppmpkccgggggggggcck',
	'.....ktttppppppppppkgggkggkggkgggk',
	'.....ktttttttttttttkggggkkgkkggggk',
	'......kttttttttttttkgggggggggggggk',
	'.......kkkkkkkkkkkkkkgggggggggggk.',
	'.....kggk.kggk.......kkkkkkkkkkk..',
	'......kk...kk........kggk...kggk..',
	'......................kk.....kk...',
]
const COLORS = {
	k: '#000000',
	t: '#ffcc99',
	p: '#ff99ff',
	m: '#ff3399',
	g: '#999999',
	w: '#ffffff',
	c: '#ff9999',
}

const RAINBOW = ['#ff0000', '#ff9900', '#ffff00', '#33ff00', '#0099ff', '#6633ff']
const STRIPE = 2
const RAINBOW_TOP = 6
const SEGMENT = 5
const TRAIL = 90 // comprimento do arco-íris (3× o anterior)
const VIEW_W = TRAIL + 34
const VIEW_H = 21
const WIDTH = VIEW_W * PX
const HEIGHT = VIEW_H * PX

// junta pixels vizinhos de mesma cor em um único <rect>
const sprite = SPRITE.flatMap((row, y) => {
	const runs = []
	for (let x = 0; x < row.length; x++) {
		const ch = row[x]
		if (ch === '.') continue
		const prev = runs[runs.length - 1]
		if (prev && prev.ch === ch && prev.x + prev.w === x) prev.w += 1
		else runs.push({ ch, x, y, w: 1, fill: COLORS[ch] })
	}
	return runs
})

// segmentos do arco-íris, até debaixo da tortinha
const rainbow = Array.from({ length: Math.ceil((TRAIL + 8) / SEGMENT) }, (_, i) => i * SEGMENT)

const { theme } = useTheme()
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const active = ref(false)
const root = ref(null)
let animation = null
let timer = 0
let themeChanges = 0

const rand = (min, max) => min + Math.random() * (max - min)

async function launch() {
	if (active.value || reducedMotion.matches) return
	if (Math.random() >= CHANCE) return
	active.value = true
	await nextTick()
	const el = root.value
	if (!el) return

	const vw = window.innerWidth
	const maxY = Math.max(0, window.innerHeight - HEIGHT)
	const fromLeft = Math.random() < 0.5
	// folga extra para que o sprite rotacionado (gira pelo centro) comece e termine fora da tela
	const extra = Math.hypot(WIDTH, HEIGHT) / 2 - WIDTH / 2
	const startX = fromLeft ? -WIDTH - extra : vw + extra
	const endX = fromLeft ? vw + extra : -WIDTH - extra
	const startY = rand(0, maxY)
	const endY = rand(0, maxY)
	const dx = endX - startX
	const dy = endY - startY
	const distance = Math.hypot(dx, dy)
	const duration = (distance / rand(...SPEED)) * 1000

	// o gato olha para a direita; ao ir para a esquerda, espelha.
	// Depois gira para apontar na direção do movimento.
	const angle = fromLeft ? Math.atan2(dy, dx) : Math.atan2(-dy, -dx)
	const pose = `rotate(${angle}rad)${fromLeft ? '' : ' scaleX(-1)'}`
	animation = el.animate(
		[
			{ transform: `translate(${startX}px, ${startY}px) ${pose}` },
			{ transform: `translate(${endX}px, ${endY}px) ${pose}` },
		],
		{ duration, easing: 'linear', fill: 'forwards' },
	)
	animation.onfinish = () => {
		animation = null
		active.value = false
	}
}

const onMouseLeave = () => launch()
const onClick = (event) => {
	if (event.target instanceof Element && event.target.closest('a[href="#contatos"]')) launch()
}

watch(theme, () => {
	themeChanges += 1
	if (themeChanges >= THEME_CHANGES) {
		themeChanges = 0
		launch()
	}
})

onMounted(() => {
	timer = window.setTimeout(launch, STAY_MS)
	document.documentElement.addEventListener('mouseleave', onMouseLeave)
	document.addEventListener('click', onClick)
})

onBeforeUnmount(() => {
	window.clearTimeout(timer)
	document.documentElement.removeEventListener('mouseleave', onMouseLeave)
	document.removeEventListener('click', onClick)
	animation?.cancel()
})
</script>

<style lang="scss" scoped>
.nyan {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 60;
	pointer-events: none;
	will-change: transform;

	&__svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	// ondulação em degraus: segmentos pares e ímpares alternam a altura
	&__wave {
		animation: nyan-bob 0.4s steps(1) infinite;

		&--odd {
			animation-delay: -0.2s;
		}
	}

	&__cat {
		animation: nyan-bob 0.4s steps(1) infinite;
	}
}

@keyframes nyan-bob {
	0% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(1px);
	}
}
</style>
