import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Wheat, User, Calendar, Weight, IndianRupee } from "lucide-react";
import { Block } from "@/types/blockchain";

interface BlockchainCardProps {
  block: Block;
  onShowQR: (block: Block) => void;
}

export const BlockchainCard = ({ block, onShowQR }: BlockchainCardProps) => {
  return (
    <Card className="group hover:shadow-strong transition-all duration-300 cursor-pointer border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
              Block #{block.index}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {block.hash.slice(0, 8)}...
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowQR(block)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-primary">{block.farmer}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Wheat className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{block.crop}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span>{block.quantity} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span>₹{block.price}/kg</span>
            </div>
          </div>

          {block.notes && (
            <p className="text-sm text-muted-foreground bg-accent p-2 rounded-md">
              {block.notes}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Calendar className="h-3 w-3" />
            <span>{block.timestamp}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};