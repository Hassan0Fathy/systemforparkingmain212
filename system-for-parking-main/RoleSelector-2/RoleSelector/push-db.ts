import 'dotenv/config';
import { spawn } from 'child_process';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL must be set');
  process.exit(1);
}

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL
};

const child = spawn('drizzle-kit', ['push'], {
  stdio: 'inherit',
  shell: true,
  env
});

child.on('error', (err) => {
  console.error(String(err));
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code === null ? 0 : code);
});
