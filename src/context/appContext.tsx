import { createContext, useContext } from "react";

export interface IAppState {
    userPlayer: string | null;
    cpuPlayer: string | null;
    currentTurn: string | null;
    winner: string | null;
    setUserPlayer: (player: 'X' | 'O') => void;
    setCpuPlayer: (player: 'X' | 'O') => void;
    setCurrentTurn: (turn: 'X' | 'O') => void;
    setWinner: (winner: string | null) => void;
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}

export const AppContext = createContext<IAppState | undefined>(undefined);
