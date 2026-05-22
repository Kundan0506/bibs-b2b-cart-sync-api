import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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

export default function Index() {
  const { sessionReady, installedShop } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="BIBS B2B Company Cart" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {sessionReady ? (
              <Banner tone="success">
                Connected to <strong>{installedShop}</strong>. Storefront sync:{" "}
                <code>/apps/company-cart/sync</code>
              </Banner>
            ) : (
              <Banner tone="warning">
                Open <Link to="/app/setup">Setup</Link> after installing on
                bibs-b2b.
              </Banner>
            )}

            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  What this app does
                </Text>
                <List type="bullet">
                  <List.Item>
                    Theme POSTs cart → company metafield{" "}
                    <code>custom.company_cart</code>
                  </List.Item>
                  <List.Item>
                    No database — OAuth session kept in memory after you open
                    this app in Admin
                  </List.Item>
                  <List.Item>
                    Render env: API key, secret, app URL, scopes only
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
