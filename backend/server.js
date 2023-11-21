// TASK 1: Setting up server


const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

const PORT = 8000;
const HOSTNAME = '0.0.0.0';

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});




// Task 2 : Connecting with mongo db data base 

/*
const http = require('http');
const { MongoClient } = require('mongodb');

const PORT = 8000;
const HOSTNAME = '0.0.0.0';

const mongoUri = 'mongodb+srv://<user_name>:<password>s@<mongo_cluster_url>';
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Create HTTP Server
    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello World\n');
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

*/




// TASK 3 : Use mongoose instead of mongodb driver 

/**
const http = require('http');
const mongoose = require('mongoose');

const PORT = 8000;
const HOSTNAME = '0.0.0.0';

const uri = "mongodb+srv://suraj_admin:suraj_admin@cluster0.dme40pl.mongodb.net/?retryWrites=true&w=majority";

async function startServer() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Create HTTP Server
    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello World\n');
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

 */



//TASK5: Write sample crud endpoints
/**
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const PORT = 8000;
const HOSTNAME = '0.0.0.0';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();

  // Buffer the data
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    let responseContent = 'Not Found\n';
    let statusCode = 404;

    // Sample CRUD Endpoints
    if (path === '') {
      switch (method) {
        case 'get':
          responseContent = 'Read: Sample Data\n';
          statusCode = 200;
          break;
        case 'post':
          responseContent = 'Create: Data Received - ' + buffer + '\n';
          statusCode = 201;
          break;
        case 'put':
          responseContent = 'Update: Data Received - ' + buffer + '\n';
          statusCode = 200;
          break;
        case 'delete':
          responseContent = 'Delete: Sample Data\n';
          statusCode = 200;
          break;
      }
    }

    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    res.end(responseContent);
  });
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
 */


//TASK 06-09 CRUD For Slambook: 
/* 
const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const PORT = 8000;
const HOSTNAME = '0.0.0.0';

const SlamBook = require('./model.js');

//  Change with your MONGO URI :
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
          if (path === '') {
            responseContent = JSON.stringify(`Yay, app is running on port ${PORT}`);
            statusCode = 200;
          }
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

**/
