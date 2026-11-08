import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import adminApi from './vite/admin-api-plugin.js'

const src = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

// Só estes modos têm o painel /admin. O Vite não aceita um modo chamado "local".
const ADMIN_MODES = ['development', 'admin']

export default defineConfig(({ mode }) => {
	const withAdmin = ADMIN_MODES.includes(mode)

	return {
		base: withAdmin ? '/' : './',
		plugins: [vue(), withAdmin && adminApi()],
		build: {
			outDir: withAdmin ? 'dist-local' : 'dist'
		},
		resolve: {
			alias: {
				// No prod aponta para um stub: os arquivos do admin nem entram no grafo de módulos
				'@admin-route': src(withAdmin ? 'router/adminRoute.local.js' : 'router/adminRoute.prod.js'),
				'@': src('')
			}
		}
	}
})
