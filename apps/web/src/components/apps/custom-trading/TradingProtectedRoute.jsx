import React from 'react';
import { Navigate } from 'react-router-dom';

const TradingProtectedRoute = ({ children }) => {
  const isNormalAuth = localStorage.getItem('trading_auth_token') === 'true';

  if (!isNormalAuth) {
    return <Navigate to="/trading-login" replace />;
  }

  return children;
};

export default TradingProtectedRoute;