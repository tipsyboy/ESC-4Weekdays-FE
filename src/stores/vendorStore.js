// stores/vendorStore.js
import { defineStore } from 'pinia'
import VendorApi from '@/api/vendor/vendorApi.js'

export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendorList: [],
  }),
  actions: {
    async fetchVendors() {
      const res = await VendorApi.getVendors({ page: 0, size: 100 })
      this.vendorList = res.results.content || []
    },
  },
})
