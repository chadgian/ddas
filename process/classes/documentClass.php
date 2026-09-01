<?php
declare(strict_types=1);

require_once __DIR__ . '/../../core/helpers.php';

class DocumentClass
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = db();
    }

    public function all(): array
    {
        $rows = $this->pdo->query(
            'SELECT d.*, u.username, u.full_name
             FROM documents d
             INNER JOIN users u ON u.id = d.uploaded_by
             ORDER BY d.uploaded_at DESC'
        )->fetchAll();

        foreach ($rows as &$row) {
            $row['visibility_roles'] = $this->visibilityRoles((int) $row['id']);
            $row['extra_metadata'] = safe_json_decode($row['extra_metadata'] ?? null);
        }

        return $rows;
    }

    public function create(array $payload, array $file, array $actor): array
    {
        $documentCode = next_code('documents', 'document_code', 'DOC-' . date('Y'));
        $originalFilename = $file['name'];
        $storedFilename = $documentCode . '-' . slugify_segment($originalFilename);
        $subPath = upload_subdir('internal') . DIRECTORY_SEPARATOR . date('Y') . DIRECTORY_SEPARATOR . date('m');
        $stored = store_uploaded_file($file, $subPath, $storedFilename);

        $stmt = $this->pdo->prepare(
            'INSERT INTO documents
             (document_code, title, source_office, document_type, description, retention_period, status, is_all_personnel,
              extra_metadata, original_filename, stored_filename, relative_path, file_size_bytes, uploaded_by)
             VALUES
             (:document_code, :title, :source_office, :document_type, :description, :retention_period, :status, :is_all_personnel,
              :extra_metadata, :original_filename, :stored_filename, :relative_path, :file_size_bytes, :uploaded_by)'
        );

        $visibilityRoles = array_values(array_unique(array_filter((array) ($payload['visibility_roles'] ?? []))));
        $isAllPersonnel = in_array('All Personnel', $visibilityRoles, true) ? 1 : 0;
        $stmt->execute([
            'document_code' => $documentCode,
            'title' => $payload['title'],
            'source_office' => $payload['source_office'],
            'document_type' => $payload['document_type'],
            'description' => $payload['description'] ?: null,
            'retention_period' => $payload['retention_period'] ?: null,
            'status' => 'active',
            'is_all_personnel' => $isAllPersonnel,
            'extra_metadata' => json_encode($payload['extra_metadata'] ?? []),
            'original_filename' => $originalFilename,
            'stored_filename' => $storedFilename,
            'relative_path' => $stored['relative_path'],
            'file_size_bytes' => (int) $file['size'],
            'uploaded_by' => (int) $actor['id'],
        ]);

        $documentId = (int) $this->pdo->lastInsertId();
        $this->syncVisibilityRoles($documentId, $visibilityRoles);

        insert_activity_log((int) $actor['id'], $actor['username'], 'Upload', 'Uploaded ' . $documentCode, [
            'document_id' => $documentId,
            'document_code' => $documentCode,
        ]);

        return $this->find($documentId) ?? [];
    }

    public function update(int $id, array $payload, array $actor): array
    {
        $stmt = $this->pdo->prepare(
            'UPDATE documents
             SET title = :title,
                 source_office = :source_office,
                 document_type = :document_type,
                 description = :description,
                 retention_period = :retention_period,
                 extra_metadata = :extra_metadata
             WHERE id = :id'
        );

        $visibilityRoles = array_values(array_unique(array_filter((array) ($payload['visibility_roles'] ?? []))));
        $isAllPersonnel = in_array('All Personnel', $visibilityRoles, true) ? 1 : 0;

        $stmt->execute([
            'id' => $id,
            'title' => $payload['title'],
            'source_office' => $payload['source_office'],
            'document_type' => $payload['document_type'],
            'description' => $payload['description'] ?: null,
            'retention_period' => $payload['retention_period'] ?: null,
            'extra_metadata' => json_encode($payload['extra_metadata'] ?? []),
        ]);

        $flagStmt = $this->pdo->prepare('UPDATE documents SET is_all_personnel = :flag WHERE id = :id');
        $flagStmt->execute(['id' => $id, 'flag' => $isAllPersonnel]);

        $this->syncVisibilityRoles($id, $visibilityRoles);

        insert_activity_log((int) $actor['id'], $actor['username'], 'Update', 'Updated document metadata', [
            'document_id' => $id,
        ]);

        return $this->find($id) ?? [];
    }

    public function delete(int $id, array $actor): void
    {
        $document = $this->find($id);
        if ($document === null) {
            return;
        }

        $stmt = $this->pdo->prepare('DELETE FROM documents WHERE id = :id');
        $stmt->execute(['id' => $id]);

        insert_activity_log((int) $actor['id'], $actor['username'], 'Delete', 'Deleted document ' . $document['document_code'], [
            'document_id' => $id,
        ]);
    }

    public function find(int $id): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT d.*, u.username, u.full_name
             FROM documents d
             INNER JOIN users u ON u.id = d.uploaded_by
             WHERE d.id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }

        $row['visibility_roles'] = $this->visibilityRoles((int) $row['id']);
        $row['extra_metadata'] = safe_json_decode($row['extra_metadata'] ?? null);
        return $row;
    }

    private function visibilityRoles(int $documentId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT role_name FROM document_visibility_roles WHERE document_id = :document_id ORDER BY role_name'
        );
        $stmt->execute(['document_id' => $documentId]);
        $roles = array_map(static fn(array $row): string => $row['role_name'], $stmt->fetchAll());
        if (!$roles) {
            return ['All Personnel'];
        }
        return $roles;
    }

    private function syncVisibilityRoles(int $documentId, array $roles): void
    {
        $deleteStmt = $this->pdo->prepare('DELETE FROM document_visibility_roles WHERE document_id = :document_id');
        $deleteStmt->execute(['document_id' => $documentId]);

        $roles = array_filter($roles, static fn(string $role): bool => $role !== 'All Personnel');
        if (!$roles) {
            return;
        }

        $insertStmt = $this->pdo->prepare(
            'INSERT INTO document_visibility_roles (document_id, role_name) VALUES (:document_id, :role_name)'
        );

        foreach ($roles as $roleName) {
            $insertStmt->execute(['document_id' => $documentId, 'role_name' => $roleName]);
        }
    }
}
