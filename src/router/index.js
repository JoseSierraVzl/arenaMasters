import { createRouter, createWebHistory } from 'vue-router'
import GenerateCode from '@/views/GenerateCode.vue' // Importa el componente GenerateCode
import UsersView from '@/views/UsersView.vue' // Importa el componente UsersView
import TournamentsView from '@/views/TournamentsView.vue'
import PricesView from '@/views/PricesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/generate-code', // Redirige a la vista de generar código por defecto
    },
    {
      path: '/generate-code',
      name: 'generate-code',
      component: GenerateCode, // Usa el componente GenerateCode
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView, // Usa el componente UsersView
    },
    {
      path: '/tournaments',
      name: 'tournaments',
      component: TournamentsView, // Usa el componente UsersView
    },
    {
      path: '/prices',
      name: 'prices',
      component: PricesView, // Usa el componente UsersView
    },
  ],
})

export default router
