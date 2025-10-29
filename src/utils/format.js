/**
 * 금액을 한국 원화 형식으로 포맷 (₩ 표기)
 * @param {number} value - 포맷할 금액
 * @returns {string} 포맷된 금액 문자열
 */
export const formatWon = (value) => {
  if (value == null || isNaN(value)) return '-'
    return value.toLocaleString('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
    })
}

/**
 * 숫자를 천 단위 콤마 형식으로 포맷
 * @param {number} value
 * @returns {string}
 */
export const formatNumber = (value) => {
    return value.toLocaleString('ko-KR')
}

/**
 * 날짜 포맷
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR')
}