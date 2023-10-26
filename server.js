const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const PORT = 3000;
const HOSTNAME = 'localhost';

const SlamBook = require('./model.js');

const uri = "mongodb+srv://suraj_admin:suraj_admin@cluster0.dme40pl.mongodb.net/?retryWrites=true&w=majority";

async function startServer() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Create HTTP Server
    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
      const method = req.method.toLowerCase();
      const queryStringObject = parsedUrl.query;

      // Buffer the data
      const decoder = new StringDecoder('utf-8');
      let buffer = '';
      req.on('data', (data) => {
        buffer += decoder.write(data);
      });

      req.on('end', async () => {
        buffer += decoder.end();

        let responseContent = 'Not Found\n';
        let statusCode = 404;

        try {
          if (path === 'slambook') {
            switch (method) {
              case 'get':
                const entries = await SlamBook.find(queryStringObject);
                responseContent = JSON.stringify(entries);
                statusCode = 200;
                break;
              case 'post':
                const newEntry = new SlamBook(JSON.parse(buffer));
                await newEntry.save();
                responseContent = 'Entry Created\n';
                statusCode = 201;
                break;
            }
          } else if (path.startsWith('slambook/')) {
            const id = path.split('/')[1];
            switch (method) {
              case 'get':
                const entry = await SlamBook.findById(id);
                if (entry) {
                  responseContent = JSON.stringify(entry);
                  statusCode = 200;
                }
                break;
              case 'put':
                const updatedEntry = await SlamBook.findByIdAndUpdate(id, JSON.parse(buffer), { new: true });
                if (updatedEntry) {
                  responseContent = 'Entry Updated\n';
                  statusCode = 200;
                }
                break;
              case 'delete':
                const deletedEntry = await SlamBook.findByIdAndDelete(id);
                if (deletedEntry) {
                  responseContent = 'Entry Deleted\n';
                  statusCode = 200;
                }
                break;
            }
          }

          res.writeHead(statusCode, { 'Content-Type': 'application/json' });
          res.end(responseContent);

        } catch (error) {
          console.error('Error processing request:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end('Internal Server Error\n');
        }
      });
    });

    // Start HTTP Server
    server.listen(PORT, HOSTNAME, () => {
      console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  }
}

startServer();
