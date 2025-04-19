const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const util = require("util");

const execAsync = util.promisify(exec);

const app = express();
const port = 5000;

app.use(cors());
const upload = multer({ dest: "uploads/" });

const isWin = os.platform() === "win32";

let printer;
if(!isWin){
    printer = require("unix-print"); // for maxOs/Linux
}

let sumatraRealPath;
if(isWin){
    // Extract SumatraPDF.exe at runtime
    const tempDir = os.tmpdir();
    const sumatraSnapshotPath = path.join(__dirname, "bin", "SumatraPDF-3.5.2-32.exe");
    sumatraRealPath = path.join(tempDir, "SumatraPDF.exe");

    // Only extract if not already there
    if(!fs.existsSync(sumatraRealPath)){
        try {
            const binary = fs.readFileSync(sumatraSnapshotPath);
            fs.writeFileSync(sumatraRealPath, binary, { mode: 0o755 });
            console.log("✅ SumatraPDF extracted to:", sumatraRealPath);
        } catch (err) {
            console.error("❌ Failed to extract SumatraPDF:", err);
        }
    }
}


app.post("/print", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const filePath = path.resolve(req.file.path);
    const fileName = req.file.originalname;

    try {
        console.log(`Received file: ${fileName}`);
        console.log(`Temporary path: ${filePath}`);

        if (isWin) {            
            const cmd = `"${sumatraRealPath}" -print-to-default -silent "${filePath}"`;
            console.log(`Executing: ${cmd}`);
            await execAsync(cmd);
        } else {
            await printer.print(filePath);
        }

        res.send(`Printing ${fileName}...`);
    } catch (err) {
        console.error("Print error:", err);
        res.status(500).send(`Print failed: ${err.message}`);
    } finally {
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.warn(`Failed to delete file ${filePath}:`, unlinkErr.message);
            } else {
                console.log(`Deleted temporary file: ${filePath}`);
            }
        });
    }
});

app.listen(port, () => {
    console.log(`✅ Print server running at http://localhost:${port}`);
});
