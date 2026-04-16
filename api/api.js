import { list } from '@vercel/blob';

export default async function handler(req, res) {
    try {
        const { blobs } = await list({ prefix: 'submissions/' });
        
        // عرض البيانات كـ JSON بسيط أولاً
        const submissions = [];
        for (const blob of blobs) {
            const response = await fetch(blob.url);
            const data = await response.json();
            submissions.push(data);
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(submissions);
        
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
