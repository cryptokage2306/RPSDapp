import React, { useEffect, useState } from "react";
import { useAccount, useContractRead, useSigner } from "wagmi";
import { ethers } from "ethers";
import { rpsABI } from "../contract/rps";
import { PentagonDesign } from "./PentagonDesign";
import { useRouter } from "next/router";
import { currentTime } from "../utils";
import { Button } from "@chakra-ui/react";

const PentagonOpponent = () => {
  const {
    query: { address: contract },
  } = useRouter();
  const { address: opponentAddress } = useAccount();
  const [success, setSuccess] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [showJ1Timeout, setShowJ1Timeout] = useState(false);
  const { data: j1Address } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "j1",
    enabled: !!contract,
    staleTime: 1000,
  });

  const { data: j2Address } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "j2",
    enabled: !!contract,
    staleTime: 1000,
  });

  const { data: opponentMove } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "c2",
    enabled: !!contract,
    staleTime: 1000,
  });
  const { data: lastAction } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "lastAction",
    enabled: !!contract,
    staleTime: 1000,
  });

  const { data: TIMEOUT } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "TIMEOUT",
    enabled: !!contract,
    staleTime: 1000,
  });
  const { data: stake } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "stake",
    enabled: !!contract,
    staleTime: 1000,
  });
  const signer = useSigner();
  const play = async (str: string) => {
    try {
      if (!contract && Array.isArray(contract)) {
        return;
      }
      // @ts-expect-error
      const factory = new ethers.Contract(contract, rpsABI, signer.data);
      const trx = await factory.play(str, {
        value: stake?.toString(),
        gasLimit: 6000000,
      });
      await trx.wait()
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    }
  };

  const timeremain = () =>
    // @ts-ignore
    !!lastAction && !!TIMEOUT ? lastAction.toNumber() + TIMEOUT.toNumber() : 0;
  useEffect(() => {
    if (
      currentTime() < timeremain() ||
      !opponentMove ||
      !stake ||
      stake.toString() === "0"
    ) {
      return;
    }
    setShowJ1Timeout(opponentMove.toString() !== "0");
  }, [timeremain, opponentMove]);

  useEffect(() => {
    if (!j2Address || !opponentAddress) {
      return;
    }
    setInvalidAddress(j2Address.toString() !== opponentAddress);
  }, [j2Address, opponentAddress]);

  const timeOut = async () => {
    try {
      // @ts-expect-error
      const factory = new ethers.Contract(contract, rpsABI, signer.data);
      const transaction = await factory.j1Timeout({
        gasLimit: 6000000,
      });
      await transaction.wait()
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    }
  };
  const showSuccess = () => {
    if (!success) return "";
    if (showJ1Timeout) return "Successfully withdraw amount from Player 1";
    return "Successfully played move by Opponent";
  };

  return (
    <div>
      Opponnet: {j1Address?.toString()}
      <br />
      TimeRemaining: {timeremain()}
      <br />
      Stake: {stake?.toString()}
      <br />
      {invalidAddress ? (
        "Not a Player, switch to valid address"
      ) : (
        <div>
          {stake?.toString() !== "0" ? (
            <div>
              {showSuccess()}
              {!success && showJ1Timeout && (
                <Button onClick={timeOut}> Withdraw from player1 </Button>
              )}
              {!success && <PentagonDesign execute={play} />}
            </div>
          ) : "Game Over"}
        </div>
      )}
    </div>
  );
};

export default PentagonOpponent;
