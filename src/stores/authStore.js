import { defineStore } from 'pinia'
import MemberApi from '@/api/member/index.js'

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
        // 라우터 이동은 logout을 호출하는 컴포넌트에서 처리
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },
  },
})
