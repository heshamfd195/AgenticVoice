import os

AUDIO_DIR = "audio_files"


def save_audio_chunk(data: bytes, filename="received_audio.mp3", is_first_chunk=False):
    """Save incoming audio data to a file.
    
    Args:
        data: The audio chunk data
        filename: Name of the output file
        is_first_chunk: If True, clear the existing file before writing
    """
    os.makedirs(AUDIO_DIR, exist_ok=True)
    filepath = os.path.join(AUDIO_DIR, filename)
    # print(filepath)
    
    # Use 'wb' for first chunk to clear file, 'ab' for subsequent chunks
    mode = "wb" if is_first_chunk else "ab"
    with open(filepath, mode) as f:
        f.write(data)

    return filepath
