const express = require('express');
const cors = require('cors');
const knex = require('knex');

const { registerControl } = require('./controllers/registerControl');
const { loginControl } = require('./controllers/loginControl');
const {
  usersCollectionsGetControl,
  userCollectionsGetControl,
  collectionsPostControl,
} = require('./controllers/collectionsControl');
const {
  itemsPostControl,
  userItemsGetControl,
  usersItemsGetControl,
} = require('./controllers/itemsControl');
const { likesPutControl } = require('./controllers/likesControl');
const {
  itemCommentsGetControl,
  commentsPostControl,
} = require('./controllers/commentsControl');
const { topicsGetControl } = require('./controllers/topicsControl');

const PORT = process.env.PORT || 8000;
const app = express();
const postgres = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  },
});

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => registerControl(req, res)(postgres));

app.post('/login', (req, res) => loginControl(req, res)(postgres));

app.post('/items', (req, res) => itemsPostControl(req, res)(postgres));

app.get('/items', (req, res) => usersItemsGetControl(req, res)(postgres));

app.get('/items/:id', (req, res) => userItemsGetControl(req, res)(postgres));

app.post('/collections/:id', (req, res) =>
  collectionsPostControl(req, res)(postgres)
);

app.get('/collections/:id', (req, res) =>
  userCollectionsGetControl(req, res)(postgres)
);

app.get('/collections', (req, res) =>
  usersCollectionsGetControl(req, res)(postgres)
);

app.put('/likes/:id', (req, res) => likesPutControl(req, res)(postgres));

app.post('/comments', (req, res) => commentsPostControl(req, res)(postgres));

app.get('/comments', (req, res) => itemCommentsGetControl(req, res)(postgres));

app.get('/topics', (_, res) => topicsGetControl(res)(postgres));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
