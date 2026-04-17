import { list } from '@vercel/blob';

export default async function handler(req, res) {
    try {
        const { blobs } = await list({ prefix: 'submissions/' });
        const submissions = [];
        
        for (const blob of blobs) {
            // إضافة التوكين لقراءة الملفات الخاصة
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
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(submissions);
        
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
}
