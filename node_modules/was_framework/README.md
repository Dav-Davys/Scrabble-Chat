# was_framework


Express-based framework used in the WAS course @UVersailles

Course page at http://swift.prism.uvsq.fr/

Install

    npm install was_framework

Example

```javascript
var fmwk = require('was_framework');

var opts = {
  default_handler: handler
};

// Create and configure application
var app = fmwk(opts);

function handler(req, res) {
  res.send(200, 'Hello world');
}

// Start application on port 12345
app.start(12345);
```

## Recognized options

* `static_dir` directory containing static content (must be an absolute path). Default: `/path/to/script/static/`.
* `static_mount` URL where static content is served. Default: `/static`.
* `template_dir` directory containing templates (must be an absolute path). Default: `/path/to/script/templates/`.
* `default_handler` handler to be executed when no other handler is found. Default: `was_framework.not_found_handler`.
* `default_route` redirect all requests for '/' to this URL. Default `null`.
* `secret` secret used for cookies. Default: `WAS`.
* `port` port to listen to. Default `8080`.
* `db` object containing database configuration. See [below](#databases). Default `null`.

Example showing use of all options:

```javascript
var fmwk = require('was_framework');

var opts = {
  static_dir         : __dirname + 'client',
  static_mount       : '/public',
  template_dir       : __dirname + 'views',
  default_handler    : handler,
  default_route      : '/index',
  secret             : 'my_secret',
  port               : 80
  db                 : {
                          type: 'sqlite',
                          file: 'data.db'
  }
};

var app = fmwk(opts);

app.f_routes.index = function(req, res) {
  res.send('This is the default page');
}

app.f_routes.view = function(req, res) {
  // my_client.js is in ./public
  res.render('a_view.mu', { 
                            title: 'This is a template',
                            script: '<script src="/public/my_client.js"></script>'
                          });
}

function handler(req, res) {
  res.send(404, 'Not found');
}

app.start();
```

All the options are added to the application's settings, so that you may get the using the `.get`:

```javascript
var dir = app.get('static_dir');
```

## Starting the server

The `.start` method is used to start the application. It takes three arguments:

```javascript
function start(port, db, callback)
```

* `port` is the port number to listen on.
* `db` is an object as described in the [Databases section](#databases). If both this object and the `db` option is used, this one gets the precedence.
* `callback` is a callback to be called after the server has started. It receives an optional `error` argument if the server fails to start.

```javascript
var fmwk = require('was_framework');

var opts = {
  db: {
    type: 'sqlite',
    file: 'app.db'
  }
}

var app = fmwk();

app.start(80, opts.db, function(err) {
  console.log('Server started');
});
```

## Routing

`was_framwork` comes with a *function name based router*, mapping
URLs to functions with the least effort. Handlers are
added to the object `app.f_routes`.

```javascript
var fmwk = require('was_framework');

var opts = {
  // redirect all requests for / to /home
  default_route: '/home';
}

var app = fmwk(opts);

app.f_routes.home = function(req, res) {
  // this function handles requests for /home
};

app.f_routes.fee = function(req, res) {
  // this function handles requests for /fee
};

// You can even nest functions inside objects
app.f_routes.foo = {
  bar: function(req, res) {
    // this function handles requests for /foo/bar
  },

  baz: function(req, res) {
    // this function handles requests for /foo/baz
  }
};

app.start();
```

Besides the function name based router, `was_framework` supports also
the default router of [express](http://expressjs.com) for finer control over
URLs and HTTP methods. Read the [documentation](http://expressjs.com/api.html#app.VERB) of
[express](http://expressjs.com) for more information.


## Sending content

`was_framework` supports the usual `.write` and `.end` methods. More high-level functions to send content 
to the user are available via [express](http://expressjs.com/api.html) functions.

The `.send` method sends arbitrary content and sets the appropriate HTTP headers. To set the content type,
use the `.type` method.

```javascript
app.f_routes.a_route = function(req, res) {
  res.type('html');
  res.send('<h1>Hello world!</h1>');
}
```

The `.json` method compiles JavaScript objects to JSON and sends them with the appropraite HTTP headers.
Content type is automatically set

```javascript
app.f_routes.xhr = function(req, res) {
  var data = {
    name     : 'foo',
    surname  : 'bar',
    adress   : 'some avenue'
  };
  res.json(data);
}
```

The `.download` method sends a file for download. The mime type is automaticalli guessed

```javascript
app.f_routes.download = function(req, res) {
  res.download('/path/to/file.png').
}
```


## Hogan.js templates

`was_framework` comes with built-in support for [Mustache](http://mustache.github.com/mustache.5.html)
templates using `hogan.js`.
Unless configured otherwise (see [options](#recognized-options)), Mustache templates must be contained in a directory called
`templates`, and must have filename
ending in `.mu` or `.mustache`. Templates are compiled and sent
to the client at once using the `.render`.

```javascript
app.f_routes.home = function(req, res) {
  // Compile Mustache template and send to the user
  res.render('about.mu', { title: 'My cool web app' });
}
```

A feature unique to `was_framework` is the method `.multiRender`,
allowing to compile and send multiple templates. It makes a simpler alternative to partials. Here’s an example using
three templates, the compiled HTML is concatenated and sent to the
user.

```javascript
app.f_routes.home = function(req, res) {
  res.multiRender(['head.mu', 'body.mu', 'foot.mu'], { title: 'My cool web app' });
}
```


## Static file server

`was_framework` comes with built-in support for static files. 
Create a directory named `static` inside your working directory: any file
contained in it will be available at the URL `/static/filename`. These paths can be configured, see [options](#recognized-options).


## Redirections and other HTTP codes

URL redirections are performed by the `.redirect` method.

```javascript
app.f_routes.rel_redirect = function(req, res) {
  res.redirect('a/relative/url/');
};

app.f_routes.abs_redirect = function(req, res) {
  res.redirect('/an/absoulte/url/');
}

app.f_routes.full_redirect = function(req, res) {
  res.redirect('http://some.other.site/some/page');
}
```

Other HTTP codes can be sent to the client, along with an arbitrary
message, using the `.send` method.

```javascript
app.f_routes.error = function(req, res) {
  res.send(500, '<h1>An unexpected error occured.</h1>');
}
```

## Cookies

Received cookies are parsed into the `req.cookies` object

```javascript
app.f_routes.read_cookies = function(req, res) {
  console.log(req.cookies.sessid);
}
```

To set cookies, use the `res.setCookie` method, to clear the, use `res.clearCookie`

```javascript
app.f_routes.set_cookie = function(req, res) {
  res.setCookie('sessid', '1');
}

app.f_routes.clear_cookie = function(req, res) {
  res.clearCookie('sessid');
}
```


## Databases

`was_framework` has builtin support for MySql and SQLite, based on the modules [mysql](https://npmjs.org/package/mysql)
and [node-sqlite-purejs](https://npmjs.org/package/node-sqlite-purejs). The
connection to the database is opened automatically before the server is
started. Use an SQLite database like this (if `filename.db` does not
exist, it is created automatically):

```javascript
var fmwk = require('was_framework');

var opts = {
  db: {
    type: 'sqlite',
    file: 'filename.db'
  }
}

var app = fmwk(opts);

app.start();   // by default, listen on port 8080
```

Use a MySql database like this:

```javascript
var fmwk = require('was_framework');

var opts = {
  db: {
    type: 'mysql',
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'db'
  }
}

var app = fmwk(opts);

app.start();   // by default, listen on port 8080
```

Are also recognized all the options accepted by the modules
[mysql](https://npmjs.org/package/mysql)
and [node-sqlite-purejs](https://npmjs.org/package/node-sqlite-purejs).

After a successfull connection, an `app.db` object is created.
Independently of the driver, `was_framework` tries to provide an API as
consistent as possible with that of the [mysql](https://npmjs.org/package/mysql) module. To
send an SQL query to the database, use the `.query` method of `app.db`, with the following signature

```
query(sql[, values[, callback]])
```

Where `sql` is a string containing an SQL statement, values is an optional array of values to be replaced inside `sql`,
and `callback` is a function with signature `callback(err, results)` to be called upon completion or error.

The `.query` method supports automatic SQL esacping to help prevent SQL injections. A `?` or `??` is replaced 
by the corresponding value in `values`. `?` is for escaping SQL values, while `??` is for escaping SQL identifierss.
In this example

```javascript
app.db.query('SELECT ?? FROM table WHERE name=? AND town=?', ['adress', 'WAS', 'Versailles']);
```

produces the SQL statement

```sql
SELECT `adress` FROM table WHERE name='WAS' AND town='Versailles'
```

Always prefer automatic escaping. If you really want to do the
escaping manually, you can use the methods `app.db.escape` for
values `app.db.escapeId` for identifiers. An alternative is to use
`app.db.format(sql, values)`, which returns a string with substitutions performed as in the `.query` method.

Here is a longer example.

```javascript
app.f_routes.create_table = function(req, res) {
  req.app.db.query('CREATE TABLE test (a TEXT, b TEXT)', function(err) {
    if (err) console.log(err);
  });
};

app.f_routes.select = function(req, res) {
  // Prepared statement (use ?)
  req.app.db.query('SELECT * FROM test WHERE a=? AND b=?', 
                   [req.query.a, req.query.b],
                   function(err, results) {
                     if (err) {
                       console.log(err);
                     } else {
                       for (var i = 0; i < results.length; i++)
                         console.log(results[i]);
                     }
  });
}
```

## Socket.io

`was_framwork` has builtion support for [socket.io](http://socket.io/). To use it, simply pass the 
option `socket_io`, and the socket object will be available at `app.io`.

```javascript
var fmwk = require('was_framework');

var app = fmwk({
    socket_io: true
})

app.f_routes.politesse = function(req, res) {
    res.write('<script src="/socket.io/socket.io.js"></script>');
    res.write('<script>');
    res.write('  var socket = io.connect("http://localhost");');
    res.write('  socket.on("merci", function (data) {');
    res.write('    console.log(data);');
    res.write('    socket.emit("de rien", { my: "Il n\'y a pas de quoi!" });');
    res.write('  });');
    res.write('</script>');
    res.end();
}

app.io.sockets.on('connection', function(socket) {
    socket.emit('merci', {greet: 'Merci beaucoup'});
    socket.on('de rien', function(data) {
        console.log(data);
    });
});

app.start(12345)
```

Alternatively, the `http` server for the application is available at `app.http_server`. You can use it to create 
the socket like this.

```javascript
var fmwk = require('was_framework');
var app = fmwk();
var io = require('socket.io').liste(app.http_server);
```
