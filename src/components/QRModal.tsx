import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { Block } from "@/types/blockchain";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: Block | null;
}

export const QRModal = ({ isOpen, onClose, block }: QRModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && block && canvasRef.current) {
      const blockData = JSON.stringify(block, null, 2);
      QRCode.toCanvas(canvasRef.current, blockData, {
        width: 300,
        margin: 2,
        color: {
          dark: "hsl(var(--primary))",
          light: "hsl(var(--background))",
        },
      });
    }
  }, [isOpen, block]);

  const downloadQR = () => {
    if (canvasRef.current && block) {
      const link = document.createElement("a");
      link.download = `block-${block.index}-qr.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  if (!block) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Block QR Code
            <Badge variant="secondary">#{block.index}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <canvas ref={canvasRef} />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Scan to view block data
            </p>
            <div className="text-xs text-muted-foreground">
              <p><strong>Farmer:</strong> {block.farmer}</p>
              <p><strong>Crop:</strong> {block.crop}</p>
              <p><strong>Hash:</strong> {block.hash.slice(0, 16)}...</p>
            </div>
          </div>

          <Button
            onClick={downloadQR}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};