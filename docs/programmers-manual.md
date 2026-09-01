# DDAS Programmer's Manual

This manual explains the DDAS codebase for maintainers and programmers. DDAS is a PHP/MySQL single-page-style web application with server-side process endpoints and a JavaScript-driven interface.

## 1. Technology Stack

- PHP with PDO
- MySQL/MariaDB
- HTML, CSS, and vanilla JavaScript
- Local jQuery asset at `js/jquery-4.0.0.min.js`, although the current app mainly uses vanilla JavaScript
- XAMPP-style local deployment path

Primary entry point:

- `index.php`

Database installer:

- `database/install.php`

Database schema:

- `database/schema.sql`

## 2. Default Configuration

Configuration lives in `core/config.php`.

Important constants:

| Constant | Default |
| --- | --- |
| `APP_NAME` | `DDAS` |
| `DB_HOST` | `127.0.0.1` |
| `DB_NAME` | `ddas_db` |
| `DB_USER` | `root` |
| `DB_PASS` | empty string |
| `STORAGE_ROOT_DEFAULT` | `storage` folder inside the project |
| `INTERNAL_DOCUMENT_SUBDIR` | `internal` |
| `PRIME_UPLOAD_SUBDIR` | `prime_hrm` |

Internal role names are defined in the `INTERNAL_ROLES` constant.

## 3. Installation Flow

`database/install.php` does the following:

1. Loads `core/config.php`.
2. Connects to the MySQL server without selecting a database.
3. Creates the configured database if missing.
4. Selects the database.
5. Checks whether an older `users` table exists with legacy columns such as `userID` or `role`.
6. Renames legacy `users` to `users_legacy_backup_YYYYMMDD_HHMMSS` when needed.
7. Executes `database/schema.sql`.
8. Seeds storage settings.
9. Seeds four default users.

Seed accounts:

- `sys.admin / ChangeMe123!`
- `division.chief / ChangeMe123!`
- `psed.staff / ChangeMe123!`
- `cgo.bago / ChangeMe123!`

All seed users are Active and have `must_change_password = 1`.

## 4. Runtime Bootstrap

`index.php` requires `core/init.php`.

`core/init.php` creates an `App` instance and exposes `$pdo`.

`core/App.php`:

- Creates the database connection through `Database`.
- Runs bootstrap behavior.
- Initializes visit tracking.
- Exposes `getDB()`.

`core/Database.php`:

- `connect()` returns a PDO connection to the configured database.
- `connectServer()` returns a PDO connection to the MySQL server without selecting a database.

`core/Tracker.php`:

- Logs non-bot page visits to `visit_logs`.
- Starts a session using `storage/sessions`.
- Avoids duplicate visit logs in the same PHP session.
- Catches tracking failures and writes them to `error_log`.

## 5. Shared Helpers

`core/helpers.php` contains procedural helpers used by the process endpoints and classes.

Key helpers:

| Function | Purpose |
| --- | --- |
| `db()` | Singleton-style PDO accessor |
| `start_session_if_needed()` | Starts PHP session using the configured storage session path |
| `json_response()` | Sends JSON response and exits |
| `current_user_id()` | Reads logged-in user id from session |
| `current_user()` | Loads current user plus internal roles |
| `require_login()` | Requires an authenticated session |
| `require_access_groups()` | Requires the user to belong to allowed access groups |
| `fetch_internal_roles()` | Loads internal roles for a user |
| `setting()` | Reads a setting value |
| `set_setting()` | Inserts or updates a setting |
| `normalized_storage_root()` | Resolves configured storage root |
| `ensure_directory()` | Creates a directory if missing |
| `slugify_segment()` | Sanitizes path/file-name segments |
| `upload_subdir()` | Returns internal or PRIME upload subdirectory |
| `store_uploaded_file()` | Moves an uploaded file to storage and returns paths |
| `insert_activity_log()` | Writes an activity log row |
| `safe_json_decode()` | Safely decodes JSON metadata |
| `next_code()` | Generates next `DOC-YYYY-###` or `ER-YYYY-###` style code |

