import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

interface BiasRecord {
  id: string;
  date: string;
  pair: string;
  predictedBias: 'LONG' | 'SHORT' | 'NEUTRAL';
  actualBias: 'LONG' | 'SHORT' | 'NEUTRAL' | null;
  timeframe: 'SHORT_TERM' | 'LONG_TERM';
  result: 'CORRECT' | 'INCORRECT' | 'PENDING';
  pips?: number;
  notes?: string;
}

interface SuccessStats {
  pair: string;
  totalPredictions: number;
  correctPredictions: number;
  successRate: number;
  shortTermRate: number;
  longTermRate: number;
  avgPips: number;
}

// Sample historical data
const sampleHistory: BiasRecord[] = [
  {
    id: '1',
    date: '2024-08-20',
    pair: 'EURCAD',
    predictedBias: 'LONG',
    actualBias: 'LONG',
    timeframe: 'SHORT_TERM',
    result: 'CORRECT',
    pips: 45,
    notes: 'Strong EUR fundamentals confirmed'
  },
  {
    id: '2',
    date: '2024-08-20',
    pair: 'USDCAD',
    predictedBias: 'SHORT',
    actualBias: 'SHORT',
    timeframe: 'SHORT_TERM',
    result: 'CORRECT',
    pips: 38,
    notes: 'Oil recovery as expected'
  },
  {
    id: '3',
    date: '2024-08-20',
    pair: 'EURUSD',
    predictedBias: 'LONG',
    actualBias: 'LONG',
    timeframe: 'SHORT_TERM',
    result: 'CORRECT',
    pips: 52,
    notes: 'ECB hawkish guidance supported'
  },
  {
    id: '4',
    date: '2024-08-20',
    pair: 'USDCHF',
    predictedBias: 'SHORT',
    actualBias: 'SHORT',
    timeframe: 'SHORT_TERM',
    result: 'CORRECT',
    pips: 35,
    notes: 'Safe haven flows as predicted'
  },
  {
    id: '5',
    date: '2024-08-19',
    pair: 'EURCAD',
    predictedBias: 'LONG',
    actualBias: 'LONG',
    timeframe: 'SHORT_TERM',
    result: 'CORRECT',
    pips: 28,
    notes: ''
  },
  {
    id: '6',
    date: '2024-08-19',
    pair: 'USDCAD',
    predictedBias: 'NEUTRAL',
    actualBias: 'SHORT',
    timeframe: 'SHORT_TERM',
    result: 'INCORRECT',
    pips: -15,
    notes: 'Missed early oil rally'
  },
  {
    id: '7',
    date: '2024-08-19',
    pair: 'EURUSD',
    predictedBias: 'LONG',
    actualBias: 'LONG',
    timeframe: 'SHORT_TERM',
    result: 'CORRECT',
    pips: 42,
    notes: ''
  },
  {
    id: '8',
    date: '2024-08-19',
    pair: 'USDCHF',
    predictedBias: 'SHORT',
    actualBias: 'NEUTRAL',
    timeframe: 'SHORT_TERM',
    result: 'INCORRECT',
    pips: -8,
    notes: 'Range-bound, no clear direction'
  },
  {
    id: '9',
    date: '2024-08-16',
    pair: 'EURCAD',
    predictedBias: 'NEUTRAL',
    actualBias: 'LONG',
    timeframe: 'LONG_TERM',
    result: 'CORRECT',
    pips: 125,
    notes: 'Longer term trend confirmed'
  },
  {
    id: '10',
    date: '2024-08-16',
    pair: 'EURUSD',
    predictedBias: 'LONG',
    actualBias: 'LONG',
    timeframe: 'LONG_TERM',
    result: 'CORRECT',
    pips: 156,
    notes: 'Strong fundamental backdrop'
  },
];

const calculateStats = (records: BiasRecord[]): SuccessStats[] => {
  const pairs = ['EURCAD', 'USDCAD', 'EURUSD', 'USDCHF'];
  
  return pairs.map(pair => {
    const pairRecords = records.filter(r => r.pair === pair && r.result !== 'PENDING');
    const correctRecords = pairRecords.filter(r => r.result === 'CORRECT');
    const shortTermRecords = pairRecords.filter(r => r.timeframe === 'SHORT_TERM');
    const shortTermCorrect = shortTermRecords.filter(r => r.result === 'CORRECT');
    const longTermRecords = pairRecords.filter(r => r.timeframe === 'LONG_TERM');
    const longTermCorrect = longTermRecords.filter(r => r.result === 'CORRECT');

    const totalPips = pairRecords.reduce((sum, r) => sum + (r.pips || 0), 0);

    return {
      pair,
      totalPredictions: pairRecords.length,
      correctPredictions: correctRecords.length,
      successRate: pairRecords.length > 0 ? (correctRecords.length / pairRecords.length) * 100 : 0,
      shortTermRate: shortTermRecords.length > 0 ? (shortTermCorrect.length / shortTermRecords.length) * 100 : 0,
      longTermRate: longTermRecords.length > 0 ? (longTermCorrect.length / longTermRecords.length) * 100 : 0,
      avgPips: pairRecords.length > 0 ? totalPips / pairRecords.length : 0
    };
  });
};

const getResultIcon = (result: string) => {
  if (result === 'CORRECT') return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (result === 'INCORRECT') return <XCircle className="w-5 h-5 text-red-600" />;
  return <AlertCircle className="w-5 h-5 text-yellow-600" />;
};

const getResultBadge = (result: string) => {
  if (result === 'CORRECT') return <Badge className="bg-green-600">Correct</Badge>;
  if (result === 'INCORRECT') return <Badge variant="destructive">Incorrect</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
};

