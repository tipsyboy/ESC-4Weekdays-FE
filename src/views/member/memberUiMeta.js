export const memberStatusMeta = {
  ACTIVE: {
    label: '재직',
    badgeColor: 'success',
    chipClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200',
  },
  INACTIVE: {
    label: '휴직',
    badgeColor: 'warning',
    chipClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-200',
  },
  LOCK: {
    label: '잠금',
    badgeColor: 'gray',
    chipClass: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  },
}

export const roleMeta = {
  ADMIN: {
    label: '관리자',
    description: '전체 기준정보와 운영 구조를 관리하는 내부 관리자',
    accent: 'from-slate-900 via-slate-800 to-sky-800',
  },
  MANAGER: {
    label: '운영 관리자',
    description: '발주, 입고, 재고 같은 운영 흐름을 관리하는 내부 담당자',
    accent: 'from-emerald-900 via-teal-800 to-cyan-700',
  },
  WORKER: {
    label: '실무 담당',
    description: '현장 처리와 실무 작업 중심으로 사용하는 내부 사용자',
    accent: 'from-amber-700 via-orange-700 to-rose-700',
  },
  VENDOR_MANAGER: {
    label: '외부 업체 담당',
    description: '공급업체 포털이나 외부 연계 화면에서 사용하는 계정',
    accent: 'from-violet-900 via-fuchsia-800 to-pink-700',
  },
}

export const loginHints = [
  { id: 1, label: '내부 운영 계정', value: 'ADMIN / MANAGER / WORKER', description: '동일 로그인 화면을 쓰되 이후 역할별 분기는 후순위로 둔다.' },
  { id: 2, label: '외부 업체 계정', value: 'VENDOR_MANAGER', description: '추후 별도 포털로 분리할 수 있지만 현재는 같은 샌드박스 안에서 흐름만 본다.' },
]
