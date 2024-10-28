<template>
	<div class="first">
		<h1 class="title">Olá, eu sou o <span>Gustavo Carvalho</span>, um desenvolvedor full stack</h1>
		<div class="row">
			<IconSVG class="icon" />
			<p class="text">Obrigado por visitar o meu site, ele ainda está sendo construído mas sinta-se a vontade para conhecer meus projetos de destaque e entrar em contato comigo.</p>
		</div>
	</div>
</template>

<script>
import IconSVG from '@/assets/svgs/undraw_programming.vue'
export default {
	components: {
		IconSVG
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
}
</style>
