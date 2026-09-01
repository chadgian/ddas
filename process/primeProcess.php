<?php
declare(strict_types=1);

require_once __DIR__ . '/classes/primeSubmissionClass.php';

$actor = require_access_groups(['PSED Admin', 'Agency']);
$primeClass = new PrimeSubmissionClass();
$action = (string) ($_REQUEST['action'] ?? 'list');

if ($action === 'list') {
    $items = $primeClass->all($actor['access_group'] === 'Agency' ? (int) $actor['id'] : null);
    json_response(['status' => true, 'prime_submissions' => $items]);
}

if ($action === 'upload') {
    if ($actor['access_group'] !== 'Agency') {
        json_response(['status' => false, 'message' => 'Only agency accounts can upload PRIME-HRM ERs.'], 403);
    }
    if (empty($_FILES['file'])) {
        json_response(['status' => false, 'message' => 'A PDF file is required.'], 422);
    }

    $payload = [
        'core_area' => trim((string) ($_POST['core_area'] ?? '')),
        'pillar' => trim((string) ($_POST['pillar'] ?? '')),
        'pillar_element' => trim((string) ($_POST['pillar_element'] ?? '')),
        'indicator_code' => trim((string) ($_POST['indicator_code'] ?? '')),
        'indicator_label' => trim((string) ($_POST['indicator_label'] ?? '')),
        'remarks' => trim((string) ($_POST['remarks'] ?? '')),
    ];

    foreach (['core_area', 'pillar', 'pillar_element', 'indicator_code', 'indicator_label'] as $requiredField) {
        if ($payload[$requiredField] === '') {
            json_response(['status' => false, 'message' => 'Incomplete PRIME-HRM hierarchy selection.'], 422);
        }
    }

    $submission = $primeClass->create($payload, $_FILES['file'], $actor);
    json_response(['status' => true, 'prime_submission' => $submission]);
}

json_response(['status' => false, 'message' => 'Unsupported PRIME-HRM action.'], 400);
