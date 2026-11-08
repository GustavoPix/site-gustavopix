// API local do painel /admin: lê e grava os JSON de public/data.
// Só é registrada nos modos com admin (vite.config.js); não existe no build de prod.
import { existsSync } from 'node:fs'
import { readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const FILES = new Set(['site', 'stacks', 'experiencias', 'projetos'])
const ROUTE = /^\/__admin\/data\/([^/]+)\/?$/
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])
const MAX_BODY_BYTES = 1024 * 1024

class HttpError extends Error {
	constructor(status, message) {
		super(message)
		this.status = status
	}
}

function send(res, status, body) {
	res.statusCode = status
	res.setHeader('Content-Type', 'application/json; charset=utf-8')
	res.setHeader('Cache-Control', 'no-store')
	res.end(typeof body === 'string' ? body : JSON.stringify(body))
}

// Os middlewares de plugin rodam antes do allowedHosts do Vite, então o host é conferido aqui
function isLocalHost(req) {
	try {
		return LOCAL_HOSTS.has(new URL(`http://${req.headers.host}`).hostname)
	} catch {
		return false
	}
}

// Sem login, isto impede que outro site aberto no navegador grave nos arquivos
function assertSameOrigin(req) {
	const contentType = (req.headers['content-type'] ?? '').split(';')[0].trim()
	if (contentType !== 'application/json') throw new HttpError(403, 'Content-Type não permitido')

	let originHost = null
	try {
		originHost = new URL(req.headers.origin).host
	} catch {
		// sem Origin válido: cai na recusa abaixo
	}
	if (originHost !== req.headers.host) throw new HttpError(403, 'Origem não permitida')
}

function readBody(req) {
	return new Promise((resolve, reject) => {
		const chunks = []
		let size = 0
		req.on('data', (chunk) => {
			size += chunk.length
			if (size > MAX_BODY_BYTES) reject(new HttpError(413, 'Corpo grande demais'))
			else chunks.push(chunk)
		})
		req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
		req.on('error', reject)
	})
}

function parseDocument(raw) {
	let data
	try {
		data = JSON.parse(raw)
	} catch {
		throw new HttpError(400, 'JSON inválido')
	}
	if (data === null || typeof data !== 'object' || Array.isArray(data)) {
		throw new HttpError(400, 'A raiz do JSON precisa ser um objeto')
	}
	return data
}

async function writeAtomic(file, content) {
	const temp = `${file}.${process.pid}.tmp`
	try {
		await writeFile(temp, content)
		await rename(temp, file)
	} catch (error) {
		await rm(temp, { force: true })
		throw error
	}
}

function createHandler(getDirs) {
	return async (req, res, next) => {
		const pathname = (req.url ?? '').split('?')[0]
		const match = ROUTE.exec(pathname)
		if (!match) return next()

		try {
			if (!isLocalHost(req)) throw new HttpError(403, 'Disponível apenas em localhost')

			const name = match[1]
			if (!FILES.has(name)) throw new HttpError(404, 'Arquivo desconhecido')

			const { publicData, builtData } = getDirs()
			const source = path.join(publicData, `${name}.json`)

			if (req.method === 'GET') {
				return send(res, 200, await readFile(source, 'utf8'))
			}
			if (req.method !== 'PUT') throw new HttpError(405, 'Método não permitido')

			assertSameOrigin(req)
			const data = parseDocument(await readBody(req))
			const content = `${JSON.stringify(data, null, '\t')}\n`

			await writeAtomic(source, content)
			if (existsSync(builtData)) {
				await writeAtomic(path.join(builtData, `${name}.json`), content)
			}
			send(res, 200, { ok: true })
		} catch (error) {
			send(res, error.status ?? 500, { error: error.message })
		}
	}
}

export default function adminApi() {
	let config

	const handler = createHandler(() => ({
		publicData: path.join(config.publicDir, 'data'),
		builtData: path.resolve(config.root, config.build.outDir, 'data')
	}))

	return {
		name: 'admin-api',
		configResolved(resolved) {
			config = resolved
		},
		configureServer(server) {
			server.middlewares.use(handler)
		},
		configurePreviewServer(server) {
			server.middlewares.use(handler)
		}
	}
}
