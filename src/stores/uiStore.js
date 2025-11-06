import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
    state: () => ({
        isLoginModalOpen: false,
        isNotificationModalOpen: false,
        notificationModalTitle: '',
        notificationModalMessage: '',
        notificationModalOnConfirm: null,
        notificationModalIcon: '', // 아이콘 추가
    }),
    actions: {
        openLoginModal() {
            this.isLoginModalOpen = true
        },
        closeLoginModal() {
            this.isLoginModalOpen = false
        },
        openNotificationModal({ title, message, onConfirm, icon = '' }) {
            this.notificationModalTitle = title
            this.notificationModalMessage = message
            this.notificationModalOnConfirm = onConfirm
            this.notificationModalIcon = icon
            this.isNotificationModalOpen = true
        },
        closeNotificationModal() {
            this.isNotificationModalOpen = false
            this.notificationModalTitle = ''
            this.notificationModalMessage = ''
            this.notificationModalOnConfirm = null
            this.notificationModalIcon = ''
        },
    },
})
