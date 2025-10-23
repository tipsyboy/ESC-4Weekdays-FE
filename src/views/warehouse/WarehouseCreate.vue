<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">물류창고 등록</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            신규 물류창고 정보를 입력하세요
          </p>
        </div>
        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
          <ButtonComp color="primary" icon="save" @click="createWarehouse">등록</ButtonComp>
        </div>
      </div>
    </template>

    <section
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
           rounded-xl shadow-sm p-6 md:p-8 backdrop-blur-sm space-y-8"
    >
      <!-- 기본 정보 -->
      <div class="space-y-5">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">기본 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">창고명 *</span>
            <input
                v-model="form.name"
                type="text"
                placeholder="창고명을 입력하세요"
                class="w-full h-10 px-3 text-sm rounded-md
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">연락처</span>
            <input
                v-model="form.phoneNumber"
                type="text"
                placeholder="예: 02-1234-5678"
                class="w-full h-10 px-3 text-sm rounded-md
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">이메일</span>
            <input
                v-model="form.email"
                type="email"
                placeholder="example@warehouse.com"
                class="w-full h-10 px-3 text-sm rounded-md
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div class="space-y-5">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">주소 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">우편번호</span>
            <input
                v-model="form.address.zipcode"
                type="text"
                placeholder="예: 06241"
                class="w-full h-10 px-3 text-sm rounded-md
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">도시</span>
            <input
                v-model="form.address.city"
                type="text"
                placeholder="예: 서울특별시 강남구"
                class="w-full h-10 px-3 text-sm rounded-md
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">도로명 주소</span>
            <input
                v-model="form.address.street"
                type="text"
                placeholder="예: 테헤란로 123"
                class="w-full h-10 px-3 text-sm rounded-md
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">상세주소</span>
            <input
                v-model="form.address.detail"
                type="text"
                placeholder="예: 5층 창고동"
                class="w-full h-10 px-3 text-sm rounded-md
                   bg-background-light dark:bg-background-dark
                   border border-primary/20 dark:border-primary/30
                   focus:ring-2 focus:ring-primary/50 focus:border-primary
                   outline-none transition-all text-slate-800 dark:text-white"
            />
          </label>
        </div>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import warehouseApi from '@/api/warehouse/index.js'

const router = useRouter()

const form = ref({
  name: '',
  phoneNumber: '',
  email: '',
  address: {
    zipcode: '',
    street: '',
    detail: '',
    city: '',
    country: 'KR',
  },
})

const createWarehouse = async () => {
  if (!form.value.name) {
    alert('창고명은 필수입니다.')
    return
  }

  try {
    const res = await warehouseApi.warehouseCreate(form.value)
    if (res.success) {
      alert('물류창고가 등록되었습니다.')
      router.push({ name: 'warehouseDetail', params: { id: res.results } })
    } else {
      alert('등록 실패: ' + (res.message || '알 수 없는 오류'))
    }
  } catch (err) {
    console.error('❌ 등록 실패:', err)
    alert('등록 실패: ' + (err.response?.data?.message || '서버 오류'))
  }
}
</script>
