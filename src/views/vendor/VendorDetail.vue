<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
            {{ vendor?.name || '업체 상세정보' }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            업체코드: {{ vendor?.vendorCode || '-' }}
          </p>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">
            뒤로가기
          </ButtonComp>
          <ButtonComp color="primary" icon="edit" @click="editVendor">
            수정
          </ButtonComp>
          <ButtonComp color="danger" icon="block" @click="suspendVendor">
            거래 중단
          </ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="vendor" class="space-y-8">
      <!-- 기본 정보 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
               rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">기본 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div><span class="text-gray-500 text-sm block">상태</span> {{ vendor.status }}</div>
          <div><span class="text-gray-500 text-sm block">연락처</span> {{ vendor.phoneNumber || '-' }}</div>
          <div><span class="text-gray-500 text-sm block">이메일</span> {{ vendor.email || '-' }}</div>
          <div class="col-span-1 md:col-span-2">
            <span class="text-gray-500 text-sm block">설명</span> {{ vendor.description || '-' }}
          </div>
          <div><span class="text-gray-500 text-sm block">등록일</span> {{ formatDate(vendor.createdAt) }}</div>
          <div><span class="text-gray-500 text-sm block">상품 수</span> {{ vendor.productCount }}</div>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
               rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">주소 정보</h2>
        <div class="space-y-2">
          <div>{{ vendor.address?.zipcode || '-' }}</div>
          <div>{{ vendor.address?.city || '' }}</div>
          <div>{{ vendor.address?.street || '' }} {{ vendor.address?.detail || '' }}</div>
        </div>
      </div>
    </section>

    <div v-else class="text-center text-gray-500 py-10">
      업체 정보를 불러오는 중입니다...
    </div>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'

const getStatusLabel = (status) => {
  const map = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    SUSPENDED: '거래중단',
  }
  return map[status] || '-'
}

const getStatusColor = (status) => {
  const map ={
    ACTIVE: 'success',
    INACTIVE: 'warning',
    SUSPENDED: 'danger',
  }
  return map[status] || 'gray'
}

const route = useRoute()
const router = useRouter()
const vendor = ref(null)

const fetchVendor = async () => {
  try {
    const res = await axios.get(`/api/vendors/${route.params.id}`)
    vendor.value = res.data?.results || null // 단일 객체
  } catch (err) {
    console.error('❌ 업체 상세 조회 실패:', err)
  }
}

const suspendVendor = async () => {
  if (!confirm('이 업체의 거래를 중단하시겠습니까?')) return
  await axios.delete(`/api/vendors/${route.params.id}`)
  alert('거래가 중단되었습니다.')
  router.push('/vendor')
}

const editVendor = () => {
  router.push(`/vendor/edit/${route.params.id}`)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

onMounted(fetchVendor)
</script>
