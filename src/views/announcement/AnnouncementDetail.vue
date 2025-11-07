<template>
    <AppPageLayout>
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900">공지 상세 조회</h1>
                    <p class="text-sm text-slate-500 mt-1">공지의 내용을 확인하고 수정&삭제 할 수 있습니다.</p>
                </div>
                <div class="flex gap-2">
                    <ButtonComp color="secondary" @click="$router.back()">뒤로가기</ButtonComp>
                    <ButtonComp v-if="auth.isAdmin" color="primary" @click="goToEdit">수정</ButtonComp>
                    <ButtonComp v-if="auth.isAdmin" color="danger" @click="openDeleteModal">삭제</ButtonComp>
                </div>
            </div>
        </template>

        <div v-if="loading" class="text-center p-8">Loading...</div>
        <div v-if="error" class="text-center p-8 text-red-500">공지사항을 불러오는데 실패했습니다.</div>

        <section v-if="announcement"
            class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <!-- 제목 영역 -->
            <div class="border-b border-gray-200 pb-4">
                <div class="flex items-center gap-2 mb-2">
                    <span v-if="announcement.isPinned"
                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        중요 공지
                    </span>
                    <h2 class="text-2xl font-bold text-gray-900">{{ announcement.title }}</h2>
                </div>

                <!-- 작성 정보 -->
                <div class="flex items-center gap-4 text-sm text-gray-500 mt-3">
                    <span>작성자: {{ announcement.name }}</span>
                    <span>작성일: {{ formatDate(announcement.createdAt) }}</span>
                </div>
            </div>

            <!-- 내용 -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">내용</label>
                <div
                    class="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 min-h-[200px] whitespace-pre-wrap text-gray-800">
                    {{ announcement.content }}
                </div>
            </div>
        </section>

        <!-- 이전/다음 공지 -->
        <div v-if="previousAnnouncement || nextAnnouncement"
            class="mt-10 max-w-4xl mx-auto border-t border-gray-200 divide-y divide-gray-200">
            <!-- 이전 글 -->
            <div v-if="previousAnnouncement"
                class="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="goToAnnouncement(previousAnnouncement.id)">
                <span class="text-sm text-gray-500">이전 글</span>
                <div class="flex-1 text-right text-gray-900 truncate">
                    {{ previousAnnouncement.title }}
                </div>
            </div>

            <!-- 다음 글 -->
            <div v-if="nextAnnouncement"
                class="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="goToAnnouncement(nextAnnouncement.id)">
                <span class="text-sm text-gray-500">다음 글</span>
                <div class="flex-1 text-right text-gray-900 truncate">
                    {{ nextAnnouncement.title }}
                </div>
            </div>
        </div>

        <!-- ✅ 삭제 확인 모달 -->
        <ModalComp :open="showDeleteModal" @close="closeDeleteModal" title="공지 삭제" icon="warning">
            <p class="text-center">정말 이 공지를 삭제하시겠습니까?</p>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <ButtonComp color="secondary" @click="closeDeleteModal">취소</ButtonComp>
                    <ButtonComp color="danger" @click="handleDelete">삭제</ButtonComp>
                </div>
            </template>
        </ModalComp>

        <!-- ✅ 삭제 완료 모달 -->
        <ModalComp :open="showSuccessModal" @close="handleSuccessClose" title="삭제 완료" icon="check">
            <p class="text-center">공지가 성공적으로 삭제되었습니다.</p>
            <template #footer>
                <div class="flex justify-end">
                    <ButtonComp color="primary" @click="handleSuccessClose">확인</ButtonComp>
                </div>
            </template>
        </ModalComp>
    </AppPageLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import ModalComp from '@/components/common/ModalComp.vue'
import { useRouter, useRoute } from 'vue-router'
import announcementApi from '@/api/announcement/index.js'
import { formatDate } from '@/utils/date.js'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()

const announcement = ref(null)
const announcementList = ref([])
const loading = ref(true)
const error = ref(null)
const auth = useAuthStore()

// ✅ 모달 상태
const showDeleteModal = ref(false)
const showSuccessModal = ref(false)

const fetchAnnouncementData = async (id) => {
    loading.value = true
    error.value = null
    try {
        const res = await announcementApi.announcementDetail(id)
        announcement.value = res.results

        if (announcementList.value.length === 0) {
            const listRes = await announcementApi.announcementList(0, 10)
            announcementList.value = listRes.results.content.sort((a, b) => b.id - a.id)
        }
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
        if (newId) fetchAnnouncementData(newId)
    },
    { immediate: true }
)

const goToEdit = () => router.push(`/announcement/edit/${route.params.id}`)

// ✅ 삭제 모달 열기/닫기
const openDeleteModal = () => (showDeleteModal.value = true)
const closeDeleteModal = () => (showDeleteModal.value = false)

// ✅ 삭제 처리
const handleDelete = async () => {
    showDeleteModal.value = false
    try {
        const res = await announcementApi.announcementDelete(route.params.id)
        if (res.success) {
            showSuccessModal.value = true
        } else {
            alert('삭제에 실패했습니다.')
        }
    } catch (err) {
        console.error('삭제 실패:', err)
        alert('삭제에 실패했습니다.')
    }
}

// ✅ 삭제 완료 모달 닫기
const handleSuccessClose = () => {
    showSuccessModal.value = false
    router.push('/announcement')
}

const currentAnnouncementIndex = computed(() => {
    if (!announcement.value || announcementList.value.length === 0) return -1
    return announcementList.value.findIndex((item) => item.id == announcement.value.id)
})

const previousAnnouncement = computed(() => {
    if (currentAnnouncementIndex.value > -1 && currentAnnouncementIndex.value < announcementList.value.length - 1) {
        return announcementList.value[currentAnnouncementIndex.value + 1]
    }
    return null
})

const nextAnnouncement = computed(() => {
    if (currentAnnouncementIndex.value > 0) {
        return announcementList.value[currentAnnouncementIndex.value - 1]
    }
    return null
})

const goToAnnouncement = (id) => {
    if (id) router.push(`/announcement/${id}`)
}
</script>
