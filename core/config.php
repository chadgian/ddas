<?php
declare(strict_types=1);

define('APP_NAME', 'DDAS');

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'ddas_db');
define('DB_USER', 'root');
define('DB_PASS', '');

define('STORAGE_ROOT_DEFAULT', realpath(__DIR__ . '/../storage') ?: (__DIR__ . '/../storage'));
define('INTERNAL_DOCUMENT_SUBDIR', 'internal');
define('PRIME_UPLOAD_SUBDIR', 'prime_hrm');

define('INTERNAL_ROLES', [
    'Division Chief',
    'Field Director',
    'Division Personnel',
    'FO Personnel',
    'Management Committee',
    'Divisions',
]);
