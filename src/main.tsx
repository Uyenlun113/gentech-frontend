import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "simplebar-react/dist/simplebar.min.css";
import "swiper/swiper-bundle.css";
import App from "./App.jsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import "./index.css";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AppWrapper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{
          position: "fixed",
          top: "90px",
          right: "20px",
          zIndex: 9999,
        }}
      />
    </ThemeProvider>
  </StrictMode>
);
