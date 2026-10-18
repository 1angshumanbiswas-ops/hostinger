import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Smartphone, Key, Copy, Check, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  generateTOTPSecret,
  generateQRCode,
  verifyTOTPToken,
  generateBackupCodes,
  sendSMSCode,
  verifySMSCode,
  storeTwoFactorSettings,
  validateRateLimit,
  getTwoFactorSettings
} from '@/utils/twoFactorAuthService';

const TwoFactorAuth = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState('disabled');
  const [method, setMethod] = useState('totp');
  const [secret, setSecret] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(null);
  const [rateLimit, setRateLimit] = useState({ allowed: true, remaining: 5 });

  useEffect(() => {
    if (user) {
      loadTwoFactorSettings();
    }
  }, [user]);

  const loadTwoFactorSettings = async () => {
    const settings = await getTwoFactorSettings(user.id);
    if (settings) {
      setCurrentSettings(settings);
      setTwoFactorEnabled(settings.enabled);
      setStep(settings.enabled ? 'enabled' : 'disabled');
      setPhoneNumber(settings.phone_number || '');
      setMethod(settings.method || 'totp');
    }
  };

  const handleSetupTOTP = async () => {
    const newSecret = generateTOTPSecret();
    const otpauthUrl = generateQRCode(newSecret, user.email);
    
    try {
      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(otpauthUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 200,
        margin: 1
      });
      
      setSecret(newSecret);
      setQrCodeUrl(otpauthUrl);
      setQrCodeDataUrl(dataUrl);
      setMethod('totp');
      setStep('setup-totp');
    } catch (error) {
      toast({
        title: 'QR Code Generation Failed',
        description: 'Unable to generate QR code. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleVerifyTOTP = async () => {
    const limitCheck = await validateRateLimit(user.id, 'totp_verify');
    setRateLimit(limitCheck);

    if (!limitCheck.allowed) {
      toast({
        title: 'Rate Limit Exceeded',
        description: `Too many attempts. Please try again in ${limitCheck.retryAfter} minutes.`,
        variant: 'destructive'
      });
      return;
    }

    const isValid = verifyTOTPToken(secret, verificationCode);
    
    if (isValid) {
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      
      await storeTwoFactorSettings(user.id, {
        totp_secret: secret,
        backup_codes: codes,
        enabled: true,
        method: 'totp'
      });

      setShowBackupDialog(true);
      setStep('enabled');
      setTwoFactorEnabled(true);
      
      toast({
        title: '2FA Enabled',
        description: 'Two-factor authentication has been successfully enabled'
      });
    } else {
      toast({
        title: 'Invalid Code',
        description: 'The verification code you entered is incorrect',
        variant: 'destructive'
      });
    }
  };

  const handleSetupSMS = () => {
    setMethod('sms');
    setStep('setup-sms');
  };

  const handleSendSMS = async () => {
    const limitCheck = await validateRateLimit(user.id, 'sms_send');
    setRateLimit(limitCheck);

    if (!limitCheck.allowed) {
      toast({
        title: 'Rate Limit Exceeded',
        description: `Too many attempts. Please try again in ${limitCheck.retryAfter} minutes.`,
        variant: 'destructive'
      });
      return;
    }

    const result = await sendSMSCode(phoneNumber);
    
    if (result.success) {
      toast({
        title: 'SMS Sent',
        description: 'Verification code sent to your phone number'
      });
      setStep('verify-sms');
    } else {
      toast({
        title: 'Failed to Send SMS',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleVerifySMS = async () => {
    const limitCheck = await validateRateLimit(user.id, 'sms_verify');
    setRateLimit(limitCheck);

    if (!limitCheck.allowed) {
      toast({
        title: 'Rate Limit Exceeded',
        description: `Too many attempts. Please try again in ${limitCheck.retryAfter} minutes.`,
        variant: 'destructive'
      });
      return;
    }

    const result = await verifySMSCode(phoneNumber, smsCode);
    
    if (result.success) {
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      
      await storeTwoFactorSettings(user.id, {
        phone_number: phoneNumber,
        backup_codes: codes,
        enabled: true,
        method: 'sms'
      });

      setShowBackupDialog(true);
      setStep('enabled');
      setTwoFactorEnabled(true);
      
      toast({
        title: '2FA Enabled',
        description: 'SMS-based two-factor authentication has been enabled'
      });
    } else {
      toast({
        title: 'Invalid Code',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleDisable2FA = async () => {
    await storeTwoFactorSettings(user.id, {
      enabled: false
    });

    setStep('disabled');
    setTwoFactorEnabled(false);
    setSecret('');
    setQrCodeUrl('');
    setQrCodeDataUrl('');
    
    toast({
      title: '2FA Disabled',
      description: 'Two-factor authentication has been disabled'
    });
  };

  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopiedCode(true);
    
    setTimeout(() => setCopiedCode(false), 2000);
    
    toast({
      title: 'Copied',
      description: 'Backup codes copied to clipboard'
    });
  };

  return (
    <>
      <Helmet>
        <title>Two-Factor Authentication - Fraud Detection</title>
        <meta name="description" content="Configure two-factor authentication for enhanced security" />
      </Helmet>

      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">Add an extra layer of security to your account</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>2FA Status</CardTitle>
                <CardDescription>Two-factor authentication protection</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    if (!checked && twoFactorEnabled) {
                      handleDisable2FA();
                    }
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
              <Shield className={`h-8 w-8 ${twoFactorEnabled ? 'text-green-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-semibold">
                  {twoFactorEnabled ? 'Your account is protected' : 'Enable 2FA for enhanced security'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled 
                    ? `Using ${method === 'totp' ? 'Authenticator App' : 'SMS'} verification`
                    : 'Secure your account with two-factor authentication'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 'disabled' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleSetupTOTP}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Authenticator App</CardTitle>
                    <CardDescription>Use Google Authenticator or similar app</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    More secure than SMS
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Works offline
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Time-based codes
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleSetupSMS}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>SMS Verification</CardTitle>
                    <CardDescription>Receive codes via text message</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Easy to set up
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    No app required
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Instant delivery
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'setup-totp' && (
          <Card>
            <CardHeader>
              <CardTitle>Set Up Authenticator App</CardTitle>
              <CardDescription>Scan the QR code with your authenticator app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                {qrCodeDataUrl && (
                  <div className="p-4 bg-white rounded-lg">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="2FA QR Code" 
                      className="w-[200px] h-[200px]"
                    />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Or enter this code manually:</p>
                  <code className="px-3 py-2 bg-muted rounded text-sm font-mono">{secret}</code>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="totp-code">Enter Verification Code</Label>
                <Input
                  id="totp-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  Remaining attempts: {rateLimit.remaining}
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep('disabled')} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleVerifyTOTP} className="flex-1 bg-primary">
                  Verify & Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'setup-sms' && (
          <Card>
            <CardHeader>
              <CardTitle>Set Up SMS Verification</CardTitle>
              <CardDescription>Enter your phone number to receive verification codes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +1 for US)
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep('disabled')} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSendSMS} className="flex-1 bg-primary">
                  Send Verification Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'verify-sms' && (
          <Card>
            <CardHeader>
              <CardTitle>Verify SMS Code</CardTitle>
              <CardDescription>Enter the code sent to {phoneNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="sms-code">Verification Code</Label>
                <Input
                  id="sms-code"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  Remaining attempts: {rateLimit.remaining}
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep('setup-sms')} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleVerifySMS} className="flex-1 bg-primary">
                  Verify & Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'enabled' && currentSettings && (
          <Card>
            <CardHeader>
              <CardTitle>Recovery Options</CardTitle>
              <CardDescription>Manage your backup codes and recovery methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      2FA is Active
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Method: {currentSettings.method === 'totp' ? 'Authenticator App' : 'SMS'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600">Enabled</Badge>
              </div>

              {currentSettings.backup_codes && currentSettings.backup_codes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Backup Codes</Label>
                    <Button onClick={handleCopyBackupCodes} variant="outline" size="sm">
                      {copiedCode ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedCode ? 'Copied' : 'Copy All'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {currentSettings.backup_codes.map((code, idx) => (
                      <code key={idx} className="px-3 py-2 bg-muted rounded text-sm font-mono text-center">
                        {code}
                      </code>
                    ))}
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Save these backup codes in a secure location. Each code can only be used once.
                    </p>
                  </div>
                </div>
              )}

              <Button onClick={handleDisable2FA} variant="destructive" className="w-full">
                Disable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Save Your Backup Codes</DialogTitle>
              <DialogDescription>
                These codes can be used to access your account if you lose access to your 2FA method
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, idx) => (
                  <code key={idx} className="px-3 py-2 bg-muted rounded text-sm font-mono text-center">
                    {code}
                  </code>
                ))}
              </div>
              
              <Button onClick={handleCopyBackupCodes} variant="outline" className="w-full">
                {copiedCode ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copiedCode ? 'Copied to Clipboard' : 'Copy All Codes'}
              </Button>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowBackupDialog(false)} className="w-full bg-primary">
                I've Saved My Codes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default TwoFactorAuth;