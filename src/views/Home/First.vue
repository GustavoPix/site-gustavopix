<template>
	<div class="first">
		<h1 class="title" v-html="text[lang].title"></h1>
		<div class="row">
			<IconSVG class="icon" />
			<p class="text" v-html="text[lang].text"></p>
		</div>
	</div>
</template>

<script>
import IconSVG from '@/assets/svgs/undraw_programming.vue'
export default {
	components: {
		IconSVG
	},
	props: ['lang'],
	data(){
		return {
			text: {
				BR: {
					title: 'Olá, eu sou o <span class="span-active">Gustavo Carvalho</span>, um desenvolvedor full stack',
					text: 'Obrigado por visitar o meu site, ele ainda está sendo construído mas sinta-se a vontade para conhecer meus projetos de destaque e entrar em contato comigo.'
				},
				EN: {
					title: 'Hello, I am <span class="span-active">Gustavo Carvalho</span>, a full stack developer',
					text: 'Thank you for visiting my website, it is still being built but feel free to check out my featured projects and get in touch with me.'
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.first{
	padding-top: 100px;
	padding-bottom: 100px;
}
.title{
	color: #fff;
	font-size: 46px;
	margin-bottom: 100px;
	line-height: 150%;

	@media (max-width: 768px){
		font-size: 36px;
	}

	span{
		color: #00BFA6;
	}
}

.text{
	color: #fff;
	font-size: 16px;
	line-height: 200%;
}
.row{
	display: flex;
	align-items: flex-start;
	gap: 25px;

	@media (max-width: 768px){
		flex-direction: column;
	}
}

.icon{
	width: 100%;

	@media (max-width: 768px){
		max-width: 350px;
	}
}
</style>

<style lang="scss">
.span-active{
	color: #00BFA6;
}
</style>
