import React from "react";
import { useContractRead, useSigner } from "wagmi";
import { ethers } from "ethers";
import { rpsABI } from "../contract/rps";
import { PentagonDesign } from "./PentagonDesign";
import { useRouter } from "next/router";

const PentagonOpponent = () => {
  const {
    query: { address: contract },
  } = useRouter();
  const { data: j1Address } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "j1",
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
    if (!contract && Array.isArray(contract)) {
      return;
    }
    // @ts-expect-error
    const factory = new ethers.Contract(contract, rpsABI, signer.data);
    const data = await factory.play(str, {
      value: stake?.toString(),
      gasLimit: 6000000,
    });
    await data.deployTransaction.wait();
  };
  const timeremain = () =>
    // @ts-ignore
    !!lastAction && !!TIMEOUT ? lastAction.toNumber() + TIMEOUT.toNumber() : 0;
  const timeOut = async () => {
    // @ts-expect-error
    const factory = new ethers.Contract(contract, rpsABI, signer.data);
    const data = await factory.j2Timeout({
      gasLimit: 6000000,
    });
    await data.deployTransaction.wait();
  };

  return (
    <div>
      Opponnet: {j1Address?.toString()}
      <br />
      TimeRemaining: {timeremain()}
      <br />
      Stake: {stake?.toString()}
      <br />
      <PentagonDesign execute={play} />
    </div>
  );
};

export default PentagonOpponent;
