const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.cadguardian.com',
  'https://cad-guardian-frontend-js.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// openai
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/summarize', async (req, res) => {
  try {
    const imageBase64 = req.body.image;
    const prompt = `Summarize the content of this image: ${imageBase64}`;
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
    });

    res.json({ summary: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the image');
  }
});
