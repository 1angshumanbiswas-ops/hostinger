import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { checkLinkedInToken, testLinkedInConnection } from '@/utils/linkedinDebugger';

export const useLinkedInTokenValidation = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, valid, invalid, expired, missing
  const [tokenDetails, setTokenDetails] = useState(null);
  const [error, setError] = useState(null);
  const [validationHistory, setValidationHistory] = useState([]);

  const validateToken = useCallback(async () => {
    if (!user) return;
    setStatus('validating');
    setError(null);

    try {
      // 1. Check DB for token
      const checkResult = await checkLinkedInToken(user.id);
      
      if (!checkResult.valid) {
        setStatus(checkResult.message === 'Token expired.' ? 'expired' : 'missing');
        setError(checkResult.message);
        return;
      }

      // 2. Test actual connectivity
      const testResult = await testLinkedInConnection(checkResult.token, user.id);
      
      if (testResult.success) {
        setStatus('valid');
        setTokenDetails({
          token: checkResult.token,
          platformUserId: checkResult.platformUserId,
          profileData: testResult.data
        });
      } else {
        setStatus('invalid');
        setError(testResult.error?.message || 'Connection test failed');
      }
      
      setValidationHistory(prev => [
          { date: new Date(), status: testResult.success ? 'Success' : 'Failed', details: testResult.success ? 'Valid' : testResult.error },
          ...prev.slice(0, 9)
      ]);

    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }, [user]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return {
    status,
    tokenDetails,
    error,
    validateToken,
    validationHistory,
    isLoading: status === 'loading' || status === 'validating'
  };
};