import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PentagonFirstPlayer from "../components/PentagonFirstPlayer";
import { useAccount } from "wagmi";

const Game = () => {
  const { push } = useRouter();
  const { isConnected } = useAccount();
  useEffect(() => {
    if (!isConnected) {
      push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <PentagonFirstPlayer />;
};

export default Game;
