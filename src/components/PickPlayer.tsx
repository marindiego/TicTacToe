import { Link } from "react-router-dom";
import Button from "./Button";
import XIcon from "./XIcon";
import OIcon from "./OIcon";
import { useState } from "react";
import { useAppContext } from "../context/appContext";

const PickPlayer = () => {
    const [xMarkSelected, setXMarkSelected ] = useState(true);
    const [oMarkSelected, setOMarkSelected ] = useState(false);

    const {setUserPlayer, setCpuPlayer} = useAppContext();

    const handleMarkSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedMark = event.target.id;
        if (selectedMark === "x-mark") {
            setXMarkSelected(xMark => !xMark);
            setOMarkSelected(false);
            setUserPlayer('X');
            setCpuPlayer('O');
        } else {
            setOMarkSelected(oMark => !oMark);
            setXMarkSelected(false);
            setUserPlayer('O');
            setCpuPlayer('X');
        }
    }

    return (
        <section className="space-y-10 w-[400px] text-center">
            <p className="text-2xl font-semibold">Pick player 1st mark </p>
            <div className="flex flex-wrap justify-around bg-gray-100 p-5 rounded-lg shadow-md ">
                <div>
                    <XIcon className={`size-[96px] ${xMarkSelected ? '' : 'opacity-50'}`} />
                    <input
                        aria-label="x-mark"
                        onChange={handleMarkSelection}
                        defaultChecked
                        type="radio"
                        name="mark"
                        id="x-mark"
                        className="radio text-blue-400 checked:bg-gray-100 border-gray-300"
                    />
                </div>
                <div>
                    <OIcon className={`size-[96px] ${oMarkSelected ? '' : 'opacity-50'}`} />
                    <input
                        aria-label="o-mark"
                        onChange={handleMarkSelection}
                        type="radio"
                        name="mark"
                        id="o-mark"
                        className="radio text-blue-400 checked:bg-gray-100 border-gray-300"
                    />
                </div>
                <span className="w-full mt-4 text-lg font-bold">{'Remember:  X is going first'.toUpperCase()}</span>
            </div>
            <Link to="/game">
                <Button className="w-full" variant="primary">
                    Start Game
                </Button>
            </Link>
        </section>
    );
}
export default PickPlayer;