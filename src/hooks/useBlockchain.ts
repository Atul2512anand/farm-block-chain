import { useState, useEffect } from "react";
import { Block } from "@/types/blockchain";

const STORAGE_KEY = "agrichain";

export const useBlockchain = () => {
  const [blockchain, setBlockchain] = useState<Block[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBlockchain(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing stored blockchain:", error);
      }
    }
  }, []);

  const calculateHash = (block: Omit<Block, 'hash'>): string => {
    return btoa(JSON.stringify(block)).slice(0, 20);
  };

  const addBlock = (blockData: Omit<Block, 'index' | 'timestamp' | 'hash' | 'prevHash'>) => {
    const newBlock: Block = {
      ...blockData,
      index: blockchain.length,
      timestamp: new Date().toLocaleString(),
      prevHash: blockchain.length ? blockchain[blockchain.length - 1].hash : "0",
      hash: "",
    };
    
    newBlock.hash = calculateHash(newBlock);
    
    const updatedBlockchain = [...blockchain, newBlock];
    setBlockchain(updatedBlockchain);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlockchain));
  };

  const exportLedger = () => {
    const blob = new Blob([JSON.stringify(blockchain, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrichain-ledger.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearLedger = () => {
    setBlockchain([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    blockchain,
    addBlock,
    exportLedger,
    clearLedger,
  };
};