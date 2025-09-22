import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../hooks/useAuth';
import { SunIcon, CloudRainIcon, WindIcon, AlertIcon, ChartIcon, CalendarIcon } from '../components/Icons';
import { AuroraBackground } from '../components/AuroraBackground';
import { MOCK_DATA } from '../lib/mockData';
import CountUp from 'react-countup';

const Index = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const weather = MOCK_DATA.liveWeather;
  const alerts = MOCK_DATA.safetyAlerts;

  const features = [
    {
      icon: ChartIcon,
      title: 'Statistical Analysis',
      description: 'Analyze 30+ years of climate data',
      stat: '30+',
      statLabel: 'Years Data'
    },
    {
      icon: CalendarIcon,
      title: 'Long-term Planning',
      description: 'Plan up to 6+ months in advance',
      stat: '6+',
      statLabel: 'Months Ahead'
    },
    {
      icon: AlertIcon,
      title: 'Activity-Specific Risk',
      description: 'Customized risk weighting for your activity',
      stat: '94%',
      statLabel: 'Confidence'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Provide Your Plan',
      description: 'Enter your desired location, date, and activity type. Use your current location or search anywhere in the world.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description: 'Our engine analyzes 30+ years of historical weather data, applying location-specific thresholds and activity weightings.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      title: 'Receive Actionable Insights',
      description: 'Get a clear risk probability score, factor breakdown, and AI-generated insights to make the best decision.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <AuroraBackground />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                🚀 Climatological Risk Assessment Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                Plan with{' '}
                <span className="gradient-text">Probability</span>
                <br />
                Not Prediction
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              AuraCast analyzes 30+ years of climate data to provide statistical weather risk assessments for your long-term outdoor plans.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={() => navigate(user ? 'predict' : 'register')}
                className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg font-semibold shadow-aurora interactive-hover"
              >
                {user ? 'Start Predicting' : 'Get Started Free'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('about')}
                className="px-8 py-4 text-lg font-semibold border-2 interactive-hover"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
            >
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    <CountUp end={parseInt(feature.stat.replace(/\D/g, ''))} duration={2} delay={0.8} />
                    {feature.stat.replace(/\d/g, '')}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {feature.statLabel}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Live Weather & Alerts Section */}
      <div className="py-20 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Live Weather Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Card className="glass interactive-hover">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <SunIcon className="w-6 h-6 text-yellow-500" />
                    Live Weather Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">{weather.location}</h3>
                        <p className="text-5xl font-extrabold gradient-text">{weather.temperature}</p>
                        <p className="text-lg text-muted-foreground">{weather.condition}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center justify-end gap-2 text-sm">
                          <CloudRainIcon className="w-4 h-4 text-blue-400" />
                          <span>Humidity: {weather.humidity}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-sm">
                          <WindIcon className="w-4 h-4 text-green-400" />
                          <span>Wind: {weather.wind}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-sm">
                          <span>UV Index: {weather.uv}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Pressure</div>
                        <div className="font-semibold">{weather.pressure}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Visibility</div>
                        <div className="font-semibold">{weather.visibility}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Card className="glass interactive-hover">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <AlertIcon className="w-6 h-6 text-amber-500" />
                    Field Health & Safety Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.slice(0, 3).map((alert) => {
                      const severityColors = {
                        High: 'bg-red-500/10 border-red-500/20 text-red-400',
                        Medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                        Low: 'bg-green-500/10 border-green-500/20 text-green-400'
                      };

                      return (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}
                        >
                          <div className="flex items-start gap-3">
                            <AlertIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{alert.type} Alert</span>
                                <Badge variant="secondary" className="text-xs">
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {alert.message}
                              </p>
                              {alert.location && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  📍 {alert.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Revolutionizing Weather Risk Assessment
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Move beyond 7-day forecasts. Our climatological approach provides statistical probability analysis for confident long-term planning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              >
                <Card className="glass interactive-hover h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming decades of climate data into your personal planning tool
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white font-bold text-xl mb-6`}>
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <div className={`w-full h-64 rounded-2xl bg-gradient-to-r ${step.color} opacity-20 flex items-center justify-center`}>
                    <div className="text-6xl font-bold text-white/30">
                      {step.number}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Plan with Confidence?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of planners who trust AuraCast for their outdoor events. Get started with our climatological risk assessment today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate(user ? 'predict' : 'register')}
                className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg font-semibold shadow-aurora interactive-hover"
              >
                {user ? 'Start Analyzing' : 'Sign Up Free'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('community')}
                className="px-8 py-4 text-lg font-semibold border-2 interactive-hover"
              >
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
