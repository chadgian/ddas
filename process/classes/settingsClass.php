<?php
declare(strict_types=1);

require_once __DIR__ . '/../../core/helpers.php';

class SettingsClass
{
    public function getAll(): array
    {
        return [
            'storage_root' => setting('storage_root', STORAGE_ROOT_DEFAULT),
            'internal_subdir' => setting('internal_subdir', INTERNAL_DOCUMENT_SUBDIR),
            'prime_subdir' => setting('prime_subdir', PRIME_UPLOAD_SUBDIR),
        ];
    }

    public function updateStorageSettings(array $payload): array
    {
        $storageRoot = trim((string) ($payload['storage_root'] ?? ''));
        if ($storageRoot === '') {
            return ['status' => false, 'message' => 'Storage root is required.'];
        }

        $internalSubdir = trim((string) ($payload['internal_subdir'] ?? INTERNAL_DOCUMENT_SUBDIR));
        $primeSubdir = trim((string) ($payload['prime_subdir'] ?? PRIME_UPLOAD_SUBDIR));

        set_setting('storage_root', $storageRoot);
        set_setting('internal_subdir', $internalSubdir);
        set_setting('prime_subdir', $primeSubdir);

        ensure_directory(rtrim($storageRoot, '\\/') . DIRECTORY_SEPARATOR . $internalSubdir);
        ensure_directory(rtrim($storageRoot, '\\/') . DIRECTORY_SEPARATOR . $primeSubdir);

        return ['status' => true, 'message' => 'Storage settings saved successfully.'];
    }
}
