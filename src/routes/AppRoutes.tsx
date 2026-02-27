import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Portfolio from "../Estampas";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}
