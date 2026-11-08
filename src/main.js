import { createApp } from 'vue'
import App from './App.vue'
import resolveAdminRoute from '@admin-route'
import '@/styles/main.scss'

async function boot() {
	const Root = (await resolveAdminRoute(window.location.pathname)) ?? App
	createApp(Root).mount('#app')
}

boot()
