require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors({
    origin: [
        process.env.DASHBOARD_URL, // http://localhost:8081
        "http://localhost:5173", // Vite web app
        "https://corrine-hirudinoid-ayleen.ngrok-free.dev" // El ngrok actual de la app móvil
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


const onProxyRes = (proxyRes) => {
    // Only delete CORS headers from the proxied service response
    // Gateway's cors() middleware will handle CORS properly
    delete proxyRes.headers['access-control-allow-origin'];
    delete proxyRes.headers['access-control-allow-methods'];
    delete proxyRes.headers['access-control-allow-credentials'];
    delete proxyRes.headers['access-control-allow-headers'];
};

// --- AUTH SERVICE ---
app.use('/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
    timeout: 10000,
    onProxyRes
}));

// --- USER / PROFILE / SEARCH SERVICE ---
// Frontend calls /api/users/*, service expects /profile or /search
app.use('/api/users', createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' },
    timeout: 10000,
    onProxyRes
}));

// Legacy routes for backward compatibility
app.use('/api/academic-profile', createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}/profile`,
    changeOrigin: true,
    pathRewrite: { '^/api/academic-profile': '' },
    onProxyRes
}));

app.use('/api/search-students', createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}/search`,
    changeOrigin: true,
    pathRewrite: { '^/api/search-students': '' },
    onProxyRes
}));

// --- SOCIAL SERVICE (Groups & Events) ---
app.use('/api/events', createProxyMiddleware({
    target: `${process.env.SOCIAL_SERVICE_URL}/events`,
    changeOrigin: true,
    pathRewrite: { '^/api/events': '' },
    timeout: 10000,
    onProxyRes
}));

app.use('/api/groups', createProxyMiddleware({
    target: `${process.env.SOCIAL_SERVICE_URL}/groups`,
    changeOrigin: true,
    pathRewrite: { '^/api/groups': '' },
    timeout: 10000,
    onProxyRes
}));

// --- CHAT SERVICE ---
// Frontend calls /api/chats, service expects /
app.use('/api/chats', createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/chats': '' },
    ws: true,
    timeout: 10000,
    onProxyRes
}));

// Legacy route for backward compatibility
app.use('/api/chat', createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/chat': '' },
    ws: true,
    onProxyRes
}));

// --- GROUP CHAT SERVICE ---
app.use('/api/group-chats', createProxyMiddleware({
    target: `${process.env.CHAT_SERVICE_URL}/groups`,
    changeOrigin: true,
    pathRewrite: { '^/api/group-chats': '' },
    ws: true,
    onProxyRes
}));

app.use('/socket.io', createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    changeOrigin: true,
    ws: true
}));

// --- ACADEMIC SERVICE ---
// Frontend calls /api/academic/*, service expects /careers, /subjects, etc.
app.use('/api/academic/careers', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/careers`,
    changeOrigin: true,
    pathRewrite: { '^/api/academic/careers': '' },
    timeout: 10000,
    onProxyRes
}));

app.use('/api/academic/faculties', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/faculties`,
    changeOrigin: true,
    pathRewrite: { '^/api/academic/faculties': '' },
    timeout: 10000,
    onProxyRes
}));

app.use('/api/academic/subjects', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/subjects`,
    changeOrigin: true,
    pathRewrite: { '^/api/academic/subjects': '' },
    timeout: 10000,
    onProxyRes
}));

// Legacy routes for backward compatibility
app.use('/api/careers', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/careers`,
    changeOrigin: true,
    pathRewrite: { '^/api/careers': '' },
    onProxyRes
}));

app.use('/api/career-structure', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/career-structure`,
    changeOrigin: true,
    pathRewrite: { '^/api/career-structure': '' },
    onProxyRes
}));

app.use('/api/subjects', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/subjects`,
    changeOrigin: true,
    pathRewrite: { '^/api/subjects': '' },
    onProxyRes
}));

app.use('/api/hierarchy/faculties', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/faculties`,
    changeOrigin: true,
    pathRewrite: { '^/api/hierarchy/faculties': '' },
    onProxyRes
}));

app.use('/api/hierarchy/academic-levels', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/academic-levels`,
    changeOrigin: true,
    pathRewrite: { '^/api/hierarchy/academic-levels': '' },
    onProxyRes
}));

app.use('/api/hierarchy/formation-levels', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/formation-levels`,
    changeOrigin: true,
    pathRewrite: { '^/api/hierarchy/formation-levels': '' },
    onProxyRes
}));

app.use('/api/hierarchy/careers-by-path', createProxyMiddleware({
    target: `${process.env.ACADEMIC_SERVICE_URL}/careers-by-path`,
    changeOrigin: true,
    pathRewrite: { '^/api/hierarchy/careers-by-path': '' },
    onProxyRes
}));

// --- NOTIFICATION SERVICE ---
app.use('/api/notifications', createProxyMiddleware({
    target: `${process.env.NOTIFICATION_SERVICE_URL}/notifications`,
    changeOrigin: true,
    pathRewrite: { '^/api/notifications': '' },
    timeout: 10000,
    onProxyRes
}));

// 3. Health Check (Para saber si el gateway está vivo)
app.get('/status', (req, res) => {
    res.json({ status: 'Gateway Operativo', timestamp: new Date() });
});

app.get('/status', (req, res) => {
    res.json({ 
        status: 'Gateway Operativo', 
        entorno: 'Docker',
        timestamp: new Date() 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway UniConnect corriendo en puerto ${PORT}`);
    console.log(`🔗 Exponiendo servicios a través de ngrok en el puerto ${PORT}`);
});