// stores/vendorStore.js
import { defineStore } from 'pinia'
import VendorApi from '@/api/vendor/index.js'

export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendorList: [],
  }),
  actions: {
    async fetchVendors() {
        const res = await VendorApi.getVendors({ page: 0, size: 100 }) // 이것도 페이징을 아예 안하게 할려면 어떻게 해야할지
      this.vendorList = res.results.content || []
    },
  },
})
