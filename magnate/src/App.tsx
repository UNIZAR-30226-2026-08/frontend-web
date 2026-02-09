import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { Login } from "@/pages/Login/Login";
import { SignUp } from "@/pages/SignUp/SignUp";
import { GameMode } from "@/pages/GameMode/GameMode";
import { BasicRules } from "@/pages/BasicRules/BasicRules";
import { Home } from "@/pages/Home/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/game-mode" element={<GameMode />} />
      <Route path="/basic-rules" element={<BasicRules />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
