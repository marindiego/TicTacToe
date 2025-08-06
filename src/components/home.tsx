import { Link } from "react-router-dom";
import OIcon from "./OIcon";
import XIcon from "./XIcon";
import Button from "./Button";

const Home = () => {
  return (
    <section className="space-y-10 w-[560px]">
      <div className="mb-10">
        <XIcon className="w-[200px] inline-block" />
        <OIcon className="w-[200px] inline-block" />
      </div>
      <h1 className="font-bold text-7xl">Tic Tac Toe </h1>
      <p className="text-2xl font-semibold">
        Dive into the excitement now and experience the time joy for this classic
        game!
      </p>
      <Link to="/pick-player">
        <Button className="w-3/4" variant="primary">
          New Game
        </Button>
      </Link>
    </section>
  );
};
export default Home;
