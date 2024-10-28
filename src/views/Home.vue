<template>
	<div>
		<First class="section" />
	</div>
</template>
<script>
import First from './Home/First.vue'
export default {
	name: 'Home',
	components: {
		First
	}
}
</script>

<style lang="scss">
.section{
	width: 100%;
	max-width: 1180px;
	height: 100vh;
	margin: 0 auto;
	padding-left: 20px;
	padding-right: 20px;
}
</style>
