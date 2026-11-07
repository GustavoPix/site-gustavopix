<template>
	<header class="header" :class="{ 'is-scrolled': scrolled }">
		<div class="header__inner">
			<div class="header__shell">
				<a href="#inicio" class="header__brand" @click="closeMenu">{{ nav.brand }}</a>

				<nav v-if="nav.items.length" class="header__nav" :aria-label="t(nav.label)">
					<ul ref="navList" class="header__nav-list" @mouseleave="hoverId = null">
						<li
							class="header__bubble"
							:class="{ 'is-ready': bubble.ready, 'is-hidden': !bubble.width }"
							:style="{ '--bubble-x': `${bubble.x}px`, '--bubble-w': `${bubble.width}px` }"
							aria-hidden="true"
						>
							<span :key="bubble.moves" class="header__bubble-blob"></span>
						</li>
						<li v-for="item in nav.items" :key="item.id">
							<a
								:ref="(el) => setLinkRef(item.id, el)"
								:href="`#${item.id}`"
								class="header__link"
								:class="{ 'is-active': bubbleTarget === item.id }"
								:aria-current="activeId === item.id ? 'location' : null"
								@mouseenter="hoverId = item.id"
								@focus="hoverId = item.id"
								@blur="hoverId = null"
							>
								{{ t(item.label) }}
							</a>
						</li>
					</ul>
				</nav>

				<div class="header__actions">
					<button
						type="button"
						class="header__lang"
						:aria-label="t(nav.langToggle)"
						@click="toggleLang"
					>
						{{ t(nav.langShort) }}
					</button>
					<a :href="`#${nav.cta.id}`" class="header__cta">
						<svg class="header__icon" viewBox="0 0 24 24" aria-hidden="true">
							<rect width="20" height="16" x="2" y="4" rx="2" />
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
						</svg>
						{{ t(nav.cta.label) }}
					</a>
					<ThemePicker :themes="nav.themes" />
					<button
						v-if="nav.items.length"
						type="button"
						class="header__toggle"
						:aria-expanded="menuOpen"
						aria-controls="mobile-menu"
						:aria-label="t(menuOpen ? nav.menuClose : nav.menuOpen)"
						@click="menuOpen = !menuOpen"
					>
						<span class="header__toggle-icon" :class="{ 'is-open': menuOpen }" aria-hidden="true"></span>
					</button>
				</div>
			</div>

			<Transition name="menu">
				<nav
					v-if="nav.items.length && menuOpen"
					id="mobile-menu"
					class="header__menu"
					:aria-label="t(nav.label)"
				>
					<ul>
						<li v-for="item in [...nav.items, nav.cta]" :key="item.id">
							<a
								:href="`#${item.id}`"
								class="header__menu-link"
								:class="{ 'is-active': activeId === item.id }"
								@click="closeMenu"
							>
								{{ t(item.label) }}
							</a>
						</li>
					</ul>
				</nav>
			</Transition>
		</div>
	</header>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useLang } from '@/composables/useLang.js'
import ThemePicker from '@/components/layout/ThemePicker.vue'

const props = defineProps({
	nav: { type: Object, required: true }
})

const SCROLL_THRESHOLD = 16

const { t, lang, toggleLang } = useLang()
const menuOpen = ref(false)
const scrolled = ref(false)
const activeId = ref(props.nav.items[0]?.id ?? null)
let observer = null
let resizeObserver = null

// Bolha: fundo que desliza até o link em hover ou, sem hover, até a seção ativa
const navList = ref(null)
const hoverId = ref(null)
const linkEls = {}
const bubble = reactive({ x: 0, width: 0, moves: 0, ready: false })
const bubbleTarget = computed(() => hoverId.value ?? activeId.value)

function setLinkRef(id, el) {
	if (el) linkEls[id] = el
	else delete linkEls[id]
}

function placeBubble() {
	const el = linkEls[bubbleTarget.value]
	if (!el) {
		bubble.width = 0
		return
	}
	if (el.offsetLeft !== bubble.x || el.offsetWidth !== bubble.width) {
		bubble.x = el.offsetLeft
		bubble.width = el.offsetWidth
		bubble.moves++
	}
}

