import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Banner,
  List,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {
  configuredShop,
  getPendingOfflineAccessToken,
  isAccessTokenConfigured,
} from "../lib/single-shop-session-storage.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    shop: configuredShop(),
    tokenConfigured: isAccessTokenConfigured(),
    pendingToken: getPendingOfflineAccessToken(),
  };
};

export default function Setup() {
  const { shop, tokenConfigured, pendingToken } =
    useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="Setup (single store)" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {tokenConfigured ? (
              <Banner tone="success">
                <p>
                  <strong>SHOPIFY_ACCESS_TOKEN</strong> is set. App Proxy sync
                  should work for <strong>{shop}</strong>.
                </p>
              </Banner>
            ) : (
              <Banner tone="warning">
                <p>
                  Add <strong>SHOPIFY_ACCESS_TOKEN</strong> to Render (or .env)
                  after install.
                </p>
              </Banner>
            )}

            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Environment variables (Render)
                </Text>
                <List type="bullet">
                  <List.Item>
                    <code>SHOPIFY_SHOP</code> ={" "}
                    <code>{shop ?? "bibs-b2b.myshopify.com"}</code>
                  </List.Item>
                  <List.Item>
                    <code>SHOPIFY_ACCESS_TOKEN</code> = offline Admin API token
                    (see below)
                  </List.Item>
                  <List.Item>
                    <code>SHOPIFY_API_KEY</code>, <code>SHOPIFY_API_SECRET</code>
                    , <code>SCOPES</code>, <code>SHOPIFY_APP_URL</code>
                  </List.Item>
                </List>
              </BlockStack>
            </Card>

            {pendingToken && !tokenConfigured && (
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Copy this token now
                  </Text>
                  <Text as="p" variant="bodyMd">
                    This was saved during install. Paste it as{" "}
                    <code>SHOPIFY_ACCESS_TOKEN</code> in Render, then redeploy.
                    It is only shown while this server instance is running.
                  </Text>
                  <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                    <pre style={{ margin: 0, wordBreak: "break-all" }}>
                      {pendingToken}
                    </pre>
                  </Box>
                </BlockStack>
              </Card>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
