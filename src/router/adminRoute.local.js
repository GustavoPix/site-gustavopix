const ADMIN_PATH = /^\/admin\/?$/

export default async function resolveAdminRoute(pathname) {
	if (!ADMIN_PATH.test(pathname)) return null
	const { default: AdminPanel } = await import('@/admin/AdminPanel.vue')
	return AdminPanel
}
