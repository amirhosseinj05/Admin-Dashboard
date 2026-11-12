/**
 * =============================================================================
 *  DUMMY DATA  (no backend needed)
 * =============================================================================
 *  Everything the UI renders comes from this file during development.
 *  To connect a real backend later, do NOT change the components -
 *  just replace the functions in `src/services/api.js` with real fetch calls.
 *  Components already consume data through that service layer.
 * =============================================================================
 */

/** Stable avatar colour per user (derived from the id - no random re-renders). */
const AVATAR_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const getAvatarColor = (id) => AVATAR_COLORS[Math.abs(Number(id)) % AVATAR_COLORS.length];

/** First letters of a full name -> "Sara Mohammadi" => "SM" */
export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/* ---------------------------------------------------------------------------
 * USERS  (used by: Users page, Add/Edit form, Dashboard)
 * ------------------------------------------------------------------------- */
export const mockUsers = [
  { id: 1, name: 'Sara Mohammadi', email: 'sara.mohammadi@example.com', role: 'Admin', status: 'Active', phone: '+98 912 111 2233', joinedAt: '2024-01-14', department: 'Engineering' },
  { id: 2, name: 'Reza Hosseini', email: 'reza.hosseini@example.com', role: 'Manager', status: 'Active', phone: '+98 912 445 8890', joinedAt: '2024-02-03', department: 'Sales' },
  { id: 3, name: 'Niloufar Karimi', email: 'niloufar.karimi@example.com', role: 'Editor', status: 'Pending', phone: '+98 935 220 1145', joinedAt: '2024-03-21', department: 'Marketing' },
  { id: 4, name: 'Amir Taghavi', email: 'amir.taghavi@example.com', role: 'Viewer', status: 'Inactive', phone: '+98 901 774 3321', joinedAt: '2024-04-02', department: 'Support' },
  { id: 5, name: 'Fatemeh Rahimi', email: 'fatemeh.rahimi@example.com', role: 'Editor', status: 'Active', phone: '+98 912 908 5514', joinedAt: '2024-04-19', department: 'Design' },
  { id: 6, name: 'Mohammad Zare', email: 'mohammad.zare@example.com', role: 'Manager', status: 'Active', phone: '+98 936 132 7788', joinedAt: '2024-05-07', department: 'Finance' },
  { id: 7, name: 'Zahra Sadeghi', email: 'zahra.sadeghi@example.com', role: 'Viewer', status: 'Pending', phone: '+98 912 665 4409', joinedAt: '2024-05-26', department: 'HR' },
  { id: 8, name: 'Ali Rezaei', email: 'ali.rezaei@example.com', role: 'Admin', status: 'Active', phone: '+98 919 330 2217', joinedAt: '2024-06-11', department: 'Engineering' },
  { id: 9, name: 'Maryam Ebrahimi', email: 'maryam.ebrahimi@example.com', role: 'Editor', status: 'Active', phone: '+98 912 554 8802', joinedAt: '2024-06-30', department: 'Content' },
  { id: 10, name: 'Hossein Moradi', email: 'hossein.moradi@example.com', role: 'Viewer', status: 'Inactive', phone: '+98 903 771 9090', joinedAt: '2024-07-15', department: 'Support' },
  { id: 11, name: 'Leila Jafari', email: 'leila.jafari@example.com', role: 'Manager', status: 'Active', phone: '+98 912 224 6677', joinedAt: '2024-08-01', department: 'Operations' },
  { id: 12, name: 'Sina Farhadi', email: 'sina.farhadi@example.com', role: 'Editor', status: 'Active', phone: '+98 935 808 1123', joinedAt: '2024-08-22', department: 'Design' },
  { id: 13, name: 'Shirin Nazari', email: 'shirin.nazari@example.com', role: 'Viewer', status: 'Pending', phone: '+98 912 417 5566', joinedAt: '2024-09-09', department: 'Marketing' },
  { id: 14, name: 'Behrad Kamali', email: 'behrad.kamali@example.com', role: 'Manager', status: 'Active', phone: '+98 912 336 7788', joinedAt: '2024-09-28', department: 'Sales' },
  { id: 15, name: 'Azadeh Shams', email: 'azadeh.shams@example.com', role: 'Editor', status: 'Inactive', phone: '+98 901 992 4455', joinedAt: '2024-10-13', department: 'Content' },
  { id: 16, name: 'Kian Mostafavi', email: 'kian.mostafavi@example.com', role: 'Viewer', status: 'Active', phone: '+98 912 668 2200', joinedAt: '2024-11-05', department: 'Support' },
  { id: 17, name: 'Sepideh Jalali', email: 'sepideh.jalali@example.com', role: 'Admin', status: 'Active', phone: '+98 936 551 3344', joinedAt: '2024-11-24', department: 'Engineering' },
  { id: 18, name: 'Arman Bahrami', email: 'arman.bahrami@example.com', role: 'Viewer', status: 'Pending', phone: '+98 912 118 9977', joinedAt: '2024-12-10', department: 'Finance' },
  { id: 19, name: 'Yasaman Karimi', email: 'yasaman.karimi@example.com', role: 'Editor', status: 'Active', phone: '+98 919 664 8811', joinedAt: '2025-01-07', department: 'HR' },
  { id: 20, name: 'Pouria Abbasi', email: 'pouria.abbasi@example.com', role: 'Manager', status: 'Inactive', phone: '+98 912 775 1199', joinedAt: '2025-01-26', department: 'Operations' },
  { id: 21, name: 'Golnaz Hosseini', email: 'golnaz.hosseini@example.com', role: 'Viewer', status: 'Active', phone: '+98 903 220 6644', joinedAt: '2025-02-12', department: 'Marketing' },
  { id: 22, name: 'Danial Rahimi', email: 'danial.rahimi@example.com', role: 'Editor', status: 'Active', phone: '+98 912 903 5522', joinedAt: '2025-03-02', department: 'Design' },
  { id: 23, name: 'Mina Salehi', email: 'mina.salehi@example.com', role: 'Viewer', status: 'Inactive', phone: '+98 935 447 8800', joinedAt: '2025-03-19', department: 'Support' },
  { id: 24, name: 'Navid Taheri', email: 'navid.taheri@example.com', role: 'Manager', status: 'Pending', phone: '+98 912 559 3311', joinedAt: '2025-04-08', department: 'Sales' },
];

