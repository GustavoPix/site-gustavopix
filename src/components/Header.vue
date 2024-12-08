<template>
	<div class="header">
		<div class="header_content">
			<span></span>
			<Logo
				class="logo"
				@click="changePage('home')"
			/>
			<div class="lang">
				<p
					:class="{'active' : lang == 'BR'}"
					@click="changeLang('BR')"
				>BR</p>
				<p
					:class="{'active' : lang == 'EN'}"
					@click="changeLang('EN')"
				>EN</p>
			</div>
		</div>
	</div>
</template>
<script>
import Logo from '@/assets/svgs/logo.vue';

export default {
	props: ['lang'],
	components: {
		Logo
	},
	methods: {
		changePage(page){
			this.$emit('changePage', page)
		},
		changeLang(lang){
			this.$emit('changeLang', lang)
		}
	}
}
</script>
<style lang="scss" scoped>
.header{
	width: 100%;
	position: fixed;

	//blur effect
	padding: 20px;
	border-radius: 5px;
	backdrop-filter: blur(10px);

	&_content{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
	}
}
.logo{
	cursor: pointer;
}

.lang{
	display: flex;
	align-items: center;
	justify-content: center;
	p{
		margin: 0 5px;
		cursor: pointer;
		color: #8F8F8F;

		&:hover, &.active{
			color: #00bfa6;
		}
	}
}
</style>
