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
