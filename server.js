const http = require('http'); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize');
const user_routes = require('./src/routes/UserRoutes');
const post_categories_routes = require('./src/routes/CategoryRoutes');
const post_routes = require('./src/routes/PostRoutes');
const comment_routes = require('./src/routes/CommentRoutes');
const { log } = require('console');
require('dotenv').config();
const app = express();

app
.use(cors())
.use(bodyParser.json());

// SERVER PROCESS CODE
sequelize.database_sync();

// SERVER ROUTES
app
.use('/api/users', user_routes)
.use('/api/post-categories', post_categories_routes)
.use('/api/posts', post_routes)
.use('/api/comments', comment_routes);


app.set('port', process.env.PORT);
const server = http.createServer(app);
server.listen(process.env.PORT);
