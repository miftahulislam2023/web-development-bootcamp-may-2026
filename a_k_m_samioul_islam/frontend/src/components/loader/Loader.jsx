import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="wallet-loader">
        <div className="wallet-back" />
        <div className="bill bill-1" />
        <div className="bill bill-2" />
        <div className="bill bill-3" />
        <div className="wallet-front">
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .wallet-loader {
    --wallet-color: #8b4513;
    /* SaddleBrown */
    --wallet-dark: #5a2d0c;
    --bill-color: #66cdaa;
    /* MediumAquamarine */
    --bill-detail: #2e8b57;
    /* SeaGreen */
    --txt-color: #ffffff;
    /* White text */
    --duration: 4s;

    position: relative;
    width: 110px;
    height: 80px;
  }

  /* --- WALLET BACK --- */
  .wallet-loader .wallet-back {
    position: absolute;
    bottom: 10px;
    left: 5px;
    width: 100px;
    height: 45px;
    background: var(--wallet-dark);
    border-radius: 5px 5px 0 0;
    z-index: 0;
  }

  /* --- BILLS (Common Styles) --- */
  .wallet-loader .bill {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -30px;
    width: 70px;
    height: 40px;
    background: var(--bill-color);
    border-radius: 2px;
    border: 1px solid var(--bill-detail);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Rupee Symbol */
  .wallet-loader .bill::before {
    content: "₹";
    font-family: sans-serif;
    font-weight: bold;
    font-size: 18px;
    color: var(--bill-detail);
    border: 2px solid var(--bill-detail);
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
  }

  /* Bill Decorative Lines */
  .wallet-loader .bill::after {
    content: "";
    position: absolute;
    left: 3px;
    right: 3px;
    top: 3px;
    bottom: 3px;
    border: 1px dashed var(--bill-detail);
    border-radius: 1px;
  }

  /* Bill Specific Animations */
  .wallet-loader .bill-1 {
    z-index: 1;
    animation: slide-in var(--duration) ease-in-out infinite;
    animation-delay: 0s;
  }

  .wallet-loader .bill-2 {
    z-index: 2;
    animation: slide-in var(--duration) ease-in-out infinite;
    animation-delay: 0.8s;
  }

  .wallet-loader .bill-3 {
    z-index: 3;
    animation: slide-in var(--duration) ease-in-out infinite;
    animation-delay: 1.6s;
  }

  /* --- WALLET FRONT --- */
  .wallet-loader .wallet-front {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 110px;
    height: 52px;
    background: linear-gradient(180deg, var(--wallet-color), var(--wallet-dark));
    border-radius: 6px 6px 10px 10px;
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

    /* Center the text inside */
    display: flex;
    align-items: center;
    justify-content: center;

    animation: wallet-bounce var(--duration) ease-in-out infinite;
  }

  /* Stitching Detail */
  .wallet-loader .wallet-front::before {
    content: "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 6px;
    top: 6px;
    border: 1px dashed rgba(60, 30, 0, 0.3);
    border-radius: 4px 4px 8px 8px;
    pointer-events: none;
  }

  /* --- TEXT STYLING --- */
  .wallet-loader .text {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
      Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--txt-color);
    letter-spacing: 0.5px;
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3);
  }

  /* The moving dots */
  .wallet-loader .dot {
    display: inline-block;
    animation: wave 1.5s infinite;
  }

  .wallet-loader .dot:nth-child(1) {
    animation-delay: 0s;
  }

  .wallet-loader .dot:nth-child(2) {
    animation-delay: 0.1s;
  }

  .wallet-loader .dot:nth-child(3) {
    animation-delay: 0.2s;
  }

  /* --- ANIMATIONS --- */

  /* Money Falling In */
  @keyframes slide-in {
    0% {
      top: -30px;
      opacity: 0;
      transform: translateX(-50%) scale(0.8);
    }

    10% {
      opacity: 1;
    }

    25% {
      top: 18px;
      transform: translateX(-50%) scale(1);
    }

    90% {
      top: 18px;
      opacity: 1;
    }

    100% {
      top: 18px;
      opacity: 0;
    }
  }

  /* Wallet Reaction (Squish/Bounce) */
  @keyframes wallet-bounce {
    0%,
    100% {
      transform: scale(1);
    }

    12% {
      transform: scale(1.02, 0.98);
    }

    15% {
      transform: scale(1);
    }

    32% {
      transform: scale(1.02, 0.98);
    }

    35% {
      transform: scale(1);
    }

    52% {
      transform: scale(1.02, 0.98);
    }

    55% {
      transform: scale(1);
    }
  }

  /* Dot Wave Animation */
  @keyframes wave {
    0%,
    60%,
    100% {
      transform: translateY(0);
    }

    30% {
      transform: translateY(-4px);
    }
  }`;

export default Loader;
