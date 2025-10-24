import { defineStore } from 'pinia'
import MemberApi from '@/api/member/index.js'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    login() {
      this.isAuthenticated = true
    },
    async logout() {
      try {
        await MemberApi.memberLogout({})
        this.isAuthenticated = false
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },
  },
})