watch(bubbleTarget, placeBubble)
watch(lang, () => nextTick(placeBubble))

function closeMenu() {
	menuOpen.value = false
}

function onKeydown(event) {
	if (event.key === 'Escape') closeMenu()
}

function onScroll() {
	scrolled.value = window.scrollY > SCROLL_THRESHOLD
}

// Marca como ativo o link da seção que cruza o meio da viewport
function observeSections() {
	const ids = [...props.nav.items, props.nav.cta].map((item) => item.id)
	observer = new IntersectionObserver(
		(entries) => {
			const visible = entries.find((entry) => entry.isIntersecting)
			if (visible) activeId.value = visible.target.id
		},
		{ rootMargin: '-50% 0px -50% 0px' }
	)
	ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => observer.observe(el))
}

onMounted(() => {
	onScroll()
	observeSections()
	window.addEventListener('scroll', onScroll, { passive: true })
	window.addEventListener('keydown', onKeydown)

	// Primeira posição sem animação; a transição só liga depois de posicionada
	placeBubble()
	document.fonts?.ready.then(placeBubble)
	requestAnimationFrame(() => {
		bubble.ready = true
	})
	if (navList.value) {
		resizeObserver = new ResizeObserver(placeBubble)
		resizeObserver.observe(navList.value)
	}
})

