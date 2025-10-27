// 상태 매핑 테이블 (공통)
export const STATUS_MAP = {
  // 발주
  pending: { label: '보류 중', color: 'gray' },
  approved: { label: '승인 완료', color: 'warning' },
  shipped: { label: '배송 중', color: 'info' },
  received: { label: '입고 완료', color: 'success' },

  // 입고
  draft: { label: '임시저장', color: 'gray' },
  in_progress: { label: '입고 중', color: 'warning' },
  completed: { label: '입고 완료', color: 'success' },

  // 직원
  active: { label: '재직', color: 'success' },
  inactive: { label: '휴직', color: 'warning' },
  lock: { label: '퇴사', color: 'gray' },

  // 배송 / 물류
  preparing: { label: '준비 중', color: 'warning' },
  delivering: { label: '배송 중', color: 'info' },
  delivered: { label: '배송 완료', color: 'success' },

  // 결제 / 회계
  paid: { label: '결제 완료', color: 'success' },
  unpaid: { label: '미결제', color: 'gray' },
  refunded: { label: '환불 완료', color: 'info' },

  //️ 기타
  canceled: { label: '취소됨', color: 'danger' },
  error: { label: '에러', color: 'danger' },
  unknown: { label: '알 수 없음', color: 'gray' },

  //권한
  worker: { label: '작업자', color: 'info' },
  manager: { label: '매니저', color: 'primary' },
  admin: { label: '관리자', color: 'danger' },
}

// 레이블
export const getStatusLabel = (status) => {
  if (!status || typeof status !== 'string') return '알 수 없음'
  const key = status.trim().toLowerCase()
  return STATUS_MAP[key]?.label || '알 수 없음'
}

// 색상
export const getStatusColor = (status) => {
  if (!status || typeof status !== 'string') return 'gray'
  const key = status.trim().toLowerCase()
  return STATUS_MAP[key]?.color || 'gray'
}
