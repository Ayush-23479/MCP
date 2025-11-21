"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const gemini_1 = require("./gemini");
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
const SPRING_API_BASE = process.env.SPRING_API_BASE || 'http://localhost:8081';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create axios instance
const api = axios_1.default.create({
    baseURL: SPRING_API_BASE,
    timeout: 10000,
});
// Store JWT token in memory
let storedToken = null;
let storedUserData = null;
// ============================================
// HELPER FUNCTIONS
// ============================================
function getAuthHeaders() {
    if (!storedToken)
        return null;
    return { Authorization: `Bearer ${storedToken}` };
}
async function makeApiCall(method, endpoint, data, requireAuth = true) {
    try {
        if (requireAuth && !storedToken) {
            return { data: null, error: 'Not authenticated. Please login first.' };
        }
        const headers = requireAuth ? getAuthHeaders() : {};
        const config = headers ? { headers } : {};
        let response;
        if (method === 'GET') {
            response = await api.get(endpoint, config);
        }
        else if (method === 'POST') {
            response = await api.post(endpoint, data, config);
        }
        else if (method === 'PUT') {
            response = await api.put(endpoint, data, config);
        }
        else if (method === 'DELETE') {
            response = await api.delete(endpoint, { ...config, data });
        }
        else {
            return { data: null, error: 'Invalid HTTP method' };
        }
        return { data: response.data, error: null };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            return { data: null, error: errorMessage };
        }
        return { data: null, error: 'An unexpected error occurred' };
    }
}
// ============================================
// HEALTH & STATUS
// ============================================
app.get('/health', (req, res) => {
    res.json({
        status: '✅ MCP Server is running',
        port: PORT,
        backend: SPRING_API_BASE,
        timestamp: new Date().toISOString(),
    });
});
app.get('/status', (req, res) => {
    res.json({
        authenticated: !!storedToken,
        user: storedUserData || null,
        timestamp: new Date().toISOString(),
    });
});
// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password required' });
            return;
        }
        const result = await makeApiCall('POST', '/api/auth/login', { email, password }, false);
        if (result.error) {
            res.status(401).json({ success: false, error: result.error });
            return;
        }
        storedToken = result.data?.token || null;
        storedUserData = result.data;
        res.json({
            success: true,
            message: '✅ Login successful',
            token: result.data?.token,
            user: storedUserData,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/auth/register', async (req, res) => {
    try {
        const userData = req.body;
        const result = await makeApiCall('POST', '/api/auth/register', userData, false);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.status(201).json({ success: true, message: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/logout', (req, res) => {
    storedToken = null;
    storedUserData = null;
    res.json({ success: true, message: '✅ Logged out successfully' });
});
// ============================================
// DASHBOARD ENDPOINTS
// ============================================
app.get('/api/dashboard', async (req, res) => {
    try {
        const [customersRes, parcelsRes, paymentRes, routesRes] = await Promise.all([
            api.get('/dashboard/customercount'),
            api.get('/dashboard/parcelscount'),
            api.get('/dashboard/parcelpayment'),
            api.get('/dashboard/parcelroutecount'),
        ]);
        res.json({
            totalCustomers: customersRes.data,
            totalParcels: parcelsRes.data,
            totalPayment: paymentRes.data,
            parcelsByRoute: routesRes.data,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// PARCEL ENDPOINTS (COMPLETE)
// ============================================
app.post('/api/parcel/create', async (req, res) => {
    try {
        const result = await makeApiCall('POST', '/api/parcels/create', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.status(201).json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/parcels', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/parcels?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/parcels/my-parcels', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/parcels/my-parcels?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/parcels/customer/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/parcels/customer/${customerId}?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/parcels/last-month', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/parcels/last-month?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/parcels/delayed', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/parcels/delayed?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/parcel/update', async (req, res) => {
    try {
        const result = await makeApiCall('PUT', '/api/parcels/update', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/parcel/delete', async (req, res) => {
    try {
        const result = await makeApiCall('DELETE', '/api/parcels/delete', req.body);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json({ success: true, message: '✅ Parcel deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// CUSTOMER ENDPOINTS (COMPLETE)
// ============================================
app.get('/api/customers/me', async (req, res) => {
    try {
        const result = await makeApiCall('GET', '/api/customers/me');
        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/customer/create', async (req, res) => {
    try {
        const result = await makeApiCall('POST', '/api/customers/create', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.status(201).json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/customers', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/customers?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/customer/update', async (req, res) => {
    try {
        const result = await makeApiCall('PUT', '/api/customers/update', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/customer/delete', async (req, res) => {
    try {
        const result = await makeApiCall('DELETE', '/api/customers/delete', req.body);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json({ success: true, message: '✅ Customer deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// EMPLOYEE ENDPOINTS (COMPLETE)
// ============================================
app.post('/api/employee/create', async (req, res) => {
    try {
        const result = await makeApiCall('POST', '/api/employees/create', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.status(201).json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/employees', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/employees?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/employee/update', async (req, res) => {
    try {
        const result = await makeApiCall('PUT', '/api/employees/update', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/employee/delete', async (req, res) => {
    try {
        const result = await makeApiCall('DELETE', '/api/employees/delete', req.body);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json({ success: true, message: '✅ Employee deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// ROUTE ENDPOINTS (COMPLETE)
// ============================================
app.post('/api/route/create', async (req, res) => {
    try {
        const result = await makeApiCall('POST', '/api/routes/create', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.status(201).json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/routes', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/routes?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/route/update', async (req, res) => {
    try {
        const result = await makeApiCall('PUT', '/api/routes/update', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/route/delete', async (req, res) => {
    try {
        const result = await makeApiCall('DELETE', '/api/routes/delete', req.body);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json({ success: true, message: '✅ Route deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// TRACKING ENDPOINTS (COMPLETE)
// ============================================
app.post('/api/track/create', async (req, res) => {
    try {
        const result = await makeApiCall('POST', '/api/track/create', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.status(201).json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/track', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber || 0;
        const size = req.query.size || 10;
        const result = await makeApiCall('GET', `/api/track?pageNumber=${pageNumber}&size=${size}`);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/track/update', async (req, res) => {
    try {
        const result = await makeApiCall('PUT', '/api/track/update', req.body);
        if (result.error) {
            res.status(400).json({ success: false, error: result.error });
            return;
        }
        res.json({ success: true, data: result.data });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/track/delete', async (req, res) => {
    try {
        const result = await makeApiCall('DELETE', '/api/track/delete', req.body);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json({ success: true, message: '✅ Tracking deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// OPTIMIZATION ENDPOINTS
// ============================================
app.get('/api/optimize-routes', async (req, res) => {
    try {
        const result = await makeApiCall('GET', '/api/optimizer/optimize-routes', undefined, false);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/optimize-clustering', async (req, res) => {
    try {
        const result = await makeApiCall('GET', '/api/optimizer/optimize-with-clustering', undefined, false);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/optimizer/health', async (req, res) => {
    try {
        const result = await makeApiCall('GET', '/api/optimizer/health', undefined, false);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/optimizer/diagnostics', async (req, res) => {
    try {
        const result = await makeApiCall('GET', '/api/optimizer/diagnostics', undefined, false);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/optimizer/stats', async (req, res) => {
    try {
        const result = await makeApiCall('GET', '/api/optimizer/stats', undefined, false);
        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ============================================
// GEMINI AI ENDPOINTS
// ============================================
/**
 * Ask Gemini a question about your logistics
 * POST /api/gemini/ask
 */
app.post('/api/gemini/ask', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            res.status(400).json({ error: 'Question is required' });
            return;
        }
        const response = await (0, gemini_1.callGemini)(question);
        if (!response.success) {
            res.status(500).json({ error: response.error });
            return;
        }
        res.json({
            success: true,
            question,
            answer: response.text,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Analyze dashboard data with AI
 * POST /api/gemini/analyze-dashboard
 */
app.post('/api/gemini/analyze-dashboard', async (req, res) => {
    try {
        const [customersRes, parcelsRes, paymentRes, routesRes] = await Promise.all([
            api.get('/dashboard/customercount'),
            api.get('/dashboard/parcelscount'),
            api.get('/dashboard/parcelpayment'),
            api.get('/dashboard/parcelroutecount'),
        ]);
        const dashboardData = {
            totalCustomers: customersRes.data,
            totalParcels: parcelsRes.data,
            totalPayment: paymentRes.data,
            parcelsByRoute: routesRes.data,
        };
        const response = await (0, gemini_1.analyzeWithGemini)(dashboardData, 'Analyze this logistics dashboard data and provide insights and recommendations.');
        if (!response.success) {
            res.status(500).json({ error: response.error });
            return;
        }
        res.json({
            success: true,
            data: dashboardData,
            analysis: response.text,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get smart recommendations for parcels
 * POST /api/gemini/parcel-recommendations
 */
app.post('/api/gemini/parcel-recommendations', async (req, res) => {
    try {
        const { parcels } = req.body;
        if (!parcels) {
            res.status(400).json({ error: 'Parcels data is required' });
            return;
        }
        const response = await (0, gemini_1.analyzeWithGemini)(parcels, 'Analyze these parcels and provide recommendations for optimal routing and handling.');
        if (!response.success) {
            res.status(500).json({ error: response.error });
            return;
        }
        res.json({
            success: true,
            recommendations: response.text,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get route optimization suggestions
 * POST /api/gemini/optimize-suggestions
 */
app.post('/api/gemini/optimize-suggestions', async (req, res) => {
    try {
        const { routes, parcels } = req.body;
        if (!routes || !parcels) {
            res.status(400).json({ error: 'Routes and parcels data are required' });
            return;
        }
        const response = await (0, gemini_1.analyzeWithGemini)({ routes, parcels }, 'Based on current routes and parcels, suggest optimizations to improve efficiency and reduce costs.');
        if (!response.success) {
            res.status(500).json({ error: response.error });
            return;
        }
        res.json({
            success: true,
            suggestions: response.text,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * General Gemini status check
 * GET /api/gemini/status
 */
app.get('/api/gemini/status', (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    res.json({
        status: apiKey ? '✅ Gemini API Key is configured' : '❌ Gemini API Key is missing',
        configured: !!apiKey,
        model: 'gemini-1.5-flash',
        freetier: {
            requests_per_minute: 60,
            tokens_per_day: '2 million',
            cost: '$0',
        },
        timestamp: new Date().toISOString(),
    });
});
// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        availableEndpoints: {
            auth: ['/api/auth/login', '/api/auth/register', '/api/logout'],
            dashboard: ['/api/dashboard'],
            parcels: ['/api/parcel/create', '/api/parcels', '/api/parcels/my-parcels', '/api/parcel/update', '/api/parcel/delete'],
            customers: ['/api/customers/me', '/api/customer/create', '/api/customers', '/api/customer/update', '/api/customer/delete'],
            employees: ['/api/employee/create', '/api/employees', '/api/employee/update', '/api/employee/delete'],
            routes: ['/api/route/create', '/api/routes', '/api/route/update', '/api/route/delete'],
            tracking: ['/api/track/create', '/api/track', '/api/track/update', '/api/track/delete'],
            optimization: ['/api/optimize-routes', '/api/optimize-clustering', '/api/optimizer/health', '/api/optimizer/diagnostics', '/api/optimizer/stats'],
            gemini: ['/api/gemini/ask', '/api/gemini/analyze-dashboard', '/api/gemini/parcel-recommendations', '/api/gemini/optimize-suggestions', '/api/gemini/status'],
        },
    });
});
// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 Route Master MCP TypeScript Server - FULL POWER       ║
║      http://localhost:${PORT}                               ║
║      Backend: ${SPRING_API_BASE}              ║
╚════════════════════════════════════════════════════════════╝

📍 AUTHENTICATION (3 endpoints):
  POST http://localhost:${PORT}/api/auth/login
  POST http://localhost:${PORT}/api/auth/register
  POST http://localhost:${PORT}/api/logout

📦 PARCELS (8 endpoints):
  POST http://localhost:${PORT}/api/parcel/create
  GET  http://localhost:${PORT}/api/parcels
  GET  http://localhost:${PORT}/api/parcels/my-parcels
  GET  http://localhost:${PORT}/api/parcels/customer/:id
  GET  http://localhost:${PORT}/api/parcels/last-month
  GET  http://localhost:${PORT}/api/parcels/delayed
  PUT  http://localhost:${PORT}/api/parcel/update
  DELETE http://localhost:${PORT}/api/parcel/delete

👥 CUSTOMERS (5 endpoints):
  GET  http://localhost:${PORT}/api/customers/me
  POST http://localhost:${PORT}/api/customer/create
  GET  http://localhost:${PORT}/api/customers
  PUT  http://localhost:${PORT}/api/customer/update
  DELETE http://localhost:${PORT}/api/customer/delete

👷 EMPLOYEES (4 endpoints):
  POST http://localhost:${PORT}/api/employee/create
  GET  http://localhost:${PORT}/api/employees
  PUT  http://localhost:${PORT}/api/employee/update
  DELETE http://localhost:${PORT}/api/employee/delete

🗺️  ROUTES (4 endpoints):
  POST http://localhost:${PORT}/api/route/create
  GET  http://localhost:${PORT}/api/routes
  PUT  http://localhost:${PORT}/api/route/update
  DELETE http://localhost:${PORT}/api/route/delete

📍 TRACKING (4 endpoints):
  POST http://localhost:${PORT}/api/track/create
  GET  http://localhost:${PORT}/api/track
  PUT  http://localhost:${PORT}/api/track/update
  DELETE http://localhost:${PORT}/api/track/delete

⚡ OPTIMIZATION (5 endpoints):
  GET  http://localhost:${PORT}/api/optimize-routes
  GET  http://localhost:${PORT}/api/optimize-clustering
  GET  http://localhost:${PORT}/api/optimizer/health
  GET  http://localhost:${PORT}/api/optimizer/diagnostics
  GET  http://localhost:${PORT}/api/optimizer/stats

🤖 GEMINI AI (5 endpoints):
  POST http://localhost:${PORT}/api/gemini/ask
  POST http://localhost:${PORT}/api/gemini/analyze-dashboard
  POST http://localhost:${PORT}/api/gemini/parcel-recommendations
  POST http://localhost:${PORT}/api/gemini/optimize-suggestions
  GET  http://localhost:${PORT}/api/gemini/status

📊 DASHBOARD (1 endpoint):
  GET  http://localhost:${PORT}/api/dashboard

✅ Total: 39 POWERFUL ENDPOINTS

🔧 Server is READY - All endpoints operational!
  `);
});
exports.default = app;
//# sourceMappingURL=server.js.map