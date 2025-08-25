import { createRoot } from "react-dom/client";
import "./index.css";

  import { ToastContainer, toast } from 'react-toastify';
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <ToastContainer theme="dark"  />
  </BrowserRouter>
);
