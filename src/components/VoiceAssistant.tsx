import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand: (command: string) => void;
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';

    // Process different voice commands
    if (lowerCommand.includes('record vitals') || lowerCommand.includes('add vitals')) {
      response = 'Opening vitals recording form';
      onCommand('record_vitals');
    } else if (lowerCommand.includes('show patients') || lowerCommand.includes('patient list')) {
      response = 'Displaying patient list';
      onCommand('show_patients');
    } else if (lowerCommand.includes('high risk') || lowerCommand.includes('critical patients')) {
      response = 'Showing high-risk patients';
      onCommand('show_high_risk');
    } else if (lowerCommand.includes('generate report')) {
      response = 'Generating medical report';
      onCommand('generate_report');
    } else if (lowerCommand.includes('security status') || lowerCommand.includes('system status')) {
      response = 'Displaying security dashboard';
      onCommand('security_status');
    } else if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
      response = 'Available commands: Record vitals, Show patients, High risk patients, Generate report, Security status';
      onCommand('help');
    } else {
      response = 'Command not recognized. Say "help" for available commands.';
      onCommand('unknown');
    }

    speak(response);
    setTranscript('');
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="cyber-border rounded-lg p-4 bg-gray-800/50">
        <div className="text-center text-cyan-300/70">
          <MicOff className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Voice Assistant not supported in this browser</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-border rounded-lg p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cyan-100">AI Voice Assistant</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-cyan-300/70">
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Voice Controls */}
        <div className="flex space-x-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'cyber-button'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isListening ? 'Stop' : 'Start'} Listening</span>
          </button>

          <button
            onClick={isSpeaking ? stopSpeaking : () => speak('Voice assistant ready for commands')}
            className={`flex items-center justify-center p-3 rounded-lg transition-all ${
              isSpeaking
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'cyber-button'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-cyan-400/30">
            <p className="text-sm text-cyan-300/70 mb-1">Transcript:</p>
            <p className="text-cyan-100">{transcript}</p>
          </div>
        )}

        {/* Quick Commands */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-cyan-300">Quick Commands:</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              onClick={() => processCommand('record vitals')}
              className="text-left p-2 rounded bg-gray-800/30 hover:bg-gray-700/50 text-cyan-300/70 hover:text-cyan-100 transition-colors"
            >
              "Record vitals" - Open vitals form
            </button>
            <button
              onClick={() => processCommand('show patients')}
              className="text-left p-2 rounded bg-gray-800/30 hover:bg-gray-700/50 text-cyan-300/70 hover:text-cyan-100 transition-colors"
            >
              "Show patients" - Display patient list
            </button>
            <button
              onClick={() => processCommand('high risk patients')}
              className="text-left p-2 rounded bg-gray-800/30 hover:bg-gray-700/50 text-cyan-300/70 hover:text-cyan-100 transition-colors"
            >
              "High risk patients" - Show critical cases
            </button>
            <button
              onClick={() => processCommand('security status')}
              className="text-left p-2 rounded bg-gray-800/30 hover:bg-gray-700/50 text-cyan-300/70 hover:text-cyan-100 transition-colors"
            >
              "Security status" - System overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}