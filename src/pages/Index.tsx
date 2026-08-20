import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar, AlertCircle, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BiasData {
  pair: string;
  shortTermBias: 'LONG' | 'SHORT' | 'NEUTRAL';
  shortTermStrength: number;
  longTermBias: 'LONG' | 'SHORT' | 'NEUTRAL';
  longTermStrength: number;
  keyFactors: string[];
  nextEvents: string[];
  timestamp: string;
}

interface BiasHistory {
  date: string;
  EURCAD: 'LONG' | 'SHORT' | 'NEUTRAL';
  USDCAD: 'LONG' | 'SHORT' | 'NEUTRAL';
  EURUSD: 'LONG' | 'SHORT' | 'NEUTRAL';
  USDCHF: 'LONG' | 'SHORT' | 'NEUTRAL';
}

// Sample data - in production this would come from forexfactory.com
const sampleBiasData: BiasData[] = [
  {
    pair: 'EURCAD',
    shortTermBias: 'LONG',
    shortTermStrength: 7,
    longTermBias: 'LONG',
    longTermStrength: 6,
    keyFactors: [
      'EUR: ECB hawkish stance',
      'CAD: Oil prices weakness',
      'Diverging monetary policy',
      'EU inflation resilient'
    ],
    nextEvents: [
      'ECB Decision - Thu 21:45',
      'Canada Employment - Fri 12:30',
      'EU Retail Sales - Fri 10:00'
    ],
    timestamp: new Date().toISOString()
  },
  {
    pair: 'USDCAD',
    shortTermBias: 'SHORT',
    shortTermStrength: 6,
    longTermBias: 'NEUTRAL',
    longTermStrength: 4,
    keyFactors: [
      'USD: Fed rate cut expectations',
      'CAD: Oil recovery potential',
      'BoC holding rates steady',
      'Risk sentiment improving'
    ],
    nextEvents: [
      'Fed Meeting Minutes - Wed 18:00',
      'Canada CPI - Thu 12:30',
      'US Jobless Claims - Thu 12:30'
    ],
    timestamp: new Date().toISOString()
  },
  {
    pair: 'EURUSD',
    shortTermBias: 'LONG',
    shortTermStrength: 8,
    longTermBias: 'LONG',
    longTermStrength: 7,
    keyFactors: [
      'EUR: Strong fundamentals',
      'USD: Weakening on rate cuts',
      'EU growth outperforming',
      'Safe haven demand low'
    ],
    nextEvents: [
      'ECB Interest Rate Decision - Thu 13:15',
      'US CPI - Wed 12:30',
      'US GDP Preliminary - Thu 12:30'
    ],
    timestamp: new Date().toISOString()
  },
  {
    pair: 'USDCHF',
    shortTermBias: 'SHORT',
    shortTermStrength: 7,
    longTermBias: 'SHORT',
    longTermStrength: 6,
    keyFactors: [
      'USD: Rate cut cycle ongoing',
      'CHF: Safe haven flows',
      'SNB maintaining stance',
      'Risk-off environment'
    ],
    nextEvents: [
      'SNB Decision - Thu 09:15',
      'US Treasury Yields declining',
      'VIX volatility index rising'
    ],
    timestamp: new Date().toISOString()
  }
];

// Sample history data
const sampleHistory: BiasHistory[] = [
  {
    date: '2024-08-20',
    EURCAD: 'LONG',
    USDCAD: 'SHORT',
    EURUSD: 'LONG',
    USDCHF: 'SHORT'
  },
  {
    date: '2024-08-19',
    EURCAD: 'LONG',
    USDCAD: 'NEUTRAL',
    EURUSD: 'LONG',
    USDCHF: 'SHORT'
  },
  {
    date: '2024-08-16',
    EURCAD: 'NEUTRAL',
    USDCAD: 'SHORT',
    EURUSD: 'LONG',
    USDCHF: 'SHORT'
  },
  {
    date: '2024-08-15',
    EURCAD: 'LONG',
    USDCAD: 'SHORT',
    EURUSD: 'NEUTRAL',
    USDCHF: 'SHORT'
  },
  {
    date: '2024-08-14',
    EURCAD: 'LONG',
    USDCAD: 'NEUTRAL',
    EURUSD: 'LONG',
    USDCHF: 'NEUTRAL'
  }
];

