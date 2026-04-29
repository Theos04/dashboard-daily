const API_URL = "http://127.0.0.1:5000";

export async function fetchCRM() {
  const res = await fetch(`${API_URL}/api/crm/contacts`);
  return res.json();
}

export async function fetchSales() {
  const res = await fetch(`${API_URL}/api/sales/transactions`);
  return res.json();
}

export async function fetchPurchase() {
  const res = await fetch(`${API_URL}/api/purchase/orders`);
  return res.json();
}
