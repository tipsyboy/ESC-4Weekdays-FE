import { defineStore } from 'pinia'
import MemberApi from '@/api/member/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  }),
  actions: {
    login() {
      this.isAuthenticated = true
      localStorage.setItem('isAuthenticated', 'true')
    },
    async logout() {
      try {
        await MemberApi.memberLogout({})
        this.isAuthenticated = false
        localStorage.removeItem('isAuthenticated')
        // 라우터 이동은 logout을 호출하는 컴포넌트에서 처리
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },
  },
})
