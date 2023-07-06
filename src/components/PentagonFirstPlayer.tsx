import React, { useEffect, useState } from "react";
import styles from "../styles/Pentagon.module.css";
import { useContractRead, useSigner } from "wagmi";
import { Input } from "@chakra-ui/react";
import {
  currentTime,
  isValidEthAddress,
  limitTo18Decimals,
  performKeccak256,
} from "../utils";
import { ethers } from "ethers";
import { byteCode, rpsABI, saltCreator } from "../contract/rps";
import { PentagonDesign } from "./PentagonDesign";

const PentagonFirstPlayer = () => {
  const [opponent, setOpponentAddress] = useState("");
  const [contract, setContract] = useState("");
  const [password, setPassword] = useState("");
  const [amountInEth, setAmountInEth] = useState("");
  const [time, setTime] = useState("");
  const { data: j2Address } = useContractRead({
    abi: rpsABI,
    // @ts-expect-error
    address: contract,
    functionName: "j2",
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
    opponent: false,
    password: false,
    amountInEth: false,
  });
  const signer = useSigner();
  const create = async (str: string) => {
    // if (inputError.opponent || inputError.password || inputError.amountInEth || opponent || password || amountInEth) {
    //   return
    // }
    const time = currentTime();
    const unsignedMessage = `${password}${time}`;
    const signedMessage = await signer.data?.signMessage(unsignedMessage);
    if (!signedMessage) {
      return;
    }
    const salt = ethers.utils.keccak256(signedMessage);
    // @ts-expect-error
    const saltCreatorInstance = new ethers.Contract("0x6f243b9a3fc0Fef623aF3B0f668C8A3d60992C28", saltCreator, signer.data)
    const saltInteraction = await saltCreatorInstance.callStatic.hash(str, salt);
    // @ts-expect-error
    const factory = new ethers.ContractFactory(rpsABI, byteCode, signer.data);
    const contract = await factory.deploy(saltInteraction, opponent, {
      value: ethers.utils.parseEther(amountInEth),
    });
    const data = await contract.deployTransaction.wait();
    setContract(contract.address);
    setTime(time.toString());
  };
  const onChangeOpponenthandler = (e: any) => {
    setInputError((state) => ({
      ...state,
      opponent: isValidEthAddress(e.target.value),
    }));
    setOpponentAddress(e.target.value);
  };

  const onChangePasswordhandler = (e: any) => {
    setInputError((state) => ({
      ...state,
      password: !e.target.value,
    }));
    setPassword(e.target.value);
  };

  const onChangeAmounthandler = (e: any) => {
    setInputError((state) => ({
      ...state,
      amountInEth: limitTo18Decimals(e.target.value),
    }));
    setAmountInEth(e.target.value);
  };
  const timeremain = () =>
    // @ts-ignore
    !!lastAction && !!TIMEOUT ? lastAction.toNumber() + TIMEOUT.toNumber() : 0;
  return (
    <div>
      Opponnet: {j2Address?.toString()}
      <br />
      TimeRemaining: {timeremain()}
      <br />
      RandomNum: {time}
      <br />
      Hint: Please remember the password and RandomNum
      <br />
      Contract: {contract}
      <br />
      Please share the contract address to the manager
      <br />
      <label>Opponent Address</label>
      <Input onChange={onChangeOpponenthandler} value={opponent} />
      {inputError.opponent && "Address is in-valid"}
      <br />
      <label>Password</label>
      <Input
        type="password"
        onChange={onChangePasswordhandler}
        value={password}
      />
      {inputError.password && "Password is not strong"}
      <br />
      <label>Amount in ETH</label>
      <Input onChange={onChangeAmounthandler} value={amountInEth} />
      {inputError.amountInEth && "Amount is in-valid"}
      <PentagonDesign execute={create} />
    </div>
  );
};

export default PentagonFirstPlayer;
