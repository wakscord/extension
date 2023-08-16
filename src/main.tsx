import "normalize.css";
import "./index.css";
import "./fonts/pretendardvariable-dynamic-subset.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "@tanstack/react-query";
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
