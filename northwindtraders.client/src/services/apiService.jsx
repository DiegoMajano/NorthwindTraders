const BASE_URL = "http://localhost:5273/api";

export const fetchCustomers = async () => {
  const response = await fetch(`${BASE_URL}/customer`);
  if (!response.ok) throw new Error("Error fetching customers");
  return await response.json();
};

export const fetchEmployees = async () => {
  const response = await fetch(`${BASE_URL}/employee`);
  if (!response.ok) throw new Error("Error fetching employees");
  return await response.json();
};

export const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/product`);
  if (!response.ok) throw new Error("Error fetching products");
  return await response.json();
};
