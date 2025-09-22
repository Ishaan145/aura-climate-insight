import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { SunIcon, CloudRainIcon, WindIcon, SnowIcon, AlertIcon, LocationIcon } from '../components/Icons';
import { MOCK_DATA, getRiskColor, getRiskLevel, calculateActivityRisk } from '../lib/mockData';
import { AuroraBackground } from '../components/AuroraBackground';
import CountUp from 'react-countup';

interface PredictionResult {
  type: 'single' | 'nearby' | 'travel';
  data: any;
  loading?: boolean;
}

const PredictPage = () => {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [activeMode, setActiveMode] = useState<'single' | 'nearby' | 'travel'>('single');
  const [location, setLocation] = useState('New Delhi, India');
  const [date, setDate] = useState('2024-12-15');
  const [activity, setActivity] = useState('hiking');
  const [startLocation, setStartLocation] = useState('New Delhi, India');
  const [endLocation, setEndLocation] = useState('Tokyo, Japan');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuroraBackground />
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-8">Please log in to access the Prediction tool.</p>
          <Button onClick={() => navigate('login')} className="bg-gradient-primary">
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Load initial prediction
  useEffect(() => {
    handlePrediction();
  }, []);

  const handlePrediction = async () => {
    setIsLoading(true);
    setPrediction(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let result: PredictionResult;

    if (activeMode === 'single' || activeMode === 'nearby') {
      const locationKey = location.split(' (')[0];
      const baseData = MOCK_DATA.weatherData[locationKey as keyof typeof MOCK_DATA.weatherData] || 
                      MOCK_DATA.weatherData["New Delhi, India"];
      
      // Apply activity-specific risk weighting
      const activityProfile = MOCK_DATA.activityProfiles[activity as keyof typeof MOCK_DATA.activityProfiles];
      const adjustedRisk = calculateActivityRisk(baseData.factors, activityProfile.weights);
      
      result = {
        type: activeMode,
        data: {
          ...baseData,
          overall: adjustedRisk,
          activity: activityProfile.name,
          activityDescription: activityProfile.description
        }
      };
    } else {
      // Travel mode
      const routeKey = `${startLocation} to ${endLocation}`;
      result = {
        type: 'travel',
        data: MOCK_DATA.travelRoutes[routeKey as keyof typeof MOCK_DATA.travelRoutes] || 
              MOCK_DATA.travelRoutes["New Delhi, India to Tokyo, Japan"]
      };
    }

    setPrediction(result);
    setIsLoading(false);
  };

  const handleLocationDetection = async () => {
    setIsLoading(true);
    // Simulate geolocation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLocation('New Delhi, India (28.7041, 77.1025)');
    setIsLoading(false);
  };

  const weatherIcons = {
    hot: SunIcon,
    cold: SnowIcon,
    windy: WindIcon,
    wet: CloudRainIcon
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <AuroraBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Climatological Risk Prediction
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analyze historical weather patterns to assess risk probability for your outdoor plans
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Risk Analysis Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="single">Single</TabsTrigger>
                    <TabsTrigger value="nearby">Nearby</TabsTrigger>
                    <TabsTrigger value="travel">Travel</TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <div className="relative">
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location..."
                            className="pr-24"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleLocationDetection}
                            disabled={isLoading}
                            className="absolute right-1 top-1 bottom-1 text-xs"
                          >
                            <LocationIcon className="w-3 h-3 mr-1" />
                            Detect
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Target Date</label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Activity Type</label>
                        <Select value={activity} onValueChange={setActivity}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MOCK_DATA.activityProfiles).map(([key, profile]) => (
                              <SelectItem key={key} value={key}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          {MOCK_DATA.activityProfiles[activity as keyof typeof MOCK_DATA.activityProfiles]?.description}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="nearby" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Center Location</label>
                        <div className="relative">
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter center location..."
                            className="pr-24"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleLocationDetection}
                            disabled={isLoading}
                            className="absolute right-1 top-1 bottom-1 text-xs"
                          >
                            <LocationIcon className="w-3 h-3 mr-1" />
                            Detect
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Scan Radius</label>
                        <Select defaultValue="50">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25 km</SelectItem>
                            <SelectItem value="50">50 km</SelectItem>
                            <SelectItem value="100">100 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Activity Type</label>
                        <Select value={activity} onValueChange={setActivity}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MOCK_DATA.activityProfiles).map(([key, profile]) => (
                              <SelectItem key={key} value={key}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="travel" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Location</label>
                        <Input
                          value={startLocation}
                          onChange={(e) => setStartLocation(e.target.value)}
                          placeholder="Starting point..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">End Location</label>
                        <Input
                          value={endLocation}
                          onChange={(e) => setEndLocation(e.target.value)}
                          placeholder="Destination..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Travel Date</label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={handlePrediction}
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-primary hover:opacity-90 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    `${activeMode === 'single' ? 'Predict Risk' : activeMode === 'nearby' ? 'Scan Area' : 'Analyze Route'}`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Risk Result */}
            <AnimatePresence>
              {prediction && prediction.type === 'single' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>Risk Assessment</span>
                        <Badge variant="secondary">
                          {prediction.data.confidence}% Confidence
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Overall Risk */}
                      <div className={`p-6 rounded-xl ${getRiskColor(prediction.data.overall)} text-white text-center`}>
                        <h3 className="text-lg font-bold mb-2">Overall Risk</h3>
                        <div className="text-4xl font-extrabold mb-1">
                          <CountUp end={prediction.data.overall} duration={1.5} />%
                        </div>
                        <p className="text-sm opacity-90 capitalize">
                          {getRiskLevel(prediction.data.overall)} Risk Level
                        </p>
                      </div>

                      {/* Activity Info */}
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <h4 className="font-semibold text-sm text-muted-foreground">Optimized for</h4>
                        <p className="font-bold">{prediction.data.activity}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {prediction.data.activityDescription}
                        </p>
                      </div>

                      {/* Factor Breakdown */}
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(prediction.data.factors).map(([factor, value]) => {
                          const Icon = weatherIcons[factor as keyof typeof weatherIcons];
                          return (
                            <div key={factor} className="text-center p-3 bg-card rounded-lg border">
                              <Icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                              <div className="text-xs font-medium capitalize mb-1">{factor}</div>
                              <div className="text-lg font-bold">
                                <CountUp end={value as number} duration={1} />%
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Climate Trend */}
                      {prediction.data.trend && (
                        <div className="p-4 bg-muted/10 rounded-lg">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            📈 Climate Trend
                            <Badge variant="outline" className="text-xs">
                              {Math.round(prediction.data.trend.significance * 100)}% significance
                            </Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {prediction.data.trend.change}
                          </p>
                        </div>
                      )}

                      {/* AI Insight */}
                      <div className="p-4 border border-border/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm mb-2">AI-Generated Insight</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {prediction.data.insight}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-2">
            <Card className="glass h-[600px] relative overflow-hidden">
              <CardContent className="p-0 h-full">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-lg font-semibold">Analyzing Climate Data...</p>
                      <p className="text-sm text-muted-foreground">Processing 30+ years of weather patterns</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-primary/20 flex items-center justify-center mx-auto mb-6">
                        <LocationIcon className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Interactive Map Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md">
                        Advanced geospatial visualization with risk heat maps, nearby location analysis, and travel route planning.
                      </p>
                      
                      {prediction && prediction.type === 'nearby' && (
                        <div className="mt-8 space-y-3">
                          <h4 className="font-semibold">Nearby Locations Risk Analysis</h4>
                          {prediction.data.nearby?.map((location: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg text-sm">
                              <span>{location.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{location.risk}%</span>
                                <div className={`w-3 h-3 rounded-full ${getRiskColor(location.risk).replace('bg-gradient-', 'bg-')}-500`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {prediction && prediction.type === 'travel' && (
                        <div className="mt-8 space-y-3">
                          <h4 className="font-semibold">Travel Route Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Total Distance:</span>
                              <span className="font-semibold">{prediction.data.totalDistance}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Estimated Time:</span>
                              <span className="font-semibold">{prediction.data.estimatedTime}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Average Risk:</span>
                              <span className="font-semibold">{prediction.data.averageRisk}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictPage;