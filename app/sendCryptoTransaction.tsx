"use client";
import React, { useCallback, useRef, useEffect, useState } from "react";

import contractAbi from "./0x34bE7f35132E97915633BC1fc020364EA5134863.json";

import "./transaction.css";

import Loading from "./Loading";
import Typewriter from "./Typewriter";

import { encodeFunctionData, parseEther } from "viem";

import {
  useDynamicContext,
  usePasskeyRecovery,
} from "@dynamic-labs/sdk-react-core";

import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa";

import { useSendBalance } from "@dynamic-labs/sdk-react-core";

const nftAddress = "0x34bE7f35132E97915633BC1fc020364EA5134863";

function SendTransaction() {
  const [isTransactionOn, setIsTransactionOn] = useState(false);
  const [formData, setFormData] = useState({
    recipient_wallet_address: "",
    amount_of_eth_to_send: "",
  });
  
  const { initPasskeyRecoveryProcess } = usePasskeyRecovery();
  const { primaryWallet, user } = useDynamicContext();
  const isConnected = primaryWallet?.connected;
  const address = primaryWallet?.address;

  const alias = user?.email || "Anon";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmitSendCrypto = async (e) => {
    e.preventDefault();
    // Handle form submission here, like sending data to a server or performing validation
    console.log(formData);
    await sendCrypto();
    // try {
    //   const connector = await primaryWallet?.connector;
    //   const aaProvider = connector.getAccountAbstractionProvider();
    //   // console.log(aaProvider)
    //   if (!aaProvider) return;

    //   const userOp = {
    //     target: formData.recipient_wallet_address,
    //     data: "0x",
    //     value: parseEther(formData.amount_of_eth_to_send),
    //   };
    //   const { hash } = await aaProvider.sendUserOperation([userOp]);
    //   console.log(hash);
    //   const result = await aaProvider.waitForUserOperationTransaction(
    //     hash as `0x${string}`
    //   );

    //   console.log(result);
    // } catch (err) {
    //   console.error("Sending balance failed", err);
    // }
    // Reset form fields after submission
    setFormData({
      recipient_wallet_address: "",
      amount_of_eth_to_send: "",
    });
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
       
        const targetAddress = formData.recipient_wallet_address.substring(2)
        const userOp = {
          target: formData.recipient_wallet_address,
          data: `0x` as `0x${string}`,
          value: parseEther(formData.amount_of_eth_to_send),
        };

        const { hash } = await aaProvider.sendUserOperation([userOp]);
        console.log(hash);
        const result = await aaProvider.waitForUserOperationTransaction(
          hash as `0x${string}`
        );

        console.log(result);
        setIsTransactionOn(false);
      } catch (e) {
        setIsTransactionOn(false);
        console.log(e);
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

          <form onSubmit={handleSubmitSendCrypto}>
            <div>
              <label htmlFor="recipient_wallet_address">
                Recipient Wallet Address:
              </label>
              <input
                type="text"
                id="recipient_wallet_address"
                name="recipient_wallet_address"
                value={formData.recipient_wallet_address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="amount_of_eth_to_send">
                Amount of eth to Send:
              </label>
              <input
                type="text"
                id="amount_of_eth_to_send"
                name="amount_of_eth_to_send"
                value={formData.amount_of_eth_to_send}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
}

export default SendTransaction;
