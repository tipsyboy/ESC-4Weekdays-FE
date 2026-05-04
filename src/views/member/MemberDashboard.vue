<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Member</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">직원 관리</h1>
          <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            내부 운영 계정과 공급업체 계정을 함께 관리하는 화면입니다. 목록 조회, 검색, 상세 확인과 등록 진입 흐름을 우선 정리합니다.
          </p>
        </div>

        <ButtonComp color="primary" icon="person_add" @click="router.push('/members/new')">직원 등록</ButtonComp>
      </div>
    </template>

    <section class="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-50">직원 목록</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">소속, 역할, 상태를 기준으로 현재 계정을 확인합니다.</p>
            </div>

            <div class="flex flex-wrap gap-2">
              <ButtonComp color="secondary" icon="manage_search" @click="isSearchModalOpen = true">직원 검색</ButtonComp>
              <ButtonComp v-if="hasActiveSearch" color="secondary" icon="filter_alt_off" @click="resetSearch">검색 초기화</ButtonComp>
            </div>
          </div>

          <div v-if="hasActiveSearch" class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="chip in activeSearchChips"
              :key="chip.key"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200 dark:hover:bg-sky-950/50"
              @click="removeSearchChip(chip.key)"
            >
              {{ chip.label }}: {{ chip.value }}
              <span class="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th class="px-6 py-4 text-left font-medium">이름</th>
                <th class="px-6 py-4 text-left font-medium">소속</th>
                <th class="px-6 py-4 text-left font-medium">역할</th>
                <th class="px-6 py-4 text-left font-medium">로그인 ID</th>
                <th class="px-6 py-4 text-left font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in filteredMembers"
                :key="member.id"
                class="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                @click="goDetail(member.id)"
              >
                <td class="px-6 py-5">
                  <div class="font-semibold text-slate-900 dark:text-slate-50">{{ member.name }}</div>
                  <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ member.memberCode }}</div>
                </td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ member.department }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ roleMeta[member.role]?.label || member.role }}</td>
                <td class="px-6 py-5 text-slate-600 dark:text-slate-300">{{ member.loginId }}</td>
                <td class="px-6 py-5">
                  <BadgeComp :color="memberStatusMeta[member.status]?.badgeColor || 'gray'" :label="memberStatusMeta[member.status]?.label || member.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <MemberSearchModal
      :is-open="isSearchModalOpen"
      :initial-params="searchParams"
      @close="isSearchModalOpen = false"
      @search="applySearch"
    />
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import memberApi from '@/api/member/memberApi.js'
import { memberStatusMeta, roleMeta } from '@/views/member/memberUiMeta.js'
import MemberSearchModal from '@/views/member/MemberSearchModal.vue'

const router = useRouter()
const members = ref([])
const isSearchModalOpen = ref(false)
const searchParams = reactive({
  name: '',
  memberCode: '',
  department: '',
  loginId: '',
  role: '',
  status: '',
})

const loadMembers = async () => {
  const res = await memberApi.getMembers()
  members.value = res.success ? (res.results.content || []) : []
}

onMounted(loadMembers)

const hasActiveSearch = computed(() =>
  Object.values(searchParams).some((value) => String(value || '').trim() !== ''),
)

const activeSearchChips = computed(() => {
  const chips = []

  if (searchParams.name) chips.push({ key: 'name', label: '이름', value: searchParams.name })
  if (searchParams.memberCode) chips.push({ key: 'memberCode', label: '사원번호', value: searchParams.memberCode })
  if (searchParams.department) chips.push({ key: 'department', label: '소속', value: searchParams.department })
  if (searchParams.loginId) chips.push({ key: 'loginId', label: '로그인 ID', value: searchParams.loginId })
  if (searchParams.role) chips.push({ key: 'role', label: '역할', value: roleMeta[searchParams.role]?.label || searchParams.role })
  if (searchParams.status) chips.push({ key: 'status', label: '상태', value: memberStatusMeta[searchParams.status]?.label || searchParams.status })

  return chips
})

const filteredMembers = computed(() =>
  members.value.filter((member) => {
    const nameMatched =
      !searchParams.name ||
      String(member.name || '').toLowerCase().includes(searchParams.name.toLowerCase())
    const memberCodeMatched =
      !searchParams.memberCode ||
      String(member.memberCode || '').toLowerCase().includes(searchParams.memberCode.toLowerCase())
    const departmentMatched =
      !searchParams.department ||
      String(member.department || '').toLowerCase().includes(searchParams.department.toLowerCase())
    const loginIdMatched =
      !searchParams.loginId ||
      String(member.loginId || '').toLowerCase().includes(searchParams.loginId.toLowerCase())
    const roleMatched = !searchParams.role || member.role === searchParams.role
    const statusMatched = !searchParams.status || member.status === searchParams.status

    return nameMatched && memberCodeMatched && departmentMatched && loginIdMatched && roleMatched && statusMatched
  }),
)

const applySearch = (params) => {
  Object.assign(searchParams, params)
}

const resetSearch = () => {
  Object.assign(searchParams, {
    name: '',
    memberCode: '',
    department: '',
    loginId: '',
    role: '',
    status: '',
  })
}

const removeSearchChip = (key) => {
  searchParams[key] = ''
}

const goDetail = (id) => {
  router.push(`/members/${id}`)
}
</script>
