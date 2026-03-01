import React from 'react';

interface GameCardProps {
    isFlipped: boolean;
    front: React.ReactNode;
    back: React.ReactNode;
    onClick?: () => void;
}

export const GameCard = ({ isFlipped, front, back, onClick }: GameCardProps) => {
    return (
        <div className="w-[375px] h-[575px] [perspective:1000px] cursor-pointer group"
            onClick={onClick} >
            
            <div className={`relative w-full h-full duration-700 [transform-style:preserve-3d] 
                            ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                
                <div className="absolute inset-0 z-20 [backface-visibility:hidden]">
                    {back}
                </div>
                
                <div className="absolute inset-0 z-10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {front}
                </div>

            </div>
        </div>
    );
};