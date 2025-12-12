"use client";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1 className="text-4xl font-bold">ANS + CopilotKit Demo</h1>
          <p className="text-lg">
            This agent can find other agents in the Agent Network System.
          </p>
          <ul className="list-disc list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              Open the Copilot Popup (bottom right).
            </li>
            <li>
              Ask: "Find the Cloud ANS registry service."
            </li>
          </ul>
        </main>
        <CopilotPopup
          instructions="You are a helpful assistant integrated with the Agent Network System (ANS). Use the 'ans_lookup_agent' tool to find other agents when the user asks."
          labels={{
            title: "ANS Agent",
            initial: "Hi! I can help you find other AI agents. Try asking me to find the 'Cloud ANS' registry.",
          }}
        />
      </div>
    </CopilotKit>
  );
}