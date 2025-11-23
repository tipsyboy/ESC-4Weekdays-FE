<template>
  <AppPageLayout>
    <!-- 상단 헤더 -->
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
            {{ detail.outboundCode || '출고 상세' }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            예정일: {{ formatDate(detail.scheduledDate) }}
          </p>
        </div>

        <div class="flex gap-2">
          <ButtonComp color="secondary" icon="arrow_back" @click="$router.push('/outbound')">
            뒤로가기
          </ButtonComp>
          <ButtonComp
            v-if="detail.status === 'REQUESTED'"
            color="primary"
            icon="check_circle"
            @click="approveOutbound"
          >
            승인
          </ButtonComp>
          <ButtonComp
            v-if="detail.status === 'APPROVED'"
            color="primary"
            icon="inventory"
            @click="startPicking"
          >
            피킹 시작
          </ButtonComp>
          <ButtonComp
            v-if="detail.status === 'PICKING'"
            color="primary"
            icon="package"
            @click="startPacking"
          >
            패킹 시작
          </ButtonComp>
          <ButtonComp
            v-if="detail.status === 'PACKING'"
            color="primary"
            icon="fact_check"
            @click="startInspection"
          >
            검수 시작
          </ButtonComp>
          <ButtonComp
            v-if="detail.status === 'INSPECTION'"
            color="primary"
            icon="local_shipping"
            @click="completeOutbound"
          >
            출고 완료
          </ButtonComp>
          <ButtonComp v-if="canCancel" color="danger" icon="cancel" @click="cancelOutbound">
            출고 취소
          </ButtonComp>
          <ButtonComp color="secondary" icon="print">인쇄</ButtonComp>
        </div>
      </div>
    </template>

    <!-- 본문 -->
    <section class="space-y-8">
      <!-- 출고 정보 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">출고 정보</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <!-- 출고 코드 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">출고 코드</span>
            <span class="text-sm font-medium">{{ detail.outboundCode || '-' }}</span>
          </div>

          <!-- 상태 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">출고 상태</span>
            <BadgeComp
              :label="getStatusLabel(detail.status)"
              :color="getStatusColor(detail.status)"
            />
          </div>

          <!-- 출고 유형 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">출고 유형</span>
            <BadgeComp
              :label="getTypeLabel(detail.outboundType)"
              :color="getTypeColor(detail.outboundType)"
            />
          </div>

          <!-- 주문 ID -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">주문 ID</span>
            <span class="text-sm font-medium">{{ detail.orderId || '-' }}</span>
          </div>

          <!-- 담당자 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">담당자</span>
            <span class="text-sm font-medium">{{ detail.outboundManagerName || '-' }}</span>
          </div>

          <!-- 예정일 -->
          <div class="flex justify-between md:block">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">예정일</span>
            <span class="text-sm font-medium">{{ formatDate(detail.scheduledDate) }}</span>
          </div>

          <!-- 비고 -->
          <div class="col-span-1 md:col-span-2 lg:col-span-3 pt-2">
            <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 block">비고</span>
            <div
              class="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-background-light dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300"
            >
              {{ detail.description || '비고 없음' }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">출고 품목</h2>

        <TableComp :columns="itemColumns" :data="detail.outboundProductItems || []">
          <template #cell-productName="{ row }">
            {{ row.productName }}
          </template>
          <template #cell-orderedQuantity="{ row }">
            <span class="block text-right font-mono">{{ row.orderedQuantity }}</span>
          </template>
          <template #cell-receivedQuantity="{ row }">
            <span class="block text-right font-mono font-semibold">{{ row.orderedQuantity }}</span>
          </template>
        </TableComp>
      </div>

      <!-- 진행 상태 타임라인 -->
      <div
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm p-6 backdrop-blur-sm"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">진행 상태</h2>

        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in statusSteps"
            :key="step.value"
            class="flex items-center"
            :class="{ 'flex-1': index < statusSteps.length - 1 }"
          >
            <!-- 단계 아이콘 -->
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                :class="getStepClass(step.value)"
              >
                <span class="material-symbols-outlined text-lg">
                  {{ step.icon }}
                </span>
              </div>
              <span
                class="text-xs mt-2 font-medium"
                :class="isCurrentOrPast(step.value) ? 'text-primary' : 'text-zinc-400'"
              >
                {{ step.label }}
              </span>
            </div>

            <!-- 연결선 -->
            <div
              v-if="index < statusSteps.length - 1"
              class="flex-1 h-0.5 mx-2 transition-colors"
              :class="
                isCurrentOrPast(statusSteps[index + 1].value)
                  ? 'bg-primary'
                  : 'bg-zinc-300 dark:bg-zinc-700'
              "
            />
          </div>
        </div>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import BadgeComp from '@/components/common/BadgeComp.vue'
import OutboundApi from '@/api/outbound/index.js'
import TableComp from '@/components/common/TableComp.vue'

const route = useRoute()
const router = useRouter()
const detail = ref({})

// 상태 단계 정의
const statusSteps = [
  { value: 'REQUESTED', label: '요청', icon: 'assignment' },
  { value: 'APPROVED', label: '승인', icon: 'check_circle' },
  { value: 'PICKING', label: '피킹', icon: 'inventory' },
  { value: 'PACKING', label: '패킹', icon: 'package' },
  { value: 'INSPECTION', label: '검수', icon: 'fact_check' },
  { value: 'SHIPPED', label: '출고완료', icon: 'local_shipping' },
]

const statusOrder = ['REQUESTED', 'APPROVED', 'PICKING', 'PACKING', 'INSPECTION', 'SHIPPED']

onMounted(async () => {
  await fetchOutboundDetail()
})

const itemColumns = [
  { key: 'productName', label: '품목명' },
  { key: 'orderedQuantity', label: '주문 수량', align: 'right' },
  { key: 'orderedQuantity', label: '출고 수량', align: 'right' },
]


const fetchOutboundDetail = async () => {
  try {
    // URL 파라미터가 id든 outboundCode든 상관없이 처리
    const outboundIdentifier = route.params.id
    const result = await OutboundApi.outboundDetail(outboundIdentifier)
    console.log(result)
    detail.value = result.results
  } catch (error) {
    console.error(error)
    alert('출고 정보를 불러오는데 실패했습니다.')
    router.push('/outbound')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}

// 출고 유형 라벨
const getTypeLabel = (type) => {
  const labels = {
    SALE: '판매',
    RETURN: '반품',
    TRANSFER: '이동',
  }
  return labels[type] || type || '-'
}

// 출고 유형 색상
const getTypeColor = (type) => {
  const colors = {
    SALE: 'primary',
    RETURN: 'warning',
    TRANSFER: 'info',
  }
  return colors[type] || 'default'
}

// 상태 라벨
const getStatusLabel = (status) => {
  const labels = {
    REQUESTED: '요청',
    APPROVED: '승인',
    PICKING: '피킹',
    PACKING: '패킹',
    INSPECTION: '검수',
    SHIPPED: '출고완료',
    CANCELLED: '취소',
  }
  return labels[status] || status || '-'
}

// 상태 색상
const getStatusColor = (status) => {
  const colors = {
    REQUESTED: 'info',
    APPROVED: 'info',
    PICKING: 'warning',
    PACKING: 'warning',
    INSPECTION: 'warning',
    SHIPPED: 'success',
    CANCELLED: 'danger',
  }
  return colors[status] || 'default'
}

// 타임라인 단계 스타일
const getStepClass = (stepValue) => {
  if (detail.value.status === 'CANCELLED') {
    return 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
  }

  if (isCurrentOrPast(stepValue)) {
    return 'border-primary bg-primary text-white'
  }
  return 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-400'
}

// 현재 단계이거나 지나간 단계인지 확인
const isCurrentOrPast = (stepValue) => {
  const currentIndex = statusOrder.indexOf(detail.value.status)
  const stepIndex = statusOrder.indexOf(stepValue)
  return stepIndex <= currentIndex
}

// 취소 가능 여부
const canCancel = computed(() => {
  return (
    detail.value.status && detail.value.status !== 'SHIPPED' && detail.value.status !== 'CANCELLED'
  )
})

// 승인
const approveOutbound = async () => {
  if (!confirm('출고를 승인하시겠습니까?')) return

  try {
    await OutboundApi.outboundApprove(detail.value.outboundCode)
    alert('출고가 승인되었습니다.')
    await fetchOutboundDetail()
  } catch (error) {
    console.error(error)
    alert('출고 승인에 실패했습니다.')
  }
}

// 피킹 시작
const startPicking = () => {
  if (confirm('피킹을 시작하시겠습니까?')) {
    detail.value.status = 'PICKING'
    alert('피킹이 시작되었습니다.')
  }
}

// 패킹 시작
const startPacking = () => {
  if (confirm('패킹을 시작하시겠습니까?')) {
    detail.value.status = 'PACKING'
    alert('패킹이 시작되었습니다.')
  }
}

// 검수 시작
const startInspection = () => {
  if (confirm('검수를 시작하시겠습니까?')) {
    detail.value.status = 'INSPECTION'
    alert('검수가 시작되었습니다.')
  }
}

// 출고 완료
const completeOutbound = () => {
  if (confirm('출고를 완료하시겠습니까?')) {
    detail.value.status = 'SHIPPED'
    alert('출고가 완료되었습니다.')
  }
}

// 출고 취소
const cancelOutbound = async () => {
  if (!confirm('출고를 취소하시겠습니까?')) return

  try {
    await OutboundApi.outboundCancelled(detail.value.outboundCode)
    alert('출고가 취소되었습니다.')
    await fetchOutboundDetail()
  } catch (error) {
    console.error(error)
    alert('출고 취소에 실패했습니다.')
  }
}
</script>