Most PHP endpoints depend on these helpers, so changes here can affect the entire app.

## 6. Database Tables

The schema is defined in `database/schema.sql`.

### `settings`

Stores key/value settings, including storage root and upload subfolders.

### `users`

Stores login and profile data.

Important columns:

- `username`
- `password_hash`
- `full_name`
- `email`
- `access_group`
- `department`
- `agency_name`
- `status`
- `must_change_password`
- `last_login_at`

`access_group` is limited to:

- `PSED Admin`
- `Internal`
- `Agency`

`status` is limited to:

- `Active`
- `Suspended`

### `user_internal_roles`

Many-to-one role table for Internal users. Roles are deleted automatically when the user is deleted.

### `documents`

Stores internal document metadata and file storage references.

Important columns:

- `document_code`
- `title`
- `source_office`
- `document_type`
- `description`
- `retention_period`
- `status`
- `is_all_personnel`
- `extra_metadata`
- `original_filename`
- `stored_filename`
- `relative_path`
- `file_size_bytes`
- `uploaded_by`

`status` is limited to:

- `active`
- `archived`
- `pending`
- `processing`

### `document_visibility_roles`

Stores specific internal role visibility for documents. If a document has no role rows, the application treats it as visible to `All Personnel`.

### `prime_submissions`

Stores agency PRIME-HRM Evidence Requirement submissions.

Important columns:

- `submission_code`
- `agency_user_id`
- `agency_name`
- `core_area`
- `pillar`
- `pillar_element`
- `indicator_code`
- `indicator_label`
- `original_filename`
- `stored_filename`
- `relative_path`
- `status`
- `remarks`
- `file_size_bytes`

`status` is limited to:

- `submitted`
- `under review`
- `received`
- `rejected`

### `activity_logs`

Stores authenticated user activity.

### `visit_logs`

Stores visit tracking entries written by `Tracker`.

## 7. PHP Domain Classes

### `process/classes/userClass.php`

Class: `User`

Responsibilities:

- Create users
- Validate login
- Load one or all users
- Update users
- Change passwords
- Toggle Active/Suspended status
- Save login session
- Log out
- Synchronize internal role assignments

Important methods:

- `createUser()`
- `validateLogin()`
- `getUserById()`
- `getAllUsers()`
- `updateUser()`
- `changePassword()`
- `updateUserStatus()`
- `usernameExists()`
- `logout()`

Passwords use `password_hash()` and `password_verify()`.

### `process/classes/documentClass.php`

Class: `DocumentClass`

Responsibilities:

- List internal documents
- Create document records and store uploaded files
- Update document metadata
- Delete document records
- Resolve visibility roles

Important methods:

- `all()`
- `create()`
- `update()`
- `delete()`
- `find()`

Document creation generates a code through `next_code()` using `DOC-YYYY`, stores the uploaded file, writes metadata, syncs visibility roles, and inserts an activity log.

Note: `delete()` removes the database record. It does not currently delete the physical file from disk.

### `process/classes/primeSubmissionClass.php`

Class: `PrimeSubmissionClass`

Responsibilities:

- List PRIME-HRM submissions
- Create agency ER submissions
- Find a submission by id

Important methods:

- `all()`
- `create()`
- `find()`

Submission creation generates a code through `next_code()` using `ER-YYYY`, stores the file under a hierarchy based on agency/core area/pillar/element, and inserts an activity log.

### `process/classes/settingsClass.php`

Class: `SettingsClass`

Responsibilities:

- Read storage settings
- Update storage settings
- Ensure configured storage folders exist

Important methods:

- `getAll()`
- `updateStorageSettings()`

## 8. Process Endpoints

The frontend calls PHP endpoints under `process/`.

