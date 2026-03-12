import type {
  Category,
  Specification,
  SpecValue,
  Product,
  Order,
  UserRole,
  User,
  Me,
} from "../types";

// ─── Roles ────────────────────────────────────────────────────────────────────
export const mockRoles: UserRole[] = [
  {
    id: "role_001",
    name: "Admin",
    permissions: [
      "analytics.read",
      "products.read","products.write","products.delete",
      "orders.read","orders.write",
      "categories.read","categories.write",
      "specifications.read","specifications.write",
      "users.read","users.write",
      "roles.read","roles.write",
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "role_002",
    name: "Manager",
    permissions: [
      "analytics.read",
      "products.read","products.write",
      "orders.read","orders.write",
      "categories.read","categories.write",
      "specifications.read","specifications.write",
      "users.read",
      "roles.read",
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "role_003",
    name: "Support",
    permissions: ["orders.read", "users.read"],
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "role_004",
    name: "Viewer",
    permissions: ["analytics.read", "products.read", "orders.read"],
    createdAt: "2026-01-02T00:00:00.000Z",
  },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id:"u_001", firstName:"Breror",   lastName:"Rexha",    email:"admin@demo.com",       roleId:"role_001", avatar:"/profile.jpg", createdAt:"2026-01-01T10:00:00.000Z" },
  { id:"u_002", firstName:"John",     lastName:"Doe",      email:"john.doe@demo.com",    roleId:"role_003", avatar:"https://i.pravatar.cc/150?u=u_002", createdAt:"2026-01-10T12:00:00.000Z" },
  { id:"u_003", firstName:"Maria",    lastName:"Smith",    email:"m.smith@demo.com",     roleId:"role_002", avatar:"https://i.pravatar.cc/150?u=u_003", createdAt:"2026-01-15T08:30:00.000Z" },
  { id:"u_004", firstName:"David",    lastName:"Jones",    email:"david.j@demo.com",     roleId:"role_004", createdAt:"2026-01-20T09:00:00.000Z" },
  { id:"u_005", firstName:"Sophie",   lastName:"Turner",   email:"sophie.t@demo.com",    roleId:"role_003", avatar:"https://i.pravatar.cc/150?u=u_005", createdAt:"2026-01-22T11:00:00.000Z" },
  { id:"u_006", firstName:"Liam",     lastName:"Wilson",   email:"liam.w@demo.com",      roleId:"role_004", createdAt:"2026-01-25T14:00:00.000Z" },
  { id:"u_007", firstName:"Emma",     lastName:"Brown",    email:"emma.b@demo.com",      roleId:"role_002", avatar:"https://i.pravatar.cc/150?u=u_007", createdAt:"2026-02-01T10:00:00.000Z" },
  { id:"u_008", firstName:"Oliver",   lastName:"Garcia",   email:"oliver.g@demo.com",    roleId:"role_003", createdAt:"2026-02-05T09:00:00.000Z" },
];

// ─── Me (logged-in user) ──────────────────────────────────────────────────────
export const mockMe: Me = {
  id: "u_001",
  firstName: "Breror",
  lastName: "Rexha",
  email: "admin@demo.com",
  roleId: "role_001",
  avatar: "/profile.jpg",
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const mockCategories: Category[] = [
  { id:"cat_001", name:"Electronics",  parentId:null,      slug:"electronics",               createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_002", name:"Computers",    parentId:"cat_001", slug:"electronics/computers",      createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_003", name:"Phones",       parentId:"cat_001", slug:"electronics/phones",         createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_004", name:"Clothing",     parentId:null,      slug:"clothing",                   createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_005", name:"Men",          parentId:"cat_004", slug:"clothing/men",               createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_006", name:"Women",        parentId:"cat_004", slug:"clothing/women",             createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_007", name:"Books",        parentId:null,      slug:"books",                      createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_008", name:"Drama",        parentId:"cat_007", slug:"books/drama",                createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_009", name:"Sci-Fi",       parentId:"cat_007", slug:"books/sci-fi",               createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"cat_010", name:"Furniture",    parentId:null,      slug:"furniture",                  createdAt:"2026-01-01T00:00:00.000Z" },
];

// ─── Specifications ───────────────────────────────────────────────────────────
export const mockSpecifications: Specification[] = [
  { id:"spec_001", name:"Color",        categoryId:"cat_004", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_002", name:"Size",         categoryId:"cat_004", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_003", name:"Color",        categoryId:"cat_005", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_004", name:"Size",         categoryId:"cat_005", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_005", name:"Color",        categoryId:"cat_006", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_006", name:"Size",         categoryId:"cat_006", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_007", name:"Storage",      categoryId:"cat_002", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_008", name:"RAM",          categoryId:"cat_002", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_009", name:"Color",        categoryId:"cat_003", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_010", name:"Storage",      categoryId:"cat_003", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"spec_011", name:"Material",     categoryId:"cat_010", createdAt:"2026-01-01T00:00:00.000Z" },
];

// ─── Spec Values ──────────────────────────────────────────────────────────────
export const mockSpecValues: SpecValue[] = [
  // Clothing color
  { id:"sv_001", value:"Black",   specificationId:"spec_001", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_002", value:"White",   specificationId:"spec_001", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_003", value:"Red",     specificationId:"spec_001", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_004", value:"Blue",    specificationId:"spec_001", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_005", value:"Green",   specificationId:"spec_001", createdAt:"2026-01-01T00:00:00.000Z" },
  // Clothing size
  { id:"sv_006", value:"XS",      specificationId:"spec_002", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_007", value:"S",       specificationId:"spec_002", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_008", value:"M",       specificationId:"spec_002", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_009", value:"L",       specificationId:"spec_002", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_010", value:"XL",      specificationId:"spec_002", createdAt:"2026-01-01T00:00:00.000Z" },
  // Men's clothing color
  { id:"sv_011", value:"Black",   specificationId:"spec_003", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_012", value:"Navy",    specificationId:"spec_003", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_013", value:"Grey",    specificationId:"spec_003", createdAt:"2026-01-01T00:00:00.000Z" },
  // Men's size
  { id:"sv_014", value:"S",       specificationId:"spec_004", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_015", value:"M",       specificationId:"spec_004", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_016", value:"L",       specificationId:"spec_004", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_017", value:"XL",      specificationId:"spec_004", createdAt:"2026-01-01T00:00:00.000Z" },
  // Women's color
  { id:"sv_018", value:"Rose",    specificationId:"spec_005", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_019", value:"Ivory",   specificationId:"spec_005", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_020", value:"Coral",   specificationId:"spec_005", createdAt:"2026-01-01T00:00:00.000Z" },
  // Women's size
  { id:"sv_021", value:"XS",      specificationId:"spec_006", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_022", value:"S",       specificationId:"spec_006", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_023", value:"M",       specificationId:"spec_006", createdAt:"2026-01-01T00:00:00.000Z" },
  // Computer storage
  { id:"sv_024", value:"256GB",   specificationId:"spec_007", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_025", value:"512GB",   specificationId:"spec_007", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_026", value:"1TB",     specificationId:"spec_007", createdAt:"2026-01-01T00:00:00.000Z" },
  // RAM
  { id:"sv_027", value:"8GB",     specificationId:"spec_008", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_028", value:"16GB",    specificationId:"spec_008", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_029", value:"32GB",    specificationId:"spec_008", createdAt:"2026-01-01T00:00:00.000Z" },
  // Phone color
  { id:"sv_030", value:"Black",   specificationId:"spec_009", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_031", value:"White",   specificationId:"spec_009", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_032", value:"Blue",    specificationId:"spec_009", createdAt:"2026-01-01T00:00:00.000Z" },
  // Phone storage
  { id:"sv_033", value:"128GB",   specificationId:"spec_010", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_034", value:"256GB",   specificationId:"spec_010", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_035", value:"512GB",   specificationId:"spec_010", createdAt:"2026-01-01T00:00:00.000Z" },
  // Furniture material
  { id:"sv_036", value:"Oak",     specificationId:"spec_011", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_037", value:"Walnut",  specificationId:"spec_011", createdAt:"2026-01-01T00:00:00.000Z" },
  { id:"sv_038", value:"Pine",    specificationId:"spec_011", createdAt:"2026-01-01T00:00:00.000Z" },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const mockProducts: Product[] = [
  {
    id:"prod_001", name:"MacBook Pro 14\"", description:"Apple M3 Pro chip, stunning Liquid Retina XDR display, 18h battery.", stock:12, price:1999.99,
    images:["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
    categoryId:"cat_002", specValues:["sv_025","sv_028"], status:"in_stock", createdAt:"2026-01-10T00:00:00.000Z",
  },
  {
    id:"prod_002", name:"iPhone 15 Pro", description:"Titanium design, 48MP camera system, USB 3.", stock:0, price:1199.99,
    images:["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400"],
    categoryId:"cat_003", specValues:["sv_030","sv_033"], status:"out_of_stock", createdAt:"2026-01-11T00:00:00.000Z",
  },
  {
    id:"prod_003", name:"Men's Slim Chino", description:"Lightweight stretch fabric, modern slim fit.", stock:35, price:49.99,
    images:["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400"],
    categoryId:"cat_005", specValues:["sv_011","sv_015"], status:"in_stock", createdAt:"2026-01-15T00:00:00.000Z",
  },
  {
    id:"prod_004", name:"Women's Floral Dress", description:"Breathable summer fabric, A-line silhouette.", stock:20, price:79.99,
    images:["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400"],
    categoryId:"cat_006", specValues:["sv_018","sv_022"], status:"in_stock", createdAt:"2026-01-16T00:00:00.000Z",
  },
  {
    id:"prod_005", name:"Dune – Hardcover", description:"Frank Herbert's masterpiece, collector's edition.", stock:5, price:24.99,
    images:["https://images.unsplash.com/photo-1531072901881-d644216d4bf9?w=400"],
    categoryId:"cat_009", specValues:[], status:"in_stock", createdAt:"2026-01-20T00:00:00.000Z",
  },
  {
    id:"prod_006", name:"Oak Dining Table", description:"Solid oak, seats 6, hand-finished surface.", stock:3, price:649.00,
    images:["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"],
    categoryId:"cat_010", specValues:["sv_036"], status:"in_stock", createdAt:"2026-01-22T00:00:00.000Z",
  },
  {
    id:"prod_007", name:"Dell XPS 15", description:"Intel Core i9, OLED display, 13h battery life.", stock:0, price:1749.00,
    images:["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400"],
    categoryId:"cat_002", specValues:["sv_026","sv_029"], status:"out_of_stock", createdAt:"2026-01-25T00:00:00.000Z",
  },
  {
    id:"prod_008", name:"Samsung Galaxy S24", description:"6.2\" Dynamic AMOLED, 50MP camera, 25W fast charge.", stock:18, price:849.00,
    images:["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"],
    categoryId:"cat_003", specValues:["sv_031","sv_034"], status:"in_stock", createdAt:"2026-01-28T00:00:00.000Z",
  },
  {
    id:"prod_009", name:"Men's Oxford Shirt", description:"100% cotton, slim fit, button-down collar.", stock:50, price:39.99,
    images:["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"],
    categoryId:"cat_005", specValues:["sv_012","sv_016"], status:"in_stock", createdAt:"2026-02-01T00:00:00.000Z",
  },
  {
    id:"prod_010", name:"Walnut Coffee Table", description:"Solid walnut, minimalist Scandinavian design.", stock:0, price:449.00,
    images:["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400"],
    categoryId:"cat_010", specValues:["sv_037"], status:"out_of_stock", createdAt:"2026-02-05T00:00:00.000Z",
  },
  {
    id:"prod_011", name:"Hamlet – Classic Edition", description:"Shakespeare's timeless tragedy, annotated.", stock:14, price:12.99,
    images:["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"],
    categoryId:"cat_008", specValues:[], status:"in_stock", createdAt:"2026-02-08T00:00:00.000Z",
  },
  {
    id:"prod_012", name:"iPad Pro 12.9\"", description:"M2 chip, Liquid Retina XDR, Apple Pencil compatible.", stock:9, price:1099.00,
    images:["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"],
    categoryId:"cat_002", specValues:["sv_025","sv_027"], status:"in_stock", createdAt:"2026-02-10T00:00:00.000Z",
  },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const mockOrders: Order[] = [
  {
    id:"ord_001", orderNumber:"ORD-2026-001", status:"delivered", total:1999.99, currency:"EUR",
    userId:"u_003", customerName:"Maria Smith",
    items:[{ productId:"prod_001", productName:"MacBook Pro 14\"", quantity:1, unitPrice:1999.99 }],
    createdAt:"2026-01-12T10:30:00.000Z",
  },
  {
    id:"ord_002", orderNumber:"ORD-2026-002", status:"processed", total:129.98, currency:"EUR",
    userId:"u_004", customerName:"David Jones",
    items:[
      { productId:"prod_003", productName:"Men's Slim Chino", quantity:1, unitPrice:49.99 },
      { productId:"prod_009", productName:"Men's Oxford Shirt", quantity:2, unitPrice:39.99 },
    ],
    createdAt:"2026-01-18T14:20:00.000Z",
  },
  {
    id:"ord_003", orderNumber:"ORD-2026-003", status:"processing", total:849.00, currency:"EUR",
    userId:"u_005", customerName:"Sophie Turner",
    items:[{ productId:"prod_008", productName:"Samsung Galaxy S24", quantity:1, unitPrice:849.00 }],
    createdAt:"2026-02-01T09:00:00.000Z",
  },
  {
    id:"ord_004", orderNumber:"ORD-2026-004", status:"delivered", total:24.99, currency:"EUR",
    userId:"u_006", customerName:"Liam Wilson",
    items:[{ productId:"prod_005", productName:"Dune – Hardcover", quantity:1, unitPrice:24.99 }],
    createdAt:"2026-02-03T11:15:00.000Z",
  },
  {
    id:"ord_005", orderNumber:"ORD-2026-005", status:"delivered", total:1099.00, currency:"EUR",
    userId:"u_007", customerName:"Emma Brown",
    items:[{ productId:"prod_012", productName:"iPad Pro 12.9\"", quantity:1, unitPrice:1099.00 }],
    createdAt:"2026-02-07T16:00:00.000Z",
  },
  {
    id:"ord_006", orderNumber:"ORD-2026-006", status:"processing", total:79.99, currency:"EUR",
    userId:"u_008", customerName:"Oliver Garcia",
    items:[{ productId:"prod_004", productName:"Women's Floral Dress", quantity:1, unitPrice:79.99 }],
    createdAt:"2026-02-10T13:45:00.000Z",
  },
  {
    id:"ord_007", orderNumber:"ORD-2026-007", status:"processed", total:649.00, currency:"EUR",
    userId:"u_003", customerName:"Maria Smith",
    items:[{ productId:"prod_006", productName:"Oak Dining Table", quantity:1, unitPrice:649.00 }],
    createdAt:"2026-02-14T10:00:00.000Z",
  },
  {
    id:"ord_008", orderNumber:"ORD-2026-008", status:"delivered", total:37.98, currency:"EUR",
    userId:"u_004", customerName:"David Jones",
    items:[
      { productId:"prod_005", productName:"Dune – Hardcover", quantity:1, unitPrice:24.99 },
      { productId:"prod_011", productName:"Hamlet – Classic Edition", quantity:1, unitPrice:12.99 },
    ],
    createdAt:"2026-02-18T09:30:00.000Z",
  },
  {
    id:"ord_009", orderNumber:"ORD-2026-009", status:"processing", total:1749.00, currency:"EUR",
    userId:"u_006", customerName:"Liam Wilson",
    items:[{ productId:"prod_007", productName:"Dell XPS 15", quantity:1, unitPrice:1749.00 }],
    createdAt:"2026-02-20T12:00:00.000Z",
  },
  {
    id:"ord_010", orderNumber:"ORD-2026-010", status:"processed", total:449.00, currency:"EUR",
    userId:"u_007", customerName:"Emma Brown",
    items:[{ productId:"prod_010", productName:"Walnut Coffee Table", quantity:1, unitPrice:449.00 }],
    createdAt:"2026-02-25T15:20:00.000Z",
  },
  {
    id:"ord_011", orderNumber:"ORD-2026-011", status:"delivered", total:1199.99, currency:"EUR",
    userId:"u_005", customerName:"Sophie Turner",
    items:[{ productId:"prod_002", productName:"iPhone 15 Pro", quantity:1, unitPrice:1199.99 }],
    createdAt:"2026-03-01T10:00:00.000Z",
  },
  {
    id:"ord_012", orderNumber:"ORD-2026-012", status:"processing", total:89.98, currency:"EUR",
    userId:"u_008", customerName:"Oliver Garcia",
    items:[
      { productId:"prod_009", productName:"Men's Oxford Shirt", quantity:1, unitPrice:39.99 },
      { productId:"prod_003", productName:"Men's Slim Chino", quantity:1, unitPrice:49.99 },
    ],
    createdAt:"2026-03-05T11:00:00.000Z",
  },
];

// ─── Revenue time series (last 14 days) ───────────────────────────────────────
export const mockRevenueSeries = [
  { date:"Feb 27", revenue:820,   orders:4 },
  { date:"Feb 28", revenue:1340,  orders:7 },
  { date:"Mar 01", revenue:980,   orders:5 },
  { date:"Mar 02", revenue:1200,  orders:6 },
  { date:"Mar 03", revenue:560,   orders:3 },
  { date:"Mar 04", revenue:1780,  orders:9 },
  { date:"Mar 05", revenue:2100,  orders:11 },
  { date:"Mar 06", revenue:1450,  orders:8 },
  { date:"Mar 07", revenue:890,   orders:5 },
  { date:"Mar 08", revenue:1630,  orders:9 },
  { date:"Mar 09", revenue:2350,  orders:12 },
  { date:"Mar 10", revenue:1100,  orders:6 },
  { date:"Mar 11", revenue:1870,  orders:10 },
  { date:"Mar 12", revenue:740,   orders:4 },
];
