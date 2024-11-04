<template>
	<div class="footer">
		<small>&copy;{{ year }} - Gustavo Carvalho v1.0</small>
	</div>
</template>

<script>
export default {
	data(){
		return {
			year: new Date().getFullYear()
		}
	}
}
</script>

<style lang="scss" scoped>
.footer{
	width: 100%;
	background: #1a2028;
	padding-top: 48px;
	padding-bottom: 48px;
	display: flex;
	justify-content: center;
	border-radius: 20px 20px 0 0;
	position: relative;

	&::after{
		content: '';
		width: 100%;
		height: 5px;
		background: #41B883;
		position: absolute;
		bottom: 0px;
		border-radius: 10px 10px 0 0;
	}

	small{
		color: #FFFFFF;
		font-size: 14px;

	}
}
</style>
