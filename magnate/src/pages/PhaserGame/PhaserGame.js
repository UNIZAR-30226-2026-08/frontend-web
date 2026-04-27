import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useMemo } from 'react';
import * as Phaser from 'phaser';
import { GameConfig } from '../../phaser/config';
import { FantasyOverlay } from "./FantasyOverlay";
import { PropertyOverlay } from "./PropertyOverlay";
import { CornerOverlay } from "./CornerOverlay";
import { ServiceOverlay } from "./ServiceOverlay";
import { AuctionOverlay } from './AuctionOverlay';
import { TradingOverlay } from './TradingOverlay';
import { TradeRequestOverlay } from './TradeRequestOverlay';
import { TramOverlay } from './TramOverlay';
import { PlayersHUD } from './PlayersHUD';
import { ControlsHUD } from './ControlsHUD';
import { ChatHUD } from './ChatHUD';
import { EventBus } from '@/EventBus';
import { useAudio } from "@/context/AudioContext";
import { PropertyAdminOverlay } from './PropertyAdminOverlay';
import { GameOver } from './GameOver';
import { BannerMessage } from '@/components/layout/BannerMessage';
import { ToastMessage } from '@/components/layout/ToastMessage';
import { SecretaryAnimation } from './SecretaryAnimation';
import { JailOverlay } from './JailOverlay';
import { useAuth } from "@/context/AuthContext";
// @ts-ignore 
import { fetchProfile } from "@/api/userServices";
import { AuctionResults } from './AuctionResults';
import { TradeMessage } from '@/components/layout/TradeMessage';
// interface PlayerInitData {
//     id: string;
//     name: string;
//     color: string;
//     balance: number;
// }
export const PhaserGame = () => {
    const gameRef = useRef(null);
    const { token } = useAuth();
    const [players, setPlayers] = useState([]);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080
    });
    useEffect(() => {
        const handleIdRequest = () => {
            if (token) {
                fetchProfile(token, (data) => {
                    console.log("React enviando ID a Phaser", data.pk);
                    EventBus.emit('receive-player-id', data.pk);
                });
            }
            else {
                console.log("Emitting default player ID", "0003");
                EventBus.emit('receive-player-id', "0003");
            }
        };
        EventBus.on('request-player-id', handleIdRequest);
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            EventBus.off('request-player-id', handleIdRequest);
            window.removeEventListener('resize', handleResize);
        };
    }, [token]);
    const { changeMusic, playSound } = useAudio();
    useEffect(() => {
        changeMusic('bg_game', 1000);
        const handlePlaySfx = (soundId) => {
            playSound(soundId);
        };
        EventBus.on('play-sfx', handlePlaySfx);
        return () => {
            EventBus.off('play-sfx', handlePlaySfx);
        };
    }, [changeMusic, playSound]);
    const dynamicScale = useMemo(() => {
        const baseHeight = 1080;
        const ratio = windowSize.height / baseHeight;
        return Math.min(Math.max(ratio, 1.0), 1.6);
    }, [windowSize.height]);
    useEffect(() => {
        const handleSetupPlayers = (playerList) => {
            setPlayers(playerList);
            EventBus.emit('players-received');
        };
        EventBus.on('setup-players', handleSetupPlayers);
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game(GameConfig);
        }
        return () => {
            EventBus.off('setup-players', handleSetupPlayers);
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);
    return (_jsxs("div", { className: "relative flex items-center justify-center w-screen h-screen overflow-hidden bg-[var(--color-black)]", children: [_jsx("div", { id: "phaser-container", className: "relative z-10 flex items-center justify-center w-full h-full [&>canvas]:mx-auto" }), _jsx(BannerMessage, {}), _jsx(ToastMessage, {}), _jsx(SecretaryAnimation, {}), _jsx(ControlsHUD, {}), _jsx(ChatHUD, {}), _jsx(PlayersHUD, { players: players, dynamicScale: dynamicScale }), _jsx(FantasyOverlay, {}), _jsx(PropertyOverlay, {}), _jsx(CornerOverlay, {}), _jsx(ServiceOverlay, {}), _jsx(AuctionOverlay, {}), _jsx(AuctionResults, {}), _jsx(TradingOverlay, {}), _jsx(TradeMessage, {}), _jsx(TradeRequestOverlay, {}), _jsx(TramOverlay, {}), _jsx(PropertyAdminOverlay, {}), _jsx(GameOver, {}), _jsx(JailOverlay, {})] }));
};
