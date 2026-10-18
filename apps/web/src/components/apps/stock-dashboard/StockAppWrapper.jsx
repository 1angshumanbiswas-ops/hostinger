import React from 'react';
import { Helmet } from 'react-helmet';
import StockDashboard from './StockDashboard';

export default function StockAppWrapper() {
  return (
    <div className="min-h-screen bg-background w-full">
      <Helmet>
        <title>BSE Live Market - My Digital Space</title>
        <meta name="description" content="Live BSE stock market dashboard and tracking." />
      </Helmet>
      
      {/* 
        The request specifies to render the new StockDashboard directly here
        in a clean layout without hidden overflows or complex nested wrappers.
      */}
      <main className="w-full h-full">
        <StockDashboard />
      </main>
    </div>
  );
}