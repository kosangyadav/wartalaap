import { Toaster } from "react-hot-toast";

const ToasterConfig = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-cream-100)",
          color: "var(--color-terminal-black)",
          border: "2px solid var(--color-terminal-black)",
          borderRadius: "8px",
          fontFamily: "monospace",
          fontSize: "14px",
          boxShadow: "4px 4px 0px var(--color-terminal-black)",
        },
        success: {
          iconTheme: {
            primary: "var(--color-accent-green)",
            secondary: "var(--color-cream-100)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-accent-red)",
            secondary: "var(--color-cream-100)",
          },
        },
      }}
    />
  );
};

export default ToasterConfig;
