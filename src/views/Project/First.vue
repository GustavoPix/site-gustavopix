<template>
	<div class="first">
		<h1 class="title" v-if="title">{{ title }}</h1>
		<div class="row">
			<div class="image">
				<img :src="image" alt="">
			</div>
			<p class="text" :style="{
				order: textAlign === 'left' ? -1 : 0
			}">{{ text }}</p>
		</div>
	</div>
</template>

<script>
export default {
	components: {
	},
	props: {
		title: String,
		text: String,
		image: String,
		textAlign: {
			type: String,
			default: 'left'
		}
	}
}
</script>

<style lang="scss" scoped>
.first{
	padding-top: 100px;
	padding-bottom: 100px;
}
.title{
	font-size: 46px;
	margin-bottom: 100px;
	line-height: 150%;
	color: #00BFA6;

	@media (max-width: 768px){
		font-size: 36px;
	}

}

.text{
	color: #fff;
	font-size: 16px;
	line-height: 200%;
}
.row{
	display: flex;
	align-items: flex-start;
	gap: 25px;

	@media (max-width: 768px){
		flex-direction: column;
	}
}

.icon{
	width: 100%;

	@media (max-width: 768px){
		max-width: 350px;
	}
}
</style>
