import fs from "fs";

export function getSecret(secretName: string, defaultValue: string = ""): string {
    try {
        // Check if running in Docker Swarm mode with secrets
        const secretPath = `/run/secrets/${secretName}`;
        if (fs.existsSync(secretPath)) {
            return fs.readFileSync(secretPath, "utf8").trim();
        }
    } catch (err) {
        console.warn(`Could not read secret ${secretName}, falling back to env/default.`);
    }

    // Fallback to environment variable or default
    return process.env[secretName.toUpperCase()] || defaultValue;
}
