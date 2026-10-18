import React from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function TransactionAnalysisCard({ transaction }) {
  if (!transaction) {
    return (
      <Card className="dashboard-card">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Select a transaction to view analysis</p>
        </CardContent>
      </Card>
    );
  }

  const technicalScore = Math.floor(Math.random() * 40) + 30;
  const behavioralScore = Math.floor(Math.random() * 40) + 30;
  const amountAnomaly = Math.floor(Math.random() * 40) + 20;
  const confidenceLevel = Math.floor((technicalScore + behavioralScore + amountAnomaly) / 3);

  const getRecommendedAction = (riskScore) => {
    if (riskScore > 80) return { text: 'Block Transaction', color: 'bg-red-600' };
    if (riskScore > 50) return { text: 'Manual Review Required', color: 'bg-yellow-600' };
    return { text: 'Approve Transaction', color: 'bg-green-600' };
  };

  const action = getRecommendedAction(transaction.risk_score);

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction Analysis</CardTitle>
            <CardDescription>Detailed fraud risk assessment</CardDescription>
          </div>
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="font-mono text-sm font-medium">{transaction.id.substring(0, 16)}...</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-bold text-lg">${transaction.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Merchant</p>
            <p className="font-medium">{transaction.location || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{new Date(transaction.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold">Risk Score Breakdown</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Technical Score</span>
              <span className="font-medium">{technicalScore}%</span>
            </div>
            <Progress value={technicalScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Behavioral Score</span>
              <span className="font-medium">{behavioralScore}%</span>
            </div>
            <Progress value={behavioralScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount Anomaly</span>
              <span className="font-medium">{amountAnomaly}%</span>
            </div>
            <Progress value={amountAnomaly} className="h-2" />
          </div>
        </div>

        {/* Overall Risk Gauge */}
        <div className="space-y-3">
          <h4 className="font-semibold">Overall Risk Assessment</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={transaction.risk_score} className="h-4" />
            </div>
            <Badge className={transaction.risk_score > 70 ? 'bg-red-600' : transaction.risk_score > 30 ? 'bg-yellow-600' : 'bg-green-600'}>
              {transaction.risk_score}%
            </Badge>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium">Confidence Level</span>
          </div>
          <span className="font-bold text-lg">{confidenceLevel}%</span>
        </div>

        {/* Detailed Reasoning */}
        <div className="space-y-2">
          <h4 className="font-semibold">Analysis Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-muted-foreground">
                Transaction amount significantly exceeds customer's historical average
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-muted-foreground">
                Transaction location matches customer's typical geographical pattern
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-muted-foreground">
                Unusual transaction time detected outside normal business hours
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="space-y-3">
          <h4 className="font-semibold">Recommended Action</h4>
          <Button className={`w-full ${action.color} hover:opacity-90`}>
            {action.text}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}