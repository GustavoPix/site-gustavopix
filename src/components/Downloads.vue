<template>
	<div>
		<h3 class="title">{{ title }}</h3>
		<ul class="buttons">
			<li v-for="download in downloads" :key="download.id" class="button">
				<a :href="download.link" target="_blank">
					{{ download.name[lang] }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		downloads: Array,
		title: String,
		lang: String
	}
}
</script>

<style lang="scss" scoped>
.title{
	color: #ffffff;
	font-size: 24px;
	margin-bottom: 50px;
	font-weight: 700;
	text-align: center;
}
.buttons{
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	gap: 25px;
}
.button{
	border-radius: 3px;
	background-color: #ffffff;

	a{
		border-radius: 3px;
		background-color: #00BFA6;
		padding: 20px 40px;
		display: block;
		transition: 0.5s ease;
		text-align: center;

		&:hover{
			background-color: rgba( #00BFA6 , 0.75);
		}
	}
}
</style>
