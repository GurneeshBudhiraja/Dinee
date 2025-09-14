import { toast } from "sonner";

type UseShowToastProps = {
  type: "error" | "success";
  message: string;
};

/**
 * Custom hook for displaying toast notifications
 * Provides a consistent interface for success and error messages
 */
export function useShowToast() {
  const showToast = ({ type, message }: UseShowToastProps) => {
    switch (type) {
      case "error":
        toast.error(message);
        break;
      case "success":
        toast.success(message);
        break;
    }
  };

  return { showToast };
}
