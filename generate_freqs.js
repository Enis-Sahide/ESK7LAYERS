const fs = require('fs');

function writeWav(filename, frequency) {
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const numSamples = sampleRate * duration;
    
    // WAV Header
    const buffer = Buffer.alloc(44 + numSamples * 2);
    
    // "RIFF" chunk descriptor
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4); // Chunk size
    buffer.write('WAVE', 8);
    
    // "fmt " sub-chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // Subchunk1Size
    buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
    buffer.writeUInt16LE(1, 22); // NumChannels (1 = Mono)
    buffer.writeUInt32LE(sampleRate, 24); // SampleRate
    buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
    buffer.writeUInt16LE(2, 32); // BlockAlign
    buffer.writeUInt16LE(16, 34); // BitsPerSample
    
    // "data" sub-chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40); // Subchunk2Size
    
    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        
        // Tremolo LFO: 0.5 Hz (1 full cycle in 2 seconds)
        // Starts at 0.5, goes to 1.0 at 0.5s, goes to 0 at 1.5s, ends at 0.5 at 2.0s
        const lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.5 * t);
        
        // Base sine wave
        // We lower the volume a bit (0.5 max) so it's not deafening
        const sample = Math.sin(2 * Math.PI * frequency * t) * lfo * 0.5;
        
        // Convert to 16-bit PCM
        let intSample = Math.max(-1, Math.min(1, sample)) * 32767;
        buffer.writeInt16LE(intSample, 44 + i * 2);
    }
    
    fs.writeFileSync(filename, buffer);
}

const freqs = [396, 417, 528, 639, 741, 852, 963];
freqs.forEach(f => {
    writeWav(`c:\\projeler\\proje1\\assets\\audio\\freq_${f}.wav`, f);
    console.log(`Created freq_${f}.wav`);
});
console.log("All done!");
