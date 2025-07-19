
'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, QrCode } from 'lucide-react';
import { BrowserMultiFormatReader, IScannerControls, NotFoundException } from '@zxing/library';

export default function CameraScan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const isMountedRef = useRef(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    isMountedRef.current = true;

    const codeReader = new BrowserMultiFormatReader();

    const startScan = async () => {
      if (!videoRef.current || !isMountedRef.current) {
        return;
      }

      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          if (!isMountedRef.current) return;
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'No Camera Found',
            description: 'Could not find a camera on this device.',
          });
          return;
        }
        if (!isMountedRef.current) return;

        setHasCameraPermission(true);
        const firstDeviceId = videoInputDevices[0].deviceId;

        controlsRef.current = await codeReader.decodeFromVideoDevice(
          firstDeviceId,
          videoRef.current,
          (result, err) => {
            if (!isMountedRef.current) return;

            if (result) {
              setScanResult(result.getText());
              toast({
                title: 'Scan Successful!',
                description: `ID Scanned.`,
              });
              if (controlsRef.current) {
                controlsRef.current.stop();
                controlsRef.current = null;
              }
            }

            if (err && !(err instanceof NotFoundException)) {
              console.error('Barcode scan error:', err);
              // Avoid spamming toasts for continuous scan errors
            }
          }
        );
      } catch (error) {
        if (!isMountedRef.current) return;
        console.error('Error initializing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    startScan();

    return () => {
      isMountedRef.current = false;
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
  }, [toast]);


  return (
    <div className="py-4 flex flex-col items-center justify-center gap-4">
      <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-muted">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        
        {hasCameraPermission === null && !scanResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-background">
            <QrCode className="h-16 w-16 mb-4 animate-pulse" />
            <p className="text-sm">Requesting camera access...</p>
          </div>
        )}

        {scanResult && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-bold">Scan Successful</p>
            <p className="text-sm mt-2 text-center break-all">ID: {scanResult}</p>
          </div>
        )}
      </div>

      {hasCameraPermission === false && (
        <Alert variant="destructive" className="w-full">
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Please allow camera access to use this feature. You may need to refresh the page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
