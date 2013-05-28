	/* Get list of users */
exports.get_user_list = function(req, cb) {
    req.app.db.query('select * from users where etat=1', cb);
};

exports.get_user_connected = function(res, cb){
	req.app.db.query('select * from users', cb);
};

	/* Get single user */
exports.get_user = function(req, cb) {
    req.app.db.query('select * from users where login=?',
		     req.query.login, function(err, result) {
			 cb(err, result.length ? result[0] : null);
		     });
};

	/* Check that a user login and password correspond */
exports.login = function(req, cb) {
    req.app.db.query('select * from users where login=? and pwd=?',
		     [req.body.login, req.body.pwd],
		     function(err, result) {
			 if (!err) {
				 console.log(result.login);
			     cb(err, result.length == 1 ? result : null);
			 }
			 cb(err);
		     });
};

	/* Register new user */
exports.sign = function(req, cb) {
    if (req.body.email && /[^@]+@[^@]+/.test(req.body.email) && req.body.pwd) 
    {
		req.app.db.query('insert into users (login, email, pwd, etat) values (?, ?, ?, ?)', 
		[
			req.body.login,
			req.body.email,
			req.body.pwd, 
			1
		], function(err, result) 
		{
			if (err) 
			{
				if (err && (err.code == 'ER_DUP_ENTRY' || /^SQLite exception: 19/.test(err))) 
				{  
					// Login already exists, callback with no error
					cb(null, null, 'Email already has an account.');
				} 
				else { cb(err); }
			} 
			else {
				// Account creation successfull
				cb(null, { login: req.body.login, email: req.body.email,pwd: req.body.pwd});
			}	
		});
    } 
};

exports.update = function(req, cb) 
{
    if (['login', 'email', 'pwd', 'etat'].indexOf(req.query.column) < 0) {
		cb(null, false, "Unknown column");
    } else if (!req.query.value) {
	cb(null, false, "Emtpy value");
    } else {
	// we do not want req.query.column to be escaped
	req.app.db.query('update users set ' + req.query.column + '=? where login=?', 
			 [req.query.value, req.session.loggedin.login],
			 function(err) {
			     if (err &&
				 (err.code == 'ER_DUP_ENTRY' ||        //MySQL
				  /^SQLite exception: 19/.test(err))) {//SQLite
				     cb(null, null, 'Duplicate entry');
			     } else if (err) {
				 cb(err);
			     } else {
				 var result = {};
				 result[req.query.column] = req.query.value;
				 cb(null, result);
			     }
			 });
    }
};


