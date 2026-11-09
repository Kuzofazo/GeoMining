<?php
/**
 * GeoMining CRM - Corporate Entity Backend Database API
 * Handles persistent CRUD, duplicate-record prevention, validation,
 * and real-time synchronization for the GMEC Cadastre.
 */

// Error handling - log errors internally, never leak trace to production clients
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// ── 1. CORS Headers ──────────────────────────────────────────────────────────
$allowed_origins = [
    'https://geominingec.com',
    'https://www.geominingec.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true) || empty($origin)) {
    if (!empty($origin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── 2. Storage Setup (Persistent Server JSON Database) ────────────────────────
$dataDir = __DIR__ . '/data';
$dataFile = $dataDir . '/companies.json';

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
    // Secure the data directory against direct HTTP access
    @file_put_contents($dataDir . '/.htaccess', "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
}

if (!file_exists($dataFile)) {
    @file_put_contents($dataFile, json_encode([], JSON_PRETTY_PRINT));
}

/**
 * Read all companies from disk with shared lock
 */
function readCompanies($dataFile) {
    if (!file_exists($dataFile)) return [];
    $fp = @fopen($dataFile, 'r');
    if (!$fp) return [];
    @flock($fp, LOCK_SH);
    $contents = @stream_get_contents($fp);
    @flock($fp, LOCK_UN);
    @fclose($fp);
    $data = json_decode($contents, true);
    return is_array($data) ? $data : [];
}

/**
 * Write all companies to disk with exclusive lock
 */
function writeCompanies($dataFile, array $companies) {
    $fp = @fopen($dataFile, 'w');
    if (!$fp) return false;
    @flock($fp, LOCK_EX);
    $written = @fwrite($fp, json_encode($companies, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    @fflush($fp);
    @flock($fp, LOCK_UN);
    @fclose($fp);
    return $written !== false;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ── 3. Handle GET: Retrieve All Company Records ──────────────────────────────
if ($method === 'GET') {
    $companies = readCompanies($dataFile);
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'count' => count($companies),
        'data' => $companies
    ]);
    exit;
}

// Read raw JSON input for write requests
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// ── 4. Handle Clear Action: Wipe All Company Records ──────────────────────────
if ($action === 'clear' || (isset($input['action']) && $input['action'] === 'clear')) {
    $success = writeCompanies($dataFile, []);
    if ($success) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'All registered company records cleared successfully from the backend database.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to clear company records from storage.'
        ]);
    }
    exit;
}

// ── 5. Handle POST: Create New Company Record ─────────────────────────────────
if ($method === 'POST' && ($action === 'create' || empty($action))) {
    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload.']);
        exit;
    }

    $companyName = trim($input['companyName'] ?? '');
    $regNumber = trim($input['registrationNumber'] ?? '');

    // Validation
    if (empty($companyName) || strlen($companyName) < 2) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Company Legal Name is required (minimum 2 characters).']);
        exit;
    }

    if (empty($regNumber)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Official Registration Number is required.']);
        exit;
    }

    $companies = readCompanies($dataFile);

    // Duplicate Detection: Check legal name and registration number
    foreach ($companies as $existing) {
        if (strcasecmp(trim($existing['companyName'] ?? ''), $companyName) === 0) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'error' => "Duplicate Record: A company with the legal name '{$companyName}' already exists in the Cadastre."
            ]);
            exit;
        }
        if (strcasecmp(trim($existing['registrationNumber'] ?? ''), $regNumber) === 0) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'error' => "Duplicate Record: A company with registration number '{$regNumber}' is already on file."
            ]);
            exit;
        }
    }

    // Build sanitised company record
    $now = date('c');
    $newCompany = [
        'id' => !empty($input['id']) ? $input['id'] : ('comp-' . round(microtime(true) * 1000)),
        'companyName' => $companyName,
        'registrationNumber' => $regNumber,
        'taxIdentificationNumber' => trim($input['taxIdentificationNumber'] ?? ''),
        'entityType' => $input['entityType'] ?? 'Corporation',
        'licenseType' => $input['licenseType'] ?? 'Class A – Industrial Mining License',
        'dateOfApplication' => $input['dateOfApplication'] ?? date('Y-m-d'),
        'expiryDate' => $input['expiryDate'] ?? date('Y-m-d', strtotime('+1 year')),
        'county' => $input['county'] ?? 'Montserrado',
        'cityOfOperation' => trim($input['cityOfOperation'] ?? 'Monrovia'),
        'registeredAddress' => trim($input['registeredAddress'] ?? ($input['officeAddress'] ?? 'Monrovia, Liberia')),
        'officeAddress' => trim($input['officeAddress'] ?? ($input['registeredAddress'] ?? 'Monrovia, Liberia')),
        'ownerName' => trim($input['ownerName'] ?? ''),
        'cellNo' => trim($input['cellNo'] ?? ($input['primaryPhone'] ?? '')),
        'primaryEmail' => trim($input['primaryEmail'] ?? ''),
        'primaryPhone' => trim($input['primaryPhone'] ?? ($input['cellNo'] ?? '')),
        'jurisdiction' => $input['jurisdiction'] ?? ($input['county'] ? ($input['county'] . ', Liberia') : 'Monrovia, Liberia'),
        'registrationDate' => $input['dateOfApplication'] ?? date('Y-m-d'),
        'annualRenewalDate' => $input['expiryDate'] ?? date('Y-m-d', strtotime('+1 year')),
        'status' => $input['status'] ?? 'under_review',
        'directors' => is_array($input['directors'] ?? null) ? $input['directors'] : [],
        'documents' => is_array($input['documents'] ?? null) ? $input['documents'] : [],
        'assignedOfficer' => $input['assignedOfficer'] ?? 'Carlos E. Tingban',
        'registeredByRole' => $input['registeredByRole'] ?? 'registry_department',
        'registeredByName' => $input['registeredByName'] ?? 'Authorized Officer',
        'registeredByEmail' => $input['registeredByEmail'] ?? '',
        'registeredByDepartment' => $input['registeredByDepartment'] ?? 'Registry Department',
        'registeredByUserId' => $input['registeredByUserId'] ?? '',
        'registeredAt' => $input['registeredAt'] ?? $now,
        'approvedBy' => $input['approvedBy'] ?? null,
        'approvedAt' => $input['approvedAt'] ?? null,
        'approvedByRole' => $input['approvedByRole'] ?? null,
        'approvedByEmail' => $input['approvedByEmail'] ?? null,
        'notes' => $input['notes'] ?? '',
        'createdAt' => $input['createdAt'] ?? $now,
        'updatedAt' => $now,
    ];

    // Prepend to top of list
    array_unshift($companies, $newCompany);
    $saved = writeCompanies($dataFile, $companies);

    if ($saved) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Company successfully recorded and committed to the backend database.',
            'company' => $newCompany,
            'data' => $newCompany
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database write failed. Unable to persist company record.']);
    }
    exit;
}

