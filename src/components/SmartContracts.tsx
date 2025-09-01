import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  Hash, 
  Lock, 
  Unlock, 
  FileCheck, 
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Block } from "@/types/blockchain";

interface SmartContractProps {
  blockchain: Block[];
  onAddBlock: (block: Omit<Block, 'index' | 'timestamp' | 'hash' | 'prevHash'>) => void;
}

interface Contract {
  id: string;
  type: 'supply_chain' | 'quality_assurance' | 'payment' | 'insurance';
  parties: string[];
  terms: string;
  status: 'pending' | 'active' | 'completed' | 'breached';
  created: string;
  conditions: string[];
}

export const SmartContracts = ({ blockchain, onAddBlock }: SmartContractProps) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [newContract, setNewContract] = useState({
    type: 'supply_chain' as Contract['type'],
    parties: '',
    terms: '',
    conditions: '',
  });
  const [verificationData, setVerificationData] = useState({
    blockIndex: '',
    expectedHash: '',
  });
  const { toast } = useToast();

  // Blockchain integrity verification
  const verifyBlockchainIntegrity = () => {
    if (blockchain.length === 0) {
      toast({
        title: "No Blockchain Data",
        description: "Add some blocks first to verify integrity.",
        variant: "destructive"
      });
      return false;
    }

    let isValid = true;
    const results = [];

    for (let i = 0; i < blockchain.length; i++) {
      const block = blockchain[i];
      const calculatedHash = btoa(JSON.stringify({
        ...block,
        hash: undefined
      })).slice(0, 20);

      const hashValid = block.hash === calculatedHash;
      const prevHashValid = i === 0 ? block.prevHash === "0" : block.prevHash === blockchain[i - 1].hash;

      results.push({
        index: i,
        hashValid,
        prevHashValid,
        valid: hashValid && prevHashValid
      });

      if (!hashValid || !prevHashValid) {
        isValid = false;
      }
    }

    toast({
      title: isValid ? "Blockchain Valid" : "Blockchain Compromised",
      description: isValid 
        ? "All blocks are properly linked and verified."
        : "Some blocks have invalid hashes or links.",
      variant: isValid ? "default" : "destructive"
    });

    return { isValid, results };
  };

  // Create smart contract
  const createContract = () => {
    if (!newContract.parties || !newContract.terms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const contract: Contract = {
      id: Math.random().toString(36).substr(2, 9),
      ...newContract,
      parties: newContract.parties.split(',').map(p => p.trim()),
      conditions: newContract.conditions.split('\n').filter(c => c.trim()),
      status: 'pending',
      created: new Date().toISOString(),
    };

    setContracts([...contracts, contract]);

    // Add contract to blockchain
    onAddBlock({
      farmer: 'Smart Contract System',
      crop: 'Contract Created',
      quantity: '1',
      price: '0',
      notes: `Contract ID: ${contract.id} | Type: ${contract.type} | Parties: ${contract.parties.join(', ')}`
    });

    setNewContract({
      type: 'supply_chain',
      parties: '',
      terms: '',
      conditions: '',
    });

    toast({
      title: "Contract Created",
      description: `Smart contract ${contract.id} has been created and recorded on the blockchain.`,
    });
  };

  // Execute contract
  const executeContract = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, status: 'active' }
        : c
    ));

    onAddBlock({
      farmer: 'Smart Contract System',
      crop: 'Contract Executed',
      quantity: '1',
      price: '0',
      notes: `Contract ${contractId} has been executed and is now active.`
    });

    toast({
      title: "Contract Executed",
      description: `Smart contract ${contractId} is now active.`,
    });
  };

  // Verify specific block
  const verifyBlock = () => {
    const index = parseInt(verificationData.blockIndex);
    if (isNaN(index) || index < 0 || index >= blockchain.length) {
      toast({
        title: "Invalid Block Index",
        description: "Please enter a valid block index.",
        variant: "destructive"
      });
      return;
    }

    const block = blockchain[index];
    const calculatedHash = btoa(JSON.stringify({
      ...block,
      hash: undefined
    })).slice(0, 20);

    const isValid = block.hash === calculatedHash;
    const expectedMatch = verificationData.expectedHash ? 
      block.hash === verificationData.expectedHash : true;

    toast({
      title: isValid && expectedMatch ? "Block Verified" : "Block Verification Failed",
      description: isValid && expectedMatch 
        ? `Block #${index} is valid and verified.`
        : `Block #${index} verification failed. Hash mismatch detected.`,
      variant: isValid && expectedMatch ? "default" : "destructive"
    });
  };

  const getContractColor = (status: Contract['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'breached': return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getContractIcon = (status: Contract['status']) => {
    switch (status) {
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      case 'active': return <FileCheck className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'breached': return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Blockchain Security Panel */}
      <Card className="shadow-strong border-primary/20">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Blockchain Security & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Integrity Check */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Integrity Verification
              </h3>
              <Button 
                onClick={verifyBlockchainIntegrity}
                className="w-full"
                variant="outline"
              >
                <Shield className="mr-2 h-4 w-4" />
                Verify Full Blockchain
              </Button>
              
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Blockchain integrity ensures all blocks are properly linked and unmodified.
                </AlertDescription>
              </Alert>
            </div>

            {/* Block Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Block Verification
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="blockIndex">Block Index</Label>
                <Input
                  id="blockIndex"
                  type="number"
                  placeholder="Enter block index"
                  value={verificationData.blockIndex}
                  onChange={(e) => setVerificationData({
                    ...verificationData,
                    blockIndex: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedHash">Expected Hash (Optional)</Label>
                <Input
                  id="expectedHash"
                  placeholder="Enter expected hash"
                  value={verificationData.expectedHash}
                  onChange={(e) => setVerificationData({
                    ...verificationData,
                    expectedHash: e.target.value
                  })}
                />
              </div>
              
              <Button 
                onClick={verifyBlock}
                className="w-full"
                variant="outline"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Verify Block
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Contracts */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Smart Contracts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Create New Contract */}
          <div className="space-y-4 p-4 bg-accent rounded-lg">
            <h3 className="text-lg font-semibold">Create New Contract</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractType">Contract Type</Label>
                <select
                  id="contractType"
                  className="w-full p-2 border rounded-md"
                  value={newContract.type}
                  onChange={(e) => setNewContract({
                    ...newContract,
                    type: e.target.value as Contract['type']
                  })}
                >
                  <option value="supply_chain">Supply Chain</option>
                  <option value="quality_assurance">Quality Assurance</option>
                  <option value="payment">Payment</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parties">Parties (comma-separated)</Label>
                <Input
                  id="parties"
                  placeholder="Farmer, Distributor, Retailer"
                  value={newContract.parties}
                  onChange={(e) => setNewContract({
                    ...newContract,
                    parties: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terms">Contract Terms</Label>
              <Textarea
                id="terms"
                placeholder="Describe the contract terms and conditions..."
                value={newContract.terms}
                onChange={(e) => setNewContract({
                  ...newContract,
                  terms: e.target.value
                })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conditions">Execution Conditions (one per line)</Label>
              <Textarea
                id="conditions"
                placeholder="Quality grade >= A&#10;Delivery within 7 days&#10;Payment confirmed"
                value={newContract.conditions}
                onChange={(e) => setNewContract({
                  ...newContract,
                  conditions: e.target.value
                })}
                rows={3}
              />
            </div>
            
            <Button onClick={createContract} className="w-full">
              <FileCheck className="mr-2 h-4 w-4" />
              Create Smart Contract
            </Button>
          </div>

          <Separator />

          {/* Active Contracts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Contracts ({contracts.length})</h3>
            
            {contracts.length === 0 ? (
              <Alert>
                <FileCheck className="h-4 w-4" />
                <AlertDescription>
                  No smart contracts created yet. Create your first contract above.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <Card key={contract.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {contract.id}
                          </Badge>
                          <Badge variant="secondary">
                            {contract.type.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            className={getContractColor(contract.status)}
                            variant="outline"
                          >
                            {getContractIcon(contract.status)}
                            {contract.status}
                          </Badge>
                        </div>
                        
                        {contract.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => executeContract(contract.id)}
                          >
                            Execute
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Parties:</strong> {contract.parties.join(', ')}</p>
                        <p className="text-sm"><strong>Terms:</strong> {contract.terms}</p>
                        {contract.conditions.length > 0 && (
                          <div className="text-sm">
                            <strong>Conditions:</strong>
                            <ul className="list-disc list-inside ml-2 mt-1">
                              {contract.conditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(contract.created).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};