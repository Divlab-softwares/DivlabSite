const ORDERS_CHANNEL = "erp-orders";
const ORDER_CHANGED_EVENT = "order.changed";

function getRealtimeUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_BASIC_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;

  if (!configuredUrl) {
    return null;
  }

  // L'URL publique des fichiers peut être un domaine Storage. Realtime doit
  // toujours utiliser l'hôte API du projet : <project-ref>.supabase.co.
  const apiUrl = configuredUrl
    .trim()
    .replace(/\/$/, "")
    .replace(".storage.supabase.co", ".supabase.co");

  try {
    return new URL(apiUrl).origin;
  } catch {
    return null;
  }
}

export async function publishOrderChanged(orderId: string, action = "created") {
  const url = getRealtimeUrl();
  const key =
    process.env.SUPABASE_REALTIME_SERVICE_ROLE_JWT ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!url || !key) {
    console.warn("Order broadcast skipped: Supabase server configuration is missing.");
    return false;
  }

  if (!key.startsWith("eyJ")) {
    console.warn(
      "Order broadcast skipped: SUPABASE_REALTIME_SERVICE_ROLE_JWT must contain the legacy service_role JWT.",
    );
    return false;
  }

  try {
    const response = await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            topic: ORDERS_CHANNEL,
            event: ORDER_CHANGED_EVENT,
            payload: {
              orderId,
              action,
              occurredAt: new Date().toISOString(),
            },
            private: true,
          },
        ],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`Order broadcast rejected by Supabase (HTTP ${response.status}).`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      "Order broadcast unavailable:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
