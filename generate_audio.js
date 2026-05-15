const fs = require('fs');
const path = require('path');

const chakras = [
  { id: 1, freq: 396 },
  { id: 2, freq: 417 },
  { id: 3, freq: 528 },
  { id: 4, freq: 639 },
  { id: 5, freq: 741 },
  { id: 6, freq: 852 },
  { id: 7, freq: 963 },
];

const sampleRate = 44100;
const numChannels = 2;
const bitsPerSample = 16;
const durationSeconds = 40; // 40 seconds per track
const numSamples = sampleRate * durationSeconds;

function createWavBuffer(freq) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const fileSize = 36 + dataSize;
  
  const buffer = Buffer.alloc(44 + dataSize);
  
  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // 4Hz Theta binaural beat offset
  const beatFreq = 4; 
  let offset = 44;
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // 5-second Fade In and 5-second Fade Out
    let envelope = 1;
    if (t < 5) envelope = t / 5;
    else if (t > durationSeconds - 5) envelope = (durationSeconds - t) / 5;
    
    // Smooth easing for envelope
    envelope = envelope * envelope * (3 - 2 * envelope);
    
    // Slow sweeping tremolo (10-second cycle)
    const tremolo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.1 * t);
    
    // Lower octave drone for deep ambient feel
    const droneL = Math.sin(2 * Math.PI * (freq / 2) * t) * 0.3 * tremolo;
    const droneR = Math.sin(2 * Math.PI * (freq / 2) * t) * 0.3 * tremolo;
    
    // Main frequency with binaural beat
    const mainL = Math.sin(2 * Math.PI * freq * t) * 0.5;
    const mainR = Math.sin(2 * Math.PI * (freq + beatFreq) * t) * 0.5;
    
    // Second lower harmonic
    const harmL = Math.sin(2 * Math.PI * (freq / 4) * t) * 0.15;
    const harmR = Math.sin(2 * Math.PI * (freq / 4) * t) * 0.15;
    
    let sampleL = (droneL + mainL + harmL) * envelope;
    let sampleR = (droneR + mainR + harmR) * envelope;
    
    // Soft white noise for space atmosphere
    sampleL += (Math.random() * 2 - 1) * 0.01;
    sampleR += (Math.random() * 2 - 1) * 0.01;
    
    // Clamp to prevent clipping
    sampleL = Math.max(-1, Math.min(1, sampleL));
    sampleR = Math.max(-1, Math.min(1, sampleR));
    
    const intL = sampleL < 0 ? sampleL * 32768 : sampleL * 32767;
    const intR = sampleR < 0 ? sampleR * 32768 : sampleR * 32767;
    
    buffer.writeInt16LE(Math.round(intL), offset);
    buffer.writeInt16LE(Math.round(intR), offset + 2);
    offset += 4;
  }
  
  return buffer;
}

const outDir = path.join(__dirname, 'assets', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating Solfeggio frequencies...');
chakras.forEach(chakra => {
  const filePath = path.join(outDir, `mantra_${chakra.id}.wav`);
  const buf = createWavBuffer(chakra.freq);
  fs.writeFileSync(filePath, buf);
  console.log(`Saved: mantra_${chakra.id}.wav (${chakra.freq}Hz)`);
});
console.log('All files generated successfully.');
