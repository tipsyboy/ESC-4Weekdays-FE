export const unwrap = (response) => response?.data?.results ?? null

export const unwrapMessage = (error, fallbackMessage) => (
  error.response?.data?.message || fallbackMessage
)

export const ok = (response, fallbackResults = null) => ({
  success: response?.data?.success ?? true,
  code: response?.data?.code ?? 200,
  message: response?.data?.message ?? '',
  results: unwrap(response) ?? fallbackResults,
})

export const fail = (error, fallbackMessage) => ({
  success: false,
  code: error.response?.data?.code || error.response?.status || 500,
  message: unwrapMessage(error, fallbackMessage),
  results: null,
})
