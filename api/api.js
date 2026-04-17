import { put } from '@vercel/blob';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const data = req.body;
        const id = Date.now().toString();
        const fileName = `submissions/${id}.json`;
        
        const blob = await put(fileName, JSON.stringify({
            id: id,
            ...data,
            time: new Date().toISOString()
        }), {
            access: 'private',
            addRandomSuffix: false,
        });
        
        return res.status(200).json({ success: true, id: id });
        
    } catch(error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
            }
