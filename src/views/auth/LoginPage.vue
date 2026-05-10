<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
    <div class="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.05fr_0.95fr]">
      <section class="bg-[linear-gradient(145deg,#082f49_0%,#0f172a_55%,#0284c7_100%)] px-8 py-10 text-white sm:px-10 lg:px-12">
        <div class="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
          4Weekdays WMS
        </div>
        <h1 class="mt-6 text-4xl font-bold leading-tight">창고 운영 흐름을 추적/관리합니다.</h1>
        <p class="mt-4 max-w-xl text-sm leading-7 text-white/75">
          발주, ASN, 입고, 재고를 연결하고 실제 작업 흐름에 맞춰 운영할 수 있습니다.
        </p>

        <div class="mt-10 grid grid-cols-1 gap-4">
          <div class="rounded-2xl bg-white/10 p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Purchase To Inbound</div>
            <div class="mt-2 text-xl font-semibold">발주에서 입고까지 연결</div>
            <div class="mt-2 text-sm text-white/75">발주 승인 이후 공급업체 응답과 입고 흐름을 끊기지 않게 이어갑니다.</div>
          </div>
          <div class="rounded-2xl bg-white/10 p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Vendor Collaboration</div>
            <div class="mt-2 text-xl font-semibold">공급업체 회신 추적</div>
            <div class="mt-2 text-sm text-white/75">ASN 회신과 납품 커뮤니케이션을 내부 운영 흐름과 같이 확인할 수 있습니다.</div>
          </div>
          <div class="rounded-2xl bg-white/10 p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Location-Based Inventory</div>
            <div class="mt-2 text-xl font-semibold">위치 기반 재고 관리</div>
            <div class="mt-2 text-sm text-white/75">입고 완료 시 실제 적치 위치를 기준으로 재고를 반영하고 위치 단위로 추적합니다.</div>
          </div>
        </div>
      </section>

      <section class="px-8 py-10 sm:px-10 lg:px-12">
        <div class="mx-auto flex h-full max-w-xl flex-col justify-center">
          <div>
            <div class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Login</div>
            <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
              <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-50">로그인</h2>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                @click="isTestAccountModalOpen = true"
              >
                <span class="material-symbols-outlined text-[18px]">badge</span>
                테스트 계정 보기
              </button>
            </div>
          </div>

          <div class="mt-8 space-y-5">
            <div>
              <div class="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">계정 유형</div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  class="rounded-2xl border px-4 py-4 text-left transition"
                  :class="selectedAccountType === 'internal'
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'"
                  @click="selectedAccountType = 'internal'"
                >
                  <div class="text-sm font-semibold">내부 운영 계정</div>
                  <div class="mt-1 text-xs opacity-80">직원, 관리자, 현장 담당자 로그인</div>
                </button>
                <button
                  type="button"
                  class="rounded-2xl border px-4 py-4 text-left transition"
                  :class="selectedAccountType === 'vendor'
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'"
                  @click="selectedAccountType = 'vendor'"
                >
                  <div class="text-sm font-semibold">공급업체 계정</div>
                  <div class="mt-1 text-xs opacity-80">외부 업체 포털 성격 로그인</div>
                </button>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {{ selectedAccountType === 'internal' ? '사원번호' : '이메일' }}
              </label>
              <input
                v-model="loginId"
                :type="selectedAccountType === 'internal' ? 'text' : 'email'"
                class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                :placeholder="selectedAccountType === 'internal' ? '사원번호를 입력하세요' : '업체 계정 이메일을 입력하세요'"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">비밀번호</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-700 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                  :aria-label="isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'"
                  @click="isPasswordVisible = !isPasswordVisible"
                >
                  <span class="material-symbols-outlined text-[20px]">
                    {{ isPasswordVisible ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>
            <ButtonComp color="primary" icon="login" @click="submitLogin">{{ isSubmitting ? '로그인 중...' : '로그인' }}</ButtonComp>
          </div>
        </div>
      </section>
    </div>
    <TestAccountModal
      :is-open="isTestAccountModalOpen"
      @close="isTestAccountModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonComp from '@/components/common/ButtonComp.vue'
import TestAccountModal from '@/views/auth/TestAccountModal.vue'
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter()
const authStore = useAuthStore()
const selectedAccountType = ref('internal')
const loginId = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const isSubmitting = ref(false)
const isTestAccountModalOpen = ref(false)

const submitLogin = async () => {
  if (!loginId.value.trim()) {
    alert(selectedAccountType.value === 'internal' ? '사원번호를 입력해주세요.' : '이메일을 입력해주세요.')
    return
  }

  if (!password.value.trim()) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  isSubmitting.value = true
  const res = await authStore.login({
    loginId: loginId.value.trim(),
    password: password.value,
  })
  isSubmitting.value = false

  if (!res.success) {
    alert(res.message || '로그인에 실패했습니다.')
    return
  }

  router.push(authStore.defaultRoute())
}
</script>
