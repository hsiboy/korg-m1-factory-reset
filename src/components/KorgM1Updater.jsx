import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const KorgM1Updater = () => {
  const [midiAccess, setMidiAccess] = useState(null);
  const [midiOutput, setMidiOutput] = useState(null);
  const [status, setStatus] = useState('waiting');
  const [errorMessage, setErrorMessage] = useState('');

  // Factory preset SysEx data would be embedded here
  // This is a placeholder - actual data would need to be obtained from Korg
  const factoryPresets = [
    0xF0, 0x42, 0x30, 0x00, /* ... SysEx data ... */ 0xF7
  ];

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(access => {
          setMidiAccess(access);
          // Get first available MIDI output
          const outputs = Array.from(access.outputs.values());
          if (outputs.length > 0) {
            setMidiOutput(outputs[0]);
          }
        })
        .catch(error => {
          setStatus('error');
          setErrorMessage('Could not access MIDI devices. Please ensure you\'re using a supported browser (Chrome/Edge) and have granted MIDI permissions.');
        });
    } else {
      setStatus('error');
      setErrorMessage('Web MIDI API is not supported in your browser. Please use Chrome or Edge.');
    }
  }, []);

  const sendSysEx = async () => {
    if (!midiOutput) {
      setStatus('error');
      setErrorMessage('No MIDI output device found. Please connect your Korg M1 and refresh the page.');
      return;
    }

    try {
      setStatus('uploading');
      
      // Send the SysEx data in chunks to avoid buffer overflow
      const chunkSize = 256;
      for (let i = 0; i < factoryPresets.length; i += chunkSize) {
        const chunk = factoryPresets.slice(i, i + chunkSize);
        midiOutput.send(chunk);
        // Add a small delay between chunks
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Error sending data to Korg M1. Please check your connection and try again.');
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Korg M1 Factory Preset Updater</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'waiting' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ready to Update</AlertTitle>
            <AlertDescription>
              Ensure your Korg M1 is connected via MIDI and powered on before proceeding.
            </AlertDescription>
          </Alert>
        )}

        {status === 'uploading' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Uploading Presets</AlertTitle>
            <AlertDescription>
              Please wait while the factory presets are being uploaded to your Korg M1...
            </AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Update Complete</AlertTitle>
            <AlertDescription>
              Factory presets have been successfully restored to your Korg M1.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={sendSysEx}
          disabled={!midiOutput || status === 'uploading'}
          className="w-full"
        >
          {status === 'uploading' ? 'Uploading...' : 'Update Factory Presets'}
        </Button>

        <div className="text-sm text-gray-500">
          <h3 className="font-medium mb-2">Requirements:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Chrome or Edge browser with Web MIDI support</li>
            <li>MIDI interface connected to your computer</li>
            <li>Korg M1 powered on and connected via MIDI</li>
            <li>New battery installed in the Korg M1</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default KorgM1Updater;