/** Options used by the filters and the add/edit form. */
export const ROLES = ['Admin', 'Manager', 'Editor', 'Viewer'];
export const USER_STATUSES = ['Active', 'Inactive', 'Pending'];
export const ORDER_STATUSES = ['Pending', 'Completed', 'Cancelled'];

/* ---------------------------------------------------------------------------
 * ORDERS  (used by: Orders page, Dashboard "latest orders")
 * ------------------------------------------------------------------------- */
export const mockOrders = [
  { id: 'ORD-1058', customer: 'DigiKala Store', product: 'MacBook Air M3', amount: 1340, date: '2025-06-18', status: 'Completed', payment: 'Credit Card', items: [{ name: 'MacBook Air M3 (13")', qty: 1, price: 1240 }, { name: 'Protective Sleeve', qty: 1, price: 100 }] },
  { id: 'ORD-1057', customer: 'Snapp Market', product: 'Wireless Headphones', amount: 260, date: '2025-06-17', status: 'Pending', payment: 'Bank Transfer', items: [{ name: 'Wireless Headphones', qty: 2, price: 130 }] },
  { id: 'ORD-1056', customer: 'Café Bazaar', product: 'Mechanical Keyboard', amount: 175, date: '2025-06-16', status: 'Completed', payment: 'Credit Card', items: [{ name: 'Mechanical Keyboard', qty: 1, price: 175 }] },
  { id: 'ORD-1055', customer: 'Torob Retail', product: '4K Monitor 27"', amount: 520, date: '2025-06-15', status: 'Cancelled', payment: 'Cash on Delivery', items: [{ name: '4K Monitor 27"', qty: 1, price: 520 }] },
  { id: 'ORD-1054', customer: 'Behin Digital', product: 'Ergonomic Mouse', amount: 89, date: '2025-06-14', status: 'Completed', payment: 'Credit Card', items: [{ name: 'Ergonomic Mouse', qty: 1, price: 89 }] },
  { id: 'ORD-1053', customer: 'Sheypoor Bazaar', product: 'USB-C Hub', amount: 64, date: '2025-06-13', status: 'Pending', payment: 'Bank Transfer', items: [{ name: 'USB-C Hub', qty: 2, price: 32 }] },
  { id: 'ORD-1052', customer: 'Alef Software', product: 'Webcam HD Pro', amount: 145, date: '2025-06-12', status: 'Completed', payment: 'Credit Card', items: [{ name: 'Webcam HD Pro', qty: 1, price: 145 }] },
  { id: 'ORD-1051', customer: 'Rayan Cloud', product: 'Office Chair', amount: 380, date: '2025-06-11', status: 'Cancelled', payment: 'Bank Transfer', items: [{ name: 'Ergonomic Office Chair', qty: 1, price: 380 }] },
  { id: 'ORD-1050', customer: 'Pardis Tech', product: 'SSD 1TB NVMe', amount: 110, date: '2025-06-10', status: 'Completed', payment: 'Credit Card', items: [{ name: 'SSD 1TB NVMe', qty: 1, price: 110 }] },
  { id: 'ORD-1049', customer: 'Novin Mart', product: 'Desk Lamp LED', amount: 45, date: '2025-06-09', status: 'Pending', payment: 'Cash on Delivery', items: [{ name: 'Desk Lamp LED', qty: 3, price: 15 }] },
  { id: 'ORD-1048', customer: 'Saba Agency', product: 'Graphics Tablet', amount: 299, date: '2025-06-08', status: 'Completed', payment: 'Credit Card', items: [{ name: 'Graphics Tablet', qty: 1, price: 299 }] },
  { id: 'ORD-1047', customer: 'Kavir Systems', product: 'Router Wi-Fi 6', amount: 132, date: '2025-06-07', status: 'Completed', payment: 'Bank Transfer', items: [{ name: 'Router Wi-Fi 6', qty: 2, price: 66 }] },
  { id: 'ORD-1046', customer: 'Metro Online', product: 'Smart Watch', amount: 210, date: '2025-06-06', status: 'Pending', payment: 'Credit Card', items: [{ name: 'Smart Watch', qty: 1, price: 210 }] },
  { id: 'ORD-1045', customer: 'Fars News Shop', product: 'Microphone Condenser', amount: 178, date: '2025-06-05', status: 'Completed', payment: 'Credit Card', items: [{ name: 'Condenser Microphone', qty: 1, price: 178 }] },
  { id: 'ORD-1044', customer: 'Zomorod Store', product: 'Laptop Stand', amount: 58, date: '2025-06-04', status: 'Cancelled', payment: 'Cash on Delivery', items: [{ name: 'Laptop Stand', qty: 1, price: 58 }] },
  { id: 'ORD-1043', customer: 'Hamrah Mall', product: 'Bluetooth Speaker', amount: 96, date: '2025-06-03', status: 'Completed', payment: 'Bank Transfer', items: [{ name: 'Bluetooth Speaker', qty: 1, price: 96 }] },
  { id: 'ORD-1042', customer: 'Asr Digital', product: 'External SSD 2TB', amount: 235, date: '2025-06-02', status: 'Pending', payment: 'Credit Card', items: [{ name: 'External SSD 2TB', qty: 1, price: 235 }] },
  { id: 'ORD-1041', customer: 'Golestan Market', product: 'Gaming Mousepad', amount: 34, date: '2025-06-01', status: 'Completed', payment: 'Cash on Delivery', items: [{ name: 'Gaming Mousepad', qty: 2, price: 17 }] },
];

