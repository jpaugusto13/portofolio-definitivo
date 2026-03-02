import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "../Estampas";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}
