import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function SimplifiedLoginPage() {
  const location = useLocation();
  return <Navigate to="/login" state={{ from: location.state?.from }} replace />;
}