| Endpoint | Main Actions | Access |
| --- | --- | --- |
| `process/bootstrapData.php` | Initial state payload | Public response, but full data only when authenticated |
| `process/loginProcess.php` | Login | Public |
| `process/logoutProcess.php` | Logout | Signed-in session |
| `process/userProcess.php` | `list`, `create`, `update`, `toggle_status` | PSED Admin |
| `process/documentProcess.php` | `list`, `upload`, `update`, `delete` | PSED Admin/Internal; delete requires PSED Admin |
| `process/primeProcess.php` | `list`, `upload` | PSED Admin/Agency; upload requires Agency |
| `process/settingsProcess.php` | `get`, `save_storage`, `save_profile` | Signed-in users; storage save requires PSED Admin |
| `process/db.php` | Exposes `$pdo` through helpers | Internal include |

All modern process endpoints return JSON through `json_response()`.

## 9. Frontend Structure

### `index.php`

Main application shell. It includes:

- Login screen from `components/login.php`
- Sidebar from `components/sidebar.php`
- All page sections
- Modals
- Toast container
- `script.js`
- jQuery asset

Pages are hidden/shown by JavaScript through route ids:

- `dashboard`
- `upload`
- `search`
- `requirements`
- `access`
- `logs`
- `settings`

### `components/login.php`

Contains the login form used by `doLogin()` in JavaScript.

### `components/sidebar.php`

Contains the app navigation. JavaScript hides or shows items based on access group.

### `components/createUser.php`

Legacy standalone account creation page. It posts to itself and uses `User::createUser()`, but its role values are `admin`, `internal`, and `agency`, which do not match the current database enum values. Prefer `User Management` in the main app or update this file before using it.

### `dashboard.php`

Simple visit-log viewer. It loads the last 100 rows from `visit_logs`.

### `error.php`

Standalone styled error page.

## 10. JavaScript Application

Main file:

- `script.js`

Primary responsibilities:

- Hydrate state from `process/bootstrapData.php`
- Manage current role and username
- Route between page sections
- Apply client-side access restrictions
- Render dashboard stats/charts/tables
- Render repository search results
- Handle PDF selection and upload
- Handle PRIME-HRM selections and upload
- Handle user add/edit/suspend actions
- Handle settings/profile saves
- Display toasts, modals, and notifications

Important functions:

| Function | Purpose |
| --- | --- |
| `apiJson()` | Fetch wrapper for JSON endpoints |
| `hydrateFromServer()` | Loads server state |
| `hydrateState()` | Applies server payload to runtime arrays |
| `initApp()` | Initializes UI after authentication |
| `applyPermissions()` | Hides/disables UI by role |
| `nav()` | Changes visible page |
| `buildAll()` | Re-renders major UI sections |
| `submitUpload()` | Uploads internal document metadata and PDF |
| `saveMeta()` | Saves internal document metadata updates |
| `submitPrime()` | Uploads agency PRIME-HRM ER |
| `addUser()` | Creates user through backend |
| `saveEditUser()` | Updates user through backend |
| `suspendUser()` | Toggles user status |
| `saveStorageSettings()` | Saves storage settings |
| `saveProfile()` | Saves profile and optional password change |

`script.js` still contains some legacy/demo arrays and legacy functions. Server data from `bootstrapData.php` replaces the active arrays after login.

## 11. Access Rules

Server-side access checks are enforced in process endpoints through `require_login()` and `require_access_groups()`.

Current server-side rules:

- User management: PSED Admin only
- Internal documents: PSED Admin and Internal
- Internal document delete: PSED Admin only
- PRIME-HRM list: PSED Admin and Agency
- PRIME-HRM upload: Agency only
- Storage settings update: PSED Admin only
- Profile update: signed-in user

Client-side rules in `applyPermissions()` improve the interface, but they should not be treated as security controls. Keep server-side checks for every sensitive action.

## 12. File Storage

Storage settings are database-driven.

Default root:

- `storage`

Default subfolders:

- `internal`
- `prime_hrm`

Internal document upload path:

```text
{storage_root}/{internal_subdir}/{YYYY}/{MM}/{document_code}-{original_filename_slug}
```

PRIME-HRM upload path:

```text
{storage_root}/{prime_subdir}/{agency}/{core_area}/{pillar}/{pillar_element}/{indicator_code}-{original_filename_slug}
```

`store_uploaded_file()` uses `move_uploaded_file()`. Make sure PHP has write permission to the configured storage root.

