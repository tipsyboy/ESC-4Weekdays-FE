// 상태 매핑 테이블 (공통)
export const STATUS_MAP = {
  // 발주
  requested: { label: '발주 요청', color: 'info' }, // 승인 대기
  approved: { label: '승인 완료', color: 'success' }, // 공급사로 발주 전송
  awaiting_delivery: { label: '납품 대기', color: 'warning' }, // ASN 수신 후
  completed: { label: '배송 완료', color: 'success' },
  cancelled: { label: '취소됨', color: 'danger' },

  // 입고
  created: { label: '입고서 생성', color: 'gray' },
  scheduled: { label: '입고 예정', color: 'info' },
  arrived: { label: '도착', color: 'warning' },
  inspecting: { label: '검수 중', color: 'warning' },
  putaway: { label: '적치 중', color: 'info' },
  completed_inbound: { label: '입고 완료', color: 'success' }, // 중복 구분용
  cancelled_inbound: { label: '입고 취소', color: 'danger' },

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
