
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, QrCode, CameraOff } from 'lucide-react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Button } from './ui/button';

export default function CameraScan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Use a ref to hold the code reader instance to avoid re-creation
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = 0.1; // Keep volume low
      oscillator.frequency.value = 523.25; // C5 note
      oscillator.type = 'sine';
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 150); // Beep duration
    } catch (e) {
      console.error("Failed to play beep sound.", e);
    }
  };

  const stopScan = useCallback(() => {
    if (codeReaderRef.current) {
        codeReaderRef.current.reset();
    }
    setIsScanning(false);
  }, []);

  const startScan = useCallback(async () => {
    if (isScanning || !videoRef.current || !codeReaderRef.current) return;
    
    setScanResult(null);
    setIsScanning(true);

    try {
      const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        setHasCameraPermission(false);
        setIsScanning(false);
        return;
      }
      
      const firstDeviceId = videoInputDevices[0].deviceId;

      await codeReaderRef.current.decodeFromVideoDevice(
        firstDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            playBeep();
            setScanResult(result.getText());
            stopScan();
          }

          if (err && !(err instanceof NotFoundException)) {
            console.error('Barcode scan error:', err);
          }
        }
      );

    } catch (error) {
      console.error('Error initializing camera for scanning:', error);
      setHasCameraPermission(false);
      setIsScanning(false);
    }
  }, [isScanning, stopScan]);


  // Effect for initializing and cleaning up the scanner
  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    
    // Request permission and start stream
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    
    getCameraPermission();

    // Cleanup
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  // Effect to start scanning once permission is granted
  useEffect(() => {
    if(hasCameraPermission && !isScanning){
        startScan();
    }
  }, [hasCameraPermission, isScanning, startScan]);


  useEffect(() => {
    if (scanResult) {
       toast({
        title: 'Scan Successful!',
        description: `ID: ${scanResult}`,
      });
    }
  }, [scanResult, toast]);


  return (
    <div className="py-4 flex flex-col items-center justify-center gap-4">
      <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-muted">
        <video ref={videoRef} className={`w-full h-full object-cover ${scanResult ? 'blur-sm' : ''}`} autoPlay muted playsInline />
        
        {hasCameraPermission === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-background">
            <QrCode className="h-16 w-16 mb-4 animate-pulse" />
            <p className="text-sm">Initializing camera...</p>
          </div>
        )}

        {hasCameraPermission === false && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive-foreground bg-destructive/90 p-4 text-center">
            <CameraOff className="h-16 w-16 mb-4" />
            <p className="text-lg font-bold">Camera Access Denied</p>
            <p className="text-sm mt-2">Please enable camera permissions in your browser settings and refresh the page.</p>
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

      {hasCameraPermission === false ? (
        <Alert variant="destructive" className="w-full">
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Please allow camera access to use this feature.
          </AlertDescription>
        </Alert>
      ) : (
        scanResult && (
          <Button onClick={startScan} className="w-full">
            Scan Again
          </Button>
        )
      )}
    </div>
  );
}
