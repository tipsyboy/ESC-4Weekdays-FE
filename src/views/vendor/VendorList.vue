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

// 라우터
const router = useRouter()
const goCreate = () => router.push('/vendors/create')

// ✅ Pinia store 사용
const vendorStore = useVendorStore()
const { vendorList } = storeToRefs(vendorStore)

// 검색 관련
const searchText = ref('')
const searchResult = ref([]) // 검색 결과만 임시로 저장

// 테이블 컬럼
const columns = [
  { key: 'vendorCode', label: '공급업체 코드' },
  { key: 'name', label: '공급업체명' },
  { key: 'phoneNumber', label: '전화번호' },
  { key: 'email', label: '이메일' },
  { key: 'status', label: '상태', align: 'center' },
]

// ✅ 검색어 변경 감지
watch(searchText, async (val) => {
  if (!val) {
    // 검색어 없으면 검색 결과 초기화
    searchResult.value = []
    return
  }

  // 검색어가 있으면 API 요청
  const res = await api.getVendors({
    page: 0,
    size: 20,
    keyword: val,
  })
  if (res.success) {
    searchResult.value = res.results.content || []
  }
})

// ✅ 표시할 목록: 검색 결과가 있으면 그걸, 없으면 store 데이터
const displayList = computed(() => {
  return searchText.value ? searchResult.value : vendorList.value
})
</script>

