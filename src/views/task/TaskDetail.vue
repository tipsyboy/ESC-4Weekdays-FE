<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">작업 상세 정보</h1>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.push('/task/kanban')">
            뒤로가기
          </ButtonComp>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <!-- 좌측 -->
      <div class="md:col-span-2 flex flex-col gap-6">
        <!-- 지시사항 -->
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-6 shadow-sm"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">작업 지시사항</h3>

          <div v-if="inboundDetails" class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>
              <strong class="inline-block w-20 text-slate-600 dark:text-slate-400"
                >지시 사항:</strong
              >
              {{ inspectionInstruction }}
            </p>

            <div>
              <strong class="inline-block w-20 text-slate-600 dark:text-slate-400 align-top"
                >품목:</strong
              >
              <div v-if="inboundDetails.items?.length" class="inline-block">
                <ul class="list-disc pl-5">
                  <li v-for="item in inboundDetails.items" :key="item.id">
                    {{ item.productName }} ({{ item.orderedQuantity }}개)
                  </li>
                </ul>
              </div>
              <span v-else>입고 품목 정보 없음</span>
            </div>

            <!-- ✅ 위치 선택 (PUTAWAY일 때만) -->
            <div v-if="task.category === 'PUTAWAY'">
              <strong class="inline-block w-20 text-slate-600 dark:text-slate-400 align-top">위치:</strong>
              <!-- 이미 할당된 위치 -->
              <div v-if="task.assignedLocationCode" class="inline-block">
                <span class="text-slate-800 dark:text-slate-200">{{
                  task.assignedLocationCode
                }}</span>
              </div>

              <!-- 아직 미할당 상태라 선택해야 함 -->
              <div
                v-else-if="task.status === 'PENDING' && availableLocations.length > 0"
                class="inline-block"
              >
                <select
                  v-model="selectedLocationId"
                  class="border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-200"
                >
                  <option disabled value="">위치를 선택하세요</option>
                  <option
                    v-for="location in availableLocations"
                    :key="location.id"
                    :value="location.id"
                  >
                    {{ location.locationCode }}
                  </option>
                </select>
                <span v-if="availableLocations.length === 0" class="text-slate-500 text-xs ml-2"
                >({{ loadingLocations ? '로딩 중...' : '위치 없음' }})</span
                >
              </div>


              <span v-else-if="task.status === 'PENDING'" class="text-slate-500"
                >추천 위치 없음</span
              >
            </div>
          </div>
        </div>

        <!-- 메모 -->
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-6 shadow-sm"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-3">작업 메모</h3>
          <textarea
            v-model="task.note"
            placeholder="메모를 입력하세요"
            class="w-full border border-gray-300 dark:border-gray-700 rounded-md p-3 resize-none h-28 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <div class="flex justify-end mt-3">
            <ButtonComp color="primary" icon="save" @click="saveMemo">메모 저장</ButtonComp>
          </div>
        </div>
      </div>

      <!-- 우측 -->
      <div
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col justify-between"
      >
        <div class="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>작업 번호:</strong> {{ task.referenceCode }}</p>
          <p><strong>작업 유형:</strong> {{ getCategoryLabel(task.category) }}</p>
          <p>
            <strong>상태:</strong>
            <BadgeComp :color="getStatusColor(task.status)" :label="getStatusLabel(task.status)" />
          </p>
          <p><strong>담당자:</strong> {{ task.workerName || '미할당' }}</p>
        </div>

        <div v-if="task.status === 'PENDING'" class="pt-6 flex flex-col gap-3">
          <select
            v-model="selectedWorker"
            class="border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-200"
          >
            <option disabled value="">작업자를 선택하세요</option>
            <option v-for="worker in workers" :key="worker.id" :value="worker.id">
              {{ worker.name }}
            </option>
          </select>
          <ButtonComp color="primary" @click="assignWorker">작업자 할당</ButtonComp>
        </div>
        <div v-if="task.status === 'ASSIGNED'" class="pt-6">
          <ButtonComp color="primary" @click="changeStatus('IN_PROGRESS')">작업 시작</ButtonComp>
        </div>
        <div v-if="task.status === 'IN_PROGRESS'" class="pt-6">
          <ButtonComp color="success" @click="changeStatus('COMPLETED')">작업 완료</ButtonComp>
        </div>
      </div>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import taskApi from '@/api/task'
import memberApi from '@/api/member'
import inboundApi from '@/api/inbound'
import locationApi from '@/api/location'

const route = useRoute()
const router = useRouter()
const task = ref({})
const workers = ref([])
const selectedWorker = ref('')
const inboundDetails = ref(null)
const availableLocations = ref([])
const selectedLocationId = ref('')
const loadingLocations = ref(false)

// 지시문
const inspectionInstruction = computed(() => {
  if (task.value.category === 'PUTAWAY') return '아래 품목들을 추천 위치에 적치하세요.'
  if (!inboundDetails.value?.items?.length) return '검수할 품목이 없습니다.'
  const products = inboundDetails.value.items.map((i) => i.productName).join(', ')
  return `${products} 을(를) 검수하세요.`
})

// 작업 상세 조회
const fetchTaskDetail = async () => {
  const id = route.params.id
  if (!id) return

  try {
    const res = await taskApi.taskDetail(id)
    task.value = res.results
    console.log('Task Detail:', task.value)

    // task 정보 받은 후 입고 정보 조회
    await fetchInboundDetails(task.value)
  } catch (e) {
    console.error('작업 상세 실패:', e)
  }
}

