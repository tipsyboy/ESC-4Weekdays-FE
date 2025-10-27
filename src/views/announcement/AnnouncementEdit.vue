<template>
    <AppPageLayout>
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900">공지 수정</h1>
                    <p class="text-sm text-slate-500 mt-1">공지의 제목과 내용을 수정할 수 있습니다.</p>
                </div>
                <div class="flex gap-2">
                    <ButtonComp color="secondary" @click="$router.back()">취소</ButtonComp>
                    <ButtonComp color="primary" @click="handleUpdate">저장</ButtonComp>
                </div>
            </div>
        </template>

        <div v-if="loading" class="text-center p-8">Loading...</div>
        <div v-if="error" class="text-center p-8 text-red-500">공지사항을 불러오는데 실패했습니다.</div>

        <section v-if="announcement"
            class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <!-- 중요 공지 체크박스 -->
            <div class="flex items-center gap-2">
                <input id="pinned" type="checkbox" v-model="announcement.pinned"
                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                <label for="pinned" class="text-sm text-gray-700">중요 공지로 표시</label>
            </div>
            <!-- 제목 -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input v-model="announcement.title" type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <!-- 내용 -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
                <textarea v-model="announcement.content" rows="10"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
            </div>


        </section>

        <!-- ✅ 수정 완료 모달 -->
        <ModalComp v-if="showSuccessModal" icon="check-circle" title="수정 완료" message="공지사항이 성공적으로 수정되었습니다."
            @close="handleModalClose" />
    </AppPageLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import ModalComp from '@/components/common/ModalComp.vue'
import { useRouter, useRoute } from 'vue-router'
import announcementApi from '@/api/announcement/index.js'

const router = useRouter()
const route = useRoute()

const announcement = ref(null)
const loading = ref(true)
const error = ref(null)
const showSuccessModal = ref(false)

// 상세 데이터 불러오기
const fetchAnnouncementData = async (id) => {
    loading.value = true
    error.value = null
    try {
        const res = await announcementApi.announcementDetail(id)
        announcement.value = res.results
    } catch (err) {
        console.error('Failed to fetch announcement data:', err)
        error.value = err
        announcement.value = null
    } finally {
        loading.value = false
    }
}

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            fetchAnnouncementData(newId)
        }
    },
    { immediate: true }
)

// 수정 저장
const handleUpdate = async () => {
    if (!announcement.value.title.trim() || !announcement.value.content.trim()) {
        alert('제목과 내용을 모두 입력해주세요.')
        return
    }

    try {
        const payload = {
            title: announcement.value.title,
            content: announcement.value.content,
            pinned: announcement.value.pinned, // ✅ 중요 공지 여부 함께 전송
        }

        const res = await announcementApi.announcementEdit(route.params.id, payload)
        if (res?.success) {
            showSuccessModal.value = true
            alert('수정에 성공했습니다.')
            router.push(`/announcement`)
        } else {
            alert('수정에 실패했습니다.')
        }
    } catch (err) {
        console.error('수정 실패:', err)
        if (err.response?.status === 403) {
            alert('수정 권한이 없습니다.')
        } else {
            alert('수정 중 오류가 발생했습니다.')
        }
    }
}

// 모달 닫기 시 상세페이지로 이동
const handleModalClose = () => {
    showSuccessModal.value = false
    router.push(`/announcement/${route.params.id}`)
}
</script>
