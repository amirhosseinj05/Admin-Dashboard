/**
 * =============================================================================
 *  API SERVICE LAYER  <--  THE ONLY FILE YOU NEED TO CHANGE FOR A REAL BACKEND
 * =============================================================================
 * Components never import mock data directly; they call these functions.
 * Today they answer with local dummy data (after a tiny simulated delay).
 *
 * To go live, replace the body of each function with a real request, e.g.:
 *
 *   const res = await fetch(`${API_BASE}/users`, {
 *     headers: { Authorization: `Bearer ${getToken()}` },
 *   });
 *   if (!res.ok) throw new Error('Failed to load users');
 *   return res.json();
 *
 * Nothing else in the app has to change.
 * =============================================================================
 */
import { mockOrders, mockUsers } from '../data/mockData.js';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

/** Tiny helper that imitates network latency during development. */
const simulateNetwork = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory "database" so add/edit/delete persist while the app is open.
let usersStore = [...mockUsers];
let ordersStore = [...mockOrders];

/* ------------------------------- USERS ---------------------------------- */
export async function fetchUsers() {
  await simulateNetwork();
  // ! replace with: return (await fetch(`${API_BASE}/users`)).json();
  return usersStore.map((user) => ({ ...user }));
}

export async function createUser(payload) {
  await simulateNetwork(250);
  // ! replace with: POST `${API_BASE}/users`
  const newUser = {
    ...payload,
    id: Math.max(0, ...usersStore.map((u) => u.id)) + 1,
    joinedAt: new Date().toISOString().slice(0, 10),
  };
  usersStore = [newUser, ...usersStore];
  return newUser;
}

export async function updateUser(id, payload) {
  await simulateNetwork(250);
  // ! replace with: PUT `${API_BASE}/users/${id}`
  const index = usersStore.findIndex((user) => user.id === Number(id));
  if (index === -1) return null;

  const updated = { ...usersStore[index], ...payload };
  usersStore = usersStore.map((user, i) => (i === index ? updated : user));
  return updated;
}

export async function deleteUser(id) {
  await simulateNetwork(200);
  // ! replace with: DELETE `${API_BASE}/users/${id}`
  usersStore = usersStore.filter((user) => user.id !== Number(id));
  return { success: true };
}

/* ------------------------------- ORDERS --------------------------------- */
export async function fetchOrders() {
  await simulateNetwork();
  // ! replace with: return (await fetch(`${API_BASE}/orders`)).json();
  return ordersStore.map((order) => ({ ...order }));
}

export async function updateOrderStatus(id, status) {
  await simulateNetwork(200);
  // ! replace with: PATCH `${API_BASE}/orders/${id}`  body: { status }
  const index = ordersStore.findIndex((order) => order.id === id);
  if (index === -1) return null;

  const updated = { ...ordersStore[index], status };
  ordersStore = ordersStore.map((order, i) => (i === index ? updated : order));
  return updated;
}
