/**
 * Mock integration service. No real external API calls.
 */

export function getShopifyContext(shopName: string) {
  return {
    recentOrders: [
      { id: "#1001", product: "Premium Widget", status: "shipped", value: "₹3,999" },
      { id: "#1002", product: "Basic Widget", status: "processing", value: "₹1,999" },
      { id: "#1003", product: "Deluxe Widget", status: "delivered", value: "₹5,999" },
    ],
    topProducts: ["Premium Widget", "Basic Widget", "Deluxe Widget"],
    shopName,
  };
}

export function getCRMContext(crmName: string) {
  return {
    recentContacts: [
      { name: "Alice Johnson", status: "lead", lastContact: "2 days ago" },
      { name: "Bob Smith", status: "customer", lastContact: "1 week ago" },
      { name: "Carol White", status: "prospect", lastContact: "today" },
    ],
    openDeals: 3,
    crmName,
  };
}
