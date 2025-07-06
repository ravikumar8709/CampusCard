'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, QrCode } from 'lucide-react';
import { BrowserMultiFormatReader, IScannerControls, NotFoundException } from '@zxing/library';

export default function CameraScan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const isScannedRef = useRef(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length > 0 && videoRef.current) {
          const deviceId = videoInputDevices[0].deviceId;
          
          controlsRef.current = codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
            if (result && !isScannedRef.current) {
              isScannedRef.current = true;
              const scannedText = result.getText();
              setScanResult(scannedText);
              toast({
                title: 'Scan Successful!',
                description: `ID Scanned.`,
              });
              controlsRef.current?.stop();
            }

            if (err && !(err instanceof NotFoundException)) {
              console.error('Barcode scan error:', err);
            }
          });
        } else {
          setHasCameraPermission(false);
          toast({ variant: 'destructive', title: 'No Camera Found' });
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    startScanning();
    
    return () => {
      controlsRef.current?.stop();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [toast]);

  return (
    <div className="py-4 flex flex-col items-center justify-center gap-4">
      <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-muted">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        
        {hasCameraPermission === null && (
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
