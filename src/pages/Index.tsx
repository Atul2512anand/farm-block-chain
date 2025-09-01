import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Wheat, Blocks, TrendingUp, Shield, Eye, Truck, BarChart3 } from "lucide-react";
import { BlockchainCard } from "@/components/BlockchainCard";
import { ProduceForm } from "@/components/ProduceForm";
import { DemandPredictor } from "@/components/DemandPredictor";
import { QRModal } from "@/components/QRModal";
import { BlockchainVisualization } from "@/components/BlockchainVisualization";
import { BlockchainAnalytics } from "@/components/BlockchainAnalytics";
import { SmartContracts } from "@/components/SmartContracts";
import { SupplyChainTracking } from "@/components/SupplyChainTracking";
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
                <p className="text-primary-foreground/80">Advanced Blockchain for Agriculture</p>
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Blocks className="h-4 w-4" />
              3D View
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Contracts
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="predict" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Predict
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-1 space-y-6">
                <ProduceForm
                  onAddBlock={addBlock}
                  onExportLedger={exportLedger}
                  onClearLedger={handleClearLedger}
                />
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
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <BlockchainAnalytics blockchain={blockchain} />
          </TabsContent>

          {/* 3D Visualization Tab */}
          <TabsContent value="3d" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">3D Blockchain Visualization</h2>
              <p className="text-muted-foreground">
                Interactive 3D representation of your blockchain. Drag to rotate, scroll to zoom.
              </p>
            </div>
            <BlockchainVisualization blockchain={blockchain} />
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts">
            <SmartContracts blockchain={blockchain} onAddBlock={addBlock} />
          </TabsContent>

          {/* Supply Chain Tracking Tab */}
          <TabsContent value="tracking">
            <SupplyChainTracking blockchain={blockchain} onAddBlock={addBlock} />
          </TabsContent>

          {/* Demand Prediction Tab */}
          <TabsContent value="predict" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <DemandPredictor />
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Market Intelligence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">↗ 12%</div>
                    <p className="text-sm text-muted-foreground">Price Trend</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <p className="text-sm text-muted-foreground">Quality Score</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">2.3k</div>
                    <p className="text-sm text-muted-foreground">Total Supply (tons)</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">98%</div>
                    <p className="text-sm text-muted-foreground">Traceability</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
