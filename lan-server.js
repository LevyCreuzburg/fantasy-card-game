"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const { WebSocketServer } = require("ws");

const HOST = process.env.LAN_HOST || "0.0.0.0";
const PORT = Number(process.env.LAN_PORT || 8787);
const ROOT = process.cwd();

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8"
};

function safeResolve(filePath) {
    const resolved = path.resolve(ROOT, filePath);
    if (!resolved.startsWith(path.resolve(ROOT))) {
        return null;
    }
    return resolved;
}

function readStaticFile(urlPath, callback) {
    const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
    const requested = cleanPath === "/" ? "/index.html" : cleanPath;
    const resolved = safeResolve(`.${requested}`);
    if (!resolved) {
        callback(403, "text/plain; charset=utf-8", Buffer.from("Forbidden"));
        return;
    }
    fs.readFile(resolved, (error, data) => {
        if (error) {
            callback(404, "text/plain; charset=utf-8", Buffer.from("Not found"));
            return;
        }
        const ext = path.extname(resolved).toLowerCase();
        callback(200, MIME_TYPES[ext] || "application/octet-stream", data);
    });
}

const server = http.createServer((req, res) => {
    readStaticFile(req.url || "/", (status, contentType, data) => {
        res.writeHead(status, {
            "Content-Type": contentType,
            "Cache-Control": "no-store"
        });
        res.end(data);
    });
});

const wss = new WebSocketServer({ server, path: "/lan" });
const roomSockets = new Map();

function getRoomSet(roomCode) {
    if (!roomSockets.has(roomCode)) {
        roomSockets.set(roomCode, new Set());
    }
    return roomSockets.get(roomCode);
}

function removeSocketFromRoom(ws) {
    if (!ws.roomCode) {
        return;
    }
    const set = roomSockets.get(ws.roomCode);
    if (!set) {
        return;
    }
    set.delete(ws);
    if (set.size <= 0) {
        roomSockets.delete(ws.roomCode);
    }
}

function sendJson(ws, payload) {
    if (!ws || ws.readyState !== ws.OPEN) {
        return;
    }
    ws.send(JSON.stringify(payload));
}

function relayToRoom(roomCode, sourceSocket, payload) {
    const members = roomSockets.get(roomCode);
    if (!members) {
        return;
    }
    members.forEach((member) => {
        if (member === sourceSocket) {
            return;
        }
        sendJson(member, { type: "peer", payload });
    });
}

wss.on("connection", (ws) => {
    ws.roomCode = "";
    ws.role = "";
    ws.playerName = "";

    ws.on("message", (raw) => {
        let message = null;
        try {
            message = JSON.parse(String(raw || ""));
        } catch (error) {
            return;
        }
        if (!message || typeof message !== "object") {
            return;
        }

        if (message.type === "hello") {
            const roomCode = String(message.roomCode || "").trim().toUpperCase();
            if (!/^[A-Z0-9]{6}$/.test(roomCode)) {
                sendJson(ws, { type: "system", event: "error", message: "Ungueltiger Session-Code." });
                return;
            }
            removeSocketFromRoom(ws);
            ws.roomCode = roomCode;
            ws.role = String(message.role || "");
            ws.playerName = String(message.playerName || "");
            getRoomSet(roomCode).add(ws);
            sendJson(ws, { type: "system", event: "joined", roomCode });
            return;
        }

        if (message.type === "relay") {
            if (!ws.roomCode || !message.payload) {
                return;
            }
            relayToRoom(ws.roomCode, ws, message.payload);
        }
    });

    ws.on("close", () => {
        removeSocketFromRoom(ws);
    });

    ws.on("error", () => {
        removeSocketFromRoom(ws);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`LAN server running: http://${HOST}:${PORT}`);
    console.log("Open this URL on both PCs in the same WLAN.");
});

