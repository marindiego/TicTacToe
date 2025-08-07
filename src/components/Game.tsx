import { Link } from "react-router-dom";
import Button from "./Button";
import OIcon from "./OIcon";
import XIcon from "./XIcon";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAppContext } from "../context/appContext";
import Modal from "./Modal";
import { GameBoard } from "./GameBoard";

// Constantes para mejorar la legibilidad
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
    [0, 4, 8], [2, 4, 6]             // Diagonales
];

const GAME_STATES = {
    PLAYING: 'playing',
    USER_WON: 'user_won',
    CPU_WON: 'cpu_won',
    DRAW: 'draw'
};

const CPU_THINKING_DELAY = 1500;

const Game = () => {
    // Estados del juego
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estados de interacción
    const [isCpuThinking, setIsCpuThinking] = useState(Array(9).fill(false));
    
    // Contador de victorias
    const [userWinsCounts, setUserWinsCounts] = useState(0);
    const [cpuWinsCounts, setCpuWinsCounts] = useState(0);
    const [drawCounts, setDrawCounts] = useState(0);
    
    // Context
    const { currentTurn, setCurrentTurn, userPlayer, cpuPlayer } = useAppContext();

    // Memoización de valores calculados
    const playerLabels = useMemo(() => ({
        X: userPlayer === 'X' ? 'YOU' : 'CPU',
        O: userPlayer === 'O' ? 'YOU' : 'CPU'
    }), [userPlayer]);

    const scores = useMemo(() => ({
        X: userPlayer === 'X' ? userWinsCounts : cpuWinsCounts,
        O: userPlayer === 'O' ? userWinsCounts : cpuWinsCounts
    }), [userPlayer, userWinsCounts, cpuWinsCounts]);

    // Función para verificar ganador
    const checkWinner = useCallback((boardState: (string | null)[]) => {
        for (const combination of WINNING_COMBINATIONS) {
            const [a, b, c] = combination;
            if (boardState[a] && 
                boardState[a] === boardState[b] && 
                boardState[a] === boardState[c]) {
                return {
                    winner: boardState[a],
                    winningLine: combination
                };
            }
        }
        return null;
    }, []);

    // Función para verificar empate
    const checkDraw = useCallback((boardState: (string | null)[]) => {
        return boardState.every(cell => cell !== null);
    }, []);

    // Función para obtener celdas disponibles
    const getAvailableCells = useCallback((boardState: (string | null)[]) => {
        return boardState.map((cell, index) => cell === null ? index : null)
                         .filter(index => index !== null);
    }, []);

    // Estrategia mejorada de CPU con niveles de dificultad
    const getCpuMove = useCallback((boardState: (string | null)[]) => {
        const availableCells = getAvailableCells(boardState);
        if (availableCells.length === 0) return null;

        // 1. Intentar ganar
        for (const cell of availableCells) {
            const testBoard = [...boardState];
            testBoard[cell] = cpuPlayer;
            if (checkWinner(testBoard)?.winner === cpuPlayer) {
                return cell;
            }
        }

        // 2. Bloquear al jugador
        for (const cell of availableCells) {
            const testBoard = [...boardState];
            testBoard[cell] = userPlayer;
            if (checkWinner(testBoard)?.winner === userPlayer) {
                return cell;
            }
        }

        // 3. Tomar el centro si está disponible
        if (availableCells.includes(4)) {
            return 4;
        }

        // 4. Tomar esquinas
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => availableCells.includes(corner));
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // 5. Movimiento aleatorio
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }, [cpuPlayer, userPlayer, getAvailableCells, checkWinner]);

    // Función para procesar el resultado del juego
    const processGameResult = useCallback((boardState: (string | null)[]) => {
        const result = checkWinner(boardState);
        
        if (result) {
            setWinningLine(result.winningLine);
            const isUserWin = result.winner === userPlayer;
            setGameState(isUserWin ? GAME_STATES.USER_WON : GAME_STATES.CPU_WON);
            
            if (isUserWin) {
                setUserWinsCounts(prev => prev + 1);
            } else {
                setCpuWinsCounts(prev => prev + 1);
            }
            
            setIsModalOpen(true);
            return true;
        }
        
        if (checkDraw(boardState)) {
            setGameState(GAME_STATES.DRAW);
            setDrawCounts(prev => prev + 1);
            setIsModalOpen(true);
            return true;
        }
        
        return false;
    }, [userPlayer, checkWinner, checkDraw]);

    // Manejo de click en celda
    const handleCellClick = useCallback((cellIndex: number) => {
        if (board[cellIndex] || 
            gameState !== GAME_STATES.PLAYING || 
            currentTurn !== userPlayer) {
            return;
        }

        const newBoard = [...board];
        newBoard[cellIndex] = currentTurn;
        setBoard(newBoard);
        
        

        const gameEnded = processGameResult(newBoard);
        
        if (!gameEnded) {
            setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
        }
    }, [board, gameState, currentTurn, userPlayer, processGameResult, setCurrentTurn]);

    // Efecto para manejar movimientos de CPU
    useEffect(() => {
        if (gameState !== GAME_STATES.PLAYING || currentTurn !== cpuPlayer) {
            return;
        }

        const cpuMoveIndex = getCpuMove(board);
        if (cpuMoveIndex === null) return;

        // Mostrar animación de "pensando"
        setIsCpuThinking(prev => {
            const newState = [...prev];
            newState[cpuMoveIndex] = true;
            return newState;
        });

        const timeoutId = setTimeout(() => {
            const newBoard = [...board];
            newBoard[cpuMoveIndex] = cpuPlayer;
            setBoard(newBoard);
            
            
            setIsCpuThinking(prev => {
                const newState = [...prev];
                newState[cpuMoveIndex] = false;
                return newState;
            });

            const gameEnded = processGameResult(newBoard);
            
            if (!gameEnded) {
                setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
            }
        }, CPU_THINKING_DELAY);

        return () => clearTimeout(timeoutId);
    }, [currentTurn, cpuPlayer, board, gameState, getCpuMove, processGameResult, setCurrentTurn]);

    // Función para resetear el juego
    const resetGame = useCallback(() => {
        setBoard(Array(9).fill(null));
        setCurrentTurn('X');
        setIsCpuThinking(Array(9).fill(false));
        setWinningLine(null);
        setGameState(GAME_STATES.PLAYING);
        setIsModalOpen(false);
    }, [setCurrentTurn]);

    // Función para salir del juego
    const quitGame = useCallback(() => {
        resetGame();
        // Aquí podrías agregar lógica adicional para volver al menú principal
    }, [resetGame]);

    // Función para obtener estilos de línea ganadora
    const getLineStyles = useCallback((combination: number[]) => {
        const combStr = combination.toString();
        const styles = {
            [WINNING_COMBINATIONS[0].toString()]: 'w-full top-[17%] left-0',
            [WINNING_COMBINATIONS[1].toString()]: 'w-full top-[50%] left-0',
            [WINNING_COMBINATIONS[2].toString()]: 'w-full top-[83%] left-0',
            [WINNING_COMBINATIONS[3].toString()]: 'h-full w-[4px] left-[17%] top-0',
            [WINNING_COMBINATIONS[4].toString()]: 'h-full w-[4px] left-[50%] top-0',
            [WINNING_COMBINATIONS[5].toString()]: 'h-full w-[4px] left-[83%] top-0',
            [WINNING_COMBINATIONS[6].toString()]: 'w-full top-[50%] left-0 rotate-45',
            [WINNING_COMBINATIONS[7].toString()]: 'w-full top-[50%] left-0 -rotate-45'
        };
        return styles[combStr] || '';
    }, []);

    // Función para obtener el mensaje del modal
    const getModalMessage = useCallback(() => {
        switch (gameState) {
            case GAME_STATES.USER_WON:
                return { title: 'You Win!', winner: userPlayer };
            case GAME_STATES.CPU_WON:
                return { title: 'CPU Wins!', winner: cpuPlayer };
            case GAME_STATES.DRAW:
                return { title: "It's a Draw!", winner: null };
            default:
                return { title: '', winner: null };
        }
    }, [gameState, userPlayer, cpuPlayer]);

    const modalMessage = getModalMessage();

    return (
        <section className="space-y-8 w-[340px] md:w-[520px] text-center">
            {/* Header */}
            <div className="flex items-center justify-between w-full h-10">
                <div className="flex w-full h-auto">
                    <XIcon className="w-10 h-10" />
                    <OIcon className="w-10 h-10" />
                </div>
                <div className="flex items-center h-full space-x-2 bg-white rounded-lg shadow-md px-14">
                    {currentTurn === 'X' ? <XIcon className="w-6 h-6" /> : <OIcon className="w-6 h-6" />}
                    <span className="text-lg font-semibold text-black">TURN</span>
                </div>
            </div>

            {/* Game Board */}
            <GameBoard
                board={board}
                winningLine={winningLine}
                gameState={gameState}
                isCpuThinking={isCpuThinking}
                getLineStyles={getLineStyles}
                onCellClick={handleCellClick}
                currentTurn={currentTurn}
                userPlayer={userPlayer}
            />
            {/* <div
                id="game-board"
                className="relative grid grid-cols-3 grid-rows-3 gap-0 place-items-center size-[520px] bg-white rounded-lg shadow-md p-5"
            >
                {winningLine && (
                    <div
                        className={`absolute bg-red-400 transform ${getLineStyles(winningLine)} h-2 transition-all duration-500 rounded-lg z-10`}
                    />
                )}
                {board.map((cell, index) => (
                    <div
                        id={`cell-${index}`}
                        key={index}
                        className={`w-full h-full p-5 border-gray-300 ${
                            index < 6 ? 'border-b-2' : ''
                        } ${
                            index % 3 !== 2 ? 'border-r-2' : ''
                        }`}
                    >
                        <div 
                            className={`size-full rounded-2xl transition-all duration-200 ${
                                !cell && gameState === GAME_STATES.PLAYING && currentTurn === userPlayer
                                    ? currentTurn === 'X' 
                                        ? 'hover:bg-blue-100 cursor-pointer' 
                                        : 'hover:bg-orange-100 cursor-pointer'
                                    : 'cursor-not-allowed'
                            } ${
                                isCpuThinking[index] ? 'bg-orange-100 animate-pulse' : ''
                            }`}
                            onClick={() => handleCellClick(index)}
                        >
                            {cell && (
                                <div className="size-full animate-fade-in">
                                    {cell === 'X' ? (
                                        <XIcon className="size-full" />
                                    ) : (
                                        <OIcon className="size-full" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div> */}

            {/* Score Section */}
            <div className="flex justify-between w-full gap-4">
                <div className="bg-[var(--primary)] py-3 px-6 rounded-lg shadow-md flex-1 flex flex-col items-center">
                    <span className="text-lg font-medium">X ({playerLabels.X})</span>
                    <span className="text-3xl font-bold">{scores.X}</span>
                </div>
                <div className="bg-gray-600 py-3 px-6 rounded-lg shadow-md flex-1 flex flex-col items-center">
                    <span className="text-lg font-medium text-white">DRAWS</span>
                    <span className="text-3xl font-bold text-white">{drawCounts}</span>
                </div>
                <div className="bg-[var(--secondary)] py-3 px-6 rounded-lg shadow-md flex-1 flex flex-col items-center">
                    <span className="text-lg font-medium">O ({playerLabels.O})</span>
                    <span className="text-3xl font-bold">{scores.O}</span>
                </div>
            </div>

            {/* Reset Button */}
            <Link to="/pick-player">
                <Button
                    className="w-full"
                    variant="tertiary"
                    onClick={resetGame}
                >
                    New Game
                </Button>
            </Link>

            {/* Modal de resultado */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="text-center flex flex-col items-center justify-center space-y-6">
                    <h2 className="text-3xl font-bold text-white">
                        {modalMessage.title}
                    </h2>
                    
                    {modalMessage.winner && (
                        <div className="flex items-center justify-center space-x-4">
                            <div className="animate-bounce">
                                {modalMessage.winner === 'X' ? (
                                    <XIcon className="size-[128px]" />
                                ) : (
                                    <OIcon className="size-[128px]" />
                                )}
                            </div>
                            <h3 className={`${
                                modalMessage.winner === 'X' 
                                    ? 'text-[var(--primary)]' 
                                    : 'text-[var(--secondary)]'
                            } text-4xl md:text-6xl font-extrabold`}>
                                TAKES THE ROUND
                            </h3>
                        </div>
                    )}
                    
                    <div className="flex justify-center gap-4 w-full">
                        <Button
                            className="flex-1 max-w-[200px]"
                            variant="tertiary"
                            onClick={() => {
                                quitGame();
                                setIsModalOpen(false);
                            }}
                        >
                            QUIT
                        </Button>
                        <Button
                            className="flex-1 max-w-[200px]"
                            variant="primary"
                            onClick={() => {
                                resetGame();
                                setIsModalOpen(false);
                            }}
                        >
                            NEXT ROUND
                        </Button>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default Game;