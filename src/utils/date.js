/**
 * 날짜와 시간을 'YYYY-MM-DD HH:mm' 형식으로 변환합니다.
 * @param {Date | string} dateString - 변환할 날짜 또는 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
