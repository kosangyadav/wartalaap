// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ChatApp from "./ui/ChatApp.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import SignUp from "./components/auth/SignUp.tsx";
import SignIn from "./components/auth/SignIn.tsx";
import {
  AuthRoute,
  ProtectedRoute,
} from "./components/routes/protectedAndAuthRoute.tsx";
import NotFoundPage from "./components/routes/NotFound.tsx";
import Toast from "./ui/Toast.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  // {/* <StrictMode></StrictMode>, */}
  <ConvexProvider client={convex}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <SignIn />
            </AuthRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toast />
    </BrowserRouter>
  </ConvexProvider>,
);
