import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchOrders, fetchUsers } from '../services/api.js';

/**
 * DataContext - single source of truth for users & orders (Context API state).
 * Data is loaded once through the service layer, then all CRUD helpers update
 * the local state optimistically so every page stays in sync without prop drilling.
 */
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ! Both calls hit `src/services/api.js` -> swap them for real endpoints.
      const [usersData, ordersData] = await Promise.all([fetchUsers(), fetchOrders()]);
      setUsers(usersData);
      setOrders(ordersData);
    } catch (err) {
      setError(err?.message || 'Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ----------------------------- USER ACTIONS ---------------------------- */
  const addUser = useCallback((newUser) => {
    setUsers((prev) => [newUser, ...prev]);
  }, []);

  const editUser = useCallback((id, payload) => {
    setUsers((prev) => prev.map((u) => (u.id === Number(id) ? { ...u, ...payload } : u)));
  }, []);

  const removeUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== Number(id)));
  }, []);

  /* ---------------------------- ORDER ACTIONS ---------------------------- */
  const changeOrderStatus = useCallback((id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const value = useMemo(
    () => ({
      users,
      orders,
      loading,
      error,
      reload: load,
      addUser,
      editUser,
      removeUser,
      changeOrderStatus,
    }),
    [users, orders, loading, error, load, addUser, editUser, removeUser, changeOrderStatus]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/** Custom hook: const { users, loading } = useData(); */
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}
