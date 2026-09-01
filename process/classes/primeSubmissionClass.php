<?php
declare(strict_types=1);

require_once __DIR__ . '/../../core/helpers.php';

class PrimeSubmissionClass
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = db();
    }

    public function all(?int $agencyUserId = null): array
    {
        $sql = 'SELECT * FROM prime_submissions';
        $params = [];
        if ($agencyUserId !== null) {
            $sql .= ' WHERE agency_user_id = :agency_user_id';
            $params['agency_user_id'] = $agencyUserId;
        }
        $sql .= ' ORDER BY submitted_at DESC';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function create(array $payload, array $file, array $actor): array
    {
        $submissionCode = next_code('prime_submissions', 'submission_code', 'ER-' . date('Y'));
        $indicatorCode = trim((string) $payload['indicator_code']);
        $storedFilename = $indicatorCode . '-' . slugify_segment($file['name']);

        $subPath = implode(DIRECTORY_SEPARATOR, [
            upload_subdir('prime'),
            slugify_segment((string) $actor['agency_name']),
            slugify_segment((string) $payload['core_area']),
            slugify_segment((string) $payload['pillar']),
            slugify_segment((string) $payload['pillar_element']),
        ]);

        $stored = store_uploaded_file($file, $subPath, $storedFilename);

        $stmt = $this->pdo->prepare(
            'INSERT INTO prime_submissions
             (submission_code, agency_user_id, agency_name, core_area, pillar, pillar_element, indicator_code,
              indicator_label, original_filename, stored_filename, relative_path, status, remarks, file_size_bytes)
             VALUES
             (:submission_code, :agency_user_id, :agency_name, :core_area, :pillar, :pillar_element, :indicator_code,
              :indicator_label, :original_filename, :stored_filename, :relative_path, :status, :remarks, :file_size_bytes)'
        );

        $stmt->execute([
            'submission_code' => $submissionCode,
            'agency_user_id' => (int) $actor['id'],
            'agency_name' => $actor['agency_name'],
            'core_area' => $payload['core_area'],
            'pillar' => $payload['pillar'],
            'pillar_element' => $payload['pillar_element'],
            'indicator_code' => $indicatorCode,
            'indicator_label' => $payload['indicator_label'],
            'original_filename' => $file['name'],
            'stored_filename' => $storedFilename,
            'relative_path' => $stored['relative_path'],
            'status' => 'submitted',
            'remarks' => $payload['remarks'] ?: null,
            'file_size_bytes' => (int) $file['size'],
        ]);

        $id = (int) $this->pdo->lastInsertId();
        insert_activity_log((int) $actor['id'], $actor['username'], 'Upload', 'Submitted ' . $submissionCode, [
            'prime_submission_id' => $id,
        ]);

        return $this->find($id) ?? [];
    }

    public function find(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM prime_submissions WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
