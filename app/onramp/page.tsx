"use client"
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from "@gatefi/js-sdk";
import { FC, useRef, useEffect, useState, ChangeEvent, FormEvent } from "react";
import crypto from "crypto-browserify";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { redirect } from "next/navigation";


const OnrampExample: React.FC = () => {
  const [showIframe, setShowIframe] = useState(false);
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const embedInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { primaryWallet, user } = useDynamicContext();
  const isConnected= primaryWallet?.connected;
  const address = primaryWallet?.address;
  const userEmail = user?.email;
  useEffect(() => {
    return () => {
      overlayInstanceSDK.current?.destroy();
      overlayInstanceSDK.current = null;
      embedInstanceSDK.current?.destroy();
      embedInstanceSDK.current = null;
    };
  }, []);

  const handleOnClickEmbed = () => {
    if (showIframe) {
      embedInstanceSDK.current?.hide();
      setShowIframe(false);
    } else {
      if (!embedInstanceSDK.current) {
        createEmbedSdkInstance();
      }
      embedInstanceSDK.current?.show();
      setShowIframe(true);
    }
  };

  const handleCloseEmbed = () => {
    embedInstanceSDK.current?.destroy();
    embedInstanceSDK.current = null;
    setShowIframe(false);
};

  const handleOnClick = () => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = crypto.randomBytes(32).toString("hex");
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: `${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}`,
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: "#overlay-button",
        lang: GateFiLangEnum.en_US,
        isSandbox: true,
        successUrl:"https://www.crypto.unlimit.com/",
        walletAddress: address,
        email: userEmail,
        externalId: randomString,
        defaultFiat: {
          currency: "USD",
          amount: "20",
        },
        defaultCrypto: {
          currency: "USDT-BEP20",
        },
      });
    }
    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
  };

  // Function to create a new embed SDK instance
  const createEmbedSdkInstance = () => { 
    const randomString = crypto.randomBytes(32).toString("hex");

    embedInstanceSDK.current =
      typeof document !== "undefined"
        ? new GateFiSDK({
            merchantId: `${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}`,
            displayMode: GateFiDisplayModeEnum.Embedded,
            nodeSelector: "#embed-button",
            isSandbox: true,
            walletAddress: address,
            email: userEmail,
            externalId: randomString,
            defaultFiat: {
              currency: "USD",
              amount: "30",
            },
            defaultCrypto: {
              currency: "USDT-BEP20",
            },
          })
        : null;
  };

  const handleHostedFlowClick = () => {
    const url =
      `https://onramp-sandbox.gatefi.com/?merchantId=${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}`;
    window.open(url, "_blank");
  };

  if (!isConnected) {
    redirect('/')
  }

  return (
    
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {/* Buttons with modern styling */}
        
        {isConnected && (
        <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={handleOnClick}
            style={{
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
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Overlay
          </button>
          <button
            onClick={handleOnClickEmbed}
            style={{
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
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Embed
          </button>
          <button
            onClick={handleHostedFlowClick}
            style={{
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
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Hosted Flow
          </button>
        </div>
  
        <div
          style={{
            position: "relative",
            border: showIframe ? "2px solid white" : "none",

            width: "100%", 
            height: "600px", 
            marginTop: "20px",
            padding: showIframe ? "20px" : "0",
            boxSizing: "border-box",
            overflow: "auto"
          }}
        >
          <div id="embed-button" style={{ width: "100%", height: showIframe ? "calc(100% - 40px)" : "100%" }}></div>
          {showIframe && (
            <button
              onClick={handleCloseEmbed}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "rgb(201, 247, 58)",
                color: "black",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          )}
        </div>
  
        <div id="overlay-button"></div>
        </>
        )}

      </div>
   
  );
  
};

export default OnrampExample;