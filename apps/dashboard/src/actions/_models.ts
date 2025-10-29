export type ResponseStatus = {
  success: string | null;
  error: string | null;
};

export const DEFAULT_RESPONSE_STATUS: ResponseStatus = {
  success: null,
  error: null,
};
