import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const register = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { name, email, password, role, org_name, darpan_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    
    // Determine and restrict role
    let assignedRole = 'donor'; // Default role
    if (role) {
      if (['donor', 'charity', 'volunteer'].includes(role)) {
        assignedRole = role;
      } else if (role === 'admin') {
        return res.status(403).json({ message: 'Cannot self-register as admin' });
      } else {
        return res.status(400).json({ message: 'Invalid role specified' });
      }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await client.query('BEGIN');

    // Check if user exists
    const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (userCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const insertUserText = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
    `;
    const userResult = await client.query(insertUserText, [name, normalizedEmail, passwordHash, assignedRole]);
    const newUser = userResult.rows[0];

    if (assignedRole === 'charity') {
      const finalOrgName = org_name || `${name}'s Organization`;
      const insertCharityText = `
        INSERT INTO charity_profiles (user_id, org_name, darpan_id)
        VALUES ($1, $2, $3)
      `;
      await client.query(insertCharityText, [newUser.id, finalOrgName, darpan_id || null]);
    }

    await client.query('COMMIT');

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    const { password_hash, ...userInfo } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};
