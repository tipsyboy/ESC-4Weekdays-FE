<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Member Create</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">직원 등록</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            내부 운영 계정과 공급업체 담당 계정을 관리자가 등록하는 화면입니다. 등록 저장 후 상세 화면으로 바로 연결합니다.
          </p>
        </div>

        <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/members')">목록으로</ButtonComp>
      </div>
    </template>

    <section class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <article class="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">등록 정보</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">계정 유형에 따라 로그인 기준과 필수 항목을 나눠서 입력합니다.</p>
        </div>

        <div class="space-y-8 px-6 py-6">
          <div>
            <div class="text-sm font-semibold text-slate-900 dark:text-slate-50">계정 구분</div>
            <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                v-for="type in accountTypes"
                :key="type.value"
                type="button"
                class="rounded-2xl border p-4 text-left transition"
                :class="form.accountType === type.value
                  ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-200 dark:border-sky-400 dark:bg-sky-950/30 dark:ring-sky-900'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'"
                @click="form.accountType = type.value"
              >
                <div class="text-sm font-semibold text-slate-900 dark:text-slate-50">{{ type.label }}</div>
                <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ type.description }}</div>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">이름</span>
              <input v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" placeholder="이름 입력" />
            </label>

            <label class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">소속</span>
              <input v-model="form.department" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" :placeholder="isVendorAccount ? '업체명 또는 담당 조직 입력' : '부서명 입력'" />
            </label>

            <label class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">역할</span>
              <select v-model="form.role" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950">
                <option value="">역할 선택</option>
                <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </label>

            <label class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">상태</span>
              <select v-model="form.status" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950">
                <option value="">상태 선택</option>
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </label>

            <label class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ loginIdLabel }}</span>
              <input v-model="form.loginId" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" :placeholder="loginIdPlaceholder" />
            </label>

            <label class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">연락처</span>
              <input
                v-model="form.phoneNumber"
                type="tel"
                inputmode="numeric"
                maxlength="13"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950"
                placeholder="010-0000-0000"
                @input="handlePhoneInput"
              />
            </label>

            <label class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">이메일</span>
              <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" :placeholder="isVendorAccount ? '업체 담당자 이메일 입력' : '사내 이메일 입력'" />
            </label>

            <label v-if="!isVendorAccount" class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">사원번호</span>
              <input v-model="form.memberCode" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" placeholder="예: EMP-24001" />
            </label>

            <label v-else class="space-y-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">연결 업체</span>
              <select v-model="form.vendorId" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950">
                <option value="">업체 선택</option>
                <option v-for="vendor in vendorOptions" :key="vendor.id" :value="String(vendor.id)">{{ vendor.name }}</option>
              </select>
            </label>
          </div>

          <label class="block space-y-2">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">운영 메모</span>
            <textarea v-model="form.note" rows="5" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" placeholder="등록 목적, 권한 요청 배경, 확인 메모 등을 기록" />
          </label>

          <div class="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <ButtonComp color="secondary" icon="restart_alt" @click="resetForm">초기화</ButtonComp>
            <ButtonComp color="primary" icon="person_add" :disabled="isSubmitting" @click="submitForm">
              {{ isSubmitting ? '등록 중...' : '직원 등록' }}
            </ButtonComp>
          </div>
        </div>
      </article>

      <div class="space-y-6">
        <article class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">등록 기준</h3>
          <div class="mt-4 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-semibold text-slate-900 dark:text-slate-50">내부 운영 계정</div>
              <div class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">사원번호 기반 로그인으로 운영하고, 역할은 관리자/운영 관리자/실무 담당으로 구분합니다.</div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-semibold text-slate-900 dark:text-slate-50">공급업체 계정</div>
              <div class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">자율 가입이 아니라 내부에서 발급하는 구조를 전제로 하고, 이메일 기반 로그인으로 연결합니다.</div>
            </div>
          </div>
        </article>

        <article class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">현재 단계 메모</h3>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <li>등록 저장 API와 연결되어 실제로 직원 데이터를 추가할 수 있습니다.</li>
            <li>권한 제어는 후속 작업으로 두고, 지금은 공통 화면 흐름을 먼저 확인합니다.</li>
            <li>비밀번호는 현재 로컬 기준 기본값 `qwer1234`로 등록됩니다.</li>
          </ul>
        </article>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import memberApi from '@/api/member/memberApi.js'
