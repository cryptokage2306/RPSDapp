import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useContractRead, useSigner } from "wagmi";
import { currentTime, isValidEthAddress } from "../../utils";
import { ethers } from "ethers";
import { rpsABI } from "../../contract/rps";
import { useRouter } from "next/router";
import { Button, Input } from "@chakra-ui/react";
import { PentagonDesign } from "../../components/PentagonDesign";
const FirstPlayer = () => {
  const {
    query: { address: contract },
    push,
  } = useRouter();

  const { isConnected, address: firstPlayerAddress } = useAccount();

  const [time, setTime] = useState("");
  const [password, setPassword] = useState("");
  const [withdrawTimeOut, setWithdrawTimeOut] = useState(false);
  const [solveData, setSolveData] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: j2Address } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "j2",
    enabled: !!contract,
    staleTime: 1000,
  });

  const { data: j1Address } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "j1",
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
    try {
      if (!contract || Array.isArray(contract) || !signer.data) {
        return;
      }
      const contractInstance = new ethers.Contract(
        contract,
        rpsABI,
        signer.data
      );
      const trx = await contractInstance.j2Timeout();
      await trx.wait();
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    }
  };
  const solve = async (str: string) => {
    try {
      if (!contract || Array.isArray(contract) || !signer.data) {
        return;
      }

      const unsignedMessage = `${password}${time}`;
      const signedMessage = await signer.data?.signMessage(unsignedMessage);
      if (!signedMessage) {
        return;
      }
      const salt = ethers.utils.keccak256(signedMessage);
      const contractInstance = new ethers.Contract(
        contract,
        rpsABI,
        signer.data
      );
      const trx = await contractInstance.solve(str, salt, {
        gasLimit: 6000000,
      });
      await trx.wait();
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (!j1Address || !firstPlayerAddress) {
      return;
    }
    setInvalidAddress(j1Address.toString() !== firstPlayerAddress);
  }, [j1Address, firstPlayerAddress]);

  useEffect(() => {
    if (!contract || Array.isArray(contract)) {
      return;
    }
    console.log(contract);
    if (!isConnected || isValidEthAddress(contract)) {
      push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, isConnected]);

  useEffect(() => {
    const timeRemaining = timeremain();
    if (!opponentMove || !timeRemaining) {
      return;
    }
    if (currentTime() > timeRemaining) {
      if (opponentMove.toString() === "0") {
        setWithdrawTimeOut(true);
      }
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

  const showSuccess = () => {
    if (!success) return "";
    if (withdrawTimeOut) return "Successfully withdraw amount of Opponent";
    if (solveData) return "Successfully Solve";
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
      Please share the contract address to the opponent
      <br />
      {invalidAddress ? (
        "Not a Player, switch to valid address"
      ) : stake?.toString() === "0" ? (
        "Game Over"
      ) : (
        <div>
          {showSuccess()}
          {!success && withdrawTimeOut && (
            <Button onClick={timeOut}>Withdraw</Button>
          )}
          <br />
          {!success && solveData && (
            <div>
              Password
              <Input
                type="password"
                onChange={onChangePasswordhandler}
                value={password}
              />
              {inputError.password && "Password is inValid"}
              RandomNum
              <Input
                type="number"
                onChange={(e) => setTime(e.target.value)}
                value={time}
              />
              <PentagonDesign execute={solve} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FirstPlayer;
