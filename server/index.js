// Backend: server.js (Node.js dengan Express)
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());


app.get('/data', (req, res) => {
  fs.readFile('readHistory.json', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }
    const history = JSON.parse(data.toString() || '[]');
    res.json(history);
  });
});

app.post('/save-url', (req, res) => {
  const { url, title, urlToImage } = req.body;
  fs.readFile('readHistory.json', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }
    const history = JSON.parse(data.toString() || '[]');
    history.push({ url, title, urlToImage });
    fs.writeFile('readHistory.json', JSON.stringify(history, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('Error writing file');
      }
      res.status(200).send('Article saved');
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