const BiasIndicator = ({ bias, strength }: { bias: 'LONG' | 'SHORT' | 'NEUTRAL'; strength: number }) => {
  const getColor = () => {
    if (bias === 'LONG') return 'text-green-600 bg-green-50 border-green-200';
    if (bias === 'SHORT') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const Icon = bias === 'LONG' ? TrendingUp : bias === 'SHORT' ? TrendingDown : Minus;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getColor()}`}>
      <Icon className="w-5 h-5" />
      <div>
        <div className="font-semibold text-sm">{bias}</div>
        <div className="text-xs opacity-75">Strength: {strength}/10</div>
      </div>
    </div>
  );
};

const StrengthBar = ({ strength }: { strength: number }) => {
  const percentage = (strength / 10) * 100;
  const color = strength >= 7 ? 'bg-green-500' : strength >= 5 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

export default function Index() {
  const [biasData] = useState<BiasData[]>(sampleBiasData);
  const [historyData] = useState<BiasHistory[]>(sampleHistory);
  const [selectedPair, setSelectedPair] = useState<string>('EURCAD');

  const currentBias = biasData.find(b => b.pair === selectedPair);

  // Transform history data for chart
  const chartData = historyData.map(h => ({
    date: h.date,
    EURCAD: h.EURCAD === 'LONG' ? 1 : h.EURCAD === 'SHORT' ? -1 : 0,
    USDCAD: h.USDCAD === 'LONG' ? 1 : h.USDCAD === 'SHORT' ? -1 : 0,
    EURUSD: h.EURUSD === 'LONG' ? 1 : h.EURUSD === 'SHORT' ? -1 : 0,
    USDCHF: h.USDCHF === 'LONG' ? 1 : h.USDCHF === 'SHORT' ? -1 : 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Forex Fundamental Bias</h1>
          <p className="text-slate-600">Daily directional analysis based on fundamental factors</p>
          <p className="text-sm text-slate-500 mt-2">Last updated: {new Date().toLocaleString()}</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full max-w-md">
            <TabsTrigger value="today">Today's Bias</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Today's Bias Tab */}
          <TabsContent value="today" className="space-y-6">
            {/* Pair Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {biasData.map(bias => (
                <button
                  key={bias.pair}
                  onClick={() => setSelectedPair(bias.pair)}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    selectedPair === bias.pair
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {bias.pair}
                </button>
              ))}
            </div>

            {/* Selected Pair Details */}
            {currentBias && (
              <div className="space-y-6">
                {/* Bias Overview */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="text-2xl">{currentBias.pair}</CardTitle>
                    <CardDescription>Fundamental Analysis & Directional Bias</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Short Term */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-slate-900">Short Term (1-3 days)</h3>
                        <BiasIndicator bias={currentBias.shortTermBias} strength={currentBias.shortTermStrength} />
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600 font-medium">Strength Indicator</p>
                          <StrengthBar strength={currentBias.shortTermStrength} />
                        </div>
                      </div>

                      {/* Long Term */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-slate-900">Long Term (2-4 weeks)</h3>
                        <BiasIndicator bias={currentBias.longTermBias} strength={currentBias.longTermStrength} />
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600 font-medium">Strength Indicator</p>
                          <StrengthBar strength={currentBias.longTermStrength} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Fundamental Factors */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Key Fundamental Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentBias.keyFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                          <p className="text-sm text-slate-700">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Upcoming Economic Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentBias.nextEvents.map((event, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-amber-600 flex-shrink-0" />
                          <p className="text-sm text-slate-700">{event}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* All Pairs Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>All Pairs Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {biasData.map(bias => (
                    <div key={bias.pair} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="font-semibold text-slate-900 w-20">{bias.pair}</div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">ST:</span>
                          <BiasIndicator bias={bias.shortTermBias} strength={bias.shortTermStrength} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">LT:</span>
                          <BiasIndicator bias={bias.longTermBias} strength={bias.longTermStrength} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Bias History (Last 5 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Bias Timeline Chart */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-slate-700 mb-4">Bias Trend Chart</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[-1.5, 1.5]} />
                        <Tooltip 
                          formatter={(value) => value === 1 ? 'LONG' : value === -1 ? 'SHORT' : 'NEUTRAL'}
                        />
                        <Line type="monotone" dataKey="EURCAD" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="USDCAD" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="EURUSD" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="USDCHF" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* History Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left p-3 font-semibold text-slate-700">Date</th>
                          <th className="text-center p-3 font-semibold text-slate-700">EURCAD</th>
                          <th className="text-center p-3 font-semibold text-slate-700">USDCAD</th>
                          <th className="text-center p-3 font-semibold text-slate-700">EURUSD</th>
                          <th className="text-center p-3 font-semibold text-slate-700">USDCHF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-3 text-slate-900 font-medium">{row.date}</td>
                            <td className="text-center p-3">
                              <Badge variant={row.EURCAD === 'LONG' ? 'default' : row.EURCAD === 'SHORT' ? 'destructive' : 'secondary'}>
                                {row.EURCAD}
                              </Badge>
                            </td>
                            <td className="text-center p-3">
                              <Badge variant={row.USDCAD === 'LONG' ? 'default' : row.USDCAD === 'SHORT' ? 'destructive' : 'secondary'}>
                                {row.USDCAD}
                              </Badge>
                            </td>
                            <td className="text-center p-3">
                              <Badge variant={row.EURUSD === 'LONG' ? 'default' : row.EURUSD === 'SHORT' ? 'destructive' : 'secondary'}>
                                {row.EURUSD}
                              </Badge>
                            </td>
                            <td className="text-center p-3">
                              <Badge variant={row.USDCHF === 'LONG' ? 'default' : row.USDCHF === 'SHORT' ? 'destructive' : 'secondary'}>
                                {row.USDCHF}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm text-slate-700">EURCAD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm text-slate-700">USDCAD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm text-slate-700">EURUSD</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-sm text-slate-700">USDCHF</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
