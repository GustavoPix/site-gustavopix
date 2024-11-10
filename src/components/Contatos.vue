<template>
	<div>
		<h2 class="title">Contatos</h2>
		<div class="row">
			<ul class="contatos">
				<li class="contato">
					<a href="https://www.linkedin.com/in/gustavopix/" target="_blank">
						<LogoLinkedin class="contato-icon" />
						gustavo-carvalho
					</a>
				</li>
				<li class="contato">
					<a href="https://github.com/GustavoPix" target="_blank">
						<LogoGithub class="contato-icon" />
						gustavo-carvalho
					</a>
				</li>
				<li class="contato">
					<a href="https://wa.me/+5511949080043" target="_blank">
						<logoMobile class="contato-icon" />
						+55 (11) 94908-0043
					</a>
				</li>
			</ul>
			<ImagePersonalEmail class="imagePersonalEmail" />
		</div>
	</div>
</template>

<script>
import ImagePersonalEmail from '@/assets/svgs/undraw_personal_email.vue'
import LogoLinkedin from '@/assets/svgs/logo-linkedin.vue'
import LogoGithub from '@/assets/svgs/logo-github.vue'
import logoMobile from '@/assets/svgs/logo-mobile.vue';

export default {
	components: {
		ImagePersonalEmail,
		LogoLinkedin,
		LogoGithub,
		logoMobile
	}
}

</script>

<style lang="scss" scoped>
.title{
	color: #41B883;
	font-size: 48px;
	margin-bottom: 50px;
	font-weight: 700;
}
.row{
	display: flex;
	justify-content: space-between;
	align-items: center	;
	gap: 50px;

	@media screen and (max-width: 768px){
		flex-direction: column;
		align-items: flex-start;
	}
}

.contatos {
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 25px;
	row-gap: 50px;
	flex: 1;

	@media screen and (max-width: 768px){
		width: 100%;
		margin-bottom: 50px;
	}

	@media screen and (max-width: 550px){
		grid-template-columns: 1fr;

	}

}

.contato{
	a{
		display: flex;
		align-items: center;
		gap: 25px ;
		color: #ffffff;
		font-size: 16px;
		text-decoration: none;
		transition: 0.5s ease;
		&:hover{
			color: #3FB27F;
		}
	}

	&-icon{
		width: 24px;
		height: 24px;
	}
}

.imagePersonalEmail{
	width: 100%;
	flex-basis: 33%;
	svg{
		width: 100%;
		height: auto;
		min-width: 1px;
	}

	@media screen and (max-width: 768px){
		max-width: 350px;
	}
}
</style>
