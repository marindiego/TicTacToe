import { Link } from "react-router-dom";
import Button from "./Button";
import OIcon from "./OIcon";
import XIcon from "./XIcon";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import Modal from "./Modal";

const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const { currentTurn, setCurrentTurn, userPlayer, cpuPlayer } = useAppContext();
    const [isCellsClicked, setIsCellsClicked] = useState(Array(9).fill(false));
    const [isCpuThinking, setIsCpuThinking] = useState(Array(9).fill(false));
    const [userWinsCounts, setUserWinsCounts] = useState(0);
    const [cpuWinsCounts, setCpuWinsCounts] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userWins, setUserWins] = useState(false);
    const [cpuWins, setCpuWins] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    

    const XPlayer = userPlayer === 'X' ? 'YOU' : 'CPU';
    const OPlayer = userPlayer === 'O' ? 'YOU' : 'CPU';


    const handleOnClickGameBoardCell = (cellIndex: number) => {
        if (board[cellIndex]) return;

        const newBoard = [...board];
        newBoard[cellIndex] = currentTurn;
        setBoard(newBoard);
        setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
        setIsCellsClicked(prev => {
            const newCellsClicked = [...prev];
            newCellsClicked[cellIndex] = true;
            return newCellsClicked;
        });
        const winner = checkWinner(newBoard);
        if (winner) {
            setIsGameOver(true);
            setIsModalOpen(true);
            setUserWins(true);
            setWinner(currentTurn);
            setUserWinsCounts(prev => prev + 1);
        } else if (newBoard.every(cell => cell !== null)) {
            setIsModalOpen(true);
        }
    }
    const checkWinner = (board: (string | null)[]) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinningLine(combination);
                return true;
            }
        }
        return null;
    }
    const onQuitGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentTurn('X');
        setIsCellsClicked(Array(9).fill(false));
        setIsCpuThinking(Array(9).fill(false));
        setWinningLine(null);
        setWinner(null);
    }
    const getLineStyles = (combination: number[]) => {
        // Líneas horizontales
        if (combination.toString() === [0, 1, 2].toString()) return 'w-full top-[17%] left-0';
        if (combination.toString() === [3, 4, 5].toString()) return 'w-full top-[50%] left-0';
        if (combination.toString() === [6, 7, 8].toString()) return 'w-full top-[83%] left-0';

        // Líneas verticales
        if (combination.toString() === [0, 3, 6].toString()) return 'h-full w-[4px] left-[17%] top-0';
        if (combination.toString() === [1, 4, 7].toString()) return 'h-full w-[4px] left-[50%] top-0';
        if (combination.toString() === [2, 5, 8].toString()) return 'h-full w-[4px] left-[83%] top-0';

        // Diagonales
        if (combination.toString() === [0, 4, 8].toString()) return 'w-full top-[50%] left-0 rotate-45';
        if (combination.toString() === [2, 4, 6].toString()) return 'w-full top-[50%] left-0 -rotate-45';

        return '';
    }
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentTurn('X');
        setIsCellsClicked(Array(9).fill(false));
        setIsCpuThinking(Array(9).fill(false));
        setWinningLine(null);
        setIsGameOver(false);
    }
    useEffect(() => {
        const cpuMove = () => {
            const availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
            if (availableCells.length === 0) return;
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const cellIndex = availableCells[randomIndex];
            const newBoard = [...board];
            newBoard[cellIndex] = cpuPlayer;

            setIsCellsClicked(prev => {
                const newCellsClicked = [...prev];
                newCellsClicked[cellIndex] = true;
                return newCellsClicked;
            });
            setIsCpuThinking(prev => {
                const newCpuThinking = [...prev];
                newCpuThinking[cellIndex] = true;
                return newCpuThinking;
            });
            setTimeout(() => {
                setIsCpuThinking(prev => {
                    const newCpuThinking = [...prev];
                    newCpuThinking[cellIndex] = false;
                    return newCpuThinking;
                });
                setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
                setBoard(newBoard);
            }, 2000);

            const winner = checkWinner(newBoard);

            if (winner) {
                setIsGameOver(true);
                setCpuWins(true);
                setWinner(cpuPlayer);
                setIsModalOpen(true);
                setCpuWinsCounts(prev => prev + 1);
            } else if (newBoard.every(cell => cell !== null)) {
                setIsModalOpen(true);
            }
        }
        if (isGameOver) return;
        if (cpuPlayer === 'X' && currentTurn === 'X') {
            cpuMove();
        } else if (cpuPlayer === 'O' && currentTurn === 'O') {
            cpuMove();
        }

    }, [currentTurn, cpuPlayer, board, setCurrentTurn, isGameOver]);

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
            <div
                id="game-board"
                className="relative grid grid-cols-3 grid-rows-3 gap-0 place-items-center size-[520px] bg-white rounded-lg shadow-md p-5"
            >
                {winningLine && (
                    <div
                        className={`absolute bg-red-400 transform ${getLineStyles(winningLine)} h-2 transition-all rounded-lg`}
                    />
                )}
                {board.map((cell, index) => (
                    <div
                        id={`cell-${index}`}
                        key={index}
                        className={`w-full h-full p-5 border-gray-300 ${index < 6 ? 'border-b-2' : '' // Línea inferior para las primeras dos filas
                            } ${index % 3 !== 2 ? 'border-r-2' : ''}`} // Línea derecha para las primeras dos columnas
                    >
                        <div className={`size-full rounded-2xl
                                ${currentTurn === 'X' && !isCellsClicked[index] ? 'hover:bg-blue-100' :
                                currentTurn === 'O' && !isCellsClicked[index] ? 'hover:bg-orange-100' : ''}
                                ${isCellsClicked[index] ? 'cursor-not-allowed' : 'cursor-pointer'}
                                ${isCpuThinking[index] ? 'bg-orange-100 animate-pulse' : ''}
                                `}
                            onClick={() => handleOnClickGameBoardCell(index)}
                        >
                            {cell ? (
                                cell === 'X' ? (
                                    <XIcon className="size-full" />
                                ) : (
                                    <OIcon className="size-full" />
                                )
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Score Section */}
            <div className="flex justify-between w-full">
                <div className="bg-[var(--primary)]  py-2 px-22 rounded-lg shadow-md flex flex-col items-center">
                    <span className="text-lg">X ({XPlayer})</span>
                    <span className="text-2xl font-bold">{userPlayer === 'X' && cpuPlayer === 'O' ? userWinsCounts : cpuPlayer === 'X' && userPlayer === 'O' ? cpuWinsCounts : ''}</span>
                </div>
                <div className="bg-[var(--secondary)]  py-2 px-22 rounded-lg shadow-md flex flex-col items-center">
                    <span className="text-lg">O ({OPlayer})</span>
                    <span className="text-2xl font-bold">{cpuPlayer === 'O' && userPlayer === 'X' ? cpuWinsCounts : userPlayer === 'O' && cpuPlayer === 'X' ? userWinsCounts : ''}</span>
                </div>
            </div>

            {/* Reset Button */}
            <Link to="/pick-player">
                <Button
                    className="w-full"
                    variant="tertiary"
                    onClick={() => {
                        resetGame();
                    }}
                >
                    Reset Game
                </Button>
            </Link>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="text-center flex flex-col items-center justify-center">
                    <h2 className="mb-4 text-2xl font-bold text-white">
                            {userWins ? 'You Win!' : cpuWins ? 'CPU Wins!' : 'It\'s a Draw!'}
                        </h2>
                    <div className="flex items-center justify-center mb-4">
                        {winner && (
                            winner === 'X' ? (
                                <XIcon className="size-[128px]" />
                            ) : (
                                <OIcon className="size-[128px]" />
                            )
                        )}
                        <h3 className={`${winner === 'X' ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'} text-6xl font-extrabold`}>WON THIS GAME</h3>
                    </div>
                    <div className="flex justify-center gap-5">
                        
                            <Button
                                className="w-[264px]"
                                variant="tertiary"
                                onClick={() => {
                                    onQuitGame();
                                    setIsModalOpen(false)
                                }}
                            >
                                
                                QUIT
                                
                            </Button>
                        <Link to="/pick-player" className="block">
                            <Button
                                className="w-[264px]"
                                variant="primary"
                                onClick={() => {
                                    resetGame();
                                    setIsModalOpen(false);
                                }}
                            >
                            NEW GAME
                            </Button>
                        </Link>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default Game;