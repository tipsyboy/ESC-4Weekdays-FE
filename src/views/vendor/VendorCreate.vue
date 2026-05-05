<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">Vendor Create</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">공급업체 등록</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            공급업체 기본 정보를 등록합니다. 등록 후 담당자 승인 전까지 기본 상태는 `거래대기`입니다.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <ButtonComp color="secondary" icon="arrow_back" @click="handleCancel">목록으로</ButtonComp>
          <ButtonComp color="primary" icon="save" @click="submitForm">저장</ButtonComp>
        </div>
      </div>
    </template>

    <section class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
      <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
        <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">기본 정보</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">공급업체 식별값과 연락 정보를 입력합니다.</p>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">공급업체명</span>
            <input v-model="form.name" class="input-base" placeholder="예: 한빛유통" @blur="touchField('name')" />
            <span v-if="showError('name')" class="text-sm text-rose-500">{{ errors.name }}</span>
          </label>

          <div class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">거래 상태</span>
            <div class="input-base cursor-not-allowed bg-zinc-100 text-slate-500 dark:bg-zinc-800/70 dark:text-slate-400">
              거래대기
            </div>
            <span class="text-xs text-slate-500 dark:text-slate-400">등록 후 승인하면 거래중으로 변경됩니다.</span>
          </div>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">담당자명</span>
            <input v-model="form.managerName" class="input-base" placeholder="담당자명을 입력하세요" @blur="touchField('managerName')" />
            <span v-if="showError('managerName')" class="text-sm text-rose-500">{{ errors.managerName }}</span>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">연락처</span>
            <input
              v-model="form.phoneNumber"
              class="input-base"
              placeholder="예: 010-0000-0000"
              @input="handlePhoneInput"
              @blur="touchField('phoneNumber')"
            />
            <span v-if="showError('phoneNumber')" class="text-sm text-rose-500">{{ errors.phoneNumber }}</span>
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">이메일</span>
            <input v-model="form.email" class="input-base" placeholder="example@company.com" />
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">설명</span>
            <textarea
              v-model="form.description"
              class="input-base resize-none"
              rows="4"
              placeholder="공급업체 관련 설명"
            />
          </label>
        </div>
      </article>

      <div class="space-y-6">
        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">주소 정보</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">1차에서는 기본 주소만 우선 관리합니다.</p>
          </div>

          <div class="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div class="grid grid-cols-1 gap-6">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label class="flex flex-col gap-1.5">
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">우편번호</span>
                  <input v-model="form.address.zipcode" class="input-base" placeholder="예: 08511" />
                </label>

                <label class="flex flex-col gap-1.5">
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">도시</span>
                  <input v-model="form.address.city" class="input-base" placeholder="예: 서울특별시" />
                </label>
              </div>

              <label class="flex flex-col gap-1.5">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">기본 주소</span>
                <input v-model="form.address.street" class="input-base" placeholder="예: 금천구 가산로 120" @blur="touchField('street')" />
                <span v-if="showError('street')" class="text-sm text-rose-500">{{ errors.street }}</span>
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">상세 주소</span>
                <input v-model="form.address.detail" class="input-base" placeholder="예: 6층" />
              </label>
            </div>
          </div>
        </article>

      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import vendorApi from '@/api/vendor/vendorApi.js'

const router = useRouter()
const submitted = ref(false)
const touched = reactive({
  name: false,
  managerName: false,
  phoneNumber: false,
  street: false,
})

const form = reactive({
  name: '',
  managerName: '',
  phoneNumber: '',
  email: '',
  status: 'PENDING',
  description: '',
  address: {
    zipcode: '',
    city: '',
    street: '',
    detail: '',
    country: 'KR',
  },
})

const errors = computed(() => ({
  name: form.name.trim() ? '' : '공급업체명을 입력해주세요.',
  managerName: form.managerName.trim() ? '' : '담당자명을 입력해주세요.',
  phoneNumber: form.phoneNumber.trim() ? '' : '연락처를 입력해주세요.',
  street: form.address.street.trim() ? '' : '기본 주소를 입력해주세요.',
}))

const isValid = computed(() => !errors.value.name && !errors.value.managerName && !errors.value.phoneNumber && !errors.value.street)

const touchField = (field) => {
  touched[field] = true
}

const showError = (field) => submitted.value || touched[field]

const handlePhoneInput = (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) {
    form.phoneNumber = digits
    return
  }

  if (digits.length <= 7) {
    form.phoneNumber = `${digits.slice(0, 3)}-${digits.slice(3)}`
    return
  }

  form.phoneNumber = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const isDirty = computed(() =>
  Boolean(
    form.name.trim() ||
    form.managerName.trim() ||
    form.phoneNumber.trim() ||
    form.email.trim() ||
    form.description.trim() ||
    form.address.zipcode.trim() ||
    form.address.city.trim() ||
    form.address.street.trim() ||
    form.address.detail.trim(),
  ),
)

const handleCancel = () => {
  if (isDirty.value && !confirm('입력 중인 내용이 있습니다. 목록으로 이동하시겠습니까?')) {
    return
  }

  router.push('/vendors')
}

const submitForm = async () => {
  submitted.value = true

  if (!isValid.value) {
    return
  }

  const res = await vendorApi.createVendor({
    name: form.name.trim(),
    managerName: form.managerName.trim(),
    phoneNumber: form.phoneNumber.trim(),
    email: form.email.trim(),
    description: form.description.trim(),
    address: {
      zipcode: form.address.zipcode.trim(),
      city: form.address.city.trim(),
      street: form.address.street.trim(),
      detail: form.address.detail.trim(),
      country: form.address.country,
    },
  })
  if (!res.success) {
    alert(res.message || '공급업체 등록에 실패했습니다.')
    return
  }

  router.push('/vendors')
}
</script>
