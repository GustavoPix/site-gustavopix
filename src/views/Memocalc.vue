<template>
	<div>
		<First
			class="section"
			title="Memocalc"
			text="Memocalc is a calculator that uses variables, allowing you to create a mathematical expression and use the result in other expressions. You can use it for simple calculations or complex expressions, as well as perform multiple calculations without losing your previous result."
			image="https://picsum.photos/200/300"
		/>
	</div>
</template>
<script>
import First from './Project/First.vue'

export default {
	components: {
		First
	}
}
</script>

<style lang="scss">
.section{
	width: 100%;
	max-width: 1180px;
	margin: 0 auto;
	margin-bottom: 250px;
	padding-left: 20px;
	padding-right: 20px;
}
</style>
