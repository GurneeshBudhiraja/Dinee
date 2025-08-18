import { toast } from "sonner";

type UseShowToastProps =
  | {
      type: "error" | "success";
      message: string;
    }
  | {
      type: "clear";
      message?: "";
    };

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
