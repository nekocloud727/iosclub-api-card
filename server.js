const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/', (req, res) => {
  res.send('✅ Callback server is running. Route: /callback/card');
});

app.get('/api', async (req, res) => {
  const query = req.query;

  // Tạo URL đích
  const urlParams = new URLSearchParams(query).toString();
  const forwardUrl = `https://iosclub.rf.gd/api/card.php?${urlParams}`;
  console.log('🚀 Forwarding to:', forwardUrl);

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(forwardUrl, { waitUntil: 'networkidle2' });

    // Lấy phản hồi dưới dạng text (nếu là văn bản)
    const responseText = await page.evaluate(() => document.body.innerText);

    await browser.close();

    console.log('📩 Phản hồi từ iosclub:', responseText);
    res.send('✅ Đã chuyển tiếp và xử lý callback thành công');
  } catch (err) {
    console.error('❌ Lỗi khi chuyển tiếp:', err.message);
    res.status(500).send('❌ Lỗi server khi chuyển tiếp');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
