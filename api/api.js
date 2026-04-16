export default async function handler(req, res) {
    try {
        // عرض صفحة HTML بسيطة للبيانات
        // ملاحظة: بعد ربط Blob Storage، ستجلب البيانات الحقيقية من هناك
        
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>لوحة التحكم - TikTok Shop</title>
                <style>
                    body {
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        font-family: 'Cairo', 'Segoe UI', system-ui;
                        padding: 20px;
                        color: #fff;
                        direction: rtl;
                    }
                    .container { max-width: 1200px; margin: 0 auto; }
                    h1 { text-align: center; color: #00f2ea; margin-bottom: 30px; }
                    .note {
                        background: #ff4757;
                        padding: 15px;
                        border-radius: 12px;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    a { color: #00f2ea; text-decoration: none; }
                    .btn {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #00f2ea;
                        color: #1a1a2e;
                        border-radius: 8px;
                    }
                </style>
            </head>
            <body>
            <div class="container">
                <h1>📊 لوحة التحكم - TikTok Shop</h1>
                <div class="note">
                    ⚠️ لعرض البيانات، قم بربط Vercel Blob Storage أولاً.<br>
                    راجع التعليمات في الشرح السابق.
                </div>
                <p>البيانات المسجلة ستظهر هنا بعد ربط التخزين.</p>
                <a href="/" class="btn">🏠 العودة للرئيسية</a>
            </div>
            </body>
            </html>
        `);
        
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}