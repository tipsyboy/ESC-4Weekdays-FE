<template>
  <AppPageLayout>
    <template #header>
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
          가맹점 정보 수정
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          가맹점의 기본 정보, 주소, 상태를 수정합니다
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
          <!-- 코드 (읽기 전용) -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">가맹점 코드</span>
            <input v-model="form.franchiseCode" type="text" class="input-base bg-gray-100" readonly/>
          </label>

          <!-- 가맹점명 -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">가맹점명 *</span>
            <input v-model="form.name" type="text" placeholder="가맹점명을 입력하세요" class="input-base"/>
          </label>

          <!-- 연락처 -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">연락처</span>
            <input v-model="form.phoneNumber" type="text" placeholder="예: 02-1234-5678" class="input-base"/>
          </label>

          <!-- 이메일 -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">이메일</span>
            <input v-model="form.email" type="email" placeholder="example@franchise.com" class="input-base"/>
          </label>

          <!-- 상태 -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">상태</span>
            <select v-model="form.status" class="input-base">
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="SUSPENDED">거래중단</option>
            </select>
          </label>

          <!-- 설명 -->
          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="label-text">설명</span>
            <textarea
                v-model="form.description"
                rows="3"
                placeholder="가맹점 설명을 입력하세요"
                class="input-base resize-none"
            />
          </label>

          <!-- 등록일 (읽기 전용) -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">등록일</span>
            <input v-model="formattedCreatedAt" type="text" class="input-base bg-gray-100" readonly/>
          </label>

          <!-- 수정일 (읽기 전용) -->
          <label class="flex flex-col gap-1.5">
            <span class="label-text">최근 수정일</span>
            <input v-model="formattedUpdatedAt" type="text" class="input-base bg-gray-100" readonly/>
          </label>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div class="space-y-5">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">주소 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label class="flex flex-col gap-1.5">
            <span class="label-text">우편번호</span>
            <input v-model="form.address.zipcode" type="text" placeholder="예: 06241" class="input-base"/>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="label-text">도시</span>
            <input v-model="form.address.city" type="text" placeholder="예: 서울특별시 강남구" class="input-base"/>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="label-text">도로명 주소</span>
            <input v-model="form.address.street" type="text" placeholder="예: 테헤란로 152" class="input-base"/>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="label-text">상세주소</span>
            <input v-model="form.address.detail" type="text" placeholder="예: 3층 가맹영업부" class="input-base"/>
          </label>
        </div>
      </div>

      <!-- 저장/취소 버튼 -->
      <div class="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <ButtonComp color="secondary" icon="cancel" @click="cancelEdit">취소</ButtonComp>
        <ButtonComp color="primary" icon="save" @click="updateFranchise">저장</ButtonComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'

const route = useRoute()
const router = useRouter()

// 기본 form 구조
const form = ref({
  franchiseCode: '',
  name: '',
  phoneNumber: '',
  email: '',
  description: '',
  status: 'ACTIVE',
  createdAt: '',
  updatedAt: '',
  address: {
    zipcode: '',
    city: '',
    street: '',
    detail: '',
    country: 'KR',
  },
})

// 날짜 포맷용 computed
const formattedCreatedAt = computed(() =>
    form.value.createdAt ? new Date(form.value.createdAt).toLocaleString('ko-KR') : ''
)
const formattedUpdatedAt = computed(() =>
    form.value.updatedAt ? new Date(form.value.updatedAt).toLocaleString('ko-KR') : ''
)

// ✅ 데이터 불러오기
const fetchFranchise = async () => {
  try {
    const res = await axios.get(`/api/franchises/${route.params.id}`)
    if (res.data?.results) form.value = res.data.results
  } catch (err) {
    console.error('❌ 데이터 불러오기 실패:', err)
    alert('가맹점 정보를 불러올 수 없습니다.')
  }
}

// ✅ PATCH 수정 요청
const updateFranchise = async () => {
  try {
    const res = await axios.patch(`/api/franchises/${route.params.id}`, form.value)
    if (res.data?.success) {
      alert('가맹점 정보가 수정되었습니다.')
      router.push({ name: 'franchiseDetail', params: { id: route.params.id } })
    } else {
      alert('수정 실패: ' + (res.data?.message || '알 수 없는 오류'))
    }
  } catch (err) {
    console.error('❌ 수정 실패:', err)
    alert('수정 실패: ' + (err.response?.data?.message || '서버 오류'))
  }
}

// ✅ 취소 버튼
const cancelEdit = () => {
  if (confirm('수정을 취소하시겠습니까? 변경사항은 저장되지 않습니다.')) {
    router.push({name: 'franchiseDetail', params: {id: route.params.id}})
  }
}

onMounted(fetchFranchise)
</script>

<style scoped>
.input-base {
  @apply w-full h-10 px-3 text-sm rounded-md
  bg-background-light dark:bg-background-dark
  border border-primary/20 dark:border-primary/30
  focus:ring-2 focus:ring-primary/50 focus:border-primary
  outline-none transition-all text-slate-800 dark:text-white;
}

.label-text {
  @apply text-xs font-medium text-slate-700 dark:text-slate-200;
}
</style>
