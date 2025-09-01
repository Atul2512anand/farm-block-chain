import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Download, TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";
import { Block } from "@/types/blockchain";

interface AnalyticsProps {
  blockchain: Block[];
}

export const BlockchainAnalytics = ({ blockchain }: AnalyticsProps) => {
  // Process blockchain data for analytics
  const cropData = blockchain.reduce((acc, block) => {
    const crop = block.crop;
    if (!acc[crop]) {
      acc[crop] = {
        name: crop,
        quantity: 0,
        value: 0,
        blocks: 0,
        avgPrice: 0,
      };
    }
    acc[crop].quantity += parseInt(block.quantity) || 0;
    acc[crop].value += (parseInt(block.quantity) || 0) * (parseFloat(block.price) || 0);
    acc[crop].blocks += 1;
    return acc;
  }, {} as Record<string, any>);

  const cropArray = Object.values(cropData).map((crop: any) => ({
    ...crop,
    avgPrice: crop.quantity > 0 ? (crop.value / crop.quantity).toFixed(2) : 0,
  }));

  // Time series data
  const timeSeriesData = blockchain.map((block, index) => ({
    blockIndex: index,
    quantity: parseInt(block.quantity) || 0,
    price: parseFloat(block.price) || 0,
    value: (parseInt(block.quantity) || 0) * (parseFloat(block.price) || 0),
    timestamp: new Date(block.timestamp).toLocaleDateString(),
  }));

  // Farmer performance data
  const farmerData = blockchain.reduce((acc, block) => {
    const farmer = block.farmer;
    if (!acc[farmer]) {
      acc[farmer] = {
        name: farmer,
        totalQuantity: 0,
        totalValue: 0,
        transactions: 0,
      };
    }
    acc[farmer].totalQuantity += parseInt(block.quantity) || 0;
    acc[farmer].totalValue += (parseInt(block.quantity) || 0) * (parseFloat(block.price) || 0);
    acc[farmer].transactions += 1;
    return acc;
  }, {} as Record<string, any>);

  const farmerArray = Object.values(farmerData);

  const COLORS = ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7'];

  const exportAnalytics = () => {
    const analyticsData = {
      summary: {
        totalBlocks: blockchain.length,
        totalQuantity: cropArray.reduce((sum, crop) => sum + crop.quantity, 0),
        totalValue: cropArray.reduce((sum, crop) => sum + crop.value, 0),
        uniqueCrops: cropArray.length,
        uniqueFarmers: farmerArray.length,
      },
      cropAnalytics: cropArray,
      farmerAnalytics: farmerArray,
      timeSeriesData,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrichain-analytics.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csvData = [
      ["Block Index", "Farmer", "Crop", "Quantity (kg)", "Price (₹/kg)", "Total Value (₹)", "Timestamp"],
      ...blockchain.map((block, index) => [
        index,
        block.farmer,
        block.crop,
        block.quantity,
        block.price,
        (parseInt(block.quantity) || 0) * (parseFloat(block.price) || 0),
        block.timestamp,
      ]),
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrichain-data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (blockchain.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Blockchain Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available. Add some blocks to see analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{blockchain.length}</div>
            <p className="text-sm opacity-90">Total Blocks</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-growth">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {cropArray.reduce((sum, crop) => sum + crop.quantity, 0)}
            </div>
            <p className="text-sm text-foreground/80">Total Quantity (kg)</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-earth">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ₹{cropArray.reduce((sum, crop) => sum + crop.value, 0).toLocaleString()}
            </div>
            <p className="text-sm text-foreground/80">Total Value</p>
          </CardContent>
        </Card>
        
        <Card className="border-primary border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{cropArray.length}</div>
            <p className="text-sm text-muted-foreground">Unique Crops</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Export
            </span>
            <div className="flex gap-2">
              <Button onClick={exportAnalytics} variant="outline" size="sm">
                Export Analytics (JSON)
              </Button>
              <Button onClick={exportCSV} variant="outline" size="sm">
                Export Data (CSV)
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Crop Quantity Distribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Crop Quantity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'quantity' ? `${value} kg` : `₹${value}`,
                    name === 'quantity' ? 'Quantity' : 'Avg Price'
                  ]}
                />
                <Bar dataKey="quantity" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop Value Pie Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Value Distribution by Crop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropArray}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cropArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transaction Timeline */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Transaction Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="blockIndex" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'quantity' ? `${value} kg` : 
                    name === 'price' ? `₹${value}/kg` : 
                    `₹${value.toLocaleString()}`,
                    name === 'quantity' ? 'Quantity' : 
                    name === 'price' ? 'Price' : 'Total Value'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                />
                <Line type="monotone" dataKey="quantity" stroke="hsl(var(--primary-glow))" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Farmer Performance */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Farmer Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={farmerArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'totalQuantity' ? `${value} kg` : 
                    name === 'totalValue' ? `₹${value.toLocaleString()}` : 
                    `${value} transactions`,
                    name === 'totalQuantity' ? 'Total Quantity' : 
                    name === 'totalValue' ? 'Total Value' : 'Transactions'
                  ]}
                />
                <Bar dataKey="totalQuantity" fill="hsl(var(--primary))" />
                <Bar dataKey="totalValue" fill="hsl(var(--primary-glow))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};