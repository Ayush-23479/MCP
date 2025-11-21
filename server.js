const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3002;
const SPRING_API_BASE = 'http://localhost:8081';

app.use(cors());
app.use(express.json());

// Store JWT token (in-memory for this session)
let storedToken = null;

// ============================================
// ENDPOINT 1: LOGIN (Get JWT Token)
// ============================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const response = await axios.post(`${SPRING_API_BASE}/api/auth/login`, {
      email,
      password
    });
    
    // Store token for future requests
    storedToken = response.data.token;
    
    res.json({
      success: true,
      token: response.data.token,
      message: '✅ Login successful'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// ============================================
// ENDPOINT 2: CREATE PARCEL
// ============================================
app.post('/api/parcel/create', async (req, res) => {
  try {
    if (!storedToken) {
      return res.status(401).json({ error: 'Not logged in. Call /api/login first' });
    }
    
    const response = await axios.post(
      `${SPRING_API_BASE}/api/parcels/create`,
      req.body,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 3: GET ALL PARCELS
// ============================================
app.get('/api/parcels', async (req, res) => {
  try {
    if (!storedToken) {
      return res.status(401).json({ error: 'Not logged in. Call /api/login first' });
    }
    
    const { pageNumber = 0, size = 10 } = req.query;
    
    const response = await axios.get(
      `${SPRING_API_BASE}/api/parcels?pageNumber=${pageNumber}&size=${size}`,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 4: GET MY PARCELS (Logged in user)
// ============================================
app.get('/api/my-parcels', async (req, res) => {
  try {
    if (!storedToken) {
      return res.status(401).json({ error: 'Not logged in. Call /api/login first' });
    }
    
    const response = await axios.get(
      `${SPRING_API_BASE}/api/parcels/my-parcels?pageNumber=0&size=10`,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 5: UPDATE PARCEL
// ============================================
app.put('/api/parcel/update', async (req, res) => {
  try {
    if (!storedToken) {
      return res.status(401).json({ error: 'Not logged in. Call /api/login first' });
    }
    
    const response = await axios.put(
      `${SPRING_API_BASE}/api/parcels/update`,
      req.body,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 6: DELETE PARCEL
// ============================================
app.delete('/api/parcel/delete', async (req, res) => {
  try {
    if (!storedToken) {
      return res.status(401).json({ error: 'Not logged in. Call /api/login first' });
    }
    
    const response = await axios.delete(
      `${SPRING_API_BASE}/api/parcels/delete`,
      {
        data: req.body,
        headers: { Authorization: `Bearer ${storedToken}` }
      }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 7: OPTIMIZE ROUTES (Flood Fill)
// ============================================
app.get('/api/optimize-routes', async (req, res) => {
  try {
    const response = await axios.get(
      `${SPRING_API_BASE}/api/optimizer/optimize-routes`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 8: OPTIMIZE WITH CLUSTERING
// ============================================
app.get('/api/optimize-clustering', async (req, res) => {
  try {
    const response = await axios.get(
      `${SPRING_API_BASE}/api/optimizer/optimize-with-clustering`
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 9: DASHBOARD STATS
// ============================================
app.get('/api/dashboard', async (req, res) => {
  try {
    const customers = await axios.get(`${SPRING_API_BASE}/dashboard/customercount`);
    const parcels = await axios.get(`${SPRING_API_BASE}/dashboard/parcelscount`);
    const payment = await axios.get(`${SPRING_API_BASE}/dashboard/parcelpayment`);
    const routes = await axios.get(`${SPRING_API_BASE}/dashboard/parcelroutecount`);
    
    res.json({
      totalCustomers: customers.data,
      totalParcels: parcels.data,
      totalPayment: payment.data,
      parcelsByRoute: routes.data
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// ENDPOINT 10: CREATE ROUTE
// ============================================
app.post('/api/route/create', async (req, res) => {
  try {
    if (!storedToken) {
      return res.status(401).json({ error: 'Not logged in. Call /api/login first' });
    }
    
    const response = await axios.post(
      `${SPRING_API_BASE}/api/routes/create`,
      req.body,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 11: GET ALL ROUTES
// ============================================
app.get('/api/routes', async (req, res) => {
  try {
    if (!storedToken) {
      return res.status(401).json({ error: 'Not logged in. Call /api/login first' });
    }
    
    const { pageNumber = 0, size = 10 } = req.query;
    
    const response = await axios.get(
      `${SPRING_API_BASE}/api/routes?pageNumber=${pageNumber}&size=${size}`,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});

// ============================================
// ENDPOINT 12: HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: '✅ MCP Server is running', port: PORT });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 Route Master MCP Server Started   ║
  ║      http://localhost:${PORT}           ║
  ╚════════════════════════════════════════╝
  
  📍 Available Endpoints:
  
  1. Login:
     POST http://localhost:3000/api/login
     Body: { "email": "user@example.com", "password": "password" }
  
  2. Get Dashboard:
     GET http://localhost:3000/api/dashboard
  
  3. Create Parcel:
     POST http://localhost:3000/api/parcel/create
  
  4. Get Parcels:
     GET http://localhost:3000/api/parcels
  
  5. Optimize Routes:
     GET http://localhost:3000/api/optimize-routes
  
  6. Health Check:
     GET http://localhost:3000/health
  `);
});