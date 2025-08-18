// --- ANSI Escape Codes for Retro Console ---
const CSI = '\x1b[';

// Standard ANSI Color Codes
export const ANSI_COLOR_RESET = '0m';
export const ANSI_COLOR_BLACK = '30m';
export const ANSI_COLOR_RED = '31m';
export const ANSI_COLOR_GREEN = '32m';
export const ANSI_COLOR_YELLOW = '33m';
export const ANSI_COLOR_BLUE = '34m';
export const ANSI_COLOR_MAGENTA = '35m';
export const ANSI_COLOR_CYAN = '36m';
export const ANSI_COLOR_WHITE = '37m';

// --- Helper for Delays ---
export const delay = ms => {
    return new Promise(res => setTimeout(res, ms));
};

// --- Helper for Text Streaming ---
export const STREAM_SPEED_MS = (() => {
    const parsed = parseInt(process.env.STREAM_SPEED_MS);
    return isNaN(parsed) ? 10 : parsed;
})(); // Default 10ms per character

export async function streamText(text, speed = STREAM_SPEED_MS) {
    for (let i = 0; i < text.length; i++) {
        process.stdout.write(text[i]);
        await delay(speed);
    }
    // No newline here, as it will be handled by the caller or specific functions
}

// --- Retro Console Specific Functions ---

// Clear screen and move cursor to home
export function clearScreen() {
    process.stdout.write(`${CSI}2J${CSI}H`);
}

// Helper to fill screen with spaces and move cursor to home
async function fillScreenAndHomeCursor() {
    const screenWidth = process.stdout.columns || 80;
    const screenHeight = process.stdout.rows || 24;
    for (let y = 0; y < screenHeight; y++) {
        process.stdout.write(' '.repeat(screenWidth));
    }
    cursorTo(1, 1); // Move cursor to top-left
}

// Set foreground and background colors (standard ANSI 16 colors)
// For 1990s MATRIX feel: fg=32 (green), bg=40 (black)
export async function setColorsMatrix(fgCode = 32, bgCode = 40) { // Default to green text on black background
    process.stdout.write(`${CSI}${fgCode}m${CSI}${bgCode}m`);
    await fillScreenAndHomeCursor(); // Fill screen after setting colors
}

// Set foreground and background colors (standard ANSI 16 colors)
// For 1990s BASIC feel: fg=37 (white), bg=44 (blue)
export async function setColors(fgCode = 37, bgCode = 44) { // Default to white text on blue background
    process.stdout.write(`${CSI}${fgCode}m${CSI}${bgCode}m`);
    await fillScreenAndHomeCursor(); // Fill screen after setting colors
}

// Reset colors to default
export function resetColors() {
    process.stdout.write(`${CSI}0m`);
}

// Move cursor to specific coordinates (1-based)
export function cursorTo(x, y) {
    process.stdout.write(`${CSI}${y};${x}H`);
}

// Print a line with a delay and then a newline
export async function printLine(text, speed = STREAM_SPEED_MS) {
    await streamText(text, speed);
    process.stdout.write('\n');
}

// Print a line with specific foreground color, then reset
export async function printColoredLine(text, colorCode, speed = STREAM_SPEED_MS) {
    process.stdout.write(`${CSI}${colorCode}`); // Set foreground color
    await streamText(text, speed);
    process.stdout.write(`${CSI}${ANSI_COLOR_RESET}`); // Reset foreground color only
    process.stdout.write('\n'); // Add newline
}

export async function printCenteredLine(text, speed = STREAM_SPEED_MS) {
    const screenWidth = process.stdout.columns || 80;
    const padding = Math.max(0, Math.floor((screenWidth - text.length) / 2));
    const centeredText = ' '.repeat(padding) + text;
    await streamText(centeredText, speed);
    process.stdout.write('\n');
}

// Print a prompt and wait for input (simulated)
export async function printPrompt(promptText = "> ", speed = STREAM_SPEED_MS) {
    await streamText(promptText, speed);
    // In a real interactive console, you'd wait for user input here.
    // For this demo, we just simulate the prompt.
}

// Countdown animation
export async function countdown(from = 5, interval = 1000, message = "LAUNCHING...") {
    const screenWidth = process.stdout.columns || 80; // Default to 80 if not available
    const screenHeight = process.stdout.rows || 24; // Default to 24 if not available
    const centerY = Math.floor(screenHeight / 2);

    for (let i = from; i > 0; i--) {
        clearScreen();
        setColors(ANSI_COLOR_YELLOW, 44); // Yellow text on blue background
        const numStr = String(i);
        const centerX = Math.floor((screenWidth - numStr.length) / 2);
        cursorTo(centerX, centerY);
        await streamText(numStr, 100); // Stream number slowly
        await delay(interval);
    }
    clearScreen();
    setColors(ANSI_COLOR_GREEN, 44); // Green text on blue background
    const msgStr = message;
    const centerX = Math.floor((screenWidth - msgStr.length) / 2);
    cursorTo(centerX, centerY);
    await streamText(msgStr, 50); // Stream message faster
    await delay(interval);
    clearScreen();
    setColors(); // Reset to default white on blue
}