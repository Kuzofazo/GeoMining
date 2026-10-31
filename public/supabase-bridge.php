<?php
// Disable error display (never expose errors to clients in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// ── CORS: Restrict to your production domain only ────────────────────────
$allowed_origins = ['https://geominingec.com', 'https://www.geominingec.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    // Not an allowed origin — reject preflight and real requests
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: apikey, authorization, content-type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Whitelist allowed table paths to prevent injection
$allowed_paths = ['jobs', 'applications', 'partners', 'contacts', 'articles'];
$path = $_GET['path'] ?? '';
if (!in_array($path, $allowed_paths, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid path']);
    exit;
}

$supabase_url = 'https://yvvalbuxdgulauupuwuk.supabase.co/rest/v1/' . $path;
$api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dmFsYnV4ZGd1bGF1dXB1d3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTc4MjYsImV4cCI6MjA5Mzk5MzgyNn0.DcRoRsKsiSB1x9LqT9XKromPGpbt29qODCKGn7MykQU';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabase_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);  // Always verify SSL in production
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'apikey: ' . $api_key,
    'Authorization: Bearer ' . $api_key,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$error = curl_error($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Gateway Error']);
} else {
    http_response_code($http_code);
    echo $response;
}
?>

