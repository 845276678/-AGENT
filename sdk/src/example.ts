import { createClient } from './client';

async function main(){
  const baseUrl = 'http://localhost:8000/v1';
  const { client } = createClient(baseUrl);
  const stats = await client.GET('/stats/platform');
  console.log(stats.data);
}
main().catch(console.error);
