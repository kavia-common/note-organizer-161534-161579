/**
 * Nuxt configuration for the Notes app.
 */
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Notes — Nuxt',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A modern notes app with authentication, CRUD, and search.',
        },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/styles.css'],
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
});
