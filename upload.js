function uploadFile() {
    const fileInput = document.getElementById("fileInput");

    if (fileInput.files.length === 0) {
        document.getElementById("status").innerText = "Please select a file.";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("status").innerText = data.message;
        loadFiles(); // Refresh file list
    })
    .catch(error => {
        console.error("Error uploading file:", error);
        document.getElementById("status").innerText = "Error uploading file.";
    });
}

// Fetch and display uploaded files
function loadFiles() {
    fetch("/files")
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById("fileList");
            fileList.innerHTML = ""; // Clear old list

            files.forEach(file => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = `/uploads/${file}`;
                link.innerText = file;
                link.target = "_blank";
                listItem.appendChild(link);
                fileList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error loading files:", error));
}

// Load files when page loads
window.onload = loadFiles;