onBeforeUnmount(() => {
	observer?.disconnect()
	resizeObserver?.disconnect()
	window.removeEventListener('scroll', onScroll)
	window.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.header {
	position: fixed;
	inset-inline: 0;
	top: var(--space-4);
	z-index: 10;

	&__inner {
		@include container;
		position: relative;
	}

	// Shell no estilo da referência: fundo translúcido com blur;
	// borda e sombra aparecem só depois do scroll
	&__shell {
		// O nome recebe a mesma folga interna dos botões de ícone da direita
		// ((48 - 20) / 2 = 14px), para ficar opticamente alinhado ao último ícone
		--shell-pad: var(--space-5);
		--icon-inset: calc((var(--header-control) - var(--icon-size)) / 2);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-2) var(--shell-pad);
		padding-inline-start: calc(var(--shell-pad) + var(--icon-inset));
		border: var(--border-thin) solid transparent;
		border-radius: var(--radius-pill);
		background: var(--color-bg-translucent);
		-webkit-backdrop-filter: blur(var(--blur)) saturate(140%);
		backdrop-filter: blur(var(--blur)) saturate(140%);
		transition: border-color var(--transition-base), box-shadow var(--transition-base);

		@include bp(sm) {
			--shell-pad: var(--space-6);
			gap: var(--space-3);
		}

		@include bp(xl) {
			gap: var(--space-4);
		}

		.is-scrolled & {
			border-color: var(--color-border-strong);
			box-shadow: var(--shadow-float);
		}
	}

	&__brand {
		min-width: 0;
		overflow: hidden;
		font-size: var(--brand-fs);
		font-weight: var(--fw-extrabold);
		letter-spacing: var(--tracking-tight);
		line-height: 1;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
		transition: color var(--transition-fast);
		@include focus-ring;

		&:hover {
			color: var(--color-accent);
		}
	}

	&__nav {
		display: none;

		@include bp(lg) {
			display: block;
		}
	}

	&__nav-list {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	// Desliza com easing de overshoot (bounce) e "amassa" a cada movimento
	&__bubble {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--bubble-w);
		height: 100%;
		transform: translateX(var(--bubble-x));
		pointer-events: none;

		&.is-ready {
			transition:
				transform var(--transition-bounce),
				width var(--transition-bounce),
				opacity var(--transition-fast);
		}

		&.is-hidden {
			opacity: 0;
		}
	}

	&__bubble-blob {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: var(--radius-pill);
		background: var(--color-active);
		animation: bubble-squash var(--duration-bounce) var(--ease-bounce);

		.header__bubble:not(.is-ready) & {
			animation: none;
		}
	}

	&__link {
		position: relative;
		display: inline-flex;
		align-items: center;
		height: var(--space-7);
		padding-inline: var(--space-4);
		border-radius: var(--radius-pill);
		color: var(--color-text-soft);
		font-size: var(--nav-fs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		white-space: nowrap;
		transition: color var(--transition-fast);
		@include focus-ring;

		&.is-active {
			color: var(--color-text);
		}
	}

	&__actions {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--space-2);
	}

	&__lang {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--header-control);
		height: var(--header-control);
		border-radius: 50%;
		color: var(--color-text-soft);
		font-size: var(--fs-md);
		font-weight: var(--fw-extrabold);
		letter-spacing: var(--tracking-wide);
		-webkit-tap-highlight-color: transparent;
		transition: color var(--transition-fast), background-color var(--transition-fast);
		@include focus-ring;

		// Só em dispositivos com hover real: no toque o :hover "gruda" depois do clique
		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color-text);
				background: var(--color-hover);
			}
		}
	}

	&__cta {
		display: none;
		align-items: center;
		gap: var(--space-3);
		height: var(--control-height-md);
		padding-inline: var(--space-5);
		border: var(--border-thin) solid var(--color-accent-line);
		border-radius: var(--radius-pill);
		background: var(--color-accent-soft);
		color: var(--color-accent);
		font-size: var(--nav-fs);
		font-weight: var(--fw-extrabold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		white-space: nowrap;
		transition: border-color var(--transition-fast), background-color var(--transition-fast);
		@include focus-ring;

		@include bp(md) {
			display: inline-flex;
		}

		&:hover {
			border-color: var(--color-accent);
		}
	}

	&__icon {
		width: var(--icon-size-sm);
		height: var(--icon-size-sm);
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	&__toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--control-height-md);
		height: var(--control-height-md);
		border: var(--border-thin) solid var(--color-control-line);
		border-radius: 50%;
		@include focus-ring;

		@include bp(lg) {
			display: none;
		}
	}

	&__toggle-icon {
		position: relative;
		width: var(--space-5);
		height: var(--border-thick);
		background: var(--color-text);
		transition: background-color var(--transition-fast);

		&::before,
		&::after {
			content: '';
			position: absolute;
			left: 0;
			width: 100%;
			height: 100%;
			background: var(--color-text);
			transition: transform var(--transition-fast);
		}

		&::before {
			transform: translateY(calc(var(--space-2) * -1 - var(--border-thick)));
		}

		&::after {
			transform: translateY(calc(var(--space-2) + var(--border-thick)));
		}

		&.is-open {
			background: transparent;

			&::before {
				transform: rotate(45deg);
			}

			&::after {
				transform: rotate(-45deg);
			}
		}
	}

	&__menu {
		margin-block-start: var(--space-4);
		padding: var(--space-3);
		border: var(--border-thin) solid var(--color-border-strong);
		border-radius: var(--radius-card);
		background: var(--color-bg-translucent);
		-webkit-backdrop-filter: blur(var(--blur)) saturate(140%);
		backdrop-filter: blur(var(--blur)) saturate(140%);
		box-shadow: var(--shadow-float);

		@include bp(lg) {
			display: none;
		}
	}

	&__menu-link {
		display: flex;
		align-items: center;
		min-height: var(--control-height);
		padding-inline: var(--space-5);
		border-radius: var(--radius-option);
		color: var(--color-text-soft);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		@include focus-ring;

		&:hover,
		&.is-active {
			color: var(--color-text);
			background: var(--color-active);
		}
	}
}

@keyframes bubble-squash {
	0% {
		transform: scale(1, 1);
	}

	30% {
		transform: scale(1.12, 0.8);
	}

	55% {
		transform: scale(0.94, 1.08);
	}

	80% {
		transform: scale(1.03, 0.97);
	}

	100% {
		transform: scale(1, 1);
	}
}

@media (prefers-reduced-motion: reduce) {
	.header__bubble.is-ready {
		transition: opacity var(--transition-fast);
	}

	.header__bubble-blob {
		animation: none;
	}
}

.menu-enter-active,
.menu-leave-active {
	transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.menu-enter-from,
.menu-leave-to {
	opacity: 0;
	transform: translateY(calc(var(--space-2) * -1));
}

@media (prefers-reduced-motion: reduce) {
	.menu-enter-active,
	.menu-leave-active {
		transition: none;
	}
}
</style>
