import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const DemandPredictor = () => {
  const [crop, setCrop] = useState("");
  const [season, setSeason] = useState("");
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const predictDemand = () => {
    if (!crop || !season) return;

    // Generate mock prediction data
    const seasonNum = parseInt(season);
    const data = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const base = 50 + 30 * Math.sin((month + seasonNum) / 2) + Math.random() * 20;
      return Math.round(Math.max(10, base));
    });

    const newChartData = {
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      datasets: [
        {
          label: `Predicted Demand for ${crop}`,
          data: data,
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
          borderWidth: 3,
          pointBackgroundColor: "hsl(var(--primary))",
          pointBorderColor: "hsl(var(--primary-foreground))",
          pointBorderWidth: 2,
          pointRadius: 6,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    setChartData(newChartData);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "hsl(var(--foreground))",
          font: {
            family: "inherit",
          },
        },
      },
        title: {
          display: true,
          text: "Monthly Demand Forecast",
          color: "hsl(var(--foreground))",
          font: {
            family: "inherit",
            size: 16,
            weight: "bold" as const,
          },
        },
    },
    scales: {
      x: {
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
      y: {
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
    },
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="bg-gradient-growth">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5" />
          AI Demand Predictor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="predictCrop">Crop</Label>
            <Input
              id="predictCrop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g., Wheat, Rice"
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="season">Season (1-12)</Label>
            <Input
              id="season"
              type="number"
              min="1"
              max="12"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              placeholder="Enter month number"
              className="focus-visible:ring-primary"
            />
          </div>

          <Button
            onClick={predictDemand}
            disabled={!crop || !season}
            className="w-full bg-gradient-growth hover:opacity-90 transition-opacity"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Predict Demand
          </Button>
        </div>

        {chartData && (
          <div className="mt-6 bg-card p-4 rounded-lg border">
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};