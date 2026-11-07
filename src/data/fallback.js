// Dados estáticos usados apenas quando os JSON de public/data não carregam.
// Mantém o mesmo formato de site.json (somente nav, devtools, hero, contatos, footer e ui).
export default {
	nav: {
		brand: 'Gustavo Carvalho',
		label: { pt: 'Navegação principal', en: 'Main navigation' },
		items: [],
		cta: { id: 'contatos', label: { pt: 'Contatos', en: 'Contact' } },
		menuOpen: { pt: 'Abrir menu', en: 'Open menu' },
		menuClose: { pt: 'Fechar menu', en: 'Close menu' },
		langToggle: { pt: 'Switch to English', en: 'Mudar para português' },
		langShort: { pt: 'EN', en: 'PT' },
		themes: {
			button: { pt: 'Escolher tema', en: 'Choose theme' },
			title: { pt: 'Temas', en: 'Themes' },
			items: [
				{ id: 'midnight', name: 'Midnight', description: { pt: 'Padrão', en: 'Default' } },
				{ id: 'dracula', name: 'Dracula', description: { pt: 'Roxo', en: 'Purple' } },
				{ id: 'nord', name: 'Nord', description: { pt: 'Ártico', en: 'Arctic' } },
				{ id: 'forest', name: 'Forest', description: { pt: 'Floresta', en: 'Woods' } },
				{ id: 'red', name: 'Inferno', description: { pt: 'Brasa', en: 'Ember' } }
			]
		}
	},
	devtools: {
		message: {
			pt: 'Acho que vc não gostaria de olhar aqui, não há nada para você, caso precise de algo, entre em contato diretamente comigo!!!',
			en: "I don't think you'd want to look here, there's nothing for you. If you need anything, contact me directly!!!"
		}
	},
	hero: {
		name: 'Gustavo\nCarvalho',
		role: { pt: 'Desenvolvedor Full Stack', en: 'Full Stack Developer' },
		tagline: {
			pt: 'Obrigado por visitar o meu site. Algumas informações não puderam ser carregadas agora, mas você pode entrar em contato comigo pelos canais abaixo.',
			en: 'Thank you for visiting my website. Some information could not be loaded right now, but you can reach me through the channels below.'
		},
		meta: [],
		stack: []
	},
	contatos: {
		label: { pt: 'Contatos', en: 'Contact' },
		items: [
			{ icon: 'email', type: { pt: 'e-mail', en: 'email' }, value: 'gustavo1pix@gmail.com', url: 'mailto:gustavo1pix@gmail.com' },
			{ icon: 'linkedin', type: { pt: 'linkedin', en: 'linkedin' }, value: 'gustavopix', url: 'https://www.linkedin.com/in/gustavopix/' },
			{ icon: 'github', type: { pt: 'github', en: 'github' }, value: 'GustavoPix', url: 'https://github.com/GustavoPix' },
			{ icon: 'whatsapp', type: { pt: 'whatsapp', en: 'whatsapp' }, value: '+55 (19) 99551-7805', url: 'https://wa.me/5519995517805' }
		]
	},
	footer: {
		text: '© {year} Gustavo Carvalho'
	},
	ui: {
		loading: { pt: 'Carregando', en: 'Loading' },
		newTab: { pt: 'abre em nova aba', en: 'opens in a new tab' }
	}
}
