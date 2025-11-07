import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
    state: () => ({
        isLoginModalOpen: false,
    }),
    actions: {
        openLoginModal() {
            this.isLoginModalOpen = true
        },
        closeLoginModal() {
            this.isLoginModalOpen = false
        },
    },
})
