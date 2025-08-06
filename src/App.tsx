import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home";
import AppLayout from "./layout/AppLayout";
import PickPlayer from "./components/PickPlayer";
import Game from "./components/Game";
import { useState } from "react";
import { AppContext, type IAppState } from "./context/appContext";


function App() {
  const [userPlayer, setUserPlayer] = useState<'X' | 'O'>('X');
  const [cpuPlayer, setCpuPlayer] = useState<'X' | 'O'>('O');
  const [currentTurn, setCurrentTurn] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);

  const appState: IAppState = {
    userPlayer,
    cpuPlayer,
    currentTurn,
    winner,
    setUserPlayer,
    setCpuPlayer,
    setCurrentTurn,
    setWinner
  };

  return (
    <AppContext value={appState}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/pick-player" element={<PickPlayer />}/>
          <Route path="/game" element={<Game />}/>
        </Route>
      </Routes>
    </AppContext>
  )
}

export default App;