// 입고 상세 조회
const fetchInboundDetails = async (taskData) => {
  try {
    // task에서 reference_id를 직접 사용
    const referenceId = taskData?.referenceId || taskData?.reference_id
    console.log('Reference ID:', referenceId)

    if (referenceId) {
      const inboundResult = await inboundApi.getInboundDetail(referenceId)
      inboundDetails.value = inboundResult.results || inboundResult
      console.log('Inbound Details:', inboundDetails.value)

      // PUTAWAY 작업이면 위치 정보 조회 (입고 정보 로드 후)
      if (task.value.category === 'PUTAWAY' && task.value.status === 'PENDING') {
        await fetchAvailableLocations()
      }
    } else {
      console.warn('Reference ID 없음')
      inboundDetails.value = {}
    }
  } catch (e) {
    console.error('입고 조회 실패:', e)
    inboundDetails.value = {}
  }
}

// 추천 위치 조회
const fetchAvailableLocations = async () => {
  if (!inboundDetails.value?.items) return
  const minCapacity = inboundDetails.value.items.reduce(
    (sum, i) => sum + (i.receivedQuantity || 0),
    0,
  )
  const vendorId = inboundDetails.value.purchaseOrder?.vendorId
  if (vendorId && minCapacity > 0) {
    try {
      const res = await locationApi.locationAvailable({ vendorId, minCapacity })
      availableLocations.value = res.results || res.content || []
    } catch (e) {
      console.error('추천 위치 조회 실패:', e)
    }

    const minCapacity = inboundDetails.value.items.reduce(
      (sum, i) => sum + (i.orderedQuantity || 0), 0
    )
    const vendorId = inboundDetails.value.purchaseOrder?.vendorId

    console.log('Location Query:', { vendorId, minCapacity })

    let res
    if (vendorId && minCapacity > 0) {
      res = await locationApi.locationAvailable({ vendorId, minCapacity })
    } else {
      res = await locationApi.locationAvailable()
    }

    availableLocations.value = res.results || res.content || res || []
    // console.log('Available Locations:', availableLocations.value)
  } catch (e) {
    console.error('추천 위치 조회 실패:', e)
    availableLocations.value = []
  } finally {
    loadingLocations.value = false
  }
}

// 직원 목록 조회
const fetchWorkers = async () => {
  try {
    const res = await memberApi.memberList()
    workers.value = res.results?.content || res.content || res || []
  } catch (e) {
    console.error('작업자 목록 실패:', e)
  }
}

// 작업자 할당
const assignWorker = async () => {
  if (!selectedWorker.value) {
    alert('작업자를 선택하세요.')
    return
  }

  try {
    const id = task.value.id || route.params.id

    if (task.value.category === 'PUTAWAY') {
      if (!selectedLocationId.value) {
        alert('적치 위치를 선택하세요.')
        return
      }

      const location = availableLocations.value.find((l) => l.id === selectedLocationId.value)
      if (!location || !location.locationCode) {
        alert('유효한 위치 정보를 찾을 수 없습니다.')
        return
      }

      await taskApi.putawayStart(
        {
          locationCode: location.locationCode,
          workerId: selectedWorker.value,
          note: task.value.note || '',
        },
        id, // ← taskId는 두 번째 파라미터!
      )

      alert('적치 작업이 시작되었습니다.')
    } else {
      await taskApi.taskAssign({ memberId: selectedWorker.value }, id)
      alert('작업자가 성공적으로 할당되었습니다.')
    }

    router.push({ name: 'TaskKanban' })
  } catch (e) {
    console.error('작업자 할당 실패:', e)
    alert('할당에 실패했습니다.')
  }
}


const getStatusLabel = (s) =>
  ({
    PENDING: '대기중',
    ASSIGNED: '할당됨',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
  })[s] || '알 수 없음'


const getCategoryLabel = (c) =>
  ({
    INSPECTION: '검수',
    PUTAWAY: '적치',
    PICKING: '피킹',
    PACKING: '포장',

  })[c] ||
  c ||
  '-'

const getStatusColor = (s) =>
  ({
    PENDING: 'default',
    ASSIGNED: 'warning',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
  })[s] || 'default'

// 상태 변경
const changeStatus = async (next) => {
  const id = route.params.id
  try {
    if (next === 'IN_PROGRESS') {
      await taskApi.taskStart({}, id)
    } else if (next === 'COMPLETED') {
      if (task.value.category === 'INSPECTION') {
        await taskApi.inspectionTaskComplete({}, id)
      } else if (task.value.category === 'PUTAWAY') {
        await taskApi.putawayComplete({}, id)
      } else if (task.value.category === 'PICKING') {
        await taskApi.pickingComplete({}, id)
      } else if (task.value.category === 'PACKING') {
        await taskApi.packingComplete({}, id)
      } else {
        await taskApi.taskComplete({}, id)
      }
    }
    alert('상태 변경 완료')
    await fetchTaskDetail()
  } catch (e) {
    console.error('상태 변경 실패:', e)
    alert('상태 변경에 실패했습니다.')
  }
}

// 메모 저장
const saveMemo = async () => {
  try {
    const id = route.params.id
    console.log('메모 저장:', task.value.note)
    alert('작업 메모가 저장되었습니다.')
  } catch (e) {
    console.error('메모 저장 실패:', e)
    alert('메모 저장에 실패했습니다.')
  }
}

onMounted(() => {
  fetchTaskDetail()
  fetchWorkers()
})
</script>