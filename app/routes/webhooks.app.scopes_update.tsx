import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, shop, topic } = await authenticate.webhook(request);
  const current = payload.current as string[];

  console.log(`Received ${topic} webhook for ${shop}`, current);

  return new Response();
};
