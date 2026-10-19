<?php
// Optional PHP Proxy for Google Apps Script API when running on XAMPP
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$endpoint = 'https://script.google.com/macros/s/AKfycbwv_0GdImwmDwDHsxPlrOTo7iGjMMkYHutax33GwC3ml1Dw1wwbKwg1UdHdlSPa11LcNg/exec';

// Forward query parameters if any (e.g. ?action=updateSpotData)
$queryString = $_SERVER['QUERY_STRING'] ?? '';
$targetUrl = $queryString ? ($endpoint . '?' . $queryString) : $endpoint;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Curl Error: ' . $error]);
} else {
    http_response_code($httpCode ?: 200);
    echo $response;
}
?>
