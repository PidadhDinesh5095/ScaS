import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Droplets, 
  Thermometer, 
  Leaf,
  Bug,
  Beaker,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

const ProjectPreview = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock project data
  const project = {
    id: "1",
    name: "Wheat Cultivation Project 2024",
    location: "Punjab, India",
    area: "15 acres",
    startDate: "2024-01-15",
    endDate: "2024-05-30",
    progress: 75,
    status: "Active",
    cropType: "Wheat",
    variety: "PBW 343",
    soilType: "Alluvial",
    irrigationType: "Drip Irrigation",
    expectedYield: "18 quintals/acre",
    totalInvestment: "₹2,50,000",
    currentSpent: "₹1,87,500"
  };

  const milestones = [
    { phase: "Land Preparation", progress: 100, status: "completed", date: "2024-01-15" },
    { phase: "Sowing", progress: 100, status: "completed", date: "2024-02-01" },
    { phase: "First Irrigation", progress: 100, status: "completed", date: "2024-02-15" },
    { phase: "Fertilizer Application", progress: 75, status: "active", date: "2024-03-01" },
    { phase: "Pest Control", progress: 50, status: "pending", date: "2024-03-15" },
    { phase: "Harvesting", progress: 0, status: "upcoming", date: "2024-05-15" }
  ];

  const analyses = [
    {
      type: "Soil Analysis",
      icon: <Beaker className="h-5 w-5" />,
      status: "Good",
      details: "pH: 7.2, Nitrogen: High, Phosphorus: Medium, Potassium: High",
      recommendation: "Apply balanced NPK fertilizer"
    },
    {
      type: "Disease Detection",
      icon: <Bug className="h-5 w-5" />,
      status: "Low Risk",
      details: "No major disease detected, minor aphid presence",
      recommendation: "Continue monitoring, apply neem oil if needed"
    },
    {
      type: "Weather Analysis",
      icon: <Thermometer className="h-5 w-5" />,
      status: "Favorable",
      details: "Temperature: 22-28°C, Humidity: 65%, Expected rainfall: 15mm",
      recommendation: "Optimal conditions for growth"
    },
    {
      type: "Market Prices",
      icon: <DollarSign className="h-5 w-5" />,
      status: "Good",
      details: "Current price: ₹2,150/quintal, 30-day avg: ₹2,050/quintal",
      recommendation: "Good time to plan for harvest sales"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "active":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "active":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 to-accent/10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <Card className="shadow-large">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-primary mb-2">
                    {project.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.startDate} to {project.endDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {project.area}
                    </div>
                  </div>
                </div>
                <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Project Progress</div>
                  <Progress value={project.progress} className="h-3" />
                  <div className="text-sm text-muted-foreground">{project.progress}% Complete</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Expected Yield</div>
                  <div className="text-lg font-semibold text-success">{project.expectedYield}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Investment Status</div>
                  <div className="text-lg font-semibold">
                    {project.currentSpent} / {project.totalInvestment}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-card rounded-lg p-1 shadow-soft">
            {[
              { key: "overview", label: "Overview" },
              { key: "timeline", label: "Timeline" },
              { key: "analysis", label: "Analysis" },
              { key: "recommendations", label: "Recommendations" }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-success" />
                  Crop Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{project.cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variety:</span>
                  <span className="font-medium">{project.variety}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soil Type:</span>
                  <span className="font-medium">{project.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Irrigation:</span>
                  <span className="font-medium">{project.irrigationType}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-warning" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget:</span>
                  <span className="font-medium">{project.totalInvestment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spent:</span>
                  <span className="font-medium">{project.currentSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-medium text-success">₹62,500</span>
                </div>
                <Progress value={75} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Yield:</span>
                  <span className="font-medium">{project.expectedYield}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Area:</span>
                  <span className="font-medium">{project.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harvest Date:</span>
                  <span className="font-medium">{project.endDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "timeline" && (
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline & Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    {getStatusIcon(milestone.status)}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{milestone.phase}</h4>
                        <Badge variant={getStatusColor(milestone.status)}>
                          {milestone.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Progress value={milestone.progress} className="flex-1 max-w-xs" />
                        <span className="text-sm text-muted-foreground ml-4">
                          {milestone.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "analysis" && (
          <div className="grid md:grid-cols-2 gap-6">
            {analyses.map((analysis, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {analysis.icon}
                    {analysis.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={analysis.status === "Good" || analysis.status === "Favorable" || analysis.status === "Low Risk" ? "default" : "destructive"}>
                      {analysis.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Details:</span>
                    <p className="text-sm text-muted-foreground mt-1">{analysis.details}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Recommendation:</span>
                    <p className="text-sm text-accent mt-1">{analysis.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <h4 className="font-medium text-success mb-2">Immediate Actions</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Apply balanced NPK fertilizer (19:19:19) @ 50kg/acre</li>
                    <li>• Monitor for aphid infestation and apply neem oil if needed</li>
                    <li>• Schedule irrigation for next week based on weather forecast</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <h4 className="font-medium text-warning mb-2">Weekly Planning</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Conduct soil moisture test</li>
                    <li>• Check for disease symptoms on leaves</li>
                    <li>• Plan for second fertilizer application</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <h4 className="font-medium text-accent mb-2">Market Insights</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Current wheat prices trending upward (+5% this month)</li>
                   
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};


export default ProjectPreview;
