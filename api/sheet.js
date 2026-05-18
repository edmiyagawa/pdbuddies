module.exports = async function handler(request, response) {
  try {
    const sourceUrl = request.query.url;
    const gid = request.query.gid || "";

    if (!sourceUrl) {
      response.status(400).json({ error: "Missing Google Sheet URL." });
      return;
    }

    const csvUrl = toGoogleSheetCsvUrl(sourceUrl, gid);
    const parsedUrl = new URL(csvUrl);
    if (parsedUrl.hostname !== "docs.google.com") {
      response.status(400).json({ error: "Only docs.google.com spreadsheet URLs are supported." });
      return;
    }

    const sheetResponse = await fetch(csvUrl, {
      headers: { "user-agent": "Pixie Dust Companion/1.0" },
      cache: "no-store",
    });

    if (!sheetResponse.ok) {
      response.status(sheetResponse.status).json({ error: `Google Sheet returned ${sheetResponse.status}.` });
      return;
    }

    const csv = redactPrivateColumns(await sheetResponse.text());
    response.setHeader("content-type", "text/csv; charset=utf-8");
    response.setHeader("cache-control", "no-store");
    response.status(200).send(csv);
  } catch (error) {
    response.status(500).json({ error: error.message || "Unable to load Google Sheet." });
  }
};

const PRIVATE_COLUMN_ALIASES = [
  "names",
  "name",
  "family",
  "guest",
  "guests",
  "occupants",
  "room occupants",
];

function redactPrivateColumns(csv) {
  const rows = parseCsv(csv);
  const headers = rows[0] || [];
  const privateIndexes = headers
    .map((header, index) => PRIVATE_COLUMN_ALIASES.includes(normalizeHeader(header)) ? index : -1)
    .filter((index) => index >= 0);

  if (!privateIndexes.length) return csv;

  const redacted = rows.map((row, rowIndex) => {
    if (rowIndex === 0) return row;
    const next = row.slice();
    privateIndexes.forEach((index) => {
      next[index] = "";
    });
    return next;
  });

  return rowsToCsv(redacted);
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((candidate) => candidate.some((value) => String(value).trim()));
}

function rowsToCsv(rows) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function normalizeHeader(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function toGoogleSheetCsvUrl(value, preferredGid) {
  const input = String(value || "").trim();
  const inferredGid = preferredGid || gidFromUrl(input);
  const sheetId = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
  const publishedId = input.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/)?.[1];

  if (publishedId) {
    return `https://docs.google.com/spreadsheets/d/e/${publishedId}/pub?output=csv${inferredGid ? `&gid=${encodeURIComponent(inferredGid)}` : ""}`;
  }

  if (sheetId) {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv${inferredGid ? `&gid=${encodeURIComponent(inferredGid)}` : ""}`;
  }

  if (/^[a-zA-Z0-9-_]{20,}$/.test(input)) {
    return `https://docs.google.com/spreadsheets/d/${input}/gviz/tq?tqx=out:csv${inferredGid ? `&gid=${encodeURIComponent(inferredGid)}` : ""}`;
  }

  return input;
}

function gidFromUrl(value) {
  try {
    const url = new URL(value);
    return url.searchParams.get("gid") || "";
  } catch {
    return "";
  }
}
