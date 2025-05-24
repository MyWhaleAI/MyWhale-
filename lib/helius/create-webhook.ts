import { createHash } from "crypto";

const HELIUS_ENDPOINT = `https://api.helius.xyz/v0/webhooks?api-key=${process.env.HELIUS_API_KEY}`;

const webhookBase = {
  webhookURL: process.env.NEXT_PUBLIC_HELIUS_WEBHOOK_URL!,
  transactionTypes: ["ALL"],
  webhookType: "enhanced",
};

export async function upsertHeliusWebhook(walletAddress: string) {
  const hashedWallet = createHash("sha256").update(walletAddress).digest("hex");
  const uniqueLabel = `whale-${hashedWallet.slice(0, 8)}`;

  const newWebhook = {
    ...webhookBase,
    accountAddresses: [walletAddress],
    webhookURL: process.env.NEXT_PUBLIC_HELIUS_WEBHOOK_URL!,
    webhookType: "enhanced",
    label: uniqueLabel,
  };

  const existingWebhooksRes = await fetch(HELIUS_ENDPOINT);
  if (!existingWebhooksRes.ok) throw new Error("Failed to fetch Helius webhooks");

  const existingWebhooks = await existingWebhooksRes.json();
  const existing = existingWebhooks.find((w: any) =>
    w.accountAddresses.includes(walletAddress)
  );

  if (existing) {
    const updateRes = await fetch(`${HELIUS_ENDPOINT}/${existing.webhookID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWebhook),
    });

    if (!updateRes.ok) throw new Error("Failed to update existing webhook");
    return await updateRes.json();
  } else {
    const createRes = await fetch(HELIUS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWebhook),
    });

    if (!createRes.ok) throw new Error("Failed to create webhook");
    return await createRes.json();
  }
}
