import "normalize.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./pretendardvariable-dynamic-subset.css";
import { queryClient } from "./utils/network";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>
);
