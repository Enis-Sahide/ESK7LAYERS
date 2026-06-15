require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://mbqjklupfoqbcfxusigs.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icWprbHVwZm9xYmNmeHVzaWdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODU2MDA4NSwiZXhwIjoyMDk0MTM2MDg1fQ.HcGzOdrjgf_NwWF-6YALN1rYWIGRBMz0Z6UzKqRjxvc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'app-assets';

async function uploadDirectory(dirPath, bucketPath) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = bucketPath ? bucketPath + '/' + item : item;
    
    if (fs.lstatSync(fullPath).isDirectory()) {
      await uploadDirectory(fullPath, relativePath);
    } else {
      if (!fullPath.match(/\.(png|jpg|jpeg|wav)$/)) continue;
      console.log('Uploading: ' + relativePath);
      const fileBuffer = fs.readFileSync(fullPath);
      let contentType = 'application/octet-stream';
      if (fullPath.endsWith('.png')) contentType = 'image/png';
      if (fullPath.endsWith('.jpg') || fullPath.endsWith('.jpeg')) contentType = 'image/jpeg';
      if (fullPath.endsWith('.wav')) contentType = 'audio/wav';
      
      await supabase.storage.from(BUCKET_NAME).upload(relativePath, fileBuffer, { contentType, upsert: true });
    }
  }
}

async function main() {
  await uploadDirectory(path.join(__dirname, 'assets', 'images'), 'images');
  await uploadDirectory(path.join(__dirname, 'assets', 'audio'), 'audio');
  console.log('DONE!');
}
main();
