import { defineStore } from 'pinia'
import authApi from '@/api/auth/authApi.js'

const INTERNAL_ROLES = ['ADMIN', 'MANAGER', 'WORKER']

const homeByRole = (role) => {
  if (role === 'WORKER') return '/task/Worker/view'
  if (role === 'VENDOR_MANAGER') return '/vendor-portal/purchase-orders'
  if (INTERNAL_ROLES.includes(role)) return '/dashboard'
  return '/auth/login'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
    isLoading: false,
  }),

  getters: {
    role: (state) => state.user?.role ?? null,
    vendorId: (state) => state.user?.vendorId ?? null,
    isAuthenticated: (state) => Boolean(state.user),
    isAdmin: (state) => state.role === 'ADMIN',
    hasInitialized: (state) => state.initialized,
  },

  actions: {
    async initialize() {
      if (this.initialized) return
      await this.fetchMe()
    },

    async fetchMe() {
      this.isLoading = true
      const res = await authApi.me()
      this.user = res.success ? res.results : null
      this.initialized = true
      this.isLoading = false
      return res
    },

    async login(payload) {
      const res = await authApi.login(payload)
      if (res.success) {
        this.user = res.results ?? null
        this.initialized = true
      }
      return res
    },

    async logout() {
      try {
        await authApi.logout()
      } finally {
        this.user = null
        this.initialized = true
      }
    },

    hasAnyRole(roles = []) {
      if (!roles.length) return true
      if (this.role === 'ADMIN') return true
      return roles.includes(this.role)
    },

    defaultRoute() {
      return homeByRole(this.role)
    },
  },
})
