<template>
  <AppPageLayout>
    <template #header>
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
          물류창고 정보 수정
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          물류창고의 기본 정보와 주소를 수정합니다
        </p>
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
          <!-- 창고명 -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">창고명 *</span>
            <input
                v-model="form.name"
                type="text"
                placeholder="창고명을 입력하세요"
                class="input-base"
            />
          </label>

          <!-- 연락처 -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">연락처</span>
            <input
                v-model="form.phoneNumber"
                type="text"
                placeholder="예: 02-1234-5678"
                class="input-base"
            />
          </label>

          <!-- 이메일 -->
          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="label-text">이메일</span>
            <input
                v-model="form.email"
                type="email"
                placeholder="example@warehouse.com"
                class="input-base"
            />
          </label>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div class="space-y-5">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">주소 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label class="flex flex-col gap-1.5">
            <span class="label-text">우편번호</span>
            <input
                v-model="form.address.zipcode"
                type="text"
                placeholder="예: 06241"
                class="input-base"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="label-text">도시</span>
            <input
                v-model="form.address.city"
                type="text"
                placeholder="예: 서울특별시 강남구"
                class="input-base"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="label-text">도로명 주소</span>
            <input
                v-model="form.address.street"
                type="text"
                placeholder="예: 테헤란로 123"
                class="input-base"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="label-text">상세주소</span>
            <input
                v-model="form.address.detail"
                type="text"
                placeholder="예: 5층 물류부"
                class="input-base"
            />
          </label>
        </div>
      </div>

      <!-- 저장/취소 버튼 -->
      <div class="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <ButtonComp color="secondary" icon="cancel" @click="cancelEdit">취소</ButtonComp>
        <ButtonComp color="primary" icon="save" @click="updateWarehouse">저장</ButtonComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import warehouseApi from '@/api/warehouse/index.js'

const route = useRoute()
const router = useRouter()

// 기본 form 구조
const form = ref({
  name: '',
  phoneNumber: '',
  email: '',
  address: {
    zipcode: '',
    city: '',
    street: '',
    detail: '',
    country: 'KR',
  },
})

// ✅ 데이터 불러오기
const fetchWarehouse = async () => {
  try {
    const res = await warehouseApi.warehouseRead(`${route.params.id}`)
    if (res.results) form.value = res.results
  } catch (err) {
    console.error('❌ 데이터 불러오기 실패:', err)
    alert('물류창고 정보를 불러올 수 없습니다.')
  }
}

// ✅ PATCH 수정 요청
const updateWarehouse = async () => {
  if (!form.value.name) {
    alert('창고명은 필수입니다.')
    return
  }

  try {
    const res = await warehouseApi.warehouseUpdate(route.params.id, form.value)
    if (res.success) {
      alert('물류창고 정보가 수정되었습니다.')
      router.push({ name: 'warehouseDetail', params: { id: route.params.id } })
    } else {
      alert('수정 실패: ' + (res.message || '알 수 없는 오류'))
    }
  } catch (err) {
    console.error('❌ 수정 실패:', err)
    alert('수정 실패: ' + (err.response?.data?.message || '서버 오류'))
  }
}

// ✅ 취소 버튼
const cancelEdit = () => {
  if (confirm('수정을 취소하시겠습니까? 변경사항은 저장되지 않습니다.')) {
    router.push({ name: 'WarehouseDetail', params: { id: route.params.id } })
  }
}

onMounted(fetchWarehouse)
</script>

<style scoped>
.input-base {
  @apply w
