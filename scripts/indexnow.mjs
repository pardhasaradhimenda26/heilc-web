/**
 * Tells Bing, Yandex, Seznam and Naver (IndexNow) that pages changed — free,
 * and Bing's index also feeds ChatGPT search and Copilot. Run after deploys:
 *
 *   npm run indexnow
 *
 * The key file lives at /public/1d49e2c2f5de2fa8f6c9a01934f36e73.txt; it is public by design.
 */
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.heilc.com").replace(/\/+$/, "");
const KEY = "1d49e2c2f5de2fa8f6c9a01934f36e73";

const res = await fetch(`${SITE}/sitemap.txt`);
if (!res.ok) throw new Error(`Could not read ${SITE}/sitemap.txt (${res.status})`);
const urlList = (await res.text()).split("\n").map((u) => u.trim()).filter(Boolean);

const submit = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${submit.status}`);
if (submit.status >= 400) console.log(await submit.text());
