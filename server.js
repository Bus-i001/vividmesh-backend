const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('VividMesh AI Backend is live!');
});

// AI Generation Route
app.post('/api/generate', async (req, res) => {
  const { mode, prompt } = req.body;
  
  try {
    let apiResponse;
    
    if (mode === '3d') {
      const response = await fetch('https://api.meshy.ai/v2/text-to-3d', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MESHY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode: 'preview', prompt })
      });
      apiResponse = await response.json();
      
    } else {
      const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${process.env.FAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      apiResponse = await response.json();
    }
    
    res.json({ success: true, data: apiResponse });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        
