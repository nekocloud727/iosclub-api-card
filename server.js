const express = require('express');
const { chromium } = require('playwright');
const app = express();

app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

app.get('/api', async (req, res) => {
  const query = req.query;
  const urlParams = new URLSearchParams(query).toString();
  const forwardUrl = `https://iosclub.rf.gd/api/card.php?${urlParams}`;
  console.log('🚀 Đang truy cập:', forwardUrl);

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(forwardUrl, { waitUntil: 'networkidle' });

    const text = await page.textContent('body');
    await browser.close();

    res.send('✅ Kết quả: \n' + text);
  } catch (err) {
    console.error('❌ Lỗi:', err);
    res.status(500).send('❌ Lỗi: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server tại http://localhost:${PORT}`);
});
