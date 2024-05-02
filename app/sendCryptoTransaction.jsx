"use client";
import React, { useCallback, useState } from "react";
import "./mint/transaction.css";
import Loading from "./Loading";
import Typewriter from "./Typewriter";

import { encodeFunctionData, parseEther } from "viem";

import {
  useDynamicContext,
  usePasskeyRecovery,
} from "@dynamic-labs/sdk-react-core";

import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa";

function SendTransaction() {
  const [isTransactionOn, setIsTransactionOn] = useState(false);
  const [formData, setFormData] = useState({
    recipient_wallet_address: "",
    amount_of_eth_to_send: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionResult, setTransactionResult] = useState();
  
  const { initPasskeyRecoveryProcess } = usePasskeyRecovery();
  const { primaryWallet, user } = useDynamicContext();
  const isConnected = primaryWallet?.connected;

  const alias = user?.email || "Anon";
  const handleUpdateBalance = async () => {
    await refetch();
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmitSendCrypto = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    console.log(formData);
    try {
      const result = await sendCrypto();
      setTransactionResult(result);
      setSuccessMessage("Transaction successful!");

      setFormData({
        recipient_wallet_address: "",
        amount_of_eth_to_send: "",
      });
    }catch(e){
      setErrorMessage("Transaction failed!");
    }
    
  };

  const sendCrypto = useCallback(async () => {
    const vcs = user?.verifiedCredentials;

    const verifiedCredential = vcs?.find((vc) => vc.walletName === "turnkeyhd");
    const hasAuthenticator =
      verifiedCredential?.walletProperties?.isAuthenticatorAttached;

    if (!hasAuthenticator) {
      await initPasskeyRecoveryProcess();
    }

    const connector = await primaryWallet?.connector;

    if (!connector) {
      console.error("no connector");
      return;
    }

    setIsTransactionOn(true);

    if (isZeroDevConnector(connector)) {
      try {
        const aaProvider = connector.getAccountAbstractionProvider();
        // console.log(aaProvider)
        if (!aaProvider) return;
       
        const userOp = {
          target: formData.recipient_wallet_address,
          data: `0x`,
          value: parseEther(formData.amount_of_eth_to_send),
        };

        const { hash } = await aaProvider.sendUserOperation([userOp]);
        console.log(hash);
        const result = await aaProvider.waitForUserOperationTransaction(
          hash
        );

        console.log(result);
        setSuccessMessage("Transaction successful!");
        setIsTransactionOn(false);
        return result;
      } catch (e) {
        setIsTransactionOn(false);
        console.log(e);
        throw e;
      }
    }
  }, [primaryWallet, user, initPasskeyRecoveryProcess]);


  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        paddingTop: "2rem",
      }}
    >
      {isConnected && (
        <>
          <Typewriter
            text={`Hey ${alias},DISCOVER THE EASIEST WAY To cash out your crypto with Unlimit Crypto's Off-Ramp Solution`}
          />
          
          <Loading isLoading={isTransactionOn} />
          {successMessage && <div className="text-green-500">{successMessage}</div>}
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          {transactionResult && (
            <div>Transaction Result: {transactionResult}</div>
          )}
          <form onSubmit={handleSubmitSendCrypto} className="flex flex-col gap-2 justify-end">
            <div className="flex items-center text-lg gap-2">
              <label htmlFor="recipient_wallet_address">
                Recipient Wallet Address :
              </label>
              <input
                type="text"
                id="recipient_wallet_address"
                name="recipient_wallet_address"
                value={formData.recipient_wallet_address}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 text-black"
                required
              />
            </div>
            <div className="flex items-center text-lg gap-2">
              <label htmlFor="amount_of_eth_to_send">
                Amount of eth to Send :
              </label>
              <input
                type="text"
                id="amount_of_eth_to_send"
                name="amount_of_eth_to_send"
                value={formData.amount_of_eth_to_send}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 text-black"
                required
              />
            </div>
            <button type="submit" style={{
              background: "rgb(201, 247, 58)",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              fontWeight: "bold",
              color: "black",
            }}>Submit</button>
          </form>
        </>
      )}
    </div>
  );
}

export default SendTransaction;