## 13. Important Implementation Notes

- The database uses foreign keys, so user deletion may be restricted by documents or submissions.
- The app stores metadata JSON in `documents.extra_metadata` and activity metadata in `activity_logs.metadata`.
- `next_code()` looks at the latest row by `id` for a code prefix and increments the trailing number. Under heavy concurrency this may produce duplicate attempts; consider a transaction or retry strategy for production.
- File type validation is mostly front-end/UI level plus endpoint messages. Add MIME and extension checks server-side before production.
- Upload size is checked in JavaScript for internal documents at 50 MB. PHP upload limits in `php.ini` must also allow the intended file size.
- `DocumentClass::delete()` removes the database record but leaves the file on disk.
- Download/print actions currently show interface feedback; they do not serve files from storage.
- Notifications, exports, backup, update checks, and reset are currently mostly front-end placeholders.
- `must_change_password` is stored but the current UI does not force a password-change workflow.
- `dashboard.php` displays raw visit data and should be protected before production use.
- `components/createUser.php` appears legacy and should be revised or removed before deployment.

## 14. Common Development Tasks

### Add a New Internal Role

1. Add the role name to `INTERNAL_ROLES` in `core/config.php`.
2. Add the same role to `INTERNAL_ROLES` in `script.js`, or refactor the frontend to rely only on `bootstrapData.php`.
3. Confirm role checkboxes display correctly.
4. Test document upload visibility.

### Add a New Document Type

1. Add an option in the upload form in `index.php`.
2. Add an option in the repository filter in `index.php`.
3. Add an option in the edit metadata modal if needed.
4. If extra fields are needed, update `renderDocTypeFields()` and `collectDocTypeDetails()` in `script.js`.
5. Confirm `extra_metadata` is saved and displayed in the document modal.

### Replace PRIME-HRM Sample Indicators

1. Update `PRIME_FOLDER_TREE` in `script.js` if the hierarchy changes.
2. Replace `SAMPLE_INDICATOR_CODES` and `buildIndicatorOptions()` with official indicator mappings.
3. Confirm `indicator_code` and `indicator_label` are posted to `process/primeProcess.php`.
4. Test stored filenames and folder paths.

### Add Real File Download

1. Create a protected endpoint such as `process/downloadDocument.php`.
2. Require login and verify the user may access the record.
3. Resolve the stored path using `normalized_storage_root()` and `relative_path`.
4. Send appropriate PDF headers.
5. Log the download with `insert_activity_log()`.
6. Update `dlDoc()` and `downloadPrimeSubmission()` to navigate to or fetch that endpoint.

### Add Persistent Notifications

1. Create a `notifications` table.
2. Add a class for notification CRUD.
3. Add process endpoints with access checks.
4. Replace the browser-only `NOTIFS` array with server data.

## 15. Testing Checklist

Manual checks after changes:

- Run installer on an empty database.
- Log in with each seed account.
- Confirm role-based navigation.
- Upload an internal PDF as PSED Admin.
- Upload an internal PDF as Internal.
- Confirm Agency cannot access internal repository pages.
- Upload a PRIME-HRM ER as Agency.
- Confirm PSED Admin can see agency submissions.
- Create, edit, and suspend a user as PSED Admin.
- Save profile details.
- Save storage settings as PSED Admin.
- Confirm activity logs are written for server-backed actions.

Recommended future automated tests:

- Unit tests for helper functions.
- Integration tests for each process endpoint.
- Upload tests with valid and invalid files.
- Authorization tests for each access group.
- Regression tests for document and ER code generation.

## 16. Production Hardening Checklist

- Change or remove all seed credentials.
- Require password changes on first login using `must_change_password`.
- Add CSRF protection to POST endpoints.
- Add server-side MIME/type/size validation for uploads.
- Protect direct access to storage files.
- Protect or remove `dashboard.php` and `components/createUser.php`.
- Add HTTPS in deployment.
- Add database backup and restore procedures.
- Add persistent exports/downloads only after authorization checks.
- Review all error handling so sensitive details are not exposed to users.