/* ---------------------------------------------------------------------------
 * DASHBOARD extras
 * ------------------------------------------------------------------------- */
/** 12-month series rendered by the Chart.js line chart. */
export const monthlyGrowth = {
  labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  sales: [8200, 9100, 8700, 10400, 11800, 12600, 11200, 13400, 14100, 13800, 15600, 17240],
  newUsers: [120, 145, 132, 168, 190, 215, 188, 236, 251, 244, 279, 310],
};

/** Short-window series used by the dashboard date-range switcher. */
export const dailyGrowth = {
  '7 days': {
    labels: ['Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18'],
    sales: [640, 720, 580, 810, 690, 750, 880],
    newUsers: [14, 18, 12, 21, 16, 19, 24],
  },
  '30 days': {
    labels: [
      'May 20', 'May 23', 'May 26', 'May 29', 'Jun 1', 'Jun 4', 'Jun 7', 'Jun 10', 'Jun 13', 'Jun 16', 'Jun 18',
    ],
    sales: [1180, 1320, 1090, 1450, 1270, 1380, 1560, 1420, 1610, 1530, 1740],
    newUsers: [28, 34, 25, 39, 31, 36, 42, 35, 45, 40, 48],
  },
  '12 months': monthlyGrowth,
};

/**
 * Static comparison figures shown on the summary cards (dummy).
 * NOTE: the "users" and "revenue" percentages are calculated live from
 * `monthlyGrowth` inside the Dashboard page instead of being hard-coded.
 */
export const statComparisons = {
  orders: { growth: 8.2, label: 'vs. last month' },
  tasks: { growth: -4.1, label: 'vs. last month' },
};

/** Recent activity feed (right column of the dashboard). */
export const recentActivities = [
  { id: 1, icon: 'bi-person-plus-fill', color: 'success', title: 'New user registered', text: 'Niloufar Karimi created an account.', time: '12 min ago' },
  { id: 2, icon: 'bi-bag-check-fill', color: 'primary', title: 'Order completed', text: 'ORD-1058 was marked as completed.', time: '45 min ago' },
  { id: 3, icon: 'bi-exclamation-triangle-fill', color: 'warning', title: 'Payment pending', text: 'ORD-1057 is waiting for confirmation.', time: '2 hours ago' },
  { id: 4, icon: 'bi-pencil-fill', color: 'info', title: 'Profile updated', text: 'Reza Hosseini changed his phone number.', time: '5 hours ago' },
  { id: 5, icon: 'bi-trash3-fill', color: 'danger', title: 'Order cancelled', text: 'ORD-1055 was cancelled by the customer.', time: 'Yesterday' },
  { id: 6, icon: 'bi-shield-check', color: 'secondary', title: 'Role changed', text: 'Sara Mohammadi is now an Admin.', time: 'Yesterday' },
];

/** Pending tasks widget (summary card + dashboard list). */
export const pendingTasks = [
  { id: 1, label: 'Review new sign-ups', due: 'Today' },
  { id: 2, label: 'Approve refund for ORD-1055', due: 'Today' },
  { id: 3, label: 'Prepare June sales report', due: 'Tomorrow' },
  { id: 4, label: 'Update product pricing', due: 'This week' },
];
