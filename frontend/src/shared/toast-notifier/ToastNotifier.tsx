import toast from "react-hot-toast";
import "./ToastNotifier.css";

type Child = JSX.Element;

export const toastNotifier = {
  success: (message: string, child?: Child) => {
    toast.success(
      <div className="toast-container">
        <strong className="toast-message">{message}</strong>
        {child}
      </div>,
      {
        position: "top-right",
        iconTheme: {
          primary: "#6DB879",
          secondary: "white",
        },
      }
    );
  },

  error: (message: string, child?: Child) => {
    toast.error(
      <div className="toast-container">
        <strong className="toast-message">{message}</strong>
        {child}
      </div>,
      { position: "top-right" }
    );
  },
};
