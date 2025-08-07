import  type { FC } from 'react';
import XIcon from './XIcon';
import OIcon from './OIcon';

interface GameBoardCellProps {
    index: number;
    cell: string | null;
    gameState: string;
    currentTurn: string | null;
    userPlayer: string | null;
    isCpuThinking: boolean;
    onClick: () => void;
}

export const GameBoardCell: FC<GameBoardCellProps> = ({
    index,
    cell,
    gameState,
    currentTurn,
    userPlayer,
    isCpuThinking,
    onClick
}) => {
    return (
        <div
            id={`cell-${index}`}
            className={`w-full h-full p-5 border-gray-300 ${
                index < 6 ? 'border-b-2' : ''
            } ${index % 3 !== 2 ? 'border-r-2' : ''}`}
        >
            <div 
                className={`size-full rounded-2xl transition-all duration-200 ${
                    !cell && gameState === 'playing' && currentTurn === userPlayer
                        ? currentTurn === 'X' 
                            ? 'hover:bg-blue-100 cursor-pointer' 
                            : 'hover:bg-orange-100 cursor-pointer'
                        : 'cursor-not-allowed'
                } ${isCpuThinking ? 'bg-orange-100 animate-pulse' : ''}`}
                onClick={onClick}
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
    );
};