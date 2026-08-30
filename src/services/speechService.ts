// Speech recognition & synthesis helper for Apno Se

// Define SpeechRecognition interface for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;

  public static isSpeechRecognitionSupported(): boolean {
    const win = window as unknown as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public static startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void,
    language: string = 'hi-IN'
  ): () => void {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('आपके ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है।');
      return () => {};
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {
          // ignore
        }
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullText = (finalTranscript || interimTranscript).trim();
        if (fullText) {
          onResult(fullText, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();

      return () => {
        try {
          if (this.recognition) {
            this.recognition.stop();
          }
        } catch {
          // ignore
        }
      };
    } catch (err: any) {
      onError(err?.message || 'माइक्रोफोन शुरू करने में असमर्थ');
      return () => {};
    }
  }

  public static stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }

  // Text-to-Speech function for AI Sarathi and reading posts
  public static speakText(text: string, lang: string = 'hi'): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower, clear cadence for 40+ audience!
      utterance.pitch = 1.0;
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';

      // Pick Hindi / Indian English voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(
        (v) => (lang === 'en' && v.lang.includes('en-IN')) || (lang !== 'en' && v.lang.includes('hi'))
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  public static stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
