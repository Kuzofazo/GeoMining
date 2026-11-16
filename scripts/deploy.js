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

  // 1. Build the project (skip if --skip-build passed and dist exists)
  const distDir = path.resolve(projectRoot, 'dist');
  const skipBuild = process.argv.includes('--skip-build') && fs.existsSync(distDir);

  if (skipBuild) {
    console.log('⚡ Step 1: Using existing fresh production build (--skip-build)...');
  } else {
    console.log('📦 Step 1: Building fresh production distribution...');
    try {
      execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    } catch (err) {
      console.error('❌ Build failed. Aborting deployment.');
      process.exit(1);
    }
  }

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found after build!');
    process.exit(1);
  }

  async function tryUpload(secure) {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    client.ftp.timeout = 180000; // 3 minutes timeout to prevent control socket drop
    try {
      await client.access({
        host,
        user,
        password,
        port,
        secure,
        secureOptions: { rejectUnauthorized: false },
      });
      console.log(secure ? '🔒 Connected securely via FTPS (TLS).' : ' Connected via standard FTP.');
      console.log(`📂 Destination: ${remoteDir}...`);
      await client.ensureDir(remoteDir);
      console.log('📤 Synchronizing files to HostGator...');
      await client.uploadFromDir(distDir, remoteDir);
      return true;
    } finally {
      client.close();
    }
  }

  console.log(`\n🔌 Step 2: Deploying to HostGator FTP (${host}:${port}) as ${user}...`);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`\nAttempt ${attempt}/3...`);
      // Try FTPS first; fallback to standard FTP if TLS control socket drops
      const secure = attempt === 1;
      await tryUpload(secure);
      console.log('\n🎉 Deployment completed successfully!');
      console.log('🌐 Your updates are now live at https://geominingec.com with zero downtime.');
      return;
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) {
        console.log('Waiting 4s before next attempt...');
        await new Promise((r) => setTimeout(r, 4000));
      } else {
        console.error('\n❌ All deployment attempts failed.');
      }
    }
  }
}

deploy();