import vendorApi from '@/api/vendor/vendorApi.js'
import { memberStatusMeta, roleMeta } from '@/views/member/memberUiMeta.js'

const router = useRouter()
const isSubmitting = ref(false)
const vendors = ref([])

const initialForm = () => ({
  accountType: 'INTERNAL',
  name: '',
  department: '',
  role: 'WORKER',
  status: 'ACTIVE',
  loginId: '',
  phoneNumber: '',
  email: '',
  memberCode: '',
  vendorId: '',
  note: '',
})

const form = reactive(initialForm())

const accountTypes = [
  { value: 'INTERNAL', label: '내부 운영 계정', description: '관리자, 운영 관리자, 실무 담당 등 사내 사용자를 등록합니다.' },
  { value: 'VENDOR', label: '공급업체 계정', description: '외부 업체 담당자를 등록하고 이후 포털 또는 연계 화면에 연결합니다.' },
]

const isVendorAccount = computed(() => form.accountType === 'VENDOR')

const roleOptions = computed(() =>
  Object.entries(roleMeta)
    .filter(([key]) => (isVendorAccount.value ? key === 'VENDOR_MANAGER' : key !== 'VENDOR_MANAGER'))
    .map(([value, meta]) => ({ value, label: meta.label })),
)

const statusOptions = Object.entries(memberStatusMeta).map(([value, meta]) => ({ value, label: meta.label }))
const vendorOptions = computed(() => vendors.value)
const loginIdLabel = computed(() => (isVendorAccount.value ? '로그인 이메일' : '로그인 사원번호'))
const loginIdPlaceholder = computed(() => (isVendorAccount.value ? '예: partner@vendor.com' : '예: 20240017'))

watch(
  () => form.accountType,
  (accountType) => {
    form.role = accountType === 'VENDOR' ? 'VENDOR_MANAGER' : 'WORKER'
    form.loginId = ''
  },
)

const loadVendors = async () => {
  const res = await vendorApi.getVendors({ page: 0, size: 200, sortBy: 'name', sortDirection: 'asc' })
  vendors.value = res.success ? (res.results?.content || []) : (res.results?.content || res.result?.content || [])
}

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

const resetForm = () => {
  Object.assign(form, initialForm())
}

const buildPayload = () => ({
  memberCode: isVendorAccount.value && form.vendorId
    ? `EXT-${form.vendorId}-${form.loginId.trim().split('@')[0] || 'ACCOUNT'}`
    : form.memberCode.trim(),
  loginId: form.loginId.trim(),
  name: form.name.trim(),
  department: form.department.trim(),
  role: form.role,
  email: form.email.trim(),
  phoneNumber: form.phoneNumber.trim(),
  vendorId: isVendorAccount.value ? Number(form.vendorId || 0) : null,
  status: form.status,
  note: form.note.trim(),
})

const validateForm = () => {
  if (!form.name.trim()) return alert('이름을 입력해주세요.'), false
  if (!form.department.trim()) return alert('소속을 입력해주세요.'), false
  if (!form.role) return alert('역할을 선택해주세요.'), false
  if (!form.status) return alert('상태를 선택해주세요.'), false
  if (!form.loginId.trim()) return alert(`${loginIdLabel.value}를 입력해주세요.`), false
  if (!form.email.trim()) return alert('이메일을 입력해주세요.'), false
  if (isVendorAccount.value && !form.vendorId) return alert('연결 업체를 선택해주세요.'), false
  if (!buildPayload().memberCode) return alert(isVendorAccount.value ? '연결 업체를 선택해주세요.' : '사원번호를 입력해주세요.'), false
  return true
}

const submitForm = async () => {
  if (!validateForm() || isSubmitting.value) return

  isSubmitting.value = true
  const res = await memberApi.createMember(buildPayload())
  isSubmitting.value = false

  if (!res.success) {
    alert(res.message || '직원 등록에 실패했습니다.')
    return
  }

  alert('직원이 등록되었습니다.')
  router.push(`/members/${res.results.id}`)
}

onMounted(loadVendors)
</script>
