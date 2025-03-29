const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const os = require("os");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
const upload = multer({ dest: "uploads/" });

let printer;
if (os.platform() === "win32") {
    printer = require("pdf-to-printer"); // Windows
} else {
    printer = require("unix-print"); // macOS/Linux
}

// Print PDF (Handles both Windows & macOS)
app.post("/print", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const filePath = req.file.path;
    //const filePath = path.resolve(req.file.path);

    try {
        if (os.platform() === "win32") {
            await printer.print(filePath); // Windows
        } else {
            console.log('print: ' + filePath)
            await printer.print(filePath); // macOS/Linux
        }

        res.send(`Printing ${req.file.originalname}`);
        //fs.unlinkSync(filePath);
    } catch (err) {
        res.status(500).send(err.toString());
    } finally{
        fs.unlinkSync(filePath);
    }
});

app.listen(port, () => console.log(`Print server running at http://localhost:${port}`));
