import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes, useNavigate } from "react-router";

import { ContextProvider } from "@/context/context-provider";

import { App } from "@/App";
import { PositionList } from "@/position-list";

import "@/styles/main.scss";

// #22: run schema migration before anything reads localStorage
import { migrateStorage } from "@/utils/favorites";
migrateStorage();

function BackButtonHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    // ponytail: dynamic import so web build doesn't break if @capacitor/app isn't installed
    import("@capacitor/app").then(({ App: CapApp }) => {
      CapApp.addListener("backButton", () => {
        if (window.history.length > 1) navigate(-1);
        else CapApp.exitApp();
      });
    }).catch(() => {});
    return () => {
      import("@capacitor/app").then(({ App: CapApp }) => {
        CapApp.removeAllListeners();
      }).catch(() => {});
    };
  }, [navigate]);
  return null;
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ContextProvider>
      <HashRouter>
        <BackButtonHandler />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/position-list" element={<PositionList />} />
          <Route path="*" element={<App />} />
        </Routes>
      </HashRouter>
    </ContextProvider>
  </StrictMode>
);
