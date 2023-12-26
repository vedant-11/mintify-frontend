import React, { FC, useState, useEffect, use } from "react";
import PageHeading from "../components/PageHeading";
import axios from "axios";
const wallet: FC = () => {
  const [walletAddress, setWalletAddress] = useState([]);
  const walletUrl = process.env.NEXT_PUBLIC_API;
  useEffect(() => {
    const getWalletAddress = async () => {
      const response = await axios.get(walletUrl);
      setWalletAddress(response.data);
    };
    getWalletAddress();
  }, []);

  return (
    <div>
      <PageHeading>
        List of all the wallet addresses that have minted an NFT
      </PageHeading>
      <div className="my-10">
        {walletAddress.length > 0 &&
          walletAddress.map(({ walletAddress, index }) => (
            <div key={index}>
              <h2 className="text-white font-medium">{walletAddress}</h2>
            </div>
          ))}
      </div>
    </div>
  );
};

export default wallet;
