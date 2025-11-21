// Panel switching
// ======================
document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
        document.getElementById(btn.dataset.panel).classList.add('active');
        btn.classList.add('active');
    });
});

// ======================
// Dark Mode Toggle
// ======================
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// ======================
// Status helper
// ======================
function setStatus(msg, id, color) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.color = color;
}

// ======================
// JSON Formatter
// ======================
function beautifyJSON() {
    try {
        const obj = JSON.parse(document.getElementById('jsonInput').value);
        document.getElementById('jsonInput').value = JSON.stringify(obj, null, 4);
        setStatus("JSON Beautified ✔", "errorMessage", "green");
    } catch (e) {
        setStatus(`Error: ${e.message}`, "errorMessage", "red");
    }
}

function minifyJSON() {
    try {
        const obj = JSON.parse(document.getElementById('jsonInput').value);
        document.getElementById('jsonInput').value = JSON.stringify(obj);
        setStatus("JSON Minified ✔", "errorMessage", "green");
    } catch (e) {
        setStatus(`Error: ${e.message}`, "errorMessage", "red");
    }
}

function validateJSON() {
    try {
        JSON.parse(document.getElementById('jsonInput').value);
        setStatus("Valid JSON ✔", "errorMessage", "green");
    } catch (e) {
        setStatus(`Invalid JSON: ${e.message}`, "errorMessage", "red");
    }
}

function clearJSON() {
    document.getElementById('jsonInput').value = "";
    setStatus("Cleared ✔", "errorMessage", "blue");
}

function copyJSON() {
    navigator.clipboard.writeText(document.getElementById('jsonInput').value);
    setStatus("Copied ✔", "errorMessage", "green");
}

// ======================
// Upload / Download
// ======================
function uploadFile() {
    document.getElementById('fileInput').click();
}

function handleFileUpload(event) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById('jsonInput').value = this.result;
    };
    reader.readAsText(event.target.files[0]);
}

function downloadJSON() {
    const blob = new Blob([document.getElementById('jsonInput').value], { type: "application/json" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    a.click();
}

// ======================
// Diff Tool
// ======================
function diffJSON() {
    const left = document.getElementById('leftJSON').value;
    const right = document.getElementById('rightJSON').value;
    const diff = Diff.createPatch('diff', left, right);
    document.getElementById('diffOutput').textContent = diff;
    setStatus("Diff Generated ✔", "diffStatus", "green");
}

// ======================
// Merge JSON
// ======================
function mergeJSON() {
    try {
        const left = JSON.parse(document.getElementById('mergeLeft').value);
        const right = JSON.parse(document.getElementById('mergeRight').value);
        const merged = { ...left, ...right };
        document.getElementById('mergeOutput').textContent = JSON.stringify(merged, null, 4);
        setStatus("Merged ✔", "mergeStatus", "green");
    } catch (e) {
        setStatus(`Merge Error: ${e.message}`, "mergeStatus", "red");
    }
}

// ======================
// Schema Generator
// ======================
function generateSchema() {
    try {
        const obj = JSON.parse(document.getElementById('schemaInput').value);
        const schema = { type: "object", properties: {} };
        Object.keys(obj).forEach(k => schema.properties[k] = { type: typeof obj[k] });
        document.getElementById('schemaOutput').textContent = JSON.stringify(schema, null, 4);
        setStatus("Schema Generated ✔", "schemaStatus", "green");
    } catch (e) {
        setStatus(`Schema Error: ${e.message}`, "schemaStatus", "red");
    }
}

// ======================
// Encryption / Decryption
// ======================
function encryptJSON() {
    const val = document.getElementById('encryptInput').value;
    const encrypted = CryptoJS.AES.encrypt(val, "secret").toString();
    document.getElementById('encryptOutput').value = encrypted;
    setStatus("Encrypted ✔", "encryptStatus", "green");
}

function decryptJSON() {
    const val = document.getElementById('encryptOutput').value;
    try {
        const decrypted = CryptoJS.AES.decrypt(val, "secret").toString(CryptoJS.enc.Utf8);
        document.getElementById('encryptInput').value = decrypted;
        setStatus("Decrypted ✔", "encryptStatus", "green");
    } catch (e) {
        setStatus(`Decrypt Error: ${e.message}`, "encryptStatus", "red");
    }
}

// ======================
// Converters
// ======================
function convertJSON() {
    const val = document.getElementById('convertInput').value;
    const format = document.getElementById('convertFormat').value;
    if (!format) { setStatus("Choose conversion format!", "convertStatus", "red"); return; }
    try {
        const obj = JSON.parse(val);
        let output = "";
        switch (format) {
            case "yaml": output = jsyaml.dump(obj); break;
            case "csv": output = Papa.unparse(obj); break;
            case "xml": output = xmljs.js2xml(obj, { compact: true, spaces: 4 }); break;
            case "json": output = JSON.stringify(obj, null, 4); break;
        }
        document.getElementById('convertOutput').textContent = output;
        setStatus(`Converted to ${format.toUpperCase()} ✔`, "convertStatus", "green");
    } catch (e) {
        setStatus(`Convert Error: ${e.message}`, "convertStatus", "red");
    }
}

// ======================
// API Tester
// ======================
let selectedMethod = "";

function setMethod(method, button) {
    selectedMethod = method;
    document.querySelectorAll('.api-methods button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
}

async function callAPI() {
    const url = document.getElementById('apiUrl').value.trim();
    if (!selectedMethod) { setStatus("Choose HTTP Method!", "apiStatus", "red"); return; }
    if (!url) { setStatus("API URL required!", "apiStatus", "red"); return; }

    try {
        let headers = {};
        try { headers = JSON.parse(document.getElementById('apiHeaders').value || "{}"); } catch (e) { setStatus("Headers JSON invalid!", "apiStatus", "red"); return; }

        let body = document.getElementById('apiBody').value;
        const options = { method: selectedMethod, headers };
        if (["POST", "PUT", "PATCH"].includes(selectedMethod)) options.body = body;

        const response = await fetch(url, options);
        const text = await response.text();
        document.getElementById('apiResponse').textContent = text;
        setStatus("API call success ✔", "apiStatus", "green");
    } catch (e) {
        setStatus(`API Error: ${e.message}`, "apiStatus", "red");
    }
}