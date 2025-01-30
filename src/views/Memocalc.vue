<template>
	<div>
		<First
			class="section"
			title="Memocalc"
			:text="text[lang].sec_1"
			image="https://picsum.photos/200/300"
			textAlign="right"
		/>
		<First
			class="section"
			:text="text[lang].sec_2"
			image="https://picsum.photos/200/301"
			textAlign="left"
		/>
		<First
			class="section"
			:text="text[lang].sec_3"
			image="https://picsum.photos/200/302"
			textAlign="right"
		/>
		<First
			class="section"
			:text="text[lang].sec_4"
			image="https://picsum.photos/200/303"
			textAlign="left"
		/>
		<Downloads
			class="section"
			:downloads="downloads_memocalc"
			:title="text[lang].download"
			:lang="lang"
		/>
		<Supportme
			class="section"
		/>
		<Contatos
			class="section"
			:lang="lang"
		/>
	</div>
</template>
<script>
import First from './Project/First.vue'
import Downloads from '@/components/Downloads.vue';
import Contatos from '@/components/Contatos.vue';
import Supportme from '@/components/Supportme.vue';

export default {
	components: {
		First,
		Downloads,
		Contatos,
		Supportme
	},
	props: ['lang'],
	data(){
		return {
			text: {
				BR: {
					title: 'Memocalc',
					sec_1: 'Memocalc é uma calculadora que utiliza variáveis, permitindo que você crie uma expressão matemática e use o resultado em outras expressões. Você pode usá-lo para cálculos simples ou expressões complexas, bem como realizar vários cálculos sem perder seu resultado anterior.',
					sec_2: 'Memocalc é uma calculadora versátil que permite criar expressões simples e complexas, exibindo resultados instantaneamente em tempo real.',
					sec_3: 'Armazene os resultados de seus cálculos em variáveis, permitindo que você os referencie e reutilize em outras expressões. Essa funcionalidade ajuda a simplificar cálculos complexos e mantém seus resultados anteriores acessíveis para trabalhos em andamento.',
					sec_4: 'Aproveite os atalhos para simplificar seus cálculos, permitindo que você copie rapidamente os resultados para uma nova linha, limpe linhas individuais ou redefina todo o cálculo, tudo com apenas algumas teclas. Isso torna seu fluxo de trabalho mais rápido e eficiente, economizando tempo e aumentando a produtividade.',
					download: 'Baixe e aproveite o Memocalc gratuitamente!'
				},
				EN: {
					title: 'Projects',
					sec_1: 'Memocalc is a calculator that uses variables, allowing you to create a mathematical expression and use the result in other expressions. You can use it for simple calculations or complex expressions, as well as perform multiple calculations without losing your previous result.',
					sec_2: 'Memocalc is a versatile calculator that enables you to create both simple and complex expressions, displaying results instantly in real-time.',
					sec_3: 'Store the results of your calculations in variables, allowing you to reference and reuse them in other expressions. This feature helps streamline complex calculations and keeps your previous results accessible for ongoing work.',
					sec_4: 'Take advantage of shortcuts to streamline your calculations, allowing you to quickly copy results to a new line, clear individual lines, or reset the entire calculation, all with just a few keystrokes. This makes your workflow faster and more efficient, saving time and boosting productivity.',
					download: 'Download and enjoy the Memocalc for free!'
				}
			},
			downloads_memocalc: [
				{
					name: {
						BR: 'Baixar para Windows',
						EN: 'Download for Windows'
					},
					link: 'https://memocalc.com'
				},
				{
					name: {
						BR: 'Baixar para Linux',
						EN: 'Download for Linux'
					},
					link: 'https://memocalc.com'
				}
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.section{
	width: 100%;
	max-width: 1180px;
	margin: 0 auto;
	margin-bottom: 250px;
	padding-left: 20px;
	padding-right: 20px;
}
</style>
