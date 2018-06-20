const env = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
let config = {},
	appInfo = {
		name: 'Mathas',
		description: 'Multiplayer math game',
		keywords: 'math, game',
		author: 'Bomdi Zane <dzedock@yahoo.com> (https://bomdizane.azurewebsites.net)',
	};

config.development = {
	envName : 'development',
	port: process.env.PORT || 3000,
	appInfo: appInfo,
	security: {
		cookieSeret: 'dashcookiesbsdashbomdizane',
		sessionSecret: 'bdashsessiondashbomdizanes',
		saltRounds: 10,
	},
	database: {
		nosql: {
			connectionString: 'mongodb://localhost/dbName',
			options: {
				autoIndex: false, // Don't build indexes
				reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
				reconnectInterval: 500, // Reconnect every 500ms
				poolSize: 10, // Maintain up to 10 socket connections
				bufferMaxEntries: 0  // If not connected, return errors immediately rather than waiting for reconnect
			}
		},
		sql: {
			connectionString: '',
			options: {
				host : 'localhost',
				port : '3306',
				user : 'Bomdi Zane',
				password : 'password',
				database : 'dbName',
				connectionLimit : 10, // This number can be changed in production as per the needs
				supportBigNumbers : true
			}
		}
	},
};

config.test = {
	envName : 'test',
	port: process.env.PORT || 3000,
	appInfo: appInfo,
	security: {
		cookieSeret: 'dashcookiesbsdashbomdizane',
		sessionSecret: 'bdashsessiondashbomdizanes',
		saltRounds: 10,
	},
	database: {
		nosql: {
			connectionString: 'mongodb://dbHost/dbName',
			options: {
				autoIndex: false, // Don't build indexes
				reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
				reconnectInterval: 500, // Reconnect every 500ms
				poolSize: 10, // Maintain up to 10 socket connections
				bufferMaxEntries: 0  // If not connected, return errors immediately rather than waiting for reconnect
			}
		},
		sql: {
			connectionString: '',
			options: {
				host : 'localhost',
				port : '3306',
				user : 'Bomdi Zane',
				password : 'password',
				database : 'dbName',
				connectionLimit : 10, // This number can be changed in production as per the needs
				supportBigNumbers : true
			}
		}
	},
};

config.production = {
	envName : 'production',
	port: process.env.PORT || 3000,
	appInfo: appInfo,
	security: {
		cookieSeret: 'dashcookiesbsdashbomdizane',
		sessionSecret: 'bdashsessiondashbomdizanes',
		saltRounds: 10,
	},
	database: {
		nosql: {
			connectionString: 'mongodb://dbHost/dbName',
			options: {
				autoIndex: false, // Don't build indexes
				reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
				reconnectInterval: 500, // Reconnect every 500ms
				poolSize: 10, // Maintain up to 10 socket connections
				bufferMaxEntries: 0  // If not connected, return errors immediately rather than waiting for reconnect
			}
		},
		sql: {
			connectionString: '',
			options: {
				host : 'dbHost',
				port : '3306',
				user : 'Bomdi Zane',
				password : 'password',
				database : 'dbName',
				connectionLimit : 10, // This number can be changed in production as per the needs
				supportBigNumbers : true
			}
		}
	},
};

module.exports = typeof(config[env]) === 'object' ? config[env] : config.development;