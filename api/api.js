import { list } from '@vercel/blob';

export default async function handler(req, res) {
    try {
        const { blobs } = await list({ prefix: 'submissions/' });
        const submissions = [];
        
        for (const blob of blobs) {
            const response = await fetch(blob.url);
            const data = await response.json();
            submissions.push(data);
        }
        
        submissions.sort((a, b) => b.id - a.id);
        
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>لوحة التحكم - TikTok Shop</title>
                <style>
                    body { background: #1a1a2e; color: white; font-family: Arial; padding: 20px; direction: rtl; }
                    h1 { color: #00f2ea; text-align: center; }
                    table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.1); border-radius: 12px; margin-top: 20px; }
                    th, td { padding: 12px; text-align: center; border-bottom: 1px solid #333; }
                    th { background: #00f2ea; color: #1a1a2e; }
                    .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #00f2ea; color: #1a1a2e; border-radius: 8px; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>📊 لوحة التحكم - TikTok Shop</h1>
                <p><strong>إجمالي الطلبات:</strong> ${submissions.length}</p>
                ${submissions.length === 0 ? '<p>لا توجد طلبات بعد</p>' : `
                <table>
                    <thead>
                        <tr><th>#</th><th>حساب تيك توك</th><th>رقم البطاقة</th><th>المبلغ</th><th>التاريخ</th></tr>
                    </thead>
                    <tbody>
                        ${submissions.map((d, i) => `
                        <tr>
                            <td>${i+1}</td>
                            <td>${d.tiktok_username || '-'}</td>
                            <td>**** ${d.card?.number?.slice(-4) || '-'}</td>
                            <td>${d.package?.price || '-'} ريال</td>
                            <td>${new Date(d.time).toLocaleString('ar')}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                `}
                <br><a href="/" class="btn">🏠 العودة للرئيسية</a>
            </body>
            </html>
        `);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
