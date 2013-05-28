/* Dependencies */
var http = require('http');
var path = require('path');
var util = require('util');
var async = require('async');
var express = require('express');
var cons = require('consolidate');
var sql = require('./db');

/* Substitute exports with createServer */
exports = module.exports = createServer;
exports.createServer = createServer;

/* Export express */
exports.express = express;
exports.connect = express;

/* Some default configuration */
function Options(opt) {
    var cwd = require.main ? path.dirname(require.main.filename) : process.cwd();
    this.static_dir = opt.static_dir || path.resolve(cwd, 'static');
    this.static_mount = opt.static_mount || '/static';
    this.template_dir = opt.template_dir || path.resolve(cwd, 'templates');
    this.default_handler = opt.default_handler || exports.not_found_handler;
    this.default_route = opt.default_route;
    this.separator = opt.separator || '---------------------------------';
    this.secret = opt.secret || 'WAS';
    this.port = opt.port || 8080;
    this.db = opt.db;
    this.socket_io = opt.socket_io || false;
}

/* 
   This function creates an express app.
*/
function createServer(options) {
    var opt = new Options(options || {});

    var app = express();
    // Import configuration
    for (var o in opt) {
	app.set(o, opt[o]);
    }
    // Default middleware
    app.use(express.favicon())
	.use(express.query())
	.use(express.bodyParser())
	.use(express.cookieParser())
	.use(express.session( {secret: opt.secret } ))
	.use(opt.static_mount, express.static(opt.static_dir))
    // Template engines
    app.engine('mustache', cons.hogan)
	.engine('mu', cons.hogan)
	.set('view engine', 'mustache')
	.set('views', opt.template_dir);
    // Custom middleware
    app.use(exports.logger(opt.separator))
	.use(set_cookie)
	.use(exports.multi_render(app))
	.use(exports.fun_router(app));
    
    // Specify default page
    if (opt.default_route)
	app.get('/', function(req, res) { res.redirect(opt.default_route); });

    // Create http server
    app.http_server = http.createServer(app);
    if (app.get('socket_io')) {
	app.io = require('socket.io').listen(app.http_server);
    }

    app.listen = function() {
	app.http_server.listen.apply(app.http_server, arguments);
    };

    app.start = startServer;
    
    return app;
}

/*
  This function connects to the database (it the app uses one), then
  starts the server.

  The port to listen on can be given as first argument.  The second
  argument is a configuration object for the database, using the same
  syntax as in the Options object. Both arguments are replaced with
  the app's options if not given.

  The thid argument is a callback(err) to be executed after the server
  is started or an error occurs.
*/
function startServer(port, db, next) {
    var app = this;
    var port = port || app.get('port');
    var db = db || app.get('db');

    if (!(next instanceof Function)) {
	next = function(err) {
	    if (err) console.error(err);
	}
    }

    // Add one last handler for unrouted requests
    app.use(app.get('default_handler'));
    
    // Start the server
    return app.listen(port, function(err) {
	if (err) {
	    next(err);
	} else {
	    console.log("Server started successfully on port", port);
	    console.log();
	    // Connect to the database if requested
	    if (db) {
		sql.db_setup(app, db, next);
	    } else {
		next();
	    }
	}
    });
}



/****************** MIDDLEWARE *****************/


/*
  Default fallback handler. It sends a 404 error.
*/
exports.not_found_handler = function(req, res) {
    res.send(404, "Error 404. Could not find a handler for your request.");
}

/*
  This middleware logs useful information to the console
*/
exports.logger = function(separator) {
    var sep = separator || '';
    var _done = express.logger('\\nHTTP/:http-version :status :response-time ms\\n' + sep);
    return function(req, res, next) {
	_done(req, res, function(err) {
	    if (err) return next(err);
	    console.log();
	    console.log(sep);
	    console.log(Date());
	    console.log(req.method, req.url, 'HTTP/' + req.httpVersion);
	    for (h in req.headers) {
		console.log(h + ': ' + req.headers[h]);
	    }
	    console.log();
	    console.log('req.query (query string):', req.query);
	    console.log('req.body (POST content):', req.body);
	    console.log('req.cookies (Cookies):', req.cookies);
	    console.log('req.session (Session):', req.session);
	    console.log();
	    next();
	});
    }
}

/*
  Adds an alias for res.cookie
*/
function set_cookie(req, res, next) {
    res.setCookie = res.cookie;
    next();
}

/*
  Function name based router. It parses the request path and looks
  for a callable in the app.routes object. Slashes in the path
  are translated to dots.
*/
exports.fun_router = function(app) {
    // define the route object f_routes
    app.f_routes = {};
    
    return function(req, res, next) {
    	// Split the path into its components
	var mod = req.path.split('/');
	// filter out empty strings
	mod = mod.filter(function(x) { return x != '' });
	
	if (mod.length > 0) {
	    var handler = res.app.f_routes;
	    for (comp in mod)
		handler = handler ? handler[mod[comp]] : undefined;
	    if (handler instanceof Function) {
		handler(req, res, next);
	    } else {
	    	// no handler found
		next();
	    }
	} else {
	    // no handler found
	    next();
	}
    }
}

/*
  Adds a facility for rendering multiple views at once (concatenated).
*/
exports.multi_render = function(app) {
    app.multiRender = function (views, options, fn) {
	if (util.isArray(views)) {
	    if ('function' == typeof options) {
		fn = options, options = {};
	    }
	    // Render each view in parallel, using async
	    async.map(views,
		      function(v, cb) { app.render(v, options, cb); }, 
		      function(err, results) { fn(err, results.join('')); });
	} else {
	    return app.render(views, options, fn);
	}
    };

    return function(req, res, next) {
	res.multiRender = function(views, options, fn) {
	    options = options || {};
	    if ('function' == typeof options) {
		fn = options, options = {};
	    }
	    if (fn) {
		// Hack to reduce problems with consolidate.js
		// in case fn raises an error.
		var _fn = fn;
		fn = function(err, results) {
		    try {
			_fn(err, results);
		    } catch (err) {
			req.next(err);
		    }
		}
	    } else {
		fn = function(err, results) {
		    if (err) return req.next(err);
		    res.send(results);
		}
	    }
	    res.app.multiRender(views, options, fn);
	};
	next();
    };
}