export default function HistoryTracker() {
  const [records] = useState<BiasRecord[]>(sampleHistory);
  const [selectedPair, setSelectedPair] = useState<string>('ALL');
  const stats = calculateStats(records);

  const filteredRecords = selectedPair === 'ALL' 
    ? records 
    : records.filter(r => r.pair === selectedPair);

  const overallStats = {
    totalPredictions: records.filter(r => r.result !== 'PENDING').length,
    correctPredictions: records.filter(r => r.result === 'CORRECT').length,
    successRate: records.filter(r => r.result !== 'PENDING').length > 0 
      ? (records.filter(r => r.result === 'CORRECT').length / records.filter(r => r.result !== 'PENDING').length) * 100 
      : 0,
    totalPips: records.reduce((sum, r) => sum + (r.pips || 0), 0)
  };

  // Prepare chart data
  const successRateData = stats.map(s => ({
    pair: s.pair,
    rate: Math.round(s.successRate),
    shortTerm: Math.round(s.shortTermRate),
    longTerm: Math.round(s.longTermRate)
  }));

  const pipsData = stats.map(s => ({
    pair: s.pair,
    pips: Math.round(s.avgPips)
  }));

  const timelineData = records
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .reverse()
    .map((r, idx) => ({
      date: r.date,
      correct: r.result === 'CORRECT' ? 1 : 0,
      incorrect: r.result === 'INCORRECT' ? 1 : 0
    }))
    .reduce((acc, curr) => {
      const existing = acc.find(a => a.date === curr.date);
      if (existing) {
        existing.correct += curr.correct;
        existing.incorrect += curr.incorrect;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as any[]);

  const resultDistribution = [
    { name: 'Correct', value: records.filter(r => r.result === 'CORRECT').length, color: '#10b981' },
    { name: 'Incorrect', value: records.filter(r => r.result === 'INCORRECT').length, color: '#ef4444' },
    { name: 'Pending', value: records.filter(r => r.result === 'PENDING').length, color: '#f59e0b' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Success Rate Tracker</h1>
          <p className="text-slate-600">Monitor your prediction accuracy and performance</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">{overallStats.successRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-500 mt-2">{overallStats.correctPredictions}/{overallStats.totalPredictions} predictions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Total Pips</p>
                <p className={`text-3xl font-bold ${overallStats.totalPips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallStats.totalPips > 0 ? '+' : ''}{overallStats.totalPips}
                </p>
                <p className="text-xs text-slate-500 mt-2">All pairs combined</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Correct</p>
                <p className="text-3xl font-bold text-blue-600">{overallStats.correctPredictions}</p>
                <p className="text-xs text-slate-500 mt-2">Accurate predictions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Incorrect</p>
                <p className="text-3xl font-bold text-red-600">{overallStats.totalPredictions - overallStats.correctPredictions}</p>
                <p className="text-xs text-slate-500 mt-2">Missed predictions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Success Rate by Pair */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Success Rate by Pair
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={successRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pair" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="rate" fill="#3b82f6" name="Overall" />
                  <Bar dataKey="shortTerm" fill="#10b981" name="Short Term" />
                  <Bar dataKey="longTerm" fill="#f59e0b" name="Long Term" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Average Pips by Pair */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Average Pips by Pair
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pair" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pips" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Timeline and Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Prediction Timeline */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Prediction Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="correct" fill="#10b981" name="Correct" />
                  <Bar dataKey="incorrect" fill="#ef4444" name="Incorrect" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Result Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Result Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resultDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resultDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pair-wise Stats */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Performance by Pair</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(stat => (
                <div key={stat.pair} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">{stat.pair}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Success Rate:</span>
                      <span className="font-semibold text-green-600">{stat.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Predictions:</span>
                      <span className="font-semibold">{stat.totalPredictions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Correct:</span>
                      <span className="font-semibold text-blue-600">{stat.correctPredictions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Short Term:</span>
                      <span className="font-semibold">{stat.shortTermRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Long Term:</span>
                      <span className="font-semibold">{stat.longTermRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600">Avg Pips:</span>
                      <span className={`font-semibold ${stat.avgPips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.avgPips > 0 ? '+' : ''}{stat.avgPips.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed History */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="correct">Correct</TabsTrigger>
            <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>All Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(record => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          {getResultIcon(record.result)}
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{record.pair}</div>
                            <div className="text-sm text-slate-600">{record.date} • {record.timeframe === 'SHORT_TERM' ? 'Short Term' : 'Long Term'}</div>
                            {record.notes && <div className="text-xs text-slate-500 mt-1">{record.notes}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-slate-600">Predicted: <span className="font-semibold">{record.predictedBias}</span></div>
                            <div className="text-sm text-slate-600">Actual: <span className="font-semibold">{record.actualBias || 'Pending'}</span></div>
                          </div>
                          <div className="text-right">
                            {record.pips !== undefined && (
                              <div className={`text-lg font-bold ${record.pips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {record.pips > 0 ? '+' : ''}{record.pips}
                              </div>
                            )}
                            {getResultBadge(record.result)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correct">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Correct Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredRecords
                    .filter(r => r.result === 'CORRECT')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(record => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-4 flex-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{record.pair}</div>
                            <div className="text-sm text-slate-600">{record.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold text-green-600`}>+{record.pips}</div>
                          <Badge className="bg-green-600">Correct</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incorrect">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Incorrect Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredRecords
                    .filter(r => r.result === 'INCORRECT')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(record => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-4 flex-1">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{record.pair}</div>
                            <div className="text-sm text-slate-600">{record.date}</div>
                            {record.notes && <div className="text-xs text-slate-500 mt-1">{record.notes}</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold text-red-600`}>{record.pips}</div>
                          <Badge variant="destructive">Incorrect</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
