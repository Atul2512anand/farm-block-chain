import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Thermometer, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  Package,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Block } from "@/types/blockchain";

interface TrackingEvent {
  id: string;
  blockIndex: number;
  timestamp: string;
  location: string;
  status: 'origin' | 'transit' | 'storage' | 'processing' | 'delivered';
  temperature?: number;
  humidity?: number;
  quality?: 'A' | 'B' | 'C';
  handler: string;
  notes: string;
}

interface SupplyChainProps {
  blockchain: Block[];
  onAddBlock: (block: Omit<Block, 'index' | 'timestamp' | 'hash' | 'prevHash'>) => void;
}

export const SupplyChainTracking = ({ blockchain, onAddBlock }: SupplyChainProps) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    location: '',
    status: 'transit' as TrackingEvent['status'],
    temperature: '',
    humidity: '',
    quality: 'A' as TrackingEvent['quality'],
    handler: '',
    notes: ''
  });
  const { toast } = useToast();

  // Generate mock IoT sensor data
  useEffect(() => {
    const interval = setInterval(() => {
      if (trackingEvents.length > 0) {
        const activeEvents = trackingEvents.filter(e => e.status !== 'delivered');
        if (activeEvents.length > 0) {
          // Simulate IoT updates for active shipments
          console.log("IoT sensors monitoring", activeEvents.length, "active shipments");
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [trackingEvents]);

  const addTrackingEvent = () => {
    if (selectedBlock === null || !newEvent.location || !newEvent.handler) {
      toast({
        title: "Missing Information",
        description: "Please select a block and fill in required fields.",
        variant: "destructive"
      });
      return;
    }

    const event: TrackingEvent = {
      id: Math.random().toString(36).substr(2, 9),
      blockIndex: selectedBlock,
      timestamp: new Date().toISOString(),
      location: newEvent.location,
      status: newEvent.status,
      temperature: newEvent.temperature ? parseFloat(newEvent.temperature) : undefined,
      humidity: newEvent.humidity ? parseFloat(newEvent.humidity) : undefined,
      quality: newEvent.quality,
      handler: newEvent.handler,
      notes: newEvent.notes
    };

    setTrackingEvents([...trackingEvents, event]);

    // Add tracking event to blockchain
    const block = blockchain[selectedBlock];
    onAddBlock({
      farmer: event.handler,
      crop: `${block.crop} - Tracking`,
      quantity: block.quantity,
      price: block.price,
      notes: `Supply Chain Event: ${event.status} at ${event.location}. Quality: ${event.quality}. ${event.notes ? `Notes: ${event.notes}` : ''}`
    });

    setNewEvent({
      location: '',
      status: 'transit',
      temperature: '',
      humidity: '',
      quality: 'A',
      handler: '',
      notes: ''
    });

    toast({
      title: "Tracking Event Added",
      description: `${event.status} event recorded for Block #${selectedBlock}`,
    });
  };

  const getStatusColor = (status: TrackingEvent['status']) => {
    switch (status) {
      case 'origin': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'transit': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'storage': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusIcon = (status: TrackingEvent['status']) => {
    switch (status) {
      case 'origin': return <Package className="h-4 w-4" />;
      case 'transit': return <Truck className="h-4 w-4" />;
      case 'storage': return <MapPin className="h-4 w-4" />;
      case 'processing': return <Zap className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getQualityColor = (quality: TrackingEvent['quality']) => {
    switch (quality) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-red-100 text-red-800';
    }
  };

  const getEventsForBlock = (blockIndex: number) => {
    return trackingEvents
      .filter(e => e.blockIndex === blockIndex)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <div className="space-y-6">
      {/* Add Tracking Event */}
      <Card className="shadow-strong border-primary/20">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Supply Chain Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Block Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Product Block</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {blockchain.map((block, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedBlock === index 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedBlock(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Block #{index}</span>
                      <Badge variant="outline">{block.crop}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {block.farmer} • {block.quantity}kg
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Tracking Event</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai Warehouse"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      location: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded-md"
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      status: e.target.value as TrackingEvent['status']
                    })}
                  >
                    <option value="origin">Origin</option>
                    <option value="transit">In Transit</option>
                    <option value="storage">Storage</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="25"
                    value={newEvent.temperature}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      temperature: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    placeholder="60"
                    value={newEvent.humidity}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      humidity: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality Grade</Label>
                  <select
                    id="quality"
                    className="w-full p-2 border rounded-md"
                    value={newEvent.quality}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      quality: e.target.value as TrackingEvent['quality']
                    })}
                  >
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handler">Handler</Label>
                  <Input
                    id="handler"
                    placeholder="Company/Person name"
                    value={newEvent.handler}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      handler: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional information..."
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    notes: e.target.value
                  })}
                />
              </div>

              <Button
                onClick={addTrackingEvent}
                disabled={selectedBlock === null}
                className="w-full"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Add Tracking Event
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Supply Chain Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {blockchain.length === 0 ? (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                No products in the blockchain yet. Add some produce records first.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {blockchain.map((block, blockIndex) => {
                const events = getEventsForBlock(blockIndex);
                return (
                  <div key={blockIndex} className="border-l-4 border-l-primary pl-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary">Block #{blockIndex}</Badge>
                      <span className="font-semibold">{block.crop}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{block.farmer}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{block.quantity}kg</span>
                    </div>

                    {events.length === 0 ? (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          No tracking events recorded for this product.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-3">
                        {events.map((event, eventIndex) => (
                          <Card key={event.id} className="ml-4 border-l-2 border-l-accent">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(event.status)}>
                                    {getStatusIcon(event.status)}
                                    {event.status}
                                  </Badge>
                                  <Badge className={getQualityColor(event.quality)}>
                                    Grade {event.quality}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleString()}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Truck className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.handler}</span>
                                </div>
                                
                                {event.temperature && (
                                  <div className="flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                                    <span>{event.temperature}°C</span>
                                  </div>
                                )}
                                
                                {event.humidity && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">💧</span>
                                    <span>{event.humidity}%</span>
                                  </div>
                                )}
                              </div>

                              {event.notes && (
                                <p className="text-sm text-muted-foreground mt-2 p-2 bg-accent rounded">
                                  {event.notes}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {blockIndex < blockchain.length - 1 && <Separator className="my-6" />}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};