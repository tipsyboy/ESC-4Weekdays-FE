<template>
  <AppPageLayout>
    <template #header>
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">공급업체 목록</h1>
        <ButtonComp color="primary" icon="add" @click="goCreate">신규 등록</ButtonComp>
      </div>
    </template>

    <!-- 검색창 -->
    <SearchBarComp v-model="searchText" placeholder="공급업체명 / 코드 검색" />

    <!-- 테이블 -->
    <TableComp :columns="columns" :data="displayList">
      <template #cell-name="{ row }">
        <RouterLink :to="`/vendors/${row.id}`" class="text-primary font-semibold hover:underline">
          {{ row.name }}
        </RouterLink>
      </template>

      <template #cell-status="{ row }">
        <BadgeComp
            :color="row.status === 'ACTIVE' ? 'success' : 'danger'"
            :label="row.status === 'ACTIVE' ? '거래중' : '중단'"
        />
      </template>
    </TableComp>
  </AppPageLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVendorStore } from '@/stores/vendorStore'
import api from '@/api/vendor'

import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'

const router = useRouter()
const goCreate = () => router.push('/vendors/create')

const vendorStore = useVendorStore()
const { vendorList } = storeToRefs(vendorStore)

const searchText = ref('')
const searchResult = ref([])

const columns = [
  { key: 'vendorCode', label: '공급업체 코드' },
  { key: 'name', label: '공급업체명' },
  { key: 'phoneNumber', label: '전화번호' },
  { key: 'email', label: '이메일' },
  { key: 'status', label: '상태', align: 'center' },
]

watch(searchText, async (val) => {
  if (!val) {
    searchResult.value = []
    return
  }

  const res = await api.getVendors({
    page: 0,
    size: 20,
    keyword: val,
  })
  if (res.success) {
    searchResult.value = res.results.content || []
  }
})

const displayList = computed(() => {
  return searchText.value ? searchResult.value : vendorList.value
})
</script>

