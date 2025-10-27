<template>
    <AppPageLayout>
        <!-- 헤더 -->
        <template #header>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">신규 직원 등록</h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        신규 직원 정보를 입력합니다.
                    </p>
                </div>
                <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
            </div>
        </template>

        <!-- 회원 등록 폼 -->
        <form @submit.prevent="registerUser" class="max-w-xl mx-auto mt-8">
            <div class="bg-white rounded-lg border border-gray-200 p-8">
                <div class="space-y-5">
                    <!-- 이메일 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                        <div class="flex gap-2">
                            <input v-model="form.email" @blur="markTouched('email')" type="email"
                                class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="example@company.com" />
                            <ButtonComp color="primary" size="sm" type="button" @click="checkEmailDuplicate">
                                중복확인
                            </ButtonComp>
                        </div>
                        <p v-if="touched.email && errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
                    </div>

                    <!-- 비밀번호 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                        <input v-model="form.password" @blur="markTouched('password')" type="password"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="8자 이상 입력하세요" />
                        <p v-if="touched.password && errors.password" class="text-red-500 text-xs mt-1">{{
                            errors.password }}
                        </p>
                    </div>

                    <!-- 비밀번호 확인 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
                        <input v-model="form.passwordConfirm" @blur="markTouched('passwordConfirm')" type="password"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="비밀번호를 다시 입력하세요" />
                        <p v-if="touched.passwordConfirm && errors.passwordConfirm" class="text-red-500 text-xs mt-1">
                            {{ errors.passwordConfirm }}
                        </p>
                    </div>

                    <!-- 이름 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
                        <input v-model="form.name" @blur="markTouched('name')" type="text"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="홍길동" />
                        <p v-if="touched.name && errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
                    </div>

                    <!-- 전화번호 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                        <input v-model="form.phoneNumber" @blur="markTouched('phoneNumber')" type="text"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="010-1234-5678" />
                        <p v-if="touched.phoneNumber && errors.phoneNumber" class="text-red-500 text-xs mt-1">
                            {{ errors.phoneNumber }}
                        </p>
                    </div>

                    <!-- 권한 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">권한</label>
                        <select v-model="form.role" @blur="markTouched('role')"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option value="">선택하세요</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="WORKER">WORKER</option>
                        </select>
                        <p v-if="touched.role && errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
                    </div>

                    <!-- 상태 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
                        <select v-model="form.status" @blur="markTouched('status')"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option value="">선택하세요</option>
                            <option value="ACTIVE">재직</option>
                            <option value="INACTIVE">휴직</option>
                            <option value="LOCK">퇴사</option>
                        </select>
                        <p v-if="touched.status && errors.status" class="text-red-500 text-xs mt-1">{{ errors.status }}
                        </p>
                    </div>
                </div>

                <!-- 버튼 영역 -->
                <div class="mt-8">
                    <ButtonComp color="primary" size="lg" type="submit" class="w-full justify-center">
                        직원 등록
                    </ButtonComp>
                </div>
            </div>
        </form>
    </AppPageLayout>
</template>

<script setup>
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import member from '@/api/member'

const router = useRouter()

const form = ref({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phoneNumber: '',
    role: '',
    status: '',
})

const errors = ref({})
const touched = ref({}) // ✅ 사용자가 건드린 필드 추적
const isEmailChecked = ref(false)

// ✅ 정규식
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const phonePattern = /^010-\d{4}-\d{4}$/

// ✅ 필드별 검증
const validateField = (key, value) => {
    switch (key) {
        case 'email':
            if (!value) return '이메일을 입력해주세요.'
            if (!emailPattern.test(value)) return '올바른 이메일 형식이 아닙니다.'
            break
        case 'password':
            if (!value) return '비밀번호를 입력해주세요.'
            if (!passwordPattern.test(value)) return '비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다.'
            break
        case 'passwordConfirm':
            if (value !== form.value.password) return '비밀번호가 일치하지 않습니다.'
            break
        case 'name':
            if (!value) return '이름을 입력해주세요.'
            break
        case 'phoneNumber':
            if (!value) return '전화번호를 입력해주세요.'
            if (!phonePattern.test(value)) return '전화번호 형식은 010-1234-5678 입니다.'
            break
        case 'role':
            if (!value) return '권한을 선택해주세요.'
            break
        case 'status':
            if (!value) return '상태를 선택해주세요.'
            break
    }
    return ''
}

// ✅ 입력 변경 시 해당 필드만 검증
watch(form, (newVal) => {
    for (const key in newVal) {
        if (touched.value[key]) {
            errors.value[key] = validateField(key, newVal[key])
        }
    }
}, { deep: true })

// ✅ blur 시 해당 필드만 터치 표시
const markTouched = (key) => {
    touched.value[key] = true
    errors.value[key] = validateField(key, form.value[key])
}

// ✅ 이메일 중복 확인
const checkEmailDuplicate = async () => {
    touched.value.email = true
    errors.value.email = validateField('email', form.value.email)
    if (errors.value.email) return

    try {
        const response = await member.memberEmailCheck({ email: form.value.email })
        if (response.success) {
            alert('사용 가능한 이메일입니다.')
            isEmailChecked.value = true
        } else {
            errors.value.email = response.message || '이미 사용 중인 이메일입니다.'
            isEmailChecked.value = false
        }
    } catch {
        errors.value.email = '이메일 중복 확인 중 오류가 발생했습니다.'
        isEmailChecked.value = false
    }
}

// ✅ 등록 버튼 클릭 시
const registerUser = async () => {
    // 전체 검증 수행
    Object.keys(form.value).forEach((key) => {
        touched.value[key] = true
        errors.value[key] = validateField(key, form.value[key])
    })

    const hasError = Object.values(errors.value).some((v) => v)
    if (hasError) {
        alert('입력하지 않은 항목이 있거나 형식이 올바르지 않습니다.')
        return
    }

    if (!isEmailChecked.value) {
        alert('이메일 중복 확인을 해주세요.')
        return
    }

    try {
        const res = await member.memberCreate(form.value)
        if (res.success) {
            alert('회원 등록이 완료되었습니다!')
            router.push('/employee')
        } else {
            alert(res.message || '회원 등록에 실패했습니다.')
        }
    } catch {
        alert('회원 등록 중 오류가 발생했습니다.')
    }
}
</script>
