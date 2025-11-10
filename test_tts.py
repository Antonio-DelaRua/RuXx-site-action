import pyttsx3
import comtypes
import os

def test_tts():
    print("=== TTS TEST ===")

    try:
        # Initialize COM
        comtypes.CoInitialize()
        print("COM initialized")

        # Initialize engine
        engine = pyttsx3.init()
        print(f"Engine initialized: {engine}")

        # Get voices
        voices = engine.getProperty('voices')
        print(f"Available voices: {len(voices) if voices else 0}")

        if voices:
            print("Voice details:")
            for i, voice in enumerate(voices):
                print(f"  {i}: {voice.name} (ID: {voice.id})")

            # Try to select Spanish voice
            spanish_selected = False
            for voice in voices:
                if 'spanish' in voice.name.lower() or 'español' in voice.name.lower() or 'es-es' in voice.name.lower():
                    engine.setProperty('voice', voice.id)
                    print(f"Selected Spanish voice: {voice.name}")
                    spanish_selected = True
                    break

            if not spanish_selected:
                for voice in voices:
                    if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                        engine.setProperty('voice', voice.id)
                        print(f"Selected fallback voice: {voice.name}")
                        break

        # Set properties
        engine.setProperty('rate', 180)
        engine.setProperty('volume', 0.9)

        # Test text
        test_text = "Hola, esto es una prueba de texto a voz en español. ¿Cómo suena?"
        print(f"Test text: {test_text}")

        # Save to file
        output_file = "test_tts_output.wav"
        print(f"Saving to: {output_file}")
        engine.save_to_file(test_text, output_file)
        engine.runAndWait()

        # Check if file was created
        if os.path.exists(output_file):
            size = os.path.getsize(output_file)
            print(f"File created successfully, size: {size} bytes")
            if size == 0:
                print("ERROR: File is empty!")
            else:
                print("SUCCESS: TTS generated audio file")
        else:
            print("ERROR: File was not created")

    except Exception as e:
        print(f"TTS test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_tts()