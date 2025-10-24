// stores/vendorStore.js
import { defineStore } from 'pinia'
import VendorApi from '@/api/vendor/index.js'

export const useVendorStore = defineStore('vendor', {
    state: () => ({
        vendorList: [],
    }),
    actions: {
        async fetchVendors() {
            const res = await VendorApi.getVendors()
            this.vendorList = res.results.content || []
        },
    },
})
