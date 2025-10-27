<template>
  <AppPageLayout>
    <!-- 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">공급업체 상세</h1>

        <div class="flex flex-wrap items-center gap-2 md:gap-3">
          <ButtonComp color="primary" icon="edit" @click="openEditModal">수정</ButtonComp>

          <!-- 상태별 버튼 분기 -->
          <ButtonComp
            v-if="vendor.status === 'ACTIVE'"
            color="danger"
            icon="block"
            @click="updateStatus('SUSPENDED')"
          >
            거래 중단
          </ButtonComp>

          <ButtonComp
            v-else-if="vendor.status === 'SUSPENDED'"
            color="success"
            icon="check_circle"
            @click="updateStatus('ACTIVE')"
          >
            거래 활성화
          </ButtonComp>

          <ButtonComp color="secondary" icon="arrow_back" @click="router.back()">
            뒤로가기
          </ButtonComp>
        </div>
      </div>
    </template>

    <!-- 기본 정보 -->
    <section
      v-if="vendor.id"
      class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 backdrop-blur-sm space-y-6"
    >
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">기본 정보</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <span class="text-xs text-gray-500 block mb-1">공급업체명</span>
          <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ vendor.name }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">공급업체 코드</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.vendorCode }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">연락처</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.phoneNumber || '-' }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">이메일</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.email || '-' }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">상태</span>
          <BadgeComp
            :color="vendor.status === 'ACTIVE' ? 'success' : vendor.status === 'INACTIVE' ? 'warning' : 'danger'"
            :label="getStatusLabel(vendor.status)"
          />
        </div>

        <div class="lg:col-span-3">
          <span class="text-xs text-gray-500 block mb-1">설명</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.description || '-' }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">등록일</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ formatDate(vendor.createdAt) }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">상품 수</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.productCount }}</p>
        </div>
      </div>
    </section>

    <!-- 주소 정보 -->
    <section
      v-if="vendor.id"
      class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 backdrop-blur-sm space-y-6"
    >
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">주소 정보</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <span class="text-xs text-gray-500 block mb-1">우편번호</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.address?.zipcode || '-' }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">도시</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.address?.city || '-' }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">도로명</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.address?.street || '-' }}</p>
        </div>

        <div>
          <span class="text-xs text-gray-500 block mb-1">상세주소</span>
          <p class="text-sm text-slate-800 dark:text-slate-200">{{ vendor.address?.detail || '-' }}</p>
        </div>
      </div>
    </section>

    <!-- 수정 모달 -->
    <ModalComp
      :open="isEditModal"
      title="공급업체 정보 수정"
      icon="edit"
      @close="isEditModal = false"
    >
      <div class="space-y-4">
        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">공급업체명</span>
          <input v-model="editForm.name" type="text" class="input-base" />
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">이메일</span>
          <input v-model="editForm.email" type="email" class="input-base" />
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">전화번호</span>
          <input v-model="editForm.phoneNumber" type="text" class="input-base" />
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-slate-700 dark:text-slate-200">설명</span>
          <textarea v-model="editForm.description" rows="3" class="input-base resize-none" />
        </label>

        <hr class="my-2 border-gray-300 dark:border-gray-700" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">우편번호</span>
            <input v-model="editForm.address.zipcode" type="text" class="input-base" />
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">도시</span>
            <input v-model="editForm.address.city" type="text" class="input-base" />
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">도로명</span>
            <input v-model="editForm.address.street" type="text" class="input-base" />
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200">상세주소</span>
            <input v-model="editForm.address.detail" type="text" class="input-base" />
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <ButtonComp color="secondary" @click="isEditModal = false">취소</ButtonComp>
          <ButtonComp color="primary" @click="submitUpdate">저장</ButtonComp>
        </div>
      </template>
    </ModalComp>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/vendor'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import ModalComp from '@/components/common/ModalComp.vue'

const route = useRoute()
const router = useRouter()
const vendor = ref({})
const isEditModal = ref(false)
const editForm = ref({})

// 상태 라벨 매핑
const getStatusLabel = (status) => {
  const map = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    SUSPENDED: '거래중단',
  }
  return map[status] || '-'
}

const loadVendor = async () => {
  const res = await api.getVendorDetail(route.params.id)
  if (res.success) vendor.value = res.results
}

const openEditModal = async () => {
  editForm.value = {
    ...vendor.value,
    address: vendor.value.address || {
      zipcode: '',
      city: '',
      street: '',
      detail: '',
      country: 'KR',
    },
  }
  await nextTick()
  isEditModal.value = true
}

const submitUpdate = async () => {
  const req = {
    name: editForm.value.name,
    email: editForm.value.email,
    phoneNumber: editForm.value.phoneNumber,
    description: editForm.value.description,
    address: editForm.value.address,
  }

  const res = await api.updateVendor(route.params.id, req)
  if (res.success) {
    alert('공급업체 정보가 수정되었습니다.')
    isEditModal.value = false
    await loadVendor()
  } else {
    alert('수정 중 오류가 발생했습니다.')
  }
}

const updateStatus = async (newStatus) => {
  const confirmMsg =
    newStatus === 'SUSPENDED'
      ? '이 업체의 거래를 중단하시겠습니까?'
      : '이 업체의 거래를 다시 활성화하시겠습니까?'
  if (!confirm(confirmMsg)) return

  const res = await api.updateVendorStatus(route.params.id, newStatus)
  if (res.success) {
    alert(
      newStatus === 'SUSPENDED'
        ? '거래가 중단되었습니다.'
        : '거래가 활성화되었습니다.'
    )
    await loadVendor()
  } else {
    alert('상태 변경 중 오류가 발생했습니다.')
  }
}

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('ko-KR') : '-')

onMounted(loadVendor)
</script>
