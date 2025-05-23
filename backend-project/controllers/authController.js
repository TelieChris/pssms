const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    req.session.user = { id: user.id, username: user.username };
    return res.json({ message: 'Login successful', user: req.session.user });
  });
};


exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
};

exports.checkSession = (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};
