export const unwrap = (response) => response?.data?.results ?? null

export const unwrapMessage = (error, fallbackMessage) => (
  error.response?.data?.message || fallbackMessage
)
