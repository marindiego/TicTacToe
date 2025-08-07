import type { FC } from 'react'
import { GameBoardCell } from './GameBoardCell';

interface GameBoardProps {
    board: (string | null)[];
    winningLine: number[] | null;
    gameState: string;
    currentTurn: string | null;
    userPlayer: string | null;
    isCpuThinking: boolean[];
    getLineStyles: (combination: number[]) => string;
    onCellClick: (index: number) => void;
}

export const GameBoard: FC<GameBoardProps> = ({
    board,
    winningLine,
    gameState,
    currentTurn,
    userPlayer,
    isCpuThinking,
    getLineStyles,
    onCellClick
}) => {
    return (
        <div
            id="game-board"
            className="relative grid grid-cols-3 grid-rows-3 gap-0 place-items-center size-[520px] bg-white rounded-lg shadow-md p-5"
        >
            {/* Winning Line */}
            {winningLine && (
                <div
                    className={`absolute bg-red-400 transform ${getLineStyles(winningLine)} h-2 transition-all duration-500 rounded-lg z-10`}
                />
            )}

            {/* Board Cells */}
            {board.map((cell, index) => (
                <GameBoardCell
                    key={index}
                    index={index}
                    cell={cell}
                    gameState={gameState}
                    currentTurn={currentTurn}
                    userPlayer={userPlayer}
                    isCpuThinking={isCpuThinking[index]}
                    onClick={() => onCellClick(index)}
                />
            ))}
        </div>
    );
};