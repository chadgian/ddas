<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sync Files</title>
</head>
<body>

  <h2>Files in uploads folder</h2>

  <?php
    $files = scandir("uploads/");
    $fileList = [];

    foreach ($files as $file) {
        if ($file != "." && $file != ".." && is_file("uploads/" . $file)) {
            echo $file . "<br>";

            $fileList[] = [
                "filename" => $file,
                "file_url" => "uploads/" . rawurlencode($file)
            ];
        }
    }
  ?>

  <br>
  <button id="selectFolderBtn">Select Folder</button>
  <button id="syncBtn">Sync Files</button>

  <p id="selectedFolderText">No folder selected
    .</p>
  <div id="status"></div>

  <script>
    let selectedDirHandle = null;

    const files = <?php echo json_encode($fileList); ?>;

    document.getElementById("selectFolderBtn").addEventListener("click", async () => {
      const status = document.getElementById("status");
      const selectedFolderText = document.getElementById("selectedFolderText");

      try {
        if (!window.showDirectoryPicker) {
          status.innerHTML = "Your browser does not support folder selection.";
          return;
        }

        selectedDirHandle = await window.showDirectoryPicker();
        selectedFolderText.innerHTML = "Folder selected successfully.";
        status.innerHTML = "";
      } catch (error) {
        selectedFolderText.innerHTML = "No folder selected.";
        status.innerHTML = "Folder selection cancelled.";
      }
    });

    document.getElementById("syncBtn").addEventListener("click", async () => {
      const status = document.getElementById("status");

      if (!selectedDirHandle) {
        status.innerHTML = "Please select a folder first.";
        return;
      }

      if (!files || files.length === 0) {
        status.innerHTML = "No files found to sync.";
        return;
      }

      status.innerHTML = "Starting sync...<br>";

      for (const file of files) {
        try {
          const response = await fetch(file.file_url);

          if (!response.ok) {
            status.innerHTML += `Failed to fetch: ${file.filename}<br>`;
            continue;
          }

          const blob = await response.blob();

          const fileHandle = await selectedDirHandle.getFileHandle(file.filename, {
            create: true
          });

          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();

          status.innerHTML += `Synced: ${file.filename}<br>`;
        } catch (error) {
          status.innerHTML += `Error syncing ${file.filename}: ${error.message}<br>`;
        }
      }

      status.innerHTML += "<br>Sync completed.";
    });
  </script>

</body>
</html>