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
import { AudioProvider } from "@/context/AudioContext";
import { Shop } from "@/pages/Shop/Shop";
import { WSTest } from "@/pages/WSTest";
import { WSClient } from "@/services/WSClient";
import { GameService } from "@/services/GameService";

function App() {
  return (
	<AudioProvider>
	<WSClient /> {/*Low level backend communication*/}
	{ /* TODO tester ?? */ }
	<GameService /> { /* Integration API */ }
   	 <Routes>
   	   <Route path="/" element={<LandingPage />} />
   	   <Route path="/login" element={<Login />} />
   	   <Route path="/signup" element={<SignUp />} />
   	   <Route path="/basic-rules" element={<BasicRules />} />
   	   <Route path="/home" element={<Home />} />
   	   <Route path="/loading" element={<Loading />} />
   	   <Route path="/lobby" element={<Lobby />} />
   	   <Route path="/private-room" element={<PrivateRoom />} />
   	   <Route path="/phaser-game" element={<PhaserGame />} />
	   <Route path="/shop" element={<Shop />} />
	   <Route path="/profile" element={<Profile />} />
	   <Route path="/wstest" element={<WSTest />} />
   	 </Routes>
	</AudioProvider>
  );
}

export default App;
