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
  configuredShop,
  isAccessTokenConfigured,
} from "../lib/single-shop-session-storage.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    shop: configuredShop(),
    tokenConfigured: isAccessTokenConfigured(),
  };
};

export default function Index() {
  const { shop, tokenConfigured } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="BIBS B2B Company Cart" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {tokenConfigured ? (
              <Banner tone="success">
                Connected to <strong>{shop}</strong>. Storefront cart sync uses
                App Proxy <code>/apps/company-cart/sync</code>.
              </Banner>
            ) : (
              <Banner tone="warning">
                Set <code>SHOPIFY_ACCESS_TOKEN</code> on Render — open{" "}
                <Link to="/app/setup">Setup</Link> after install.
              </Banner>
            )}

            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  What this app does
                </Text>
                <List type="bullet">
                  <List.Item>
                    Theme POSTs cart lines to App Proxy → updates company
                    metafield <code>custom.company_cart</code>
                  </List.Item>
                  <List.Item>
                    Other company customers load cart from that metafield
                    (theme)
                  </List.Item>
                  <List.Item>
                    No database — single store only ({shop ?? "set SHOPIFY_SHOP"}
                    )
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
