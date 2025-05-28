import { toast } from "react-toastify";

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  role: "alert",
  "aria-live": "polite",
};

export const showError = (message, overrideConfig = {}) =>
  toast.error(message, { ...toastConfig, ...overrideConfig });
export const showInfo = (message, overrideConfig = {}) =>
  toast.info(message, { ...toastConfig, ...overrideConfig });

export const showSuccess = (message) => toast.success(message, toastConfig);
export const showLoading = (message) =>
  toast.loading(message, { ...toastConfig, autoClose: false });
export const updateLoadingToSuccess = (toastId, message) =>
  toast.update(toastId, {
    render: message,
    type: "success",
    isLoading: false,
    autoClose: toastConfig.autoClose,
  });
export const updateLoadingToError = (toastId, message) =>
  toast.update(toastId, {
    render: message,
    type: "error",
    isLoading: false,
    autoClose: toastConfig.autoClose,
  });

const defaultMessageConfig = {
  success: "Operacja zakończona pomyślnie",
  error: "Wystąpił nieoczekiwany błąd!",
};

export const withToastHandling = async (
  callback,
  messageConfig = defaultMessageConfig,
) => {
  const toastId = showLoading("Przetwarzanie...");
  try {
    await callback();
    updateLoadingToSuccess(toastId, messageConfig.success);
  } catch (err) {
    updateLoadingToError(toastId, `${messageConfig.error}: ${err.message}`);
    throw err;
  }
};
