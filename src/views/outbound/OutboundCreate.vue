<template>
  <AppPageLayout>
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-800">신규 출고 등록</h1>
        <button
          @click="$router.push('/outbound')"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          목록으로
        </button>
      </div>
    </template>

    <form @submit.prevent="registerOutbound" class="space-y-6 max-w-3xl mx-auto mt-8">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">주문 코드</label>
          <input
            v-model="form.orderCode"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="주문 코드를 입력하세요"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">출고 완료 예상 시간</label>
          <input
            v-model="form.scheduledDate"
            type="datetime-local"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">비고</label>
        <textarea
          v-model="form.description"
          class="w-full border rounded px-3 py-2"
          rows="4"
          placeholder="추가 설명을 입력하세요"
        ></textarea>
      </div>

      <div class="flex justify-end mt-6">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded">
          등록
        </button>
      </div>
    </form>
  </AppPageLayout>
</template>

<script setup>
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import OutboundApi from '@/api/outbound/index.js'

const router = useRouter()

const form = ref({
  orderCode: '',
  scheduledDate: '',
  description: '',
})

const registerOutbound = async () => {
  // 서버로 전송할 데이터 준비
  const requestData = {
    orderCode: form.value.orderCode,
    scheduledDate: form.value.scheduledDate,
    description: form.value.description,
  }

  const result = await OutboundApi.outboundCreate(requestData)

  if (result.code === 200) {
    console.log('등록 결과:', result)
    alert('출고 등록 완료!')

    router.push('/outbound')
  } else {
    console.error('출고 등록 실패:', error)
    alert('출고 등록에 실패했습니다. 다시 시도해주세요.')
  }
}
</script>
