// https://nuxt.com/docs/api/configuration/nuxt-config
// import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // use this commet line with package-test.json 
  extends: [['bitbucket:vladimir-bnb/xcore-kit#develop']],
  // extends: [['bitbucket:vladimir-bnb/xcore-kit#develop', { install: true }]],
  // vite:{
  //   server:{
  //     hmr: {
  //       timeout: 0
  //     }
  //   }
  // }

  icon: {
    customCollections: [
      {
        prefix: "x",
        dir: "./assets/icons"
      }
    ],
    clientBundle: {
      scan: true,
      includeCustomCollections: false,
      sizeLimitKb: 5000
    }
  },

  nitro: {
    routeRules: {
      '/my-api/**': {
        proxy: 'http://10.240.208.143/interbank-core-cortex-api/api/**',
        cors: true,
      }
    }
  },
  
  runtimeConfig: {
    public: {
      apiBase: '/my-api'
    }
  }
})