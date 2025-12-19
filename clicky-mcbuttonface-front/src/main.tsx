import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/HomePage";
import RootLayout from "./layouts/root-layout";
import ClientsPage from "./pages/clients/clients-page";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
