import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle, Upload } from 'lucide-react';

const MODELS = {
  M1: { name: 'M1/M1R', soundSize: 32768 },
  M1EX: { name: 'M1ex/M1Rex', soundSize: 65536 }
};

const FILE_TYPES = {
  SOUNDS: 'sounds',
  SEQUENCES: 'sequences'
};

const KorgM1Updater = () => {
  const [midiAccess, setMidiAccess] = useState(null);
  const [midiOutputs, setMidiOutputs] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [status, setStatus] = useState('waiting');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [sysexData, setSysexData] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Update available MIDI outputs
  const updateDevices = useCallback((access) => {
    const outputs = Array.from(access.outputs.values());
    setMidiOutputs(outputs);
    
    // If currently selected output is no longer available, clear it
    if (selectedOutput && !outputs.find(output => output.id === selectedOutput.id)) {
      setSelectedOutput(null);
    }
  }, [selectedOutput]);

  // Handle MIDI device connection/disconnection
  const handleStateChange = useCallback((event) => {
    console.log(`MIDI port ${event.port.name} ${event.port.state}`);
    updateDevices(midiAccess);
  }, [midiAccess, updateDevices]);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: true })
        .then(access => {
          setMidiAccess(access);
          updateDevices(access);
          
          // Set up connection/disconnection listeners
          access.onstatechange = handleStateChange;
        })
        .catch(error => {
          setStatus('error');
          setErrorMessage('Could not access MIDI devices. Please ensure you\'re using a supported browser (Chrome/Edge) and have granted MIDI permissions.');
        });
    } else {
      setStatus('error');
      setErrorMessage('Web MIDI API is not supported in your browser. Please use Chrome or Edge.');
    }
  }, [handleStateChange, updateDevices]);

  const loadSysexFile = async (fileType) => {
    try {
      const path = `/sysex/${selectedModel.toLowerCase()}/${fileType}.syx`;
      const response = await fetch(path);
      if (!response.ok) throw new Error('Failed to load SysEx file');
      const arrayBuffer = await response.arrayBuffer();
      setSysexData(new Uint8Array(arrayBuffer));
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setErrorMessage(`Error loading factory data: ${error.message}`);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      setSysexData(new Uint8Array(arrayBuffer));
      setStatus('ready');
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const sendSysEx = async () => {
    if (!selectedOutput || !sysexData) {
      setStatus('error');
      setErrorMessage('No MIDI output device selected or no data loaded. Please check your connections and try again.');
      return;
    }

    try {
      setStatus('uploading');
      
      // Send the SysEx data in chunks to avoid buffer overflow
      const chunkSize = 256;
      for (let i = 0; i < sysexData.length; i += chunkSize) {
        const chunk = sysexData.slice(i, i + chunkSize);
        selectedOutput.send(chunk);
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Setup Instructions:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-900">
            <li>Connect MIDI OUT from your computer's MIDI interface to MIDI IN on the M1</li>
            <li>Power on your M1</li>
            <li>On the M1, press <span className="font-mono bg-gray-200 px-1 rounded">GLOBAL</span></li>
            <li>Press <span className="font-mono bg-gray-200 px-1 rounded">PAGE+</span> until you see "MIDI DUMP"</li>
            <li>Use the slider to select "RECEIVE" mode</li>
            <li>Select your MIDI interface and M1 model below</li>
            <li>Choose Factory Sounds or Demo Sequences to restore</li>
            <li>Click "Send to M1" and wait for the transfer to complete</li>
            <li>The M1 will automatically restart when the transfer is complete</li>
          </ol>
          <p className="mt-4 text-sm text-blue-800 font-medium">⚠️ Important: Ensure your M1 has a working battery installed before proceeding</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MIDI Device Selection */}
        <div>
          <h3 className="text-sm font-medium mb-2">Select MIDI Output:</h3>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={selectedOutput?.id || ''}
            onChange={(e) => {
              const output = midiOutputs.find(out => out.id === e.target.value);
              setSelectedOutput(output);
            }}
          >
            <option value="">Select MIDI Device</option>
            {midiOutputs.map(output => (
              <option key={output.id} value={output.id}>
                {output.name} ({output.manufacturer || 'Unknown manufacturer'})
              </option>
            ))}
          </select>
          {midiOutputs.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No MIDI devices detected. Please connect a MIDI interface.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Select Your Model:</h3>
            <select
              className="w-full p-2 border rounded-md bg-white"
              value={selectedModel || ''}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Select M1 Model</option>
              {Object.entries(MODELS).map(([key, model]) => (
                <option key={key} value={key}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {selectedModel && (
            <div>
              <h3 className="text-sm font-medium mb-2">Select Data Type:</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    setSelectedFileType(FILE_TYPES.SOUNDS);
                    loadSysexFile('factory-sounds');
                  }}
                  variant={selectedFileType === FILE_TYPES.SOUNDS ? "default" : "outline"}
                  className="w-full"
                >
                  Factory Sounds
                </Button>
                <Button
                  onClick={() => {
                    setSelectedFileType(FILE_TYPES.SEQUENCES);
                    loadSysexFile('factory-sequences');
                  }}
                  variant={selectedFileType === FILE_TYPES.SEQUENCES ? "default" : "outline"}
                  className="w-full"
                >
                  Demo Sequences
                </Button>
              </div>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Or drag and drop your own SysEx file here
            </p>
          </div>
        </div>

        {status === 'ready' && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Ready to Update</AlertTitle>
            <AlertDescription>
              Data loaded successfully. Ensure your Korg M1 is connected via MIDI and powered on before proceeding.
            </AlertDescription>
          </Alert>
        )}

        {status === 'uploading' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Uploading Data</AlertTitle>
            <AlertDescription>
              Please wait while the data is being uploaded to your Korg M1...
            </AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Update Complete</AlertTitle>
            <AlertDescription>
              Data has been successfully sent to your Korg M1.
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
          disabled={!selectedOutput || !sysexData || status === 'uploading'}
          className="w-full"
        >
          {status === 'uploading' ? 'Uploading...' : 'Send to M1'}
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