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
import { LocationIcon, RouteIcon, ScanIcon, SunIcon, CloudRainIcon, WindIcon, SnowIcon, AlertIcon } from '../components/Icons';
import { MOCK_DATA, calculateActivityRisk, getRiskColor, getRiskLevel } from '../lib/mockData';
import { AuroraBackground } from '../components/AuroraBackground';
import { LocationInput } from '../components/LocationInput';
import { InteractiveMap } from '../components/InteractiveMap';
import { RiskAnalyzer } from '../components/RiskAnalyzer';
import CountUp from 'react-countup';

interface LocationData {
  name: string;
  coords: [number, number];
  risk: number;
  weather?: {
    temp: string;
    condition: string;
    humidity: string;
    wind: string;
  };
}

interface PredictionResult {
  type: 'single' | 'nearby' | 'travel';
  data: any;
  locations: LocationData[];
  travelRoute?: [number, number][];
}

const PredictPage = () => {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [activeMode, setActiveMode] = useState<'single' | 'nearby' | 'travel'>('single');
  const [location, setLocation] = useState('New Delhi, India');
  const [locationCoords, setLocationCoords] = useState<[number, number]>([28.7041, 77.1025]);
  const [date, setDate] = useState('2025-01-15');
  const [activity, setActivity] = useState('hiking');
  const [startLocation, setStartLocation] = useState('New Delhi, India');
  const [startCoords, setStartCoords] = useState<[number, number]>([28.7041, 77.1025]);
  const [endLocation, setEndLocation] = useState('Tokyo, Japan');
  const [endCoords, setEndCoords] = useState<[number, number]>([35.6762, 139.6503]);
  const [scanRadius, setScanRadius] = useState('50');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationDetecting, setIsLocationDetecting] = useState(false);

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

    // Simulate API call delay with realistic processing steps
    await new Promise(resolve => setTimeout(resolve, 2000));

    let result: PredictionResult;

    if (activeMode === 'single') {
      const locationKey = location.split(' (')[0];
      const baseData = MOCK_DATA.weatherData[locationKey as keyof typeof MOCK_DATA.weatherData] || 
                      MOCK_DATA.weatherData["New Delhi, India"];
      
      const activityProfile = MOCK_DATA.activityProfiles[activity as keyof typeof MOCK_DATA.activityProfiles];
      const adjustedRisk = calculateActivityRisk(baseData.factors, activityProfile.weights);
      
      result = {
        type: 'single',
        data: {
          ...baseData,
          overall: adjustedRisk,
          activity: activityProfile.name,
          activityDescription: activityProfile.description,
          recommendations: [
            `Best time window: ${adjustedRisk < 40 ? 'Early morning (6-10 AM)' : 'Late afternoon (4-6 PM)'}`,
            `Activity duration: Limit to ${adjustedRisk > 70 ? '2 hours' : adjustedRisk > 40 ? '4 hours' : '6+ hours'}`,
            `Weather monitoring: Check conditions ${adjustedRisk > 60 ? 'hourly' : 'every 3 hours'}`
          ],
          historicalAverage: Math.max(10, adjustedRisk - Math.floor(Math.random() * 20))
        },
        locations: [{
          name: locationKey,
          coords: locationCoords,
          risk: adjustedRisk,
          weather: {
            temp: `${Math.floor(Math.random() * 15) + 20}°C`,
            condition: baseData.factors.wet > 60 ? 'Rainy' : baseData.factors.hot > 70 ? 'Hot' : 'Clear',
            humidity: `${Math.floor(Math.random() * 30) + 50}%`,
            wind: `${Math.floor(Math.random() * 20) + 5} km/h`
          }
        }]
      };
    } else if (activeMode === 'nearby') {
      const locationKey = location.split(' (')[0];
      const baseData = MOCK_DATA.weatherData[locationKey as keyof typeof MOCK_DATA.weatherData] || 
                      MOCK_DATA.weatherData["New Delhi, India"];
      
      const activityProfile = MOCK_DATA.activityProfiles[activity as keyof typeof MOCK_DATA.activityProfiles];
      const centerRisk = calculateActivityRisk(baseData.factors, activityProfile.weights);
      
      // Generate nearby locations with varied risks
      const nearbyLocations: LocationData[] = [
        {
          name: locationKey,
          coords: locationCoords,
          risk: centerRisk,
          weather: {
            temp: `${Math.floor(Math.random() * 15) + 20}°C`,
            condition: 'Clear',
            humidity: `${Math.floor(Math.random() * 30) + 50}%`,
            wind: `${Math.floor(Math.random() * 20) + 5} km/h`
          }
        }
      ];

      // Add surrounding locations
      const radiusKm = parseInt(scanRadius);
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * (Math.PI / 180);
        const offsetLat = (radiusKm / 111) * Math.cos(angle);
        const offsetLng = (radiusKm / (111 * Math.cos(locationCoords[0] * Math.PI / 180))) * Math.sin(angle);
        
        nearbyLocations.push({
          name: `Area ${i + 1}`,
          coords: [locationCoords[0] + offsetLat, locationCoords[1] + offsetLng],
          risk: Math.max(5, Math.min(95, centerRisk + (Math.random() - 0.5) * 40)),
          weather: {
            temp: `${Math.floor(Math.random() * 10) + 22}°C`,
            condition: Math.random() > 0.7 ? 'Cloudy' : 'Clear',
            humidity: `${Math.floor(Math.random() * 20) + 55}%`,
            wind: `${Math.floor(Math.random() * 15) + 8} km/h`
          }
        });
      }

      result = {
        type: 'nearby',
        data: {
          ...baseData,
          overall: centerRisk,
          activity: activityProfile.name,
          activityDescription: activityProfile.description,
          scanRadius: radiusKm
        },
        locations: nearbyLocations
      };
    } else {
      // Travel mode
      const routeKey = `${startLocation.split(' (')[0]} to ${endLocation.split(' (')[0]}`;
      const travelData = MOCK_DATA.travelRoutes[routeKey as keyof typeof MOCK_DATA.travelRoutes] || 
                        MOCK_DATA.travelRoutes["New Delhi, India to Tokyo, Japan"];
      
      const waypoints: LocationData[] = [
        {
          name: `Start: ${startLocation.split(' (')[0]}`,
          coords: startCoords,
          risk: 65,
          weather: { temp: '28°C', condition: 'Clear', humidity: '68%', wind: '12 km/h' }
        },
        {
          name: `End: ${endLocation.split(' (')[0]}`,
          coords: endCoords,
          risk: 45,
          weather: { temp: '22°C', condition: 'Partly Cloudy', humidity: '72%', wind: '18 km/h' }
        }
      ];

      result = {
        type: 'travel',
        data: {
          ...travelData,
          startLocation: startLocation.split(' (')[0],
          endLocation: endLocation.split(' (')[0],
          totalDistance: '6,200 km',
          estimatedTime: '8h 45m flight',
          averageRisk: 55
        },
        locations: waypoints,
        travelRoute: [startCoords, endCoords]
      };
    }

    setPrediction(result);
    setIsLoading(false);
  };

  const handleLocationDetection = async () => {
    setIsLocationDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setLocation(locationString);
          setLocationCoords([latitude, longitude]);
          setIsLocationDetecting(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default location
          setLocation('New Delhi, India (28.7041, 77.1025)');
          setLocationCoords([28.7041, 77.1025]);
          setIsLocationDetecting(false);
        }
      );
    } else {
      // Simulate geolocation for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLocation('New Delhi, India (28.7041, 77.1025)');
      setLocationCoords([28.7041, 77.1025]);
      setIsLocationDetecting(false);
    }
  };

  const handleLocationChange = (value: string, coords?: [number, number]) => {
    if (activeMode === 'travel') {
      // Handle travel mode location changes separately
      return;
    }
    setLocation(value);
    if (coords) {
      setLocationCoords(coords);
    }
  };

  const handleStartLocationChange = (value: string, coords?: [number, number]) => {
    setStartLocation(value);
    if (coords) {
      setStartCoords(coords);
    }
  };

  const handleEndLocationChange = (value: string, coords?: [number, number]) => {
    setEndLocation(value);
    if (coords) {
      setEndCoords(coords);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'single': return LocationIcon;
      case 'nearby': return ScanIcon;
      case 'travel': return RouteIcon;
      default: return LocationIcon;
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'single': return 'Analyze risk for a specific location and activity';
      case 'nearby': return 'Compare risks across nearby locations within a radius';
      case 'travel': return 'Assess weather risks along your travel route';
      default: return '';
    }
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
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            🌍 Advanced Climate Intelligence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Climatological Risk Prediction
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Harness 30+ years of historical weather data with AI-powered risk analysis for confident outdoor planning
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {React.createElement(getModeIcon(activeMode), { className: "w-4 h-4 text-primary" })}
                  </div>
                  Risk Analysis Mode
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {getModeDescription(activeMode)}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 h-12">
                    <TabsTrigger value="single" className="flex items-center gap-2">
                      <LocationIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Single</span>
                    </TabsTrigger>
                    <TabsTrigger value="nearby" className="flex items-center gap-2">
                      <ScanIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Nearby</span>
                    </TabsTrigger>
                    <TabsTrigger value="travel" className="flex items-center gap-2">
                      <RouteIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Travel</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="space-y-6 mt-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">📍 Target Location</label>
                        <LocationInput
                          value={location}
                          onChange={handleLocationChange}
                          placeholder="Search for any location worldwide..."
                          onLocationDetect={handleLocationDetection}
                          isDetecting={isLocationDetecting}
                          showCoordinates={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">📅 Target Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          max={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 6 months ahead
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-muted-foreground">
                          Select any date up to 6 months in advance
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">🎯 Activity Type</label>
                        <Select value={activity} onValueChange={setActivity}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MOCK_DATA.activityProfiles).map(([key, profile]) => (
                              <SelectItem key={key} value={key} className="py-3">
                                <div className="flex items-center gap-3">
                                  <SunIcon className="w-5 h-5 text-primary" />
                                  <div>
                                    <div className="font-medium">{profile.name}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-48">
                                      {profile.description}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="p-3 bg-accent/10 rounded-lg">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <strong>Selected:</strong> {MOCK_DATA.activityProfiles[activity as keyof typeof MOCK_DATA.activityProfiles]?.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
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
                        {Object.entries(prediction.data.factors).map(([factor, value]) => (
                            <div key={factor} className="text-center p-3 bg-card rounded-lg border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 mb-2">
                        {factor === 'hot' && <SunIcon className="w-5 h-5 text-orange-500" />}
                        {factor === 'cold' && <SnowIcon className="w-5 h-5 text-blue-500" />}
                        {factor === 'windy' && <WindIcon className="w-5 h-5 text-cyan-500" />}
                        {factor === 'wet' && <CloudRainIcon className="w-5 h-5 text-blue-600" />}
                      </div>
                              <div className="text-xs font-medium capitalize mb-1">{factor}</div>
                              <div className="text-lg font-bold">
                                <CountUp end={value as number} duration={1} />%
                              </div>
                            </div>
                          ))}
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