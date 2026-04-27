import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { Login } from "@/pages/Login/Login";
import { SignUp } from "@/pages/SignUp/SignUp";
import { BasicRules } from "@/pages/BasicRules/BasicRules";
import { Home } from "@/pages/Home/Home";
import { Loading } from "@/pages/Loading/Loading";
import { Lobby } from "@/pages/Lobby/Lobby";
import { Profile } from "@/pages/Profile/Profile";
import { PrivateRoom } from "@/pages/PrivateRoom/PrivateRoom";
import { PhaserGame } from "@/pages/PhaserGame/PhaserGame";
import { Shop } from "@/pages/Shop/Shop";
import { WSTest } from "@/pages/WSTest";
import { WSClient } from "@/services/WSClient";
import { GameService } from "@/services/GameService";
import { AudioProvider } from "@/context/AudioContext";
import { AuthProvider } from "@/context/AuthContext";
import { ItemProvider } from "@/context/ItemContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
function App() {
    return (_jsx(AuthProvider, { children: _jsx(ItemProvider, { children: _jsxs(AudioProvider, { children: [_jsx(WSClient, {}), " ", _jsx(GameService, {}), " ", _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUp, {}) }), _jsx(Route, { path: "/basic-rules", element: _jsx(BasicRules, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/home", element: _jsx(Home, {}) }), _jsx(Route, { path: "/loading", element: _jsx(Loading, {}) }), _jsx(Route, { path: "/lobby", element: _jsx(Lobby, {}) }), _jsx(Route, { path: "/private-room", element: _jsx(PrivateRoom, {}) }), _jsx(Route, { path: "/phaser-game", element: _jsx(PhaserGame, {}) }), _jsx(Route, { path: "/shop", element: _jsx(Shop, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/wstest", element: _jsx(WSTest, {}) })] })] })] }) }) }));
}
export default App;
