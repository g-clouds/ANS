import { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint, OpenAIAdapter } from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { ansActions } from "@ans-sdk/copilotkit-adapter";

export const POST = async (req: NextRequest) => {
  const actions = ansActions({
    baseURL: "https://ans-register-390011077376.us-central1.run.app"
  });

  const runtime = new CopilotRuntime({
    actions: actions,
  });

  const serviceAdapter = new OpenAIAdapter({ model: "gpt-4o-mini" });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
