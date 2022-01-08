import { Connection, createConnection, getConnectionManager } from 'typeorm';

import config from './config/ormconfig';

export const dbCreateConnection = async (connectionNameVal?: string): Promise<Connection | null> => {
  try {
    if (typeof connectionNameVal !== 'undefined') {
      const connectionName = connectionNameVal || 'default';
      const conn = await createConnection({ ...config, name: connectionName });
      console.log(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
    } else {
      const conn = await createConnection(config);
      console.log(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
    }
  } catch (err) {
    // If AlreadyHasActiveConnectionError occurs, return already existent connection
    if (err.name === 'AlreadyHasActiveConnectionError') {
      const existentConn = getConnectionManager().get('default');
      return existentConn;
    }
  }
  return null;
};
