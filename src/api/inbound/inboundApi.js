import api from '@/plugin/axiosInterceptor.js'
import { unwrap, unwrapMessage } from '@/api/common/response.js'

const ok = (results) => ({ success: true, code: 1000, results })
const fail = (message) => ({ success: false, code: 4000, message, results: null })

const normalizeItem = (item = {}) => ({
  ...item,
  expectedQuantity: Number(item.expectedQuantity || 0),
  receivedQuantity: Number(item.receivedQuantity || 0),
  defectQuantity: Number(item.defectQuantity || 0),
})

const normalizeInbound = (inbound = {}) => ({
  ...inbound,
  expectedQuantity: Number(inbound.expectedQuantity || 0),
  receivedQuantity: Number(inbound.receivedQuantity || 0),
  defectQuantity: Number(inbound.defectQuantity || 0),
  items: (inbound.items || []).map(normalizeItem),
})

const getInbounds = async (params = {}) => {
  try {
    const { data } = await api.get('/api/inbounds', { params })
    const page = unwrap({ data })

    return ok({
      ...page,
      content: (page?.content || []).map(normalizeInbound),
    })
  } catch (error) {
    return fail(unwrapMessage(error, '입고 목록 조회에 실패했습니다.'))
  }
}

const getInboundDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/inbounds/${id}`)
    return ok(normalizeInbound(unwrap({ data })))
  } catch (error) {
    return fail(unwrapMessage(error, '입고 상세 조회에 실패했습니다.'))
  }
}

const getInboundByAsnId = async (asnId) => {
  try {
    const { data } = await api.get(`/api/inbounds/asn/${asnId}`)
    return ok(normalizeInbound(unwrap({ data })))
  } catch (error) {
    return fail(unwrapMessage(error, '연결된 입고 조회에 실패했습니다.'))
  }
}

const createInbound = async (payload) => {
  try {
    const { data } = await api.post('/api/inbounds', {
      asnId: Number(payload.asnId),
      dock: payload.dock,
      inboundMemo: payload.inboundMemo || '',
    })

    return ok(normalizeInbound(unwrap({ data })))
  } catch (error) {
    return fail(unwrapMessage(error, '입고 생성에 실패했습니다.'))
  }
}

const updateInboundReceipt = async (id, payload) => {
  try {
    const { data } = await api.patch(`/api/inbounds/${id}/receipt`, payload)
    return ok(normalizeInbound(unwrap({ data })))
  } catch (error) {
    return fail(unwrapMessage(error, '입고 처리 저장에 실패했습니다.'))
  }
}

export default {
  getInbounds,
  getInboundDetail,
  getInboundByAsnId,
  createInbound,
  updateInboundReceipt,
}
