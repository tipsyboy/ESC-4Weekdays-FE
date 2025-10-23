<template>
  <AppPageLayout>
    <!-- 페이지 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">공급업체 등록</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            새로운 공급업체를 등록합니다.
          </p>
        </div>
        <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
      </div>
    </template>

    <!-- 본문 -->
    <section
      class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 md:p-8 backdrop-blur-sm space-y-8"
    >
      <!-- 기본 정보 -->
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">기본 정보</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">공급업체명</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="예: 아모레퍼시픽"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">이메일</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@company.com"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">전화번호</label>
            <input
              v-model="form.phoneNumber"
              type="text"
              placeholder="예: 02-1234-5678"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">설명</label>
            <input
              v-model="form.description"
              type="text"
              placeholder="공급업체 관련 설명"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">주소 정보</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">우편번호</label>
            <input
              v-model="form.zipcode"
              type="text"
              placeholder="예: 12345"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">도로명 주소</label>
            <input
              v-model="form.street"
              type="text"
              placeholder="예: 서울특별시 강남구 테헤란로 123"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">상세 주소</label>
            <input
              v-model="form.detail"
              type="text"
              placeholder="예: ○○빌딩 3층"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">도시</label>
            <input
              v-model="form.city"
              type="text"
              placeholder="예: 서울특별시 강남구"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">국가 코드</label>
            <input
              v-model="form.country"
              type="text"
              placeholder="예: KR"
              class="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2.5
                     text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-800
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-end pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <ButtonComp color="primary" icon="save" @click="createVendor">저장</ButtonComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/vendor'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  phoneNumber: '',
  description: '',
  zipcode: '',
  street: '',
  detail: '',
  city: '',
  country: '',
})

const createVendor = async () => {
  if (!form.value.name) return alert('공급업체명을 입력해주세요.')
  const res = await api.createVendor(form.value)
  if (res.isSuccess) {
    alert('공급업체가 등록되었습니다.')
    router.push('/vendors')
  }
}
</script>

