<template>
	<canvas ref="canvas" class="fire" aria-hidden="true"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Fogo do Doom (base: github.com/tiagomenegaz/doom-fire), easter egg do DevTools (useDevtools.js).
// Cada célula vale de 0 (vazio) a MAX (branco). A linha de baixo é a fonte, sempre em MAX.
// A cada passo, cada célula recebe o valor da célula abaixo menos um decaimento aleatório
// (0..MAX_DECAY) e é gravada esse mesmo número de blocos à esquerda: o fogo sobe e o vento
// o empurra para a esquerda. Com decaimento médio 1, a chama alcança ~MAX linhas.
const MAX = 36
const MAX_DECAY = 2
const ROWS = 44 // altura total da matriz (ROWS × --fire-cell)
const TICK_MS = 110 // intervalo entre passos (o original usa 50ms)
const ALPHA_MIN = 0.1

const canvas = ref(null)
let ctx = null
let cell = 10
let cols = 0
let grid = new Uint8Array(0)
let palette = []
let frame = 0
let last = 0

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function parseHex(value) {
	const hex = value.trim().replace('#', '')
	const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex
	return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

const lerp = (a, b, k) => a.map((c, i) => Math.round(c + (b[i] - c) * k))

// 0 = transparente; 1..MAX passa por --fire-low → --fire-mid → --fire-high, com alpha crescente
function buildPalette() {
	const styles = getComputedStyle(document.documentElement)
	cell = parseInt(styles.getPropertyValue('--fire-cell'), 10) || 10
	const stops = ['--fire-low', '--fire-mid', '--fire-high'].map((name) => parseHex(styles.getPropertyValue(name)))
	palette = Array.from({ length: MAX + 1 }, (_, i) => {
		if (i === 0) return null
		const k = i / MAX
		const [r, g, b] = k < 0.6 ? lerp(stops[0], stops[1], k / 0.6) : lerp(stops[1], stops[2], (k - 0.6) / 0.4)
		const alpha = ALPHA_MIN + (1 - ALPHA_MIN) * Math.min(1, k * 1.6)
		return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
	})
}

function resize() {
	const el = canvas.value
	if (!el) return
	cols = Math.ceil(window.innerWidth / cell)
	grid = new Uint8Array(cols * ROWS)
	grid.fill(MAX, (ROWS - 1) * cols) // fonte do fogo
	const dpr = window.devicePixelRatio || 1
	el.width = cols * cell * dpr
	el.height = ROWS * cell * dpr
	el.style.width = `${cols * cell}px`
	el.style.height = `${ROWS * cell}px`
	ctx = el.getContext('2d')
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	// com movimento reduzido, pré-aquece até a chama estabilizar e mostra um quadro parado
	if (reducedMotion) for (let i = 0; i < ROWS * 2; i++) step()
	draw()
}

function step() {
	for (let y = 0; y < ROWS - 1; y++) {
		const row = y * cols
		const below = (y + 1) * cols
		for (let x = 0; x < cols; x++) {
			const decay = Math.floor(Math.random() * (MAX_DECAY + 1))
			const value = Math.max(0, grid[below + x] - decay)
			grid[row + ((x - decay + cols) % cols)] = value
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, cols * cell, ROWS * cell)
	for (let y = 0; y < ROWS; y++) {
		for (let x = 0; x < cols; x++) {
			const color = palette[grid[y * cols + x]]
			if (!color) continue
			ctx.fillStyle = color
			ctx.fillRect(x * cell, y * cell, cell, cell)
		}
	}
}

function loop(now) {
	if (now - last >= TICK_MS) {
		last = now
		step()
		draw()
	}
	frame = requestAnimationFrame(loop)
}

onMounted(() => {
	buildPalette()
	resize()
	window.addEventListener('resize', resize)
	if (!reducedMotion) frame = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
	cancelAnimationFrame(frame)
	window.removeEventListener('resize', resize)
})
</script>

<style lang="scss" scoped>
.fire {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 50;
	display: block;
	pointer-events: none;
	image-rendering: pixelated;
}
</style>
