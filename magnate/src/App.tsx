import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { Login } from "@/pages/Login/Login";
import { SignUp } from "@/pages/SignUp/SignUp";
import { GameMode } from "@/pages/GameMode/GameMode";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/game-mode" element={<GameMode />} />
    </Routes>
  );
}

export default App;
