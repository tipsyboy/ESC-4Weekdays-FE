export const inventoryStatusMeta = {
  NORMAL: {
    label: '정상',
    badgeColor: 'success',
    chipClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200',
    cellClass: 'border-sky-200 bg-sky-100 text-slate-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-slate-100',
  },
  LOW: {
    label: '부족',
    badgeColor: 'warning',
    chipClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-200',
    cellClass: 'border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-100',
  },
  OUT: {
    label: '품절',
    badgeColor: 'danger',
    chipClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-200',
    cellClass: 'border-rose-200 bg-rose-100 text-rose-900 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-100',
  },
}
