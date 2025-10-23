<template>
  <AppPageLayout>
    <template #header>
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">공급업체 목록</h1>
        <ButtonComp color="primary" icon="add" @click="goCreate">신규 등록</ButtonComp>
      </div>
    </template>

    <SearchBarComp v-model="searchText" placeholder="공급업체명 / 코드 검색" />

    <TableComp :columns="columns" :data="filteredList">
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/vendor'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TableComp from '@/components/common/TableComp.vue'
import SearchBarComp from '@/components/common/SearchBarComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'

const router = useRouter()
const vendorList = ref([])
const searchText = ref('')

const columns = [
  { key: 'vendorCode', label: '공급업체 코드' },
  { key: 'name', label: '공급업체명' },
  { key: 'phoneNumber', label: '전화번호' },
  { key: 'email', label: '이메일' },
  { key: 'status', label: '상태', align: 'center' },
]

const goCreate = () => router.push('/vendors/create')

onMounted(async () => {
  const res = await api.getVendors({ page: 0, size: 20 })
  if (res.success) {
    vendorList.value = res.results.content || []
  }
})

const filteredList = computed(() => {
  if (!searchText.value) return vendorList.value
  return vendorList.value.filter((v) =>
    [v.name, v.vendorCode].some((val) =>
      val?.toLowerCase().includes(searchText.value.toLowerCase()),
    ),
  )
})
</script>
