<template>
	<div>
		<First
			class="section"
			title="Memocalc"
			text="Memocalc is a calculator that uses variables, allowing you to create a mathematical expression and use the result in other expressions. You can use it for simple calculations or complex expressions, as well as perform multiple calculations without losing your previous result."
			image="https://picsum.photos/200/300"
			textAlign="right"
		/>
		<First
			class="section"
			text="Memocalc is a versatile calculator that enables you to create both simple and complex expressions, displaying results instantly in real-time."
			image="https://picsum.photos/200/301"
			textAlign="left"
		/>
		<First
			class="section"
			text="Store the results of your calculations in variables, allowing you to reference and reuse them in other expressions. This feature helps streamline complex calculations and keeps your previous results accessible for ongoing work."
			image="https://picsum.photos/200/302"
			textAlign="right"
		/>
		<First
			class="section"
			text="Take advantage of shortcuts to streamline your calculations, allowing you to quickly copy results to a new line, clear individual lines, or reset the entire calculation, all with just a few keystrokes. This makes your workflow faster and more efficient, saving time and boosting productivity."
			image="https://picsum.photos/200/303"
			textAlign="left"
		/>
		<Downloads
			class="section"
			:downloads="downloads_memocalc"
			title="Download and enjoy the Memocalc for free!"
		/>
		<Supportme
			class="section"
		/>
		<Contatos
			class="section"
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
	data(){
		return {
			downloads_memocalc: [
				{
					name: 'Download for Windows',
					link: 'https://memocalc.com'
				},
				{
					name: 'Download for Linux',
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
