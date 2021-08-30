/**
 * Module dependencies.
 */
import { createServer } from 'http';
import config from '../config.js';
import app from '../app.js';
import MongoHelper from '../dao/mongo_helper.js';

console.log('Checking DB Connection..');

/**
 * Test the MongoDb database before listening onto the designated port
 */

await MongoHelper.connectMongoDB();
/**
 * Get port from environment and store in Express.
 */

const port = config.port || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe  ${port}`
    : `Port + ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(`${bind}  is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe  ${addr}`
    : `port  ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
