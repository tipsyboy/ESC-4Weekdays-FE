<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Member Detail</div>
          <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{{ member?.name || '직원 상세' }}</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {{ member?.memberCode || '-' }} · {{ member ? roleMeta[member.role]?.label || member.role : '-' }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <ButtonComp v-if="member && !isEditing" color="primary" icon="edit" @click="startEdit">정보 수정</ButtonComp>
          <ButtonComp v-if="isEditing" color="secondary" icon="close" @click="cancelEdit">수정 취소</ButtonComp>
          <ButtonComp color="secondary" icon="arrow_back" @click="router.push('/members')">목록으로</ButtonComp>
        </div>
      </div>
    </template>

    <section v-if="member" class="grid grid-cols-1 gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
      <div class="space-y-6">
        <article class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div class="bg-[linear-gradient(135deg,#020617_0%,#0f172a_42%,#0369a1_100%)] px-6 py-6 text-white">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div class="text-xs uppercase tracking-[0.18em] text-white/60">{{ member.memberCode }}</div>
                <h2 class="mt-2 text-2xl font-bold">{{ member.name }}</h2>
                <p class="mt-2 text-sm text-white/75">{{ member.department }} · {{ roleMeta[member.role]?.label || member.role }}</p>
              </div>
              <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" :class="memberStatusMeta[member.status]?.chipClass || 'bg-slate-200 text-slate-700'">
                {{ memberStatusMeta[member.status]?.label || member.status }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">로그인 ID</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ member.loginId }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">현재 상태</div>
              <div class="mt-2">
                <BadgeComp :color="memberStatusMeta[member.status]?.badgeColor || 'gray'" :label="memberStatusMeta[member.status]?.label || member.status" />
              </div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">이메일</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ member.email }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">연락처</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ member.phoneNumber || '-' }}</div>
            </div>
            <div v-if="member.vendorName" class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">연결 업체</div>
              <div class="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{{ member.vendorName }}</div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
          <div class="border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">기본 정보</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">직원 계정의 기본 정보와 운영 메모를 확인하거나 수정합니다.</p>
          </div>

          <div v-if="!isEditing" class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">이름</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ member.name }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">소속</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ member.department }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">역할</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ roleMeta[member.role]?.label || member.role }}</div>
            </div>
            <div v-if="member.vendorName" class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">연결 업체</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ member.vendorName }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">수정일</div>
              <div class="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{{ formatDateTime(member.updatedAt) }}</div>
            </div>
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">운영 메모</div>
              <div class="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{{ member.note || '-' }}</div>
            </div>
          </div>

          <div v-else class="mt-5 space-y-5">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label class="space-y-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">이름</span>
                <input v-model="editForm.name" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" />
              </label>
              <label class="space-y-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">소속</span>
                <input v-model="editForm.department" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" />
              </label>
              <label class="space-y-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">역할</span>
                <select v-model="editForm.role" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950">
                  <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </label>
              <label class="space-y-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">이메일</span>
                <input v-model="editForm.email" type="email" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" />
              </label>
              <label v-if="editForm.role === 'VENDOR_MANAGER'" class="space-y-2 md:col-span-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">연결 업체</span>
                <select v-model="editForm.vendorId" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950">
                  <option value="">업체 선택</option>
                  <option v-for="vendor in vendorOptions" :key="vendor.id" :value="String(vendor.id)">{{ vendor.name }}</option>
                </select>
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">연락처</span>
                <input v-model="editForm.phoneNumber" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" />
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-200">운영 메모</span>
                <textarea v-model="editForm.note" rows="5" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-sky-950" />
              </label>
            </div>

            <div class="flex justify-end">
              <ButtonComp color="primary" icon="save" :disabled="isSaving" @click="saveMember">
                {{ isSaving ? '저장 중...' : '수정 저장' }}
              </ButtonComp>
            </div>
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">역할 및 상태</h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">간단한 상태 변경은 상세 화면에서 바로 처리합니다.</p>
            </div>
            <BadgeComp :color="memberStatusMeta[member.status]?.badgeColor || 'gray'" :label="memberStatusMeta[member.status]?.label || member.status" />
          </div>

          <div class="mt-5 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">역할</div>
              <div class="mt-2 font-semibold text-slate-900 dark:text-slate-50">{{ roleMeta[member.role]?.label || member.role }}</div>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ roleMeta[member.role]?.description || '-' }}</div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="text-sm font-medium text-slate-500 dark:text-slate-400">상태 변경</div>
              <div class="mt-3 flex flex-wrap gap-2">
                <ButtonComp
                  v-for="status in statusOptions"
                  :key="status.value"
                  :color="member.status === status.value ? 'primary' : 'secondary'"
                  size="sm"
                  :disabled="member.status === status.value || isStatusUpdating"
                  @click="changeStatus(status.value)"
                >
                  {{ status.label }}
                </ButtonComp>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50">연결 포인트</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">이후 실제 구현 시 연결할 영역</p>
          </div>

          <div class="mt-5 space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="font-medium text-slate-900 dark:text-slate-50">로그인</div>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">내부 운영 계정은 사원번호, 공급업체 계정은 이메일 기준 로그인으로 연결합니다.</div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div class="font-medium text-slate-900 dark:text-slate-50">권한 분기</div>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">현재는 공통 화면을 우선하고, 이후 역할별 접근 제어와 화면 분기로 확장합니다.</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import memberApi from '@/api/member/memberApi.js'
