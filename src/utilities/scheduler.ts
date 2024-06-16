import cron from 'node-cron';
import { refreshPageAccessToken } from './facebook-token-utils.ts.js';

export const scheduler = () => {
  // Schedule the refresh to run on the first day of every second month at midnight
  cron.schedule('0 0 1 */2 *', async () => {
    console.log('Running the token refresh task');
    await refreshPageAccessToken();
  });
  console.log('Token refresh scheduler started');
}