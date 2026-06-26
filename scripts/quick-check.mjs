const url = process.argv[2] || 'https://www.dreamlab.id/thankyoupage-google/?_gl=1*rfshcq*_gcl_au*MTY4MDcwNDg4Ni4xNzc5MjQxMjMx*_ga*MTYyMTc3NTY0Ny4xNzcxMzMyMzcx*_ga_T5SZRCDS0T*czE3ODIzOTUzNTkkbzExNSRnMCR0MTc4MjM5NTM1OSRqNjAkbDAkaDE5MjAxNzEwNw..';

async function main() {
  const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
  console.log('Status:', res.status);
  console.log('Location:', res.headers.get('location') || '(none)');
  console.log('Content-Type:', res.headers.get('content-type'));
  
  if (res.status === 200) {
    const text = await res.text();
    console.log('Title:', text.match(/<title>(.*?)<\/title>/i)?.[1] || '(not found)');
    console.log('Body length:', text.length);
  }
}

main().catch(e => console.log('Error:', e.message));
