import React, { useEffect, useState } from "react";
import { useContractRead, useSigner } from "wagmi";
import { currentTime } from "../../utils";
import { ethers } from "ethers";
import { rpsABI } from "../../contract/rps";
import { useRouter } from "next/router";
import { Button, Input } from "@chakra-ui/react";
import { PentagonDesign } from "../../components/PentagonDesign";
const FirstPlayer = () => {
  const {
    query: { address: contract },
  } = useRouter();

  const [time, setTime] = useState("");
  const [password, setPassword] = useState("");
  const [withdrawTimeOut, setWithdrawTimeOut] = useState(false);
  const [solveData, setSolveData] = useState(false);
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
  const [inputError, setInputError] = useState<{
    [key: string]: boolean;
  }>({
    password: false,
  });
  const signer = useSigner();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeremain = () =>
    // @ts-expect-error
    !!lastAction && !!TIMEOUT ? lastAction.toNumber() + TIMEOUT.toNumber() : 0;
  const timeOut = async () => {
    if (!contract || Array.isArray(contract) || !signer.data) {
      return;
    }
    const contractInstance = new ethers.Contract(contract, rpsABI, signer.data);
    await contractInstance.j1Timeout();
  };
  const solve = async (str: string) => {
    if (!contract || Array.isArray(contract) || !signer.data) {
      return;
    }

    const unsignedMessage = `${password}${time}`;
    const signedMessage = await signer.data?.signMessage(unsignedMessage);
    if (!signedMessage) {
      return;
    }
    const salt = ethers.utils.keccak256(signedMessage);
    const contractInstance = new ethers.Contract(contract, rpsABI, signer.data);
    await contractInstance.solve(str, salt, {
      gasLimit: 6000000,
    });
  };
  useEffect(() => {
    const timeRemaining = timeremain();
    if (!opponentMove || !timeRemaining) {
      return;
    }
    if (currentTime() > timeRemaining) {
      setWithdrawTimeOut(true);
    } else {
      setSolveData(true);
    }
  }, [opponentMove, timeremain]);

  const onChangePasswordhandler = (e: any) => {
    setInputError((state) => ({
      ...state,
      password: !e.target.value,
    }));
    setPassword(e.target.value);
  };

  return (
    <div>
      Opponnet: {j2Address?.toString()}
      <br />
      TimeRemaining: {timeremain()}
      <br />
      Hint: Please remember the password and RandomNum
      <br />
      Contract: {contract}
      <br />
      Please share the contract address to the manager
      <br />
      {withdrawTimeOut && <Button onClick={timeOut}>Withdraw</Button>}
      <br />
      {solveData && (
        <div>
          <Input
            type="password"
            onChange={onChangePasswordhandler}
            value={password}
          />
          {inputError.password && "Password is inValid"}
          <Input
            type="number"
            onChange={(e) => setTime(e.target.value)}
            value={time}
          />
          <PentagonDesign execute={solve} />
        </div>
      )}
    </div>
  );
};

export default FirstPlayer;