// ── 6. Handle PUT / Update: Update Company or Status ──────────────────────────
if ($method === 'PUT' || ($method === 'POST' && $action === 'update')) {
    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload.']);
        exit;
    }

    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Company ID is required for update.']);
        exit;
    }

    $companies = readCompanies($dataFile);
    $found = false;
    $updatedCompany = null;

    foreach ($companies as &$comp) {
        if ($comp['id'] === $id) {
            foreach ($input as $k => $v) {
                if ($k !== 'id') {
                    $comp[$k] = $v;
                }
            }
            $comp['updatedAt'] = date('c');
            $updatedCompany = $comp;
            $found = true;
            break;
        }
    }
    unset($comp);

    if (!$found) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Company record not found.']);
        exit;
    }

    $saved = writeCompanies($dataFile, $companies);
    if ($saved) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Company record successfully updated in the database.',
            'company' => $updatedCompany,
            'data' => $updatedCompany
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save updates to the database.']);
    }
    exit;
}

// ── 7. Handle DELETE: Remove Company Record ───────────────────────────────────
if ($method === 'DELETE' || ($method === 'POST' && $action === 'delete')) {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Company ID is required for deletion.']);
        exit;
    }

    $companies = readCompanies($dataFile);
    $initialCount = count($companies);
    $companies = array_values(array_filter($companies, function($c) use ($id) {
        return $c['id'] !== $id;
    }));

    if (count($companies) === $initialCount) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Company record not found.']);
        exit;
    }

    $saved = writeCompanies($dataFile, $companies);
    if ($saved) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Company record successfully removed from the database.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to commit deletion to the database.']);
    }
    exit;
}

// Method not allowed fallback
http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);

