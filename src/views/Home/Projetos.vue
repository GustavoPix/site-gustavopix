<template>
	<div>
		<h2 class="title" v-html="text[lang].title"></h2>
		<ul class="projetos">
			<li>
				<div @click="changePage('memocalc')" class="projeto">
					<IconMemoCalc class="projeto-icon"/>
					<h3 class="projeto-name">Memo-calc</h3>
					<p class="projeto-descricao" v-html="text[lang].memocalc"></p>
					<ul class="projeto-techs">
						<li>
							<LogoVue />
						</li>
						<li>
							<LogoElectron />
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import IconMemoCalc from '@/assets/svgs/memo-calc.vue'
import LogoVue from '@/assets/svgs/logo-vue.vue'
import LogoElectron from '@/assets/svgs/logo-electron.vue'

export default {
	components: {
		IconMemoCalc,
		LogoVue,
		LogoElectron
	},
	props: ['lang'],
	data(){
		return {
			text: {
				BR: {
					title: 'Projetos',
					memocalc: 'Calculadora avançada com uso de variáveis'
				},
				EN: {
					title: 'Projects',
					memocalc: 'Advanced calculator with variable usage'
				}
			}
		}
	},
	methods: {
		changePage(page){
			this.$emit('changePage', page)
		}
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
.projetos{
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 50px;
}

.projeto{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	padding: 20px;
	padding-top: 30px;
	padding-bottom: 10px;
	transition: 0.5s ease;
	//background: #374659;
	border-radius: 10px;

	a{

	}

	*{
		transition: 0.5s ease;
	}

	&:hover{
		background: #374659;
		color: #fff;
		cursor: pointer;
		padding-top: 20px;
		padding-bottom: 20px;

		.projeto-icon{
			*{
				//fill: #fff;
			}
		}

		.projeto-name{
			color: #3FB27F;
		}

		.projeto-descricao{
			//color: #fff;
		}
	}

	&-icon{
		width: 100%;
		max-width: 100px;
	}

	&-name{
		color: #FFFFFF;
		font-size: 24px;
		font-weight: 700;
	}

	&-descricao{
		color: #8F8F8F;
		font-size: 16px;
		text-align: center;
	}
	&-techs{
		display: flex;
		gap: 10px;
		justify-content: center;
		align-items: center;

		> li{
			flex: 1;
			min-width: 1px;
			width: 25px;
			height: 25px;
			//width: 100%;

			div {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