import vendorApi from '@/api/vendor/vendorApi.js'
import { memberStatusMeta, roleMeta } from '@/views/member/memberUiMeta.js'

const route = useRoute()
const router = useRouter()
const member = ref(null)
const isEditing = ref(false)
const isSaving = ref(false)
const isStatusUpdating = ref(false)
const vendors = ref([])
const editForm = reactive({
  name: '',
  department: '',
  role: '',
  email: '',
  phoneNumber: '',
  vendorId: '',
  note: '',
})

const roleOptions = computed(() =>
  Object.entries(roleMeta).map(([value, meta]) => ({ value, label: meta.label })),
)
const vendorOptions = computed(() => vendors.value)
const statusOptions = computed(() =>
  Object.entries(memberStatusMeta).map(([value, meta]) => ({ value, label: meta.label })),
)

const applyMemberToForm = () => {
  if (!member.value) return
  Object.assign(editForm, {
    name: member.value.name || '',
    department: member.value.department || '',
    role: member.value.role || '',
    email: member.value.email || '',
    phoneNumber: member.value.phoneNumber || '',
    vendorId: member.value.vendorId ? String(member.value.vendorId) : '',
    note: member.value.note || '',
  })
}

const loadVendors = async () => {
  const res = await vendorApi.getVendors({ page: 0, size: 200, sortBy: 'name', sortDirection: 'asc' })
  vendors.value = res.success ? (res.results?.content || []) : (res.results?.content || res.result?.content || [])
}

const loadMember = async () => {
  const res = await memberApi.getMemberDetail(route.params.id)
  member.value = res.success ? res.results : null
  applyMemberToForm()
}

onMounted(async () => {
  await loadVendors()
  await loadMember()
})

const formatDateTime = (value) => {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}

const startEdit = () => {
  applyMemberToForm()
  isEditing.value = true
}

const cancelEdit = () => {
  applyMemberToForm()
  isEditing.value = false
}

const validateEditForm = () => {
  if (!editForm.name.trim()) return alert('이름을 입력해주세요.'), false
  if (!editForm.department.trim()) return alert('소속을 입력해주세요.'), false
  if (!editForm.role) return alert('역할을 선택해주세요.'), false
  if (!editForm.email.trim()) return alert('이메일을 입력해주세요.'), false
  if (editForm.role === 'VENDOR_MANAGER' && !editForm.vendorId) return alert('연결 업체를 선택해주세요.'), false
  return true
}

const saveMember = async () => {
  if (!member.value || !validateEditForm() || isSaving.value) return

  isSaving.value = true
  const res = await memberApi.updateMember(member.value.id, {
    name: editForm.name.trim(),
    department: editForm.department.trim(),
    role: editForm.role,
    email: editForm.email.trim(),
    phoneNumber: editForm.phoneNumber.trim(),
    vendorId: editForm.role === 'VENDOR_MANAGER' ? Number(editForm.vendorId) : null,
    note: editForm.note.trim(),
  })
  isSaving.value = false

  if (!res.success) {
    alert(res.message || '직원 수정에 실패했습니다.')
    return
  }

  member.value = res.results
  applyMemberToForm()
  isEditing.value = false
  alert('직원 정보가 수정되었습니다.')
}

const changeStatus = async (status) => {
  if (!member.value || member.value.status === status || isStatusUpdating.value) return

  isStatusUpdating.value = true
  const res = await memberApi.updateMemberStatus(member.value.id, status)
  isStatusUpdating.value = false

  if (!res.success) {
    alert(res.message || '직원 상태 변경에 실패했습니다.')
    return
  }

  member.value = {
    ...member.value,
    ...res.results,
    status,
  }
  alert('직원 상태가 변경되었습니다.')
}
</script>
