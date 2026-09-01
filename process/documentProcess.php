<?php
declare(strict_types=1);

require_once __DIR__ . '/classes/documentClass.php';

$actor = require_access_groups(['PSED Admin', 'Internal']);
$documentClass = new DocumentClass();
$action = (string) ($_REQUEST['action'] ?? 'list');

if ($action === 'list') {
    json_response(['status' => true, 'documents' => $documentClass->all()]);
}

if ($action === 'upload') {
    if (empty($_FILES['file'])) {
        json_response(['status' => false, 'message' => 'A PDF file is required.'], 422);
    }

    $payload = [
        'title' => trim((string) ($_POST['title'] ?? '')),
        'source_office' => trim((string) ($_POST['source_office'] ?? '')),
        'document_type' => trim((string) ($_POST['document_type'] ?? '')),
        'description' => trim((string) ($_POST['description'] ?? '')),
        'retention_period' => trim((string) ($_POST['retention_period'] ?? '')),
        'visibility_roles' => $_POST['visibility_roles'] ?? [],
        'extra_metadata' => json_decode((string) ($_POST['extra_metadata'] ?? '{}'), true) ?: [],
    ];

    foreach (['title', 'source_office', 'document_type'] as $requiredField) {
        if ($payload[$requiredField] === '') {
            json_response(['status' => false, 'message' => 'Missing required document metadata.'], 422);
        }
    }

    $document = $documentClass->create($payload, $_FILES['file'], $actor);
    json_response(['status' => true, 'document' => $document]);
}

if ($action === 'update') {
    $id = (int) ($_POST['id'] ?? 0);
    $document = $documentClass->update($id, [
        'title' => trim((string) ($_POST['title'] ?? '')),
        'source_office' => trim((string) ($_POST['source_office'] ?? '')),
        'document_type' => trim((string) ($_POST['document_type'] ?? '')),
        'description' => trim((string) ($_POST['description'] ?? '')),
        'retention_period' => trim((string) ($_POST['retention_period'] ?? '')),
        'visibility_roles' => $_POST['visibility_roles'] ?? [],
        'extra_metadata' => json_decode((string) ($_POST['extra_metadata'] ?? '{}'), true) ?: [],
    ], $actor);
    json_response(['status' => true, 'document' => $document]);
}

if ($action === 'delete') {
    if ($actor['access_group'] !== 'PSED Admin') {
        json_response(['status' => false, 'message' => 'Only PSED Admin can delete documents.'], 403);
    }
    $id = (int) ($_POST['id'] ?? 0);
    $documentClass->delete($id, $actor);
    json_response(['status' => true]);
}

json_response(['status' => false, 'message' => 'Unsupported document action.'], 400);
