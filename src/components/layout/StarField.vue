<template>
	<div class="starfield" aria-hidden="true">
		<canvas ref="canvas" class="starfield__canvas"></canvas>
	</div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Fundo estrelado inspirado em devhasibulislam.vercel.app.
// Cada estrela tem direção e velocidade próprias (deriva lenta, reaparece do outro
// lado ao sair da tela) e cintila em momentos aleatórios.
const AREA_PER_STAR = 7000 // px² por estrela: controla a densidade
const SPEED = [2, 8] // px por segundo
const TWINKLE_GAP = [1.5, 9] // segundos entre cintiladas
const TWINKLE_LENGTH = [0.5, 1.4] // duração da cintilada em segundos

const canvas = ref(null)
let ctx = null
let stars = []
let width = 0
let height = 0
let frame = 0
let last = 0
let starColor = '255, 255, 255'
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const rand = ([min, max]) => min + Math.random() * (max - min)

function createStar(time) {
	const angle = Math.random() * Math.PI * 2
	const speed = rand(SPEED)
	return {
		x: Math.random() * width,
		y: Math.random() * height,
		radius: Math.random() < 0.2 ? rand([0.9, 1.3]) : rand([0.4, 0.8]),
		alpha: rand([0.3, 0.75]),
		vx: Math.cos(angle) * speed,
		vy: Math.sin(angle) * speed,
		twinkleAt: time + rand(TWINKLE_GAP),
		twinkleLength: rand(TWINKLE_LENGTH)
	}
}

// Lê --color-star (hex) para usar com alpha no canvas
function readStarColor() {
	const hex = getComputedStyle(document.documentElement).getPropertyValue('--color-star').trim().replace('#', '')
	if (hex.length !== 6) return
	starColor = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')
}

function resize() {
	const dpr = Math.min(window.devicePixelRatio || 1, 2)
	const widthChanged = window.innerWidth !== width
	width = window.innerWidth
	height = window.innerHeight
	canvas.value.width = Math.round(width * dpr)
	canvas.value.height = Math.round(height * dpr)
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

	// No mobile a altura muda com a barra de endereço durante o scroll:
	// só redistribui as estrelas quando a largura muda
	const time = performance.now() / 1000
	if (widthChanged || !stars.length) {
		const count = Math.round((width * height) / AREA_PER_STAR)
		stars = Array.from({ length: count }, () => createStar(time))
	}
	draw(time)
}

// Brilho extra da cintilada: sobe e desce em curva senoidal
function twinkleBoost(star, time) {
	const progress = (time - star.twinkleAt) / star.twinkleLength
	if (progress < 0) return 0
	if (progress > 1) {
		star.twinkleAt = time + rand(TWINKLE_GAP)
		star.twinkleLength = rand(TWINKLE_LENGTH)
		return 0
	}
	return Math.sin(progress * Math.PI)
}

function draw(time) {
	ctx.clearRect(0, 0, width, height)
	for (const star of stars) {
		const boost = reducedMotion.matches ? 0 : twinkleBoost(star, time)
		const alpha = Math.min(1, star.alpha + boost * (1 - star.alpha))
		const radius = star.radius * (1 + boost * 0.8)

		ctx.beginPath()
		ctx.arc(star.x, star.y, radius, 0, Math.PI * 2)
		ctx.fillStyle = `rgba(${starColor}, ${alpha})`
		ctx.fill()

		// Halo suave durante a cintilada
		if (boost > 0.3) {
			ctx.beginPath()
			ctx.arc(star.x, star.y, radius * 3, 0, Math.PI * 2)
			ctx.fillStyle = `rgba(${starColor}, ${boost * 0.12})`
			ctx.fill()
		}
	}
}

function move(delta) {
	for (const star of stars) {
		star.x += star.vx * delta
		star.y += star.vy * delta
		if (star.x < -2) star.x = width + 2
		else if (star.x > width + 2) star.x = -2
		if (star.y < -2) star.y = height + 2
		else if (star.y > height + 2) star.y = -2
	}
}

function tick(now) {
	const time = now / 1000
	// Limita o delta para a aba voltar de segundo plano sem "teleportar" as estrelas
	const delta = Math.min(time - last, 0.1)
	last = time
	move(delta)
	draw(time)
	frame = requestAnimationFrame(tick)
}

function start() {
	cancelAnimationFrame(frame)
	if (reducedMotion.matches) {
		draw(performance.now() / 1000)
		return
	}
	last = performance.now() / 1000
	frame = requestAnimationFrame(tick)
}

onMounted(() => {
	ctx = canvas.value.getContext('2d')
	readStarColor()
	resize()
	start()
	window.addEventListener('resize', resize)
	reducedMotion.addEventListener('change', start)
})

onBeforeUnmount(() => {
	cancelAnimationFrame(frame)
	window.removeEventListener('resize', resize)
	reducedMotion.removeEventListener('change', start)
})
</script>

<style lang="scss" scoped>
.starfield {
	position: fixed;
	inset: 0;
	z-index: -1;
	pointer-events: none;

	// Vinheta da referência, agora fixa: acompanha o scroll em todo o site
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(at 50% 40%, transparent 0%, var(--color-bg) 80%);
	}

	&__canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
}
</style>
