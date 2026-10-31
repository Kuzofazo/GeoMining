import * as ftp from 'basic-ftp';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load .env.local
const envLocalPath = path.resolve(projectRoot, '.env.local');
if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath });

const host = process.env.FTP_HOST;
const user = process.env.FTP_USER;
const password = process.env.FTP_PASSWORD;
const port = parseInt(process.env.FTP_PORT || '21', 10);

async function testFTP() {
  console.log('🔍 FTP Connection Test\n');
  console.log(`   Host    : ${host}`);
  console.log(`   User    : ${user}`);
  console.log(`   Port    : ${port}\n`);

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    // Try FTPS first, fallback to plain FTP
    try {
      await client.access({ host, user, password, port, secure: true, secureOptions: { rejectUnauthorized: false } });
      console.log('🔒 Connected via FTPS (TLS)\n');
    } catch {
      console.log('ℹ️  FTPS failed, trying plain FTP...');
      await client.access({ host, user, password, port, secure: false });
      console.log('✅ Connected via plain FTP\n');
    }

    // Show current directory and listing
    const pwd = await client.pwd();
    console.log(`📂 FTP Root Directory: ${pwd}\n`);

    console.log('📋 Files/Folders at FTP root:');
    const list = await client.list();
    list.forEach(item => {
      const type = item.type === 2 ? '📁' : '📄';
      console.log(`   ${type} ${item.name}`);
    });

    console.log('\n✅ FTP connection test PASSED!');
    console.log('✅ Use the directory above as your FTP_REMOTE_DIR (or a subfolder within it).');

  } catch (err) {
    console.error('❌ FTP connection FAILED:', err.message);
  } finally {
    client.close();
  }
}

testFTP();

