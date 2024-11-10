<template>
	<div class="header">
		<div class="header_content">
			<Logo
				class="logo"
				@click="changePage('home')"
			/>
		</div>
	</div>
</template>
<script>
import Logo from '@/assets/svgs/logo.vue';

export default {
	components: {
		Logo
	},
	methods: {
		changePage(page){
			this.$emit('changePage', page)
		}
	}
}
</script>
<style lang="scss" scoped>
.header{
	width: 100%;
	position: fixed;
	//blur effect

	&_content{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
	}
}
.logo{
	cursor: pointer;
	padding: 20px;
	border-radius: 5px;
	backdrop-filter: blur(10px);
}
</style>
