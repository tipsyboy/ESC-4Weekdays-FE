<template>
    <AppPageLayout>
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900">신규 공지 등록</h1>
                    <p class="text-sm text-slate-500 mt-1">새로운 공지를 등록합니다</p>
                </div>
                <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
            </div>
        </template>

        <section class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- 제목 + 중요 공지 체크박스 -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="block text-sm font-medium text-gray-700">제목</label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input v-model="form.isPinned" type="checkbox"
                                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                            <span class="text-sm font-medium text-red-600">중요 공지 (상단 고정)</span>
                        </label>
                    </div>
                    <input v-model="form.title" type="text" required placeholder="공지 제목을 입력하세요"
                        class="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <!-- 공지 대상 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">공지 대상</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" value="WORKER" v-model="form.targetRoles"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <span class="text-sm text-gray-700">작업자</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" value="MANAGER" v-model="form.targetRoles"
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <span class="text-sm text-gray-700">매니저</span>
                        </label>
                    </div>
                    <p v-if="form.targetRoles.length === 0" class="text-xs text-red-500 mt-1">
                        최소 1개 이상 선택해주세요
                    </p>
                </div>

                <!-- 내용 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
                    <textarea v-model="form.content" rows="8" required placeholder="공지 내용을 입력하세요"
                        class="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
                </div>

            </form>

            <!-- 버튼 영역 -->
            <div class="flex justify-end gap-3 pt-4 border-t">
                <ButtonComp color="secondary" @click="$router.back()">취소</ButtonComp>
                <ButtonComp color="primary" icon="save" @click="handleSubmit">등록하기</ButtonComp>
            </div>
        </section>
    </AppPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import { useRouter } from 'vue-router'
import announcementApi from '@/api/announcement/index.js'

const router = useRouter()

const form = ref({
    title: '',
    content: '',
    isPinned: false,
    targetRoles: [],
})

const preview = ref(null)
const uploading = ref(false)


const handleSubmit = async () => {
    // 유효성 검사
    if (!form.value.title.trim()) {
        alert('제목을 입력해주세요.')
        return
    }
    if (!form.value.content.trim()) {
        alert('내용을 입력해주세요.')
        return
    }
    if (form.value.targetRoles.length === 0) {
        alert('공지 대상을 최소 1개 이상 선택해주세요.')
        return
    }
    const res = await announcementApi.announcementCreate(form.value)
    if (res.success) {
        console.log('등록할 공지 데이터:', form.value)
        alert('공지가 등록되었습니다.')
        router.push('/announcement') // 공지 목록으로 이동
    } else {
        console.error('공지 등록 실패:', err)
        alert('공지 등록에 실패했습니다.')
    }
}
</script>