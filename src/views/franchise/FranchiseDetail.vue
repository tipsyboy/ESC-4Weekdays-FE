<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
            {{ franchise?.name || '가맹점 상세정보' }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            가맹점코드: {{ franchise?.franchiseCode || '-' }}
          </p>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">
            뒤로가기
          </ButtonComp>
          <ButtonComp color="primary" icon="edit" @click="editFranchise">
            수정
          </ButtonComp>
          <ButtonComp color="danger" icon="block" @click="suspendFranchise">
            거래 중단
          </ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="franchise" class="space-y-8">
      <!-- 기본 정보 -->
      <div
          class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
               rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">기본 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div><span class="text-gray-500 text-sm block">상태</span> {{ franchise.status }}</div>
          <div><span class="text-gray-500 text-sm block">연락처</span> {{ franchise.phoneNumber || '-' }}</div>
          <div><span class="text-gray-500 text-sm block">이메일</span> {{ franchise.email || '-' }}</div>
          <div class="col-span-1 md:col-span-2">
            <span class="text-gray-500 text-sm block">설명</span> {{ franchise.description || '-' }}
          </div>
          <div><span class="text-gray-500 text-sm block">등록일</span> {{ formatDate(franchise.createdAt) }}</div>
          <div><span class="text-gray-500 text-sm block">상품 수</span> {{ franchise.productCount }}</div>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div
          class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
               rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">주소 정보</h2>
        <div class="space-y-2">
          <div>{{ franchise.address?.zipcode || '-' }}</div>
          <div>{{ franchise.address?.city || '' }}</div>
          <div>{{ franchise.address?.street || '' }} {{ franchise.address?.detail || '' }}</div>
        </div>
      </div>
    </section>

    <div v-else class="text-center text-gray-500 py-10">
      가맹점 정보를 불러오는 중입니다...
    </div>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'

const route = useRoute()
const router = useRouter()
const franchise = ref(null)

// ✅ 더미 데이터 (API 실패 시 대체)
const dummyFranchise = {
  id: 1,
  franchiseCode: 'FR-2025001',
  name: '올리브뷰티 강남점',
  phoneNumber: '02-567-1234',
  email: 'gangnam@olivebeauty.co.kr',
  status: 'ACTIVE',
  description: '서울 강남구에 위치한 가맹점으로, 스킨케어 및 메이크업 전문 매장입니다.',
  productCount: 124,
  createdAt: '2025-01-12T10:30:00Z',
  address: {
    zipcode: '06241',
    city: '서울특별시 강남구',
    street: '테헤란로 152',
    detail: '3층 가맹영업부',
  },
}

const fetchFranchise = async () => {
  try {
    const res = await axios.get(`/api/franchises/${route.params.id}`)
    franchise.value = res.data?.results || dummyFranchise
  } catch (err) {
    console.error('❌ 가맹점 상세 조회 실패:', err)
    franchise.value = dummyFranchise
  }
}

const suspendFranchise = async () => {
  if (!confirm('이 가맹점의 거래를 중단하시겠습니까?')) return
  alert('거래가 중단되었습니다.')
  router.push('/franchise')
}

const editFranchise = () => {
  router.push(`/franchise/edit/${route.params.id}`)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

onMounted(fetchFranchise)
</script>
