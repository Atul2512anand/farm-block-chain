import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Wheat, Blocks, TrendingUp, Shield } from "lucide-react";
import { BlockchainCard } from "@/components/BlockchainCard";
import { ProduceForm } from "@/components/ProduceForm";
import { DemandPredictor } from "@/components/DemandPredictor";
import { QRModal } from "@/components/QRModal";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useToast } from "@/hooks/use-toast";
import { Block } from "@/types/blockchain";

const Index = () => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const { blockchain, addBlock, exportLedger, clearLedger } = useBlockchain();
  const { toast } = useToast();

  const handleShowQR = (block: Block) => {
    setSelectedBlock(block);
    setShowQRModal(true);
  };

  const handleClearLedger = () => {
    if (window.confirm("Are you sure you want to clear the entire blockchain ledger? This action cannot be undone.")) {
      clearLedger();
      toast({
        title: "Ledger Cleared",
        description: "The blockchain has been reset.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-strong">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wheat className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">AgriChain</h1>
                <p className="text-primary-foreground/80">Blockchain for Agriculture</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
                <Blocks className="h-4 w-4 mr-1" />
                {blockchain.length} Blocks
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
                <Shield className="h-4 w-4 mr-1" />
                Secured
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-1 space-y-6">
            <ProduceForm
              onAddBlock={addBlock}
              onExportLedger={exportLedger}
              onClearLedger={handleClearLedger}
            />
            <DemandPredictor />
          </div>

          {/* Right Column - Blockchain Ledger */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Blocks className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Blockchain Ledger</h2>
              </div>
              {blockchain.length > 0 && (
                <Badge variant="outline" className="text-muted-foreground">
                  Latest Hash: {blockchain[blockchain.length - 1]?.hash.slice(0, 12)}...
                </Badge>
              )}
            </div>
            
            <Separator />

            {blockchain.length === 0 ? (
              <Alert className="border-primary/20 bg-primary/5">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  No blocks recorded yet. Start by adding your first produce record to the blockchain.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {blockchain
                  .slice()
                  .reverse()
                  .map((block) => (
                    <BlockchainCard
                      key={block.index}
                      block={block}
                      onShowQR={handleShowQR}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        block={selectedBlock}
      />
    </div>
  );
};

export default Index;
