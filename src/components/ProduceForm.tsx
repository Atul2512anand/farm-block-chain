import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Sprout, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Block } from "@/types/blockchain";

interface ProduceFormProps {
  onAddBlock: (block: Omit<Block, 'index' | 'timestamp' | 'hash' | 'prevHash'>) => void;
  onExportLedger: () => void;
  onClearLedger: () => void;
}

export const ProduceForm = ({ onAddBlock, onExportLedger, onClearLedger }: ProduceFormProps) => {
  const [formData, setFormData] = useState({
    farmer: "",
    crop: "",
    quantity: "",
    price: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmer || !formData.crop || !formData.quantity || !formData.price) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onAddBlock(formData);
    setFormData({
      farmer: "",
      crop: "",
      quantity: "",
      price: "",
      notes: ""
    });
    
    toast({
      title: "Block Added",
      description: "Successfully recorded on blockchain!",
    });
  };

  return (
    <Card className="shadow-strong">
      <CardHeader className="bg-gradient-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          Record Produce
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farmer">Farmer *</Label>
            <Input
              id="farmer"
              value={formData.farmer}
              onChange={(e) => setFormData({ ...formData, farmer: e.target.value })}
              placeholder="Enter farmer name"
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop">Crop *</Label>
            <Input
              id="crop"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              placeholder="e.g., Wheat, Rice, Tomatoes"
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg) *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹/kg) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                className="focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information..."
              className="focus-visible:ring-primary resize-none"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
            Record on Blockchain
          </Button>
        </form>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onExportLedger}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="destructive"
            onClick={onClearLedger}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};