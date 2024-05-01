"use client"
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import crypto from "crypto-browserify";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";


const OfframpExample: React.FC = () => {
  const { primaryWallet, user } = useDynamicContext();
  const isConnected= primaryWallet?.connected;
  const address = primaryWallet?.address;
  const userEmail = user?.email;
  

  const handleHostedFlowClick = () => {
    const url =
      `https://offramp-sandbox.gatefi.com/?merchantId=${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}&wallet=${address}&cryptoCurrency=ETH&fiatCurrency=BRL&cryptoAmount=0.005`;
    window.open(url, "_blank");
  };

  return (
    
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
        </>
        )}
      </div>
   
  );
  
};

export default OfframpExample;