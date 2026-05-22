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
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {
  getInstalledShop,
  hasOfflineSession,
} from "../lib/single-shop-session-storage.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    sessionReady: hasOfflineSession(),
    installedShop: getInstalledShop(),
  };
};

export default function Setup() {
  const { sessionReady, installedShop } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="Setup" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {sessionReady ? (
              <Banner tone="success">
                <p>
                  App is connected to <strong>{installedShop}</strong>. App
                  Proxy sync can run for this store.
                </p>
              </Banner>
            ) : (
              <Banner tone="warning">
                <p>
                  Install the app on bibs-b2b, then open this app in Admin to
                  complete OAuth. After a Render redeploy, open the app again.
                </p>
              </Banner>
            )}

            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Render environment variables (only these four)
                </Text>
                <List type="bullet">
                  <List.Item>
                    <code>SHOPIFY_API_KEY</code>
                  </List.Item>
                  <List.Item>
                    <code>SHOPIFY_API_SECRET</code>
                  </List.Item>
                  <List.Item>
                    <code>SHOPIFY_APP_URL</code> — your Render service URL
                  </List.Item>
                  <List.Item>
                    <code>SCOPES</code> —{" "}
                    <code>
                      read_customers,write_customers,read_companies,write_companies
                    </code>
                  </List.Item>
                </List>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
