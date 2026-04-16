import { put } from '@vercel/blob';

export default async function handler(req, res) {
    // السماح بالطلبات من أي مكان (للتجربة)
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

        // حفظ البيانات في Blob Storage
        const blob = await put(fileName, JSON.stringify({
            id: id,
            ...data,
            time: new Date().toISOString()
        }), {
            access: 'private',
            addRandomSuffix: false,
        });

        console.log('تم حفظ البيانات في:', blob.url);

        // إرسال رد بالنجاح
        return res.status(200).json({
            success: true,
            id: id,
            message: 'تم حفظ بياناتك بنجاح'
        });

    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
