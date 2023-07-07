import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PentagonOpponent from "../../components/PentagonOpponent";
import { useAccount } from "wagmi";
import { isValidEthAddress } from "../../utils";

const Opponent = () => {
  const {
    query: { address: contract },
    push,
  } = useRouter();
  const { isConnected } = useAccount();
  useEffect(() => {
    if (!contract || Array.isArray(contract)) {
      return;
    }
    if (!isConnected || isValidEthAddress(contract)) {
      push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, isConnected]);
  return <PentagonOpponent />;
};

export default Opponent;
