# DDAS User Manual

Digital Document Archiving System (DDAS) is a web-based document workspace for the Policies and Systems Evaluation Division (PSED). It separates internal document archiving from agency PRIME-HRM Evidence Requirement (ER) submission.

## 1. Default Login Accounts

After running `database/install.php`, the system creates these seed accounts:

| Username | Default Password | Access Group | Intended Use |
| --- | --- | --- | --- |
| `sys.admin` | `ChangeMe123!` | PSED Admin | Main administrator account |
| `division.chief` | `ChangeMe123!` | Internal | Internal PSED leadership/account user |
| `psed.staff` | `ChangeMe123!` | Internal | Internal PSED staff user |
| `cgo.bago` | `ChangeMe123!` | Agency | Sample agency account for PRIME-HRM uploads |

Important: Change all default passwords immediately after installation. Seeded and newly created users are marked with `must_change_password = 1` in the database.

## 2. User Access Groups

DDAS uses three main access groups.

| Access Group | Main Capabilities |
| --- | --- |
| PSED Admin | Full system access, user management, internal document upload, repository access, PRIME-HRM monitoring, activity logs, and storage settings |
| Internal | Internal document upload, repository search/view, document metadata updates, activity logs, profile settings |
| Agency | PRIME-HRM ER upload and own submission tracking only |

Internal users may also be assigned one or more internal roles:

- Division Chief
- Field Director
- Division Personnel
- FO Personnel
- Management Committee
- Divisions

These roles are used when setting document visibility.

## 3. Signing In and Out

Open `index.php` in the web browser through the configured local web server, then enter your assigned username and password.

If login succeeds, DDAS loads the correct workspace for your access group. If login fails, check that the username and password are correct and that the account is still Active.

Use the Sign Out button at the bottom of the sidebar when finished.

## 4. Main Navigation

The sidebar changes depending on your access group.

Internal/PSED Admin navigation:

- Dashboard
- Upload Documents
- Document Repository
- PRIME-HRM
- Activity Logs
- Settings
- User Management, for PSED Admin only

Agency navigation:

- PRIME-HRM Dashboard
- PRIME-HRM

Agency accounts cannot open the internal upload, repository, logs, settings, or user management pages.

## 5. Dashboard

The dashboard summarizes the current workspace.

For PSED Admin and Internal users, it shows:

- Total documents
- Active internal documents
- PRIME-HRM submission count
- Restricted documents
- Recent documents
- Document type chart
- Monthly upload chart shown in the interface

For Agency users, it shows:

- Own PRIME-HRM submissions
- Submitted or under-review items
- Received submissions
- Shortcuts to PRIME-HRM upload and submission tracking

## 6. Internal Document Upload

Available to PSED Admin and Internal users.

To upload a document:

1. Open Upload Documents.
2. Select or drag a PDF file.
3. Enter required metadata:
   - Document Title
   - Source Office
   - Document Type
4. Choose the retention period.
5. Select which roles may view the document.
6. Add a description if needed.
7. Click Upload to Repository.

Accepted file type: PDF.

Displayed maximum file size: 50 MB.

Document types:

- Memorandum
- Opinion/Query
- Resolution
- Report
- Advisory
- Others

Extra fields appear for some document types:

- Memorandum: memo number, addressee, subject, memo date, memo author
- Opinion/Query: addressee, subject, opinion date

Uploaded files are saved under the configured internal storage folder by year and month. Document codes use the pattern `DOC-YYYY-###`, for example `DOC-2026-001`.

## 7. Document Repository

Available to PSED Admin and Internal users.

Use the Document Repository to search and filter archived internal documents.

Search and filters include:

- Title
- Source office
- Document type
- Visibility role
- Status
- Description or extra metadata text

Repository actions:

- View document details
- Edit metadata, for PSED Admin and Internal users
- Delete document record, for PSED Admin only
- Export/search buttons shown in the interface

Note: The current document viewer displays metadata and a PDF preview placeholder. Download and print actions are represented in the interface with notifications but do not currently stream the stored file to the browser.

## 8. PRIME-HRM Evidence Requirement Uploads

Agency accounts use this page to upload PRIME-HRM Evidence Requirement PDF files. PSED Admin can monitor agency submissions but cannot upload ERs as an agency.

To submit an ER:

1. Sign in using an Agency account.
2. Open PRIME-HRM.
3. Select the hierarchy:
   - Core Area
   - Pillar
   - Pillar Element
   - Indicator
4. Attach the PDF file.
5. Click Submit ER.

The system automatically records:

- Agency account
- Agency name
- Core area
- Pillar
- Pillar element
- Indicator code and label
- Original file name
- Stored file name
- Submission date
- File size

PRIME-HRM submission codes use the pattern `ER-YYYY-###`, for example `ER-2026-001`.

Current PRIME-HRM core areas in the interface:

- Recruitment, Selection and Placement (RSP)
- Learning and Development (L&D)
- Performance Management (PM)
- Rewards and Recognition (R&R)
- Other Documentary Requirements

Note: Indicator labels currently use sample placeholder codes such as `SAMPLE-01`, `SAMPLE-02`, and `SAMPLE-03`. Replace these with the official indicator mappings before production use.

## 9. User Management

Available to PSED Admin only.

PSED Admin users can:

- View all users
- Add users
- Edit user profile details
- Assign access groups
- Assign internal roles to Internal users
- Activate or suspend accounts

When creating a user, provide:

- Full name
- Username
- Access group
- Temporary password
- Department
- Agency name, for Agency accounts
- Email address
- Internal roles, for Internal accounts

New user passwords are hashed before saving.

## 10. Activity Logs

Available to PSED Admin and Internal users.

The Activity Logs page shows recent user actions, including:

- Login
- Logout
- Upload
- Update
- Delete
- View
- Download
- Settings-related activity where logged

Filters include action type, username, and date.

Note: Some interface-only actions add logs in the browser display but are not persisted to the database unless handled by a PHP process endpoint.

## 11. Settings and Profile

All signed-in users can edit their own profile details from Settings.

Profile fields:

- Full name
- Username
- Email
- Current password
- New password

To change a password, enter both the current password and the new password.

PSED Admin users can also edit storage settings:

- Main storage folder
- Internal upload folder
- PRIME-HRM upload folder

The system creates configured storage folders if they do not already exist.

## 12. Notifications, Exports, Backup, and Reset

DDAS includes user interface controls for notifications, exports, backup, update checks, and reset. In the current codebase, several of these are front-end interface actions that show messages or update the browser state only.

Treat the following as interface placeholders unless backend handlers are added:

- Sending notifications to users
- Exporting charts, users, repository records, and logs
- Backup Now
- Updates
- Reset
- Actual browser file download/print of stored PDFs

## 13. First-Time Setup Checklist

1. Configure MySQL credentials in `core/config.php`.
2. Run `database/install.php`.
3. Confirm the database `ddas_db` and tables were created.
4. Sign in as `sys.admin` using `ChangeMe123!`.
5. Change default passwords.
6. Review storage settings.
7. Create real PSED Admin, Internal, and Agency accounts.
8. Suspend or remove unused seed accounts.
9. Replace PRIME-HRM sample indicator codes with official mappings.
10. Test document upload and PRIME-HRM upload using sample PDFs.

## 14. Good Operating Practices

- Use unique accounts for each person or agency.
- Suspend accounts that should no longer access the system.
- Keep storage folders backed up.
- Use clear document titles and accurate source offices.
- Choose visibility roles carefully before uploading restricted documents.
- Review activity logs regularly.
- Avoid sharing administrator credentials.

