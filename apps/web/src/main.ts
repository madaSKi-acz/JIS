import './style.css';
import { loadConfig } from './config';

const config = loadConfig(import.meta.env);
const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <main class="placeholder">
      <h1>JIS</h1>
      <p lang="km">ផែនទីទេសចរណ៍ និងការដឹកជញ្ជូននៅកម្ពុជា</p>
      <p lang="en">Cambodia tourism &amp; transport map — coming soon.</p>
    </main>
  `;
  console.info('JIS config', config);
}
