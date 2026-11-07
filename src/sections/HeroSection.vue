<template>
	<section id="inicio" class="section hero" aria-labelledby="hero-title">
		<div class="container hero__inner">
			<div class="hero__intro">
				<h1 id="hero-title" class="hero__name">{{ hero.name }}</h1>
				<p class="hero__role">{{ t(hero.role) }}</p>
			</div>

			<div class="hero__details">
				<p class="hero__tagline">{{ t(hero.tagline) }}</p>

				<dl v-if="hero.meta.length || hero.stack.length" class="hero__meta">
					<div v-for="(item, index) in hero.meta" :key="index" class="hero__meta-item">
						<dt class="hero__meta-label">{{ t(item.label) }}</dt>
						<dd class="hero__meta-value">{{ t(item.value) }}</dd>
					</div>
					<div v-if="hero.stack.length" class="hero__meta-item">
						<dt class="hero__meta-label">{{ t(hero.stackLabel) }}</dt>
						<dd>
							<ul class="hero__stack">
								<li v-for="tech in hero.stack" :key="tech" class="hero__meta-value">{{ tech }}</li>
							</ul>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</section>
</template>

<script setup>
import { useLang } from '@/composables/useLang.js'

defineProps({
	hero: { type: Object, required: true }
})

const { t } = useLang()
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

// O hero ocupa a tela inteira também no mobile: a troca de idioma (textos mais curtos)
// não pode revelar o início da próxima seção
.hero {
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 100vh;
	min-height: 100dvh;
	padding-block: var(--header-offset) var(--space-9);
	text-align: center;

	&__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-10);

		@include bp(lg) {
			gap: var(--space-11);
		}
	}

	&__intro {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-5);
	}

	&__name {
		color: var(--color-accent);
		font-size: var(--fs-display);
		font-weight: var(--fw-extrabold);
		line-height: var(--lh-tight);
		white-space: pre-line;
	}

	&__role {
		font-size: var(--fs-lg);
		line-height: var(--lh-tight);
	}

	&__details {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-7);
		max-width: var(--hero-max);
	}

	&__tagline {
		font-size: var(--fs-lg);
		line-height: var(--lh-body);
	}

	&__meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-5) var(--space-8);

		@include bp(md) {
			text-align: start;
		}
	}

	&__meta-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);

		@include bp(md) {
			align-items: flex-start;
		}
	}

	&__meta-label {
		color: var(--color-text-muted);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	&__meta-value {
		font-size: var(--fs-md);
		font-weight: var(--fw-semibold);
	}

	// Itens separados por uma bolinha branca a 50%, centralizada entre eles
	&__stack {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-2) var(--space-4);

		li {
			display: inline-flex;
			align-items: center;
		}

		li + li::before {
			content: '';
			flex-shrink: 0;
			width: var(--space-2);
			height: var(--space-2);
			margin-inline-end: var(--space-4);
			border-radius: 50%;
			background: var(--color-text-muted);
		}
	}
}
</style>
