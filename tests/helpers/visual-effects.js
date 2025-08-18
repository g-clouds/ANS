import { streamText, delay, printCenteredLine, printLine, printColoredLine, ANSI_COLOR_BLACK, ANSI_COLOR_GREEN, ANSI_COLOR_RED, resetColors } from './retro-console.js';

// --- Configuration for Animation Speed ---
const ANIMATION_CHAR_DELAY = (() => {
    const parsed = parseInt(process.env.ANIMATION_CHAR_DELAY);
    return isNaN(parsed) ? 5 : parsed;
})();
const ANIMATION_LINE_DELAY = (() => {
    const parsed = parseInt(process.env.ANIMATION_LINE_DELAY);
    return isNaN(parsed) ? 100 : parsed;
})();

// --- ASCII Art Animations ---
// music : https://youtu.be/cu_vihKMWeA
// music 2: https://youtu.be/NZ4Of3lID84
// ascii art https://asciiflow.com/

export const ansLogo = [
"               xx           x             x         xxxxxxx    ",    
"              xxx          xx            xx       xxxxxxxxxxx  ",
"             xxxx          xxx           xx      xxxx     xxxx ",
"            xxxxxx         xx x          xx      xx         xx ",
"           xxx  xx         xx  x         xx      xxx           ",
"          xxx   xx         xx   x        xx       xxxxx        ",
"         xxx    xx        xx    x       xx        xxxxxx       ",
"        xxx     xx        xx     x      xx          xxxxx      ",
"       xxx      xx       xx      x     xx            xxxx      ",
"      xxxxxxxxxxxx      xx       x    xx              xx       ",
"     xxxxxxxxxxxxx      xx        x   xx               x       ",
"    xxxx        xx     xx         x  xx   xx          x        ",
"   xxxx         xx     xx          xxxx   xxx       xxx        ",
"  xxxx          xx    xx           xxx    xxxxxxxxxxx          ",
" xxxx           xx    xx            xx       xxxxxx            "
];


export const pixelCharacter = [
"   _   ",
"  / \\  ",
" (o o) ",
"   `   ",
];

export const levelUpText = [
"+--+         +-+----+  +-+         +-+   +-+----+   +--+               +--+      +--+ ++-------+",
"|  |         | +----+  | |         | |   | +----+   |  |               |  |      |  | |  +---+  |",
"|  |         | |       +-+-+     +-+-+   | |        |  |               |  |      |  | |  |   |  |",
"|  |         | +--+      | |     | |     | +--+     |  |               |  |      |  | |  +---+  |",
"|  |         | +--+      +-+-+ +-+-+     | +--+     |  |               |  |      |  | |+-+-----+",
"|  |         | |           | | | |       | |        |  |               |  |      |  | | |      ",
"|  +------+  | +----+      +-+++-+       | +----+   |  +------+        |  +------|  | | |      ",
"+--+------+  +-+----+        ++          +-+----+   +--+------+        +--+------+--+ +-+     ",

];

export const levelUpTextMobile = [
"|xx|     xxxxxx xx   xx xxxxxx xx        xx  xx xxxxx",
"|xx|     xx     xx   xx xx     xx        xx  xx x  xx",
"|xx|     xxxxx   xx xx  xxxxx  xx        xx  xx xxxxx",
"|xxxxxx| xx       xxx   xx     xxxxxx    xx  xx xx   ",
"|xxxxxx| xxxxxx    x    xxxxxx xxxxxx    xxxxxx xx   ",
];

export async function animateText(lines, lineDelay = ANIMATION_LINE_DELAY, charDelay = ANIMATION_CHAR_DELAY) {
    for (const line of lines) {
        await streamText(line, charDelay);
        process.stdout.write('\n'); // Add newline after each streamed line
        await delay(lineDelay);
    }
}

export async function introAnimation() {
    await animateText(ansLogo, 150, 5);
    await printLine("Agent Network System");
    await delay(1000);
}