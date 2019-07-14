const express    = require('express');
const authRoutes = express.Router();

const passport   = require('passport');
const bcrypt     = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User       = require('../models/user-model');

authRoutes.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
  
	if (!username || !email || !password) {
		res.status(400).json({ message: 'Please provide a username, email, and password' });
		return;
	}

  User.findOne({ username }, (err, foundUser) => {
		if(err){
			res.status(500).json({message: "Error checking username"});
			return;
		}

		if (foundUser) {
			res.status(400).json({ message: 'Sorry, username already exists' });
			return;
		}
  
		const salt     = bcrypt.genSaltSync(10);
		const hashPass = bcrypt.hashSync(password, salt);

		const newUser = new User({
			username: username,
			email: email,
			password: hashPass
		});
  
		newUser.save(err => {
			if (err) {
				res.status(400).json({ message: 'Error saving user to database' });
				return;
			}
            
			// LOGIN with new user info
			req.login(newUser, (err) => {
				if (err) {
					res.status(500).json({ message: 'Error logging in after signup.' });
					return;
				}
				// SEND new user info
				res.status(200).json(newUser);
			});
		});
	});
});

authRoutes.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, thisUser, errDetails) => {
		if (err) {
			res.status(500).json({ message: 'Error authenticating thisUser' });
			return;
		}

		if (!thisUser) {
			res.status(401).json(errDetails);
			return;
		}

		req.login(thisUser, (err) => {
			if (err) {
				res.status(500).json({ message: 'Could not save session' });
				return;
			}

			//LOGGED IN, send to front
			res.status(200).json(thisUser);
		});
	})(req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ message: 'Log out success!' });
});

authRoutes.get('/instagram',
  passport.authenticate('instagram'));

authRoutes.get('/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = authRoutes;