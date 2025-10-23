<template>
  <AppPageLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">신규 상품 등록</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">새로운 상품 정보를 등록합니다</p>
        </div>
        <ButtonComp color="secondary" icon="arrow_back" @click="$router.back()">뒤로가기</ButtonComp>
      </div>
    </template>

    <section
        class="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700
             rounded-xl shadow-sm p-6 md:p-8 space-y-6"
    >
      <form class="grid md:grid-cols-2 gap-6" @submit.prevent="handleSubmit">
        <!-- 브랜드 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">브랜드</label>
          <select
              v-model="form.vendorId"
              class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option :value="null">자체 생산</option>
            <option v-for="v in vendorList" :key="v.id" :value="v.id">{{ v.name }}</option>
          </select>
        </div>

        <!-- 상품명 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">상품명</label>
          <input
              v-model="form.name"
              type="text"
              placeholder="상품명을 입력하세요"
              class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <!-- 단가 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">단가 (₩)</label>
          <input
              v-model="form.unitPrice"
              type="number"
              min="0"
              placeholder="가격을 입력하세요"
              class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <!-- 유닛 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">유닛 (박스당 낱개 수)</label>
          <input
              v-model="form.unit"
              type="number"
              min="1"
              placeholder="예: 20"
              class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <!-- 이미지 업로드 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">상품 이미지</label>
          <input
              type="file"
              accept="image/*"
              @change="uploadToS3"
              class="block w-full text-sm text-slate-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-indigo-50 file:text-indigo-700
                   hover:file:bg-indigo-100"
          />
          <div v-if="uploading" class="text-sm text-slate-500 mt-1">이미지 업로드 중...</div>
          <img v-if="preview" :src="preview" class="w-40 rounded-lg shadow mt-3"/>
        </div>

        <!-- 비고 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">비고</label>
          <textarea
              v-model="form.description"
              rows="3"
              placeholder="상품 설명을 입력하세요"
              class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 w-full
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          ></textarea>
        </div>
      </form>

      <div class="flex justify-end">
        <ButtonComp color="primary" icon="save" @click="handleSubmit">등록</ButtonComp>
      </div>
    </section>
  </AppPageLayout>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import AppPageLayout from '@/layouts/AppPageLayout.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import axios from 'axios' // vendor api 받으면 삭제
import FileApi from '@/api/file/index.js'
import ProductApi from '@/api/product/index.js'
import ProductList from "@/views/product/ProductList.vue";
import {useRouter} from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  unitPrice: null,
  unit: null,
  description: '',
  vendorId: null,
  imageUrl: null,
})
const vendorList = ref([])
const preview = ref(null)
const uploading = ref(false)

const uploadToS3 = async e => {
  const file = e.target.files[0]
  if (!file) return
  preview.value = URL.createObjectURL(file)
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await FileApi.fileUpload(formData)
    form.value.imageUrl = res.data.results
  } catch (err) {
    console.error('S3 업로드 실패:', err)
  } finally {
    uploading.value = false
  }
}

const fetchVendors = async () => {
  const res = await axios.get('/api/vendors')
  vendorList.value = res.data.results.content
}

const handleSubmit = async () => {
  const res = await ProductApi.productCreate(form.value);
  if (res.success) {
    alert('상품이 등록되었습니다.')
    router.push({name: 'ProductDetail', params: {id: res.results}}); // test 필요
    // of
    // router.push({name: 'ProductList')
  } else {
    console.error('상품 등록에 실패 했습니다.')
  }
}

onMounted(fetchVendors)
</script>
