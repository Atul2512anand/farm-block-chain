export interface Block {
  index: number;
  timestamp: string;
  farmer: string;
  crop: string;
  quantity: string;
  price: string;
  notes: string;
  prevHash: string;
  hash: string;
}

export interface DemandPrediction {
  crop: string;
  season: number;
  data: number[];
}