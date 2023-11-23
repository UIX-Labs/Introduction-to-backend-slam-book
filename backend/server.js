// TASK 1: Setting up server


// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// const PORT = 8000;
// const HOSTNAME = '0.0.0.0';

// server.listen(PORT, HOSTNAME, () => {
//   console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
// });




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



//TASK 4:Create Document for slam book
/*
const slambookSchema = new mongoose.Schema({
  nameInYourContact: String,
  relationship: String,
  somethingYouLikeInMe: String,
  somethingYouHateInMe: String,
  ifIDieYourReaction: String,
  whatDidYouFeelWhenYouFirstSawMe: String,
  beutifulMessageForMe: String,
  nickNameForMe: String,
  songDedicatedToMe: String,
  canIShare: String,
  yourName: String
});

const SlamBook = mongoose.model('SlamBook', slambookSchema);
*/



//TASK5: Write sample crud endpoints
/**
const http = require('http');
const url = require('url');
const mongoose = require('mongoose');
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
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 8000;
const HOSTNAME = '0.0.0.0';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const uri = "mongodb+srv://suraj_admin:suraj_admin@cluster0.dme40pl.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });

// SlamBook schema and model
const slambookSchema = new mongoose.Schema({
  nameInYourContact: String,
  relationship: String,
  somethingYouLikeInMe: String,
  somethingYouHateInMe: String,
  ifIDieYourReaction: String,
  whatDidYouFeelWhenYouFirstSawMe: String,
  beutifulMessageForMe: String,
  nickNameForMe: String,
  songDedicatedToMe: String,
  canIShare: String,
  yourName: String
});

const SlamBook = mongoose.model('SlamBook', slambookSchema);
// Routes
app.get('/', (req, res) => {
  res.json({ message: `Yay, app is running on port ${PORT}` });
});

app.get('/slambook', async (req, res) => {
  try {
    const entries = await SlamBook.find(req.query);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching slambook entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/slambook', async (req, res) => {
  try {
    const newEntry = new SlamBook(req.body);
    await newEntry.save();
    res.status(201).json({ message: 'Entry Created' });
  } catch (error) {
    console.error('Error creating slambook entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/slambook/:id', async (req, res) => {
  try {
    const entry = await SlamBook.findById(req.params.id);
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error fetching slambook entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/slambook/:id', async (req, res) => {
  try {
    const updatedEntry = await SlamBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedEntry) {
      res.json({ message: 'Entry Updated' });
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error updating slambook entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/slambook/:id', async (req, res) => {
  try {
    const deletedEntry = await SlamBook.findByIdAndDelete(req.params.id);
    if (deletedEntry) {
      res.json({ message: 'Entry Deleted' });
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (error) {
    console.error('Error deleting slambook entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Start the server
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});