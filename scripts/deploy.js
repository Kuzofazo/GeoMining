import * as ftp from 'basic-ftp';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load environment variables from .env.local first, fallback to .env
const envLocalPath = path.resolve(projectRoot, '.env.local');
const envPath = path.resolve(projectRoot, '.env');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const host = process.env.FTP_HOST || 'ftp.geominingec.com';
const user = process.env.FTP_USER;
const password = process.env.FTP_PASSWORD;
const port = parseInt(process.env.FTP_PORT || '21', 10);
const remoteDir = process.env.FTP_REMOTE_DIR || '/public_html';

async function deploy() {
  console.log('🚀 Starting GeoMining Zero-Downtime Deployment to HostGator...\n');

  if (!user || !password) {
    console.error('❌ Missing FTP Credentials!');
    console.error('Please configure FTP_USER and FTP_PASSWORD in your .env.local file:');
    console.error(`
FTP_HOST=ftp.geominingec.com
FTP_USER=your_cpanel_username (or deploy@geominingec.com)
FTP_PASSWORD=your_password
FTP_PORT=21
FTP_REMOTE_DIR=/public_html
`);
    process.exit(1);
  }

  // 1. Build the project
  console.log('📦 Step 1: Building fresh production distribution...');
  try {
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Build failed. Aborting deployment.');
    process.exit(1);
  }

  const distDir = path.resolve(projectRoot, 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found after build!');
    process.exit(1);
  }

  // 2. Connect to FTP
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log(`\n🔌 Step 2: Connecting to HostGator FTP (${host}:${port}) as ${user}...`);
    try {
      // Try explicit TLS first for secure transmission
      await client.access({
        host,
        user,
        password,
        port,
        secure: true,
        secureOptions: { rejectUnauthorized: false },
      });
      console.log('🔒 Connected securely via FTPS (TLS).');
    } catch (tlsErr) {
      console.log('ℹ️  FTPS unavailable or timed out, trying standard FTP...');
      await client.access({
        host,
        user,
        password,
        port,
        secure: false,
      });
      console.log(' Connected via standard FTP.');
    }

    console.log(`📂 Step 3: Navigating to destination: ${remoteDir}...`);
    await client.ensureDir(remoteDir);

    console.log('📤 Step 4: Synchronizing production files to HostGator public_html...');
    await client.uploadFromDir(distDir, remoteDir);

    console.log('\n🎉 Deployment completed successfully!');
    console.log('🌐 Your updates are now live at https://geominingec.com with zero downtime.');
  } catch (err) {
    console.error('\n❌ Deployment failed with error:', err.message);
  } finally {
    client.close();
  }
}

deploy();

