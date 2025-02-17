import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Import createRoot
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));  // ✅ Create root
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
