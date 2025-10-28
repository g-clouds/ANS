const { spawn } = require('child_process');
const path = require('path');

const processes = [];

function cleanup() {
    console.log('\n[Orchestrator] Shutting down all processes...');
    processes.forEach(p => {
        if (!p.killed) p.kill();
    });
    process.exit();
}
process.on('SIGINT', cleanup);
process.on('exit', cleanup);

function runCommand(command, args, options, successMessage) {
    return new Promise((resolve, reject) => {
        console.log(`[Orchestrator] Launching: ${command} ${args.join(' ')}`);
        const proc = spawn(command, args, options);
        processes.push(proc);

        proc.stdout.on('data', (data) => {
            const output = data.toString();
            process.stdout.write(output);
            if (successMessage && output.includes(successMessage)) {
                console.log(`[Orchestrator] Detected success message for ${args[0]}`);
                resolve(proc);
            }
        });
        proc.stderr.on('data', (data) => process.stderr.write(data));
        proc.on('close', (code) => {
            if (code !== 0 && !proc.killed) {
                reject(new Error(`Process ${args[0]} exited with code ${code}`));
            } else {
                // If the process exits cleanly (code 0), we can resolve.
                // This is important for Agent B which exits after its task.
                resolve();
            }
        });
    });
}

async function main() {
    try {
        // 1. Start Dashboard
        await runCommand('node', [path.join(__dirname, 'dashboard/server.js')], {}, 'Visualizer running');

        // 2. Start Agent A (Alice)
        await runCommand('node', [path.join(__dirname, 'agent_a.js')], {}, 'ALICE_IS_READY');

        // 3. Start Agent B (Bob) and wait for it to complete
        await runCommand('node', [path.join(__dirname, 'agent_b.js')], {}, null);

        console.log("\n[Orchestrator] Demo sequence complete. Press Ctrl+C to exit.");
        
        // Keep the process alive to allow viewing the dashboard
        setInterval(() => {}, 1 << 30);

    } catch (error) {
        console.error("\n[Orchestrator] An error occurred:", error);
        cleanup();
    }
}

main();
