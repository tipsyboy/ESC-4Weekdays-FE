import { defineStore } from 'pinia'
import MemberApi from '@/api/member/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    role: localStorage.getItem('userRole') || null,
  }),

  getters: {
    // 관리자 여부 간단히 확인 가능
    isAdmin: (state) => state.role === 'ADMIN',
  },

  actions: {
    login(role) {
      this.isAuthenticated = true
      this.role = role
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userRole', role)
    },

    async logout() {
      try {
        await MemberApi.memberLogout({})
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        this.isAuthenticated = false
        this.role = null
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userRole')
      }
    },
  },
})
