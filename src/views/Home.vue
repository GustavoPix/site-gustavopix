<template>
	<div>
		<First
			class="section"
			:lang="lang"
		/>
		<Projetos
			class="section"
			@changePage="changePage"
			:lang="lang"
		/>
		<Contatos
			class="section"
			:lang="lang"
		/>
	</div>
</template>
<script>
import First from './Home/First.vue'
import Projetos from './Home/Projetos.vue'
import Contatos from '@/components/Contatos.vue'

export default {
	name: 'Home',
	props: ['lang'],
	components: {
		First,
		Projetos,
		Contatos
	},
	methods: {
		changePage(page){
			this.$emit('changePage', page)
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
