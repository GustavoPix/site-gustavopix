<template>
	<div>
		<h2 class="title">Contatos</h2>
		<div class="row">
			<ul>

			</ul>
			<div>
				<ImagePersonalEmail />
			</div>
		</div>
	</div>
</template>

<script>
import ImagePersonalEmail from '@/assets/svgs/undraw_personal_email.vue'

export default {
	components: {
		ImagePersonalEmail
	}
}

</script>

<style lang="scss" scoped>
.title{
	color: #41B883;
	font-size: 48px;
	margin-bottom: 50px;
	font-weight: 700;
}
.row{
	display: flex;
	justify-content: space-between;
	align-items: center	;
	gap: 50px;
}
</style>
