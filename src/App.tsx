// Kaveri Heritage Foods Step 6: connected demo workflow across storefront, maker portal and admin dashboard.
// Uses shared React state and localStorage; production use requires a secure backend.

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChefHat,
  Clock3,
  Heart,
  Leaf,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Minus,
  Plus,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  Trash2,
  Store,
  Boxes,
  IndianRupee,
  ClipboardList,
  PackageOpen,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  maker: string;
  price: number;
  category: string;
  image: string;
  description: string;
  label?: string;
  rating: string;
  netWeight: string;
  ingredients: string[];
  allergens: string;
  shelfLife: string;
  storage: string;
  preparationTime: string;
  availability: "Ready to dispatch" | "Made to order" | "Limited batch";
  dispatchEstimate: string;
};

type OrderStatus = "Order placed" | "Preparing" | "Dispatched" | "Out for delivery" | "Delivered";

type OrderRecord = {
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  delivery: number;
  total: number;
  customerName: string;
  address: string;
  paymentMethod: string;
  createdAt: string;
  status: OrderStatus;
  estimatedDelivery: string;
};

const orderStatuses: OrderStatus[] = [
  "Order placed",
  "Preparing",
  "Dispatched",
  "Out for delivery",
  "Delivered",
];

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


// Public assets must include Vite's configured base path so they work on
// both localhost and GitHub Pages (/oorsoru/).
const productImage = (filename: string) =>
  `${import.meta.env.BASE_URL}images/products/${encodeURIComponent(filename)}`;

const products: Product[] = [
  {
    id: 1,
    name: "Thanjavur Ashoka Halwa",
    maker: "Kaveri Heritage Foods",
    price: 360,
    category: "Sweets",
    image: productImage("tanjore-ashoka-halwa.png"),
    description:
      "The crown jewel of Thanjavur confectionery. Roasted yellow moong dal slow-simmered with pure village cow ghee, fragrant cardamom, and toasted cashews.",
    label: "Thanjavur Special",
    rating: "4.8",
    netWeight: "350 g · Clay Handi",
    ingredients: [
      "Moong Dal",
      "Pure Desi Ghee",
      "Cane Sugar",
      "Kaju (Cashews)",
      "Green Cardamom",
    ],
    allergens: "Contains dairy and cashews.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Store as directed on the product label.",
    preparationTime: "Ready to serve",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 2,
    name: "Traditional Handmade Murukku",
    maker: "Kaveri Heritage Foods",
    price: 240,
    category: "Snacks",
    image: productImage("mullu-muruku-recipe-a.jpg"),
    description:
      "Crunchy, spiral-shaped thenkuzhal murukku made with rice flour, urad dal, cumin, and sesame seeds.",
    label: "Artisanal Savory",
    rating: "4.8",
    netWeight: "300 g · Pack of 10",
    ingredients: [
      "Raw Rice Flour",
      "Urad Dal",
      "Sesame Seeds",
      "Asafoetida",
      "Cold-Pressed Oil",
    ],
    allergens: "Contains sesame; check the label for other allergens.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Keep sealed in an airtight container away from moisture.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 3,
    name: "Heritage Sesame Oil Mango Pickle",
    maker: "Kaveri Heritage Foods",
    price: 290,
    category: "Pickles",
    image: productImage("mango-pickle-recipe.jpg"),
    description:
      "Tender baby mangoes with wood-pressed gingelly oil, hand-pounded red chillies, fenugreek, and sea salt.",
    label: "Grandmother Recipe",
    rating: "4.8",
    netWeight: "400 g · Ceramic Jar",
    ingredients: [
      "Farm Mangoes",
      "Wood-Pressed Sesame Oil",
      "Guntur Chilli",
      "Mustard",
      "Fenugreek",
    ],
    allergens: "Contains mustard; check the label for other allergens.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage:
      "Store as directed on the product label; use a clean, dry spoon.",
    preparationTime: "Ready to serve",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 4,
    name: "Organic Palm Jaggery Sweets",
    maker: "Kaveri Heritage Foods",
    price: 420,
    category: "Sweets",
    image: productImage("healthy_coconut_burfi_barfi_sweet_recipe.jpg"),
    description:
      "Traditional sweets made with palm jaggery, roasted cashews, dry ginger, and cardamom.",
    label: "100% Karupatti",
    rating: "4.8",
    netWeight: "300 g · 15 pieces",
    ingredients: [
      "Native Palm Jaggery",
      "Pure Ghee",
      "Dry Ginger (Sukku)",
      "Cardamom",
      "Cashews",
    ],
    allergens: "Contains dairy and cashews.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Store in a cool, dry place and follow the label instructions.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 5,
    name: "Handmade Cardamom Pistachio Fudge",
    maker: "Kaveri Heritage Foods",
    price: 480,
    category: "Sweets",
    image: productImage("images.jpg"),
    description:
      "Kesar pista burfi made with milk mawa, freshly crushed green cardamom, and toasted pistachios.",
    label: "Best Seller",
    rating: "4.8",
    netWeight: "250 g · 16 pieces",
    ingredients: [
      "Fresh Mawa (Khoya)",
      "Pistachios",
      "Green Cardamom",
      "Sugar",
      "Silver Vark",
    ],
    allergens: "Contains dairy and pistachios.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Store as directed on the product label.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 6,
    name: "Traditional Jaggery Coconut Crunch",
    maker: "Kaveri Heritage Foods",
    price: 320,
    category: "Sweets",
    image: productImage("images (1).jpg"),
    description:
      "Coconut slow-roasted with unrefined jaggery, black pepper, and cardamom for a crisp, chewy traditional treat.",
    rating: "4.8",
    netWeight: "300 g · 20 pieces",
    ingredients: [
      "Pollachi Coconut",
      "Organic Jaggery",
      "Crushed Pepper",
      "Cardamom",
      "Desi Ghee",
    ],
    allergens: "May contain dairy if prepared with ghee.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Keep sealed in a cool, dry place.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 7,
    name: "Royal Ghee Mysore Pak",
    maker: "Kaveri Heritage Foods",
    price: 450,
    category: "Sweets",
    image: productImage("R485_grid.jpg"),
    description:
      "Traditional soft Mysore Pak crafted from slow-roasted gram flour, country cow ghee, and sugar syrup.",
    label: "Royal Recipe",
    rating: "4.8",
    netWeight: "350 g · 12 blocks",
    ingredients: [
      "Gram Flour (Besan)",
      "Village Cow Ghee",
      "Cane Sugar",
      "Cardamom Essence",
    ],
    allergens: "Contains dairy and gram flour.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Store as directed on the product label.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 8,
    name: "Small-Batch Dark Chocolate Sea Salt Truffles",
    maker: "Kaveri Heritage Foods",
    price: 650,
    category: "Sweets",
    image: productImage("55129638.avif"),
    description:
      "Dark chocolate ganache finished with cocoa powder and a delicate touch of sea salt.",
    label: "Artisan Batch",
    rating: "4.8",
    netWeight: "200 g · 12 truffles",
    ingredients: [
      "70% Cacao",
      "Fresh Milk Cream",
      "Pink Salt",
      "Cocoa Powder",
    ],
    allergens: "Contains dairy; check the label for other allergens.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Store as directed on the product label; protect from heat.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
  {
    id: 9,
    name: "Rose Petal & Almond Infused Pralines",
    maker: "Kaveri Heritage Foods",
    price: 560,
    category: "Sweets",
    image: productImage("tanjore-ashoka-halwa.png"),
    description:
      "Caramelised almonds with rose petals and a touch of honey gulkand.",
    label: "Seasonal Craft",
    rating: "4.8",
    netWeight: "180 g · 10 pieces",
    ingredients: [
      "Almonds",
      "Damask Rose Petals",
      "Honey Gulkand",
      "Cane Sugar",
    ],
    allergens: "Contains almonds and honey.",
    shelfLife:
      "Confirm the packed-on date and shelf life on the product label.",
    storage: "Store in a cool, dry place and follow the label instructions.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Estimated delivery in 1–3 business days",
  },
];


const categories = [
  {
    name: "Pickles",
    subtitle: "Bold, tangy & homemade",
    image: products[2].image,
    background: "#F0DCCB",
  },
  {
    name: "Podis",
    subtitle: "A little spice, a lot of love",
    image: products[3].image,
    background: "#E7C98E",
  },
  {
    name: "Snacks",
    subtitle: "Crunchy little memories",
    image: products[1].image,
    background: "#DCE4D6",
  },
  {
    name: "Sweets",
    subtitle: "Made for sharing",
    image: products[0].image,
    background: "#F1D8D8",
  },
];

const trustItems = [
  {
    icon: PackageCheck,
    title: "Thoughtful batches",
    description: "Demand-led preparation",
  },
  {
    icon: ShieldCheck,
    title: "Know your maker",
    description: "Discover the people behind it",
  },
  {
    icon: Heart,
    title: "Recipes with roots",
    description: "Tradition in every bite",
  },
  {
    icon: Truck,
    title: "Order updates",
    description: "Follow your order journey",
  },
];

export default function App() {
  const reduceMotion = useReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const [storyPageOpen, setStoryPageOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
const [cart, setCart] = useState<Record<number, number>>(() => {
  try {
    const savedCart = localStorage.getItem("oorsoru-cart");
    return savedCart ? JSON.parse(savedCart) : {};
  } catch {
    return {};
  }
});

useEffect(() => {
  localStorage.setItem("oorsoru-cart", JSON.stringify(cart));
}, [cart]);

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const savedOrders = localStorage.getItem("oorsoru-orders");
      if (!savedOrders) return [];
      const parsedOrders = JSON.parse(savedOrders) as Partial<OrderRecord>[];
      if (!Array.isArray(parsedOrders)) return [];

      // Add tracking defaults to orders saved by the previous checkout version.
      return parsedOrders.map((order) => {
        const createdAt = order.createdAt || new Date().toISOString();
        const estimatedDelivery = order.estimatedDelivery ||
          new Date(new Date(createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
        return {
          ...order,
          createdAt,
          estimatedDelivery,
          status: orderStatuses.includes(order.status as OrderStatus)
            ? (order.status as OrderStatus)
            : "Order placed",
        } as OrderRecord;
      });
    } catch {
      return [];
    }
  });
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [makerStock, setMakerStock] = useState<Record<number, { stock: number; listed: boolean }>>(() => {
    try {
      const saved = localStorage.getItem("oorsoru-maker-stock");
      const defaults = Object.fromEntries(products.map((product) => [product.id, { stock: 12, listed: true }]));
      if (saved) return { ...defaults, ...(JSON.parse(saved) as Record<number, { stock: number; listed: boolean }>) };
    } catch { /* use demo defaults */ }
    return Object.fromEntries(products.map((product) => [product.id, { stock: 12, listed: true }]));
  });
  const [productionCapacity, setProductionCapacity] = useState<number>(() => {
    try { return Number(localStorage.getItem("oorsoru-production-capacity")) || 120; }
    catch { return 120; }
  });
  const [selectedBatchOrders, setSelectedBatchOrders] = useState<string[]>([]);
  const [batches, setBatches] = useState<{ batchId: string; orderIds: string[]; createdAt: string }[]>(() => {
    try {
      const saved = localStorage.getItem("oorsoru-batches");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [manufacturerNotice, setManufacturerNotice] = useState("");

  // Step 5: admin workspace state. This prototype stores changes in this browser only.
  type AdminTab = "Overview" | "Manufacturers" | "Products" | "Orders & logistics" | "Settlements";
  type VerificationStatus = "Pending" | "Verified" | "Rejected";
  type ApprovalStatus = "Pending" | "Approved" | "Rejected";
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>("Overview");
  const [adminNotice, setAdminNotice] = useState("");
  const [commissionRate, setCommissionRate] = useState<number>(() => {
    try { return Number(localStorage.getItem("oorsoru-commission-rate")) || 10; }
    catch { return 10; }
  });
  const [manufacturerVerification, setManufacturerVerification] = useState<Record<string, VerificationStatus>>(() => {
    try {
      const saved = localStorage.getItem("kaveri-admin-manufacturers");
      const defaults: Record<string, VerificationStatus> = {
        "Kaveri Heritage Foods": "Verified",
      };
      // Merge defaults so existing browser data from Step 5 gains the new maker records.
      return saved ? { ...defaults, ...(JSON.parse(saved) as Record<string, VerificationStatus>) } : defaults;
    } catch { /* use demo defaults below */ }
    return {
      "Kaveri Heritage Foods": "Verified",
    };
  });
  const [productApproval, setProductApproval] = useState<Record<number, ApprovalStatus>>(() => {
    try {
      const saved = localStorage.getItem("kaveri-admin-products");
      const defaults = Object.fromEntries(products.map((product) => [product.id, "Approved"])) as Record<number, ApprovalStatus>;
      // Preserve admin decisions while adding any product IDs introduced in later steps.
      return saved ? { ...defaults, ...(JSON.parse(saved) as Record<number, ApprovalStatus>) } : defaults;
    } catch { /* use demo defaults below */ }
    return Object.fromEntries(products.map((product) => [product.id, "Approved"])) as Record<number, ApprovalStatus>;
  });
  const [orderExceptions, setOrderExceptions] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("oorsoru-order-exceptions") || "{}"); }
    catch { return {}; }
  });
  const [settlementStatus, setSettlementStatus] = useState<Record<string, "Pending" | "Paid">>(() => {
    try { return JSON.parse(localStorage.getItem("oorsoru-settlements") || "{}"); }
    catch { return {}; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kaveri-admin-manufacturers", JSON.stringify(manufacturerVerification));
      localStorage.setItem("kaveri-admin-products", JSON.stringify(productApproval));
      localStorage.setItem("oorsoru-order-exceptions", JSON.stringify(orderExceptions));
      localStorage.setItem("oorsoru-settlements", JSON.stringify(settlementStatus));
      localStorage.setItem("oorsoru-commission-rate", String(commissionRate));
    } catch (error) { console.error("Could not save admin demo data", error); }
  }, [manufacturerVerification, productApproval, orderExceptions, settlementStatus, commissionRate]);

  function setVerification(name: string, status: VerificationStatus) {
    setManufacturerVerification((current) => ({ ...current, [name]: status }));
    setAdminNotice(`${name} marked ${status.toLowerCase()}.`);
  }

  function setApproval(productId: number, status: ApprovalStatus) {
    setProductApproval((current) => ({ ...current, [productId]: status }));
    setAdminNotice(`Product ${status.toLowerCase()}.`);
  }

  function toggleOrderException(orderId: string) {
    setOrderExceptions((current) => ({ ...current, [orderId]: !current[orderId] }));
    setAdminNotice(`Exception flag updated for ${orderId}.`);
  }

  function markSettlement(orderId: string, status: "Pending" | "Paid") {
    setSettlementStatus((current) => ({ ...current, [orderId]: status }));
    setAdminNotice(`Settlement for ${orderId} marked ${status.toLowerCase()}.`);
  }

  useEffect(() => {
    try { localStorage.setItem("oorsoru-maker-stock", JSON.stringify(makerStock)); }
    catch (error) { console.error("Could not save demo stock", error); }
  }, [makerStock]);
  useEffect(() => {
    try { localStorage.setItem("oorsoru-production-capacity", String(productionCapacity)); }
    catch (error) { console.error("Could not save production capacity", error); }
  }, [productionCapacity]);
  useEffect(() => {
    try { localStorage.setItem("oorsoru-batches", JSON.stringify(batches)); }
    catch (error) { console.error("Could not save production batches", error); }
  }, [batches]);

  useEffect(() => {
    try {
      localStorage.setItem("oorsoru-orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Could not save Kaveri Heritage Foods order history", error);
    }
  }, [orders]);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderRecord | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on delivery");
  const [checkoutError, setCheckoutError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailImageFailed, setDetailImageFailed] = useState(false);

  function openProductDetails(product: Product) {
    setSelectedProduct(product);
    setDetailQuantity(1);
    setDetailImageFailed(false);
  }

  function closeProductDetails() {
    setSelectedProduct(null);
    setDetailQuantity(1);
    setDetailImageFailed(false);
  }

  function addSelectedProductToCart() {
    if (!selectedProduct) return;
    setCart((current) => ({
      ...current,
      [selectedProduct.id]: (current[selectedProduct.id] ?? 0) + detailQuantity,
    }));
    closeProductDetails();
    setCartOpen(true);
  }

  const animationDuration = reduceMotion ? 0 : 0.55;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (makerStock[product.id]?.listed === false) return false;
      if (productApproval[product.id] !== "Approved") return false;
      // Step 6: customers can only see products from approved listings and verified makers.
      if (manufacturerVerification[product.maker] !== "Verified") return false;
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.maker.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, makerStock, productApproval, manufacturerVerification]);

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  const cartTotal = products.reduce(
    (total, product) => total + product.price * (cart[product.id] ?? 0),
    0,
  );
  const deliveryCharge = cartTotal === 0 || cartTotal >= 799 ? 0 : 49;
  const orderTotal = cartTotal + deliveryCharge;

  function placeDemoOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError("");

    const phoneDigits = deliveryForm.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setCheckoutError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(deliveryForm.pincode.trim())) {
      setCheckoutError("Enter a valid 6-digit PIN code.");
      return;
    }
    if (cartTotal <= 0) {
      setCheckoutError("Your bag is empty. Add a product before checking out.");
      return;
    }

    // Revalidate at checkout in case an admin changed approval after an item entered the cart.
    const blockedCartProduct = products.find((product) =>
      (cart[product.id] ?? 0) > 0 &&
      (productApproval[product.id] !== "Approved" || manufacturerVerification[product.maker] !== "Verified" || makerStock[product.id]?.listed === false)
    );
    if (blockedCartProduct) {
      setCheckoutError(`${blockedCartProduct.name} is currently unavailable because its listing or maker approval changed. Remove it from your bag and try again.`);
      return;
    }

    const orderId = `ORS-${Date.now().toString().slice(-8)}`;
    const order = {
      orderId,
      items: products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({
          name: product.name,
          quantity: cart[product.id],
          price: product.price,
        })),
      subtotal: cartTotal,
      delivery: deliveryCharge,
      total: orderTotal,
      customerName: deliveryForm.fullName.trim(),
      address: `${deliveryForm.addressLine.trim()}, ${deliveryForm.city.trim()} - ${deliveryForm.pincode.trim()}`,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: "Order placed" as OrderStatus,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    } satisfies OrderRecord;

    setOrders((currentOrders) => [order, ...currentOrders]);
    setOrderConfirmation(order);
    setCart({});
    setCheckoutOpen(false);
    setCartOpen(false);
  }

  function advanceDemoOrderStatus(orderId: string) {
    setOrders((currentOrders) => currentOrders.map((order) => {
      if (order.orderId !== orderId) return order;
      const currentIndex = orderStatuses.indexOf(order.status);
      const nextStatus = orderStatuses[Math.min(currentIndex + 1, orderStatuses.length - 1)];
      return { ...order, status: nextStatus };
    }));
  }

  const makerProductSales = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => {
    const matchingProduct = products.find((product) => product.name === item.name);
    return itemSum + (matchingProduct ? item.price * item.quantity : 0);
  }, 0), 0);
  const activeOrders = orders.filter((order) => order.status !== "Delivered");
  const lowStockCount = products.filter((product) => (makerStock[product.id]?.stock ?? 0) <= 5).length;

  function updateStock(productId: number, stock: number) {
    setMakerStock((current) => ({
      ...current,
      [productId]: { ...(current[productId] ?? { listed: true, stock: 0 }), stock: Math.max(0, Math.floor(stock)) },
    }));
    setManufacturerNotice("Stock updated and saved in this browser.");
  }

  function toggleProductListing(productId: number) {
    setMakerStock((current) => ({
      ...current,
      [productId]: {
        ...(current[productId] ?? { stock: 0, listed: true }),
        listed: !(current[productId]?.listed ?? true),
      },
    }));
    setManufacturerNotice("Product listing visibility updated.");
  }

  function updateManufacturerOrder(orderId: string) {
    const order = orders.find((item) => item.orderId === orderId);
    if (!order) return;
    if (order.status === "Order placed") {
      const required = order.items.map((item) => ({
        product: products.find((product) => product.name === item.name),
        quantity: item.quantity,
      })).filter((item) => item.product);
      const unavailable = required.find((item) => (makerStock[item.product!.id]?.stock ?? 0) < item.quantity);
      if (unavailable) {
        setManufacturerNotice(`Not enough demo stock for ${unavailable.product!.name}. Update stock before accepting this order.`);
        return;
      }
      setMakerStock((current) => {
        const next = { ...current };
        required.forEach(({ product, quantity }) => {
          if (!product) return;
          next[product.id] = { ...(next[product.id] ?? { listed: true, stock: 0 }), stock: Math.max(0, (next[product.id]?.stock ?? 0) - quantity) };
        });
        return next;
      });
    }
    advanceDemoOrderStatus(orderId);
    setManufacturerNotice(`Order ${orderId} status updated.`);
  }

  function consolidateSelectedOrders() {
    if (selectedBatchOrders.length < 2) {
      setManufacturerNotice("Select at least two incoming orders to consolidate into a batch.");
      return;
    }
    const batchId = `BAT-${Date.now().toString().slice(-6)}`;
    setBatches((current) => [{ batchId, orderIds: selectedBatchOrders, createdAt: new Date().toISOString() }, ...current]);
    setSelectedBatchOrders([]);
    setManufacturerNotice(`Batch ${batchId} created with ${selectedBatchOrders.length} orders. This is a simulated consolidation.`);
  }

  function addToCart(productId: number) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  }

  function changeQuantity(productId: number, change: number) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + change;
      const next = { ...current };

      if (nextQuantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = nextQuantity;
      }

      return next;
    });
  }

  function toggleFavorite(productId: number) {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function scrollToShop() {
    document.getElementById("shop")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F8F3E9] text-[#292D24]">
      {/* Subtle kolam-inspired side borders. Decorative only; controls remain clickable. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-5 opacity-40 lg:block" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='72' viewBox='0 0 24 72'%3E%3Cg fill='none' stroke='%23B9573C' stroke-width='1.15'%3E%3Cpath d='M12 3 C2 10 2 18 12 24 C22 18 22 10 12 3Z M12 24 C2 31 2 39 12 45 C22 39 22 31 12 24Z M12 45 C2 52 2 60 12 66 C22 60 22 52 12 45Z'/%3E%3Cpath d='M3 13 Q12 22 21 13 M3 34 Q12 43 21 34 M3 55 Q12 64 21 55'/%3E%3Ccircle cx='12' cy='13' r='2'/%3E%3Ccircle cx='12' cy='34' r='2'/%3E%3Ccircle cx='12' cy='55' r='2'/%3E%3C/g%3E%3C/svg%3E\")", backgroundRepeat: "repeat-y", backgroundSize: "20px 72px" }} />
      <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-5 opacity-40 lg:block" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='72' viewBox='0 0 24 72'%3E%3Cg fill='none' stroke='%23B9573C' stroke-width='1.15'%3E%3Cpath d='M12 3 C2 10 2 18 12 24 C22 18 22 10 12 3Z M12 24 C2 31 2 39 12 45 C22 39 22 31 12 24Z M12 45 C2 52 2 60 12 66 C22 60 22 52 12 45Z'/%3E%3Cpath d='M3 13 Q12 22 21 13 M3 34 Q12 43 21 34 M3 55 Q12 64 21 55'/%3E%3Ccircle cx='12' cy='13' r='2'/%3E%3Ccircle cx='12' cy='34' r='2'/%3E%3Ccircle cx='12' cy='55' r='2'/%3E%3C/g%3E%3C/svg%3E\")", backgroundRepeat: "repeat-y", backgroundSize: "20px 72px" }} />
      {/* Announcement bar */}
      <div className="bg-[#294B38] px-4 py-2.5 text-center text-xs tracking-wide text-[#F8F3E9]">
        <span className="inline-flex items-center justify-center gap-2">
          <Sparkles size={13} className="text-[#E7C98E]" />
          Celebrating local makers, one delicious tradition at a time.
          <span className="hidden text-[#E7C98E] sm:inline">✦</span>
        </span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#294B38]/10 bg-[#F8F3E9]/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a href="#home" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#294B38] text-[#F8F3E9]">
              <Leaf size={23} />
            </span>

            <span>
              <span className="block font-serif text-2xl font-bold tracking-tight text-[#294B38]">
                Kaveri Heritage Foods
              </span>
              <span className="block text-[9px] tracking-[0.19em] text-[#746D60]">
                TRADITION, PACKED WITH LOVE
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="#shop" className="transition hover:text-[#B9573C]">
              Shop all
            </a>
            <a href="#categories" className="transition hover:text-[#B9573C]">
              Categories
            </a>
            <a href="#manufacturer-profile" className="transition hover:text-[#B9573C]">
              Manufacturer profile
            </a>
            <button type="button" onClick={() => setStoryPageOpen(true)} className="transition hover:text-[#B9573C]">
              Our story
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              aria-label="Toggle product search"
              onClick={() => setSearchOpen((open) => !open)}
              className="rounded-full p-3 transition hover:bg-[#294B38]/10"
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>

            <button
              aria-label={`Open shopping bag, ${cartCount} items`}
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-3 transition hover:bg-[#294B38]/10"
            >
              <ShoppingBag size={19} />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B9573C] px-1 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              aria-label={`Open order history, ${orders.length} orders`}
              onClick={() => setOrdersOpen(true)}
              className="relative rounded-full p-3 transition hover:bg-[#294B38]/10"
              title="Order tracking & history"
            >
              <PackageCheck size={19} />
              {orders.length > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E7C98E] px-1 text-xs text-[#294B38]">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              aria-label="Open admin dashboard"
              onClick={() => { setManufacturerOpen(false); setAdminOpen(true); setAdminNotice(""); }}
              className="hidden items-center gap-2 rounded-full border border-[#B9573C]/25 px-4 py-2.5 text-sm text-[#B9573C] transition hover:bg-[#B9573C] hover:text-white xl:inline-flex"
              title="Admin dashboard"
            >
              <ShieldCheck size={17} /> Admin
            </button>

            <button
              aria-label="Open manufacturer dashboard"
              onClick={() => { setManufacturerOpen(true); setManufacturerNotice(""); }}
              className="hidden items-center gap-2 rounded-full border border-[#294B38]/15 px-4 py-2.5 text-sm text-[#294B38] transition hover:bg-[#294B38] hover:text-white lg:inline-flex"
              title="Manufacturer dashboard"
            >
              <Store size={17} /> Maker portal
            </button>

            <button
              aria-label="Toggle mobile navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-full p-3 md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {searchOpen && (
          <div className="border-t border-[#294B38]/10 px-5 py-4">
            <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-[#294B38]/15 bg-white px-4">
              <Search size={18} className="shrink-0 text-[#746D60]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setActiveCategory("All");
                }}
                placeholder="Search pickles, podis, makers..."
                aria-label="Search products"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#9A9386]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="grid gap-1 border-t border-[#294B38]/10 bg-[#F8F3E9] px-6 py-4 md:hidden">
            {[
              ["Shop all", "#shop"],
              ["Categories", "#categories"],
              ["Our makers", "#makers"],
              ["Our story", "#story"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm hover:bg-[#294B38]/5"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
              },
            },
          }}
          className="order-2 lg:order-1"
        >
          <motion.div
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B9573C]/20 bg-[#B9573C]/5 px-4 py-2 text-xs font-medium tracking-wide text-[#B9573C]"
          >
            <Sparkles size={14} />
            THANJAVUR, TAMIL NADU · EST. 1987
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-xl font-serif text-5xl font-medium leading-[1.08] tracking-tight text-[#294B38] sm:text-6xl lg:text-7xl"
          >
            Handcrafted with
            <span className="mt-2 block italic text-[#B9573C]">
              Ancient Recipes, Modern Love.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-lg text-base leading-8 text-[#746D60] sm:text-lg"
          >
            Authentic South Indian artisanal sweets and savories from the heart of Thanjavur — traditional recipes, wood-pressed oils, pure country cow ghee, and care passed down over generations.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={scrollToShop}
              className="group inline-flex items-center gap-3 rounded-full bg-[#294B38] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#203B2C]"
            >
              Explore Sweets Collection
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <a href="#manufacturer-profile" className="rounded-full px-5 py-4 text-sm font-medium text-[#294B38] transition hover:text-[#B9573C]">
              View Manufacturer Profile ↗
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-[#294B38]/10 pt-7"
          >
            <div>
              <p className="font-serif text-lg text-[#294B38] sm:text-xl">
                Small batches
              </p>
              <p className="mt-1 text-xs leading-5 text-[#746D60]">
                Made with care
              </p>
            </div>
            <div>
              <p className="font-serif text-lg text-[#294B38] sm:text-xl">
                Local makers
              </p>
              <p className="mt-1 text-xs leading-5 text-[#746D60]">
                Real people, real craft
              </p>
            </div>
            <div>
              <p className="font-serif text-lg text-[#294B38] sm:text-xl">
                Rooted in home
              </p>
              <p className="mt-1 text-xs leading-5 text-[#746D60]">
                Flavours we love
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2 text-xs text-[#294B38]">
            { ["🌿 Zero Preservatives", "🤝 Authentically Handmade", "⭐ 4.8 / 5.0 Rating", "🚚 1–3 Day Delivery"].map((item) => <span key={item} className="rounded-full border border-[#294B38]/15 bg-white/70 px-3 py-2">{item}</span>) }
          </motion.div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{
            opacity: 0,
            scale: reduceMotion ? 1 : 0.96,
          }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: animationDuration }}
          className="relative order-1 lg:order-2"
        >
          <div className="absolute -right-3 -top-3 h-28 w-28 rounded-full border border-[#B9573C]/30 sm:-right-5 sm:-top-5 sm:h-36 sm:w-36" />
          <div className="absolute -bottom-5 -left-4 h-24 w-24 rounded-full bg-[#E7C98E]/50 sm:-left-7 sm:h-32 sm:w-32" />

          <div className="relative overflow-hidden rounded-[46%_46%_18px_18px] bg-[#E7C98E]">
            <img
              src="https://d31ajqzatc2qj3.cloudfront.net/xl_22_Thinnai_1_Under_the_warm_glow_of_evening_lights_Shruti_s_traditional_thinnai_invites_peaceful_contemplation_022ecf7df2.webp"
              alt="Traditional Tamil heritage home with a shaded thinnai verandah and tiled roof"
              className="h-[390px] w-full object-cover sm:h-[520px] lg:h-[590px]"
              fetchPriority="high"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17251B]/65 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9">
              <p className="text-xs tracking-[0.22em] text-white/80">
                A THINNAI-WARM WELCOME
              </p>
              <p className="mt-2 font-serif text-3xl sm:text-4xl">
                Where every recipe feels like home.
              </p>
            </div>
          </div>

          {/* Floating maker card */}
          <motion.div
            animate={
              reduceMotion ? {} : { y: [0, -7, 0] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-2 top-12 rounded-2xl border border-[#294B38]/10 bg-white/95 p-4 shadow-xl sm:-left-10 sm:top-20"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7C98E]/40 text-[#294B38]">
                <ChefHat size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#294B38]">
                  Made by local hands
                </p>
                <p className="mt-1 text-xs text-[#746D60]">
                  Every maker has a story
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating seal */}
          <div className="absolute -bottom-5 right-3 flex h-24 w-24 rotate-6 flex-col items-center justify-center rounded-full border-4 border-[#F8F3E9] bg-[#B9573C] text-center text-white shadow-xl sm:right-7 sm:h-28 sm:w-28">
            <Heart size={18} />
            <span className="mt-1 text-[9px] font-semibold tracking-[0.14em]">
              MADE WITH
            </span>
            <span className="font-serif text-xl italic">love</span>
          </div>
        </motion.div>
      </section>

      {/* Manufacturer profile */}
      <section id="manufacturer-profile" className="scroll-mt-24 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#B9573C]">MANUFACTURER PROFILE</p>
            <h2 className="mt-3 font-serif text-4xl text-[#294B38] sm:text-5xl">Kaveri Heritage Foods</h2>
            <p className="mt-3 text-sm font-semibold tracking-wide text-[#746D60]">Traditional Foods &amp; Agro Enterprise</p>
            <p className="mt-2 text-sm text-[#746D60]">Thanjavur, Tamil Nadu · 613001 · Est. 1987</p>
          </div>
          <div className="grid gap-8 rounded-3xl border border-[#294B38]/10 bg-white p-6 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex flex-col justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE4D6] text-[#294B38]"><Leaf size={28}/></div>
              <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-[#B9573C]">KAVERI HERITAGE</p>
              <h3 className="mt-2 font-serif text-3xl text-[#294B38]">A taste of Thanjavur, made with care.</h3>
              <p className="mt-4 text-sm leading-7 text-[#746D60]">Each confection and savory is inspired by South Indian culinary heritage and the recipes shared across generations. Our small-batch philosophy celebrates familiar flavours, thoughtful preparation, and ingredients rooted in tradition.</p>
              <div className="mt-5 rounded-2xl bg-[#F8F3E9] p-4 text-sm leading-6 text-[#294B38]"><strong>FSSAI Registration:</strong> 67676767676767 <span className="mt-1 block text-xs text-[#746D60]">Demo profile detail — verify the registration number and claims before publishing commercially.</span></div>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#294B38]">Featured products</h3>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {products.slice(0,4).map((product) => <button key={product.id} onClick={() => { setSelectedProduct(product); }} className="group overflow-hidden rounded-2xl border border-[#294B38]/10 text-left transition hover:-translate-y-1 hover:shadow-md"><img src={product.image} alt={product.name} loading="lazy" className="h-32 w-full object-cover transition group-hover:scale-[1.02]"/><div className="p-3"><p className="text-sm font-semibold text-[#294B38]">{product.id === 1 ? "Thanjavur Ashoka Halwa" : product.id === 2 ? "Handmade Murukku" : product.id === 3 ? "Sesame Oil Pickle" : "Palm Jaggery Sweets"}</p><p className="mt-1 text-xs text-[#B9573C]">₹{product.price}</p></div></button>)}
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
            {[["Product category", "Traditional Sweets & Savories"], ["Entrepreneur", "Kaveri Heritage Foods Co."], ["Registration", "FSSAI No. 67676767676767"], ["Order status", "Accepting bulk & retail orders"], ["Delivery lead time", "1–3 business days"], ["Region & heritage", "South Indian · Traditional artisanal"]].map(([label, value]) => <div key={label} className="border-b border-[#294B38]/10 py-3 last:border-0 sm:last:border-b lg:[&:nth-last-child(-n+3)]:border-b-0"><p className="text-xs text-[#746D60]">{label}</p><p className="mt-1 text-sm font-semibold text-[#294B38]">{value}</p></div>)}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium text-[#294B38]">
            {["🌿 Zero preservatives*", "🏆 Authentic taste", "🧼 Hygienically prepared*", "🛡️ Quality assured*", "👑 Customer priority", "Small-batch · Seasonal · Pure ingredients"].map((item) => <span key={item} className="rounded-full bg-[#DCE4D6]/70 px-3 py-2">{item}</span>)}
          </div>
          <p className="mt-3 text-center text-[11px] text-[#746D60]">*Confirm all product, hygiene, quality and preservative claims against actual manufacturing practices and labels before commercial use.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[["🌿","Ingredient-first craft","Traditional ingredients"],["🧼","Careful preparation","Made in considered batches"],["⭐","Customer-focused","4.8 / 5.0 demo rating"],["🚚","Delivery estimate","1–3 business days"]].map(([icon,title,detail]) => <div key={title} className="rounded-2xl border border-[#294B38]/10 bg-white/70 p-4"><p className="text-xl">{icon}</p><p className="mt-2 text-sm font-semibold text-[#294B38]">{title}</p><p className="mt-1 text-xs leading-5 text-[#746D60]">{detail}</p></div>)}
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section
        id="categories"
        className="px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#B9573C]">
                FIND YOUR FAVOURITE
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#294B38] sm:text-4xl">
                What feels like home?
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-6 text-[#746D60]">
              Familiar flavours, recipes passed down and little jars of
              nostalgia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                type="button"
                onClick={() => {
                  setActiveCategory(category.name);
                  scrollToShop();
                }}
                initial={{
                  opacity: 0,
                  y: reduceMotion ? 0 : 18,
                }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: reduceMotion ? 0 : index * 0.08,
                  duration: animationDuration,
                }}
                whileHover={reduceMotion ? {} : { y: -5 }}
                className="group rounded-2xl p-3 text-left sm:p-4"
                style={{ backgroundColor: category.background }}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-36 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-48"
                  />

                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F3E9] text-[#294B38] shadow-sm transition group-hover:bg-[#294B38] group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <div className="px-1 pb-2 pt-4">
                  <h3 className="font-serif text-xl text-[#294B38] sm:text-2xl">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#655D50] sm:text-sm">
                    {category.subtitle}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#294B38]/10 bg-[#EDE9DC] px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#294B38] text-[#F8F3E9]">
                  <Icon size={19} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-[#294B38]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#746D60]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products */}
      <section
        id="shop"
        className="scroll-mt-24 bg-white/55 px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#B9573C]">
                MADE WITH MEANING
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[#294B38] sm:text-5xl">
                A few local favourites
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-[#746D60]">
                Discover small-batch staples made by independent traditional
                food makers.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 text-sm text-[#746D60]">
              <Leaf size={16} className="text-[#B9573C]" />
              Made by independent makers
            </span>
          </div>

          {/* Category filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            {["All", "Pickles", "Podis", "Snacks", "Sweets"].map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-5 py-2.5 text-sm transition ${
                    activeCategory === category
                      ? "border-[#294B38] bg-[#294B38] text-white"
                      : "border-[#294B38]/15 bg-transparent text-[#294B38] hover:border-[#294B38]"
                  }`}
                >
                  {category}
                </button>
              ),
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <motion.article
                  layout={!reduceMotion}
                  key={product.id}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 18,
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: animationDuration,
                    delay: reduceMotion ? 0 : (index % 3) * 0.06,
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${product.name}`}
                  onClick={() => openProductDetails(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProductDetails(product);
                    }
                  }}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-[#294B38]/10 bg-[#F8F3E9] outline-none transition hover:border-[#B9573C]/50 focus-visible:ring-2 focus-visible:ring-[#B9573C]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {product.label && (
                      <span className="absolute left-4 top-4 rounded-full bg-[#F8F3E9]/95 px-3 py-1.5 text-xs font-semibold text-[#B9573C] shadow-sm">
                        {product.label}
                      </span>
                    )}

                    <button
                      type="button"
                      aria-label={
                        favorites.includes(product.id)
                          ? `Remove ${product.name} from favourites`
                          : `Add ${product.name} to favourites`
                      }
                      aria-pressed={favorites.includes(product.id)}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute right-4 top-4 rounded-full bg-white/95 p-2.5 text-[#294B38] shadow-sm transition hover:text-[#B9573C]"
                    >
                      <Heart
                        size={18}
                        fill={
                          favorites.includes(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <span className="absolute bottom-4 left-4 rounded-full bg-[#294B38]/90 px-3 py-1.5 text-xs text-white backdrop-blur">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#746D60]">
                          By {product.maker}
                        </p>
                        <h3 className="mt-2 font-serif text-xl text-[#294B38]">
                          {product.name}
                        </h3>
                      </div>

                      <p className="shrink-0 pt-1 font-semibold text-[#294B38]">
                        ₹{product.price}
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#746D60]">
                      {product.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#B9573C]">
                      View product details <span aria-hidden="true">↗</span>
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[#294B38]/10 pt-4">
                      <span className="flex items-center gap-1.5 text-xs text-[#746D60]">
                        <Star
                          size={14}
                          className="fill-[#D5A84C] text-[#D5A84C]"
                        />
                        {product.rating}
                        <span className="text-[#9A9386]">· Demo rating</span>
                      </span>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          addToCart(product.id);
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-[#294B38] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#203B2C]"
                      >
                        {cart[product.id] ? (
                          <>
                            <Check size={14} />
                            Added ({cart[product.id]})
                          </>
                        ) : (
                          <>
                            Add to bag
                            <ShoppingBag size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#294B38]/20 px-6 py-16 text-center">
              <Search className="mx-auto text-[#746D60]" size={28} />
              <h3 className="mt-4 font-serif text-2xl text-[#294B38]">
                Nothing on the shelf just yet
              </h3>
              <p className="mt-2 text-sm text-[#746D60]">
                Try another search or explore all our products.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-5 rounded-full bg-[#294B38] px-5 py-3 text-sm text-white"
              >
                Show all products
              </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-sm text-[#746D60]">
              Every purchase helps independent makers share their craft.
            </p>
          </div>
        </div>
      </section>

      {/* Maker spotlight */}
      <section
        id="makers"
        className="px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-[#294B38] md:grid-cols-2">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-[#E7C98E]">
              <Heart size={14} />
              PEOPLE BEHIND THE FLAVOUR
            </span>

            <h2 className="font-serif text-4xl leading-tight text-[#F8F3E9] sm:text-5xl">
              Every maker has a story.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              From Thanjavur, Kaveri Heritage Foods celebrates artisanal South Indian sweets and savories, with a focus on heritage recipes, careful preparation, and small-batch craft.
            </p>

            <button
              type="button"
              onClick={() => { setStoryPageOpen(true); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }}
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#E7C98E] px-6 py-3.5 text-sm font-semibold text-[#294B38] transition hover:bg-[#F8F3E9]"
            >
              Discover our story
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="relative min-h-[300px] overflow-hidden md:min-h-[460px]">
            <img
              src="https://lalithaskitchen.shop/assets/our-story-BQPbXzFj.jpg"
              alt="Tamil woman in a traditional sari preparing food in a warm home kitchen"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17251B]/70 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-[#F8F3E9]/90 p-5 backdrop-blur-sm">
              <p className="font-serif text-xl text-[#294B38]">
                Small businesses. Big traditions.
              </p>
              <p className="mt-2 text-sm leading-6 text-[#746D60]">
                A marketplace built around the people who make it special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section
        id="story"
        className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12"
      >
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#E7C98E]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#B9573C]/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#294B38]/15 text-[#B9573C]">
            <Leaf size={25} />
          </span>

          <p className="mt-6 text-xs font-semibold tracking-[0.22em] text-[#B9573C]">
            MORE THAN JUST FOOD
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#294B38] sm:text-6xl">
            Good food traditions deserve a future.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#746D60]">
            At Kaveri Heritage Foods, every batch begins with a story — of a grandmother’s recipe, traditional sweets made with care, and flavours rooted in Thanjavur. We believe authentic food is never rushed, and that heritage deserves to be shared with the next generation.
          </p>

          <a
            href="#shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#294B38]/20 px-6 py-3.5 text-sm font-medium text-[#294B38] transition hover:bg-[#294B38] hover:text-white"
          >
            Find your favourites
            <ArrowDown size={16} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#203B2C] px-5 pb-8 pt-12 text-[#F8F3E9] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <a href="#home" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7C98E] text-[#294B38]">
                <Leaf size={22} />
              </span>
              <span className="font-serif text-3xl font-bold">Kaveri Heritage Foods</span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              Bringing regional flavours, independent makers and food
              traditions closer to every home.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <a href="#shop" className="hover:text-white">Shop all</a>
              <a href="#categories" className="hover:text-white">Categories</a>
              <a href="#manufacturer-profile" className="hover:text-white">Manufacturer profile</a>
              <a href="#story" className="hover:text-white">Our story</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Our promise</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/65">
              <p>Thoughtful batch planning</p>
              <p>Independent food makers</p>
              <p>Tradition worth sharing</p>
              <p>More mindful production</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/50">
          <p>© 2026 Kaveri Heritage Foods. Tradition, packed with love.</p>
          <p>Built with care for local makers.</p>
        </div>
      </footer>

      {/* Product details dialog */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#17251B]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProductDetails();
          }}
        >
          <motion.section
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-[#F8F3E9] shadow-2xl sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#294B38]/10 bg-[#F8F3E9]/95 px-5 py-4 backdrop-blur sm:px-7">
              <button
                type="button"
                onClick={closeProductDetails}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#294B38] transition hover:bg-[#294B38]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B9573C]"
              >
                <ArrowRight size={16} className="rotate-180" />
                Back to Products
              </button>
              <button
                type="button"
                aria-label="Close product details"
                onClick={closeProductDetails}
                className="rounded-full p-2 text-[#294B38] transition hover:bg-[#294B38]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B9573C]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2">
              <div className="p-5 sm:p-7">
                <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl bg-[#E7C98E]/30 sm:min-h-[420px]">
                  {!detailImageFailed ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      onError={() => setDetailImageFailed(true)}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-8 text-center text-[#294B38]">
                      <Package size={42} strokeWidth={1.3} />
                      <p className="font-serif text-xl">{selectedProduct.name}</p>
                      <p className="text-sm text-[#746D60]">Product image is currently unavailable.</p>
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-[#F8F3E9]/95 px-3 py-1.5 text-xs font-semibold text-[#294B38]">
                    {selectedProduct.category}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                    selectedProduct.availability === "Ready to dispatch"
                      ? "bg-[#294B38]/10 text-[#294B38]"
                      : selectedProduct.availability === "Limited batch"
                        ? "bg-[#E7C98E]/40 text-[#6D4C12]"
                        : "bg-[#B9573C]/10 text-[#B9573C]"
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {selectedProduct.availability}
                  </span>
                  <span className="rounded-full border border-[#294B38]/15 px-3 py-2 text-xs text-[#746D60]">
                    {selectedProduct.netWeight}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-7 sm:px-7 sm:pb-8">
                <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-[#B9573C]">FROM {selectedProduct.maker.toUpperCase()}</p>
                <h2 id="product-detail-title" className="mt-3 font-serif text-3xl leading-tight text-[#294B38] sm:text-4xl">
                  {selectedProduct.name}
                </h2>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="font-serif text-3xl font-semibold text-[#294B38]">₹{selectedProduct.price}</p>
                  <span className="flex items-center gap-1.5 text-sm text-[#746D60]">
                    <Star size={15} className="fill-[#D5A84C] text-[#D5A84C]" />
                    {selectedProduct.rating} <span className="text-xs">demo rating</span>
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#746D60]">{selectedProduct.description}</p>

                <div className="mt-5 rounded-2xl border border-[#294B38]/10 bg-white/65 p-4">
                  <div className="flex items-start gap-3">
                    <Clock3 size={18} className="mt-0.5 shrink-0 text-[#B9573C]" />
                    <div>
                      <p className="text-sm font-semibold text-[#294B38]">{selectedProduct.dispatchEstimate}</p>
                      <p className="mt-1 text-xs leading-5 text-[#746D60]">
                        Dispatch estimate is illustrative for this college demo and may vary by maker and order volume.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#294B38]">Ingredients</h3>
                    <p className="mt-1 text-sm leading-6 text-[#746D60]">{selectedProduct.ingredients.join(", ")}.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#294B38]">Allergen information</h3>
                    <p className="mt-1 text-sm leading-6 text-[#746D60]">{selectedProduct.allergens}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#294B38]">Shelf life</h3>
                      <p className="mt-1 text-sm leading-6 text-[#746D60]">{selectedProduct.shelfLife}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#294B38]">Preparation</h3>
                      <p className="mt-1 text-sm leading-6 text-[#746D60]">{selectedProduct.preparationTime}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#294B38]">Storage instructions</h3>
                    <p className="mt-1 text-sm leading-6 text-[#746D60]">{selectedProduct.storage}</p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-[#294B38]/10 pt-5">
                  <div className="inline-flex items-center gap-4 rounded-full border border-[#294B38]/20 px-3 py-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={detailQuantity <= 1}
                      onClick={() => setDetailQuantity((quantity) => Math.max(1, quantity - 1))}
                      className="rounded-full p-1 text-[#294B38] hover:bg-[#294B38]/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Minus size={16} />
                    </button>
                    <span aria-live="polite" className="min-w-4 text-center text-sm font-semibold">{detailQuantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setDetailQuantity((quantity) => quantity + 1)}
                      className="rounded-full p-1 text-[#294B38] hover:bg-[#294B38]/10"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={addSelectedProductToCart}
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#294B38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#203B2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B9573C]"
                  >
                    <ShoppingBag size={17} />
                    Add {detailQuantity} to bag · ₹{selectedProduct.price * detailQuantity}
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      )}

      {/* Shopping bag drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close shopping bag"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: reduceMotion ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: animationDuration }}
            role="dialog"
            aria-modal="true"
            aria-label="Your shopping bag"
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col bg-[#F8F3E9] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#294B38]/10 p-5">
              <div>
                <h2 className="font-serif text-2xl text-[#294B38]">
                  Your bag
                </h2>
                <p className="mt-1 text-xs text-[#746D60]">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </p>
              </div>

              <button
                aria-label="Close shopping bag"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-3 hover:bg-[#294B38]/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cartCount === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E7C98E]/40 text-[#294B38]">
                    <ShoppingBag size={27} />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl text-[#294B38]">
                    Your bag is waiting
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#746D60]">
                    Discover something delicious from our collection of
                    traditional foods.
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      scrollToShop();
                    }}
                    className="mt-6 rounded-full bg-[#294B38] px-6 py-3 text-sm text-white"
                  >
                    Explore products
                  </button>
                </div>
              ) : (
                <div className="grid gap-5">
                  {products
                    .filter((product) => (cart[product.id] ?? 0) > 0)
                    .map((product) => (
                      <div key={product.id} className="flex gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-24 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-[#746D60]">
                            {product.maker}
                          </p>
                          <h3 className="mt-1 font-serif text-lg text-[#294B38]">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-[#294B38]">
                            ₹{product.price}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-4 rounded-full border border-[#294B38]/15 px-3 py-1.5">
                              <button
                                aria-label={`Remove one ${product.name}`}
                                onClick={() => changeQuantity(product.id, -1)}
                                className="text-lg"
                              >
                                −
                              </button>
                              <span className="min-w-3 text-center text-sm">
                                {cart[product.id]}
                              </span>
                              <button
                                aria-label={`Add one ${product.name}`}
                                onClick={() => addToCart(product.id)}
                                className="text-lg"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => setCart((current) => {
                                const next = { ...current };
                                delete next[product.id];
                                return next;
                              })}
                              className="inline-flex items-center gap-1 text-xs text-[#B9573C] hover:underline"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {cartCount > 0 && (
              <div className="border-t border-[#294B38]/10 p-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#746D60]">Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#746D60]">Delivery</span>
                    <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                  </div>
                  {cartTotal > 0 && cartTotal < 799 && (
                    <p className="text-xs text-[#746D60]">Add ₹{799 - cartTotal} more for free delivery.</p>
                  )}
                  <div className="flex items-center justify-between border-t border-[#294B38]/10 pt-3">
                    <span className="text-sm font-semibold text-[#294B38]">Total</span>
                    <span className="font-serif text-2xl text-[#294B38]">₹{orderTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#746D60]">
                  Demo checkout. No real payment will be collected.
                </p>

                <button
                  onClick={() => {
                    setCheckoutError("");
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#294B38] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#203B2C]"
                >
                  Continue to checkout
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}

      {/* Checkout: demo address and payment selection */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/45 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto my-4 grid w-full max-w-5xl overflow-hidden rounded-3xl bg-[#F8F3E9] shadow-2xl md:grid-cols-[1.15fr_0.85fr]">
            <section className="p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B9573C]">Almost yours</p>
                  <h2 className="mt-2 font-serif text-3xl text-[#294B38]">Delivery details</h2>
                  <p className="mt-2 text-sm leading-6 text-[#746D60]">Tell us where to send your traditional favourites.</p>
                </div>
                <button aria-label="Close checkout" onClick={() => setCheckoutOpen(false)} className="rounded-full p-2 hover:bg-[#294B38]/10"><X size={20} /></button>
              </div>

              <form className="mt-7 space-y-5" onSubmit={placeDemoOrder}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-[#294B38]">Full name
                    <input required autoComplete="name" value={deliveryForm.fullName} onChange={(event) => setDeliveryForm({ ...deliveryForm, fullName: event.target.value })} className="mt-2 w-full rounded-xl border border-[#294B38]/15 bg-white/70 px-4 py-3 font-normal outline-none focus:border-[#B9573C]" placeholder="Name for delivery" />
                  </label>
                  <label className="block text-sm font-medium text-[#294B38]">Mobile number
                    <input required type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} value={deliveryForm.phone} onChange={(event) => setDeliveryForm({ ...deliveryForm, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} className="mt-2 w-full rounded-xl border border-[#294B38]/15 bg-white/70 px-4 py-3 font-normal outline-none focus:border-[#B9573C]" placeholder="10-digit number" />
                  </label>
                </div>
                <label className="block text-sm font-medium text-[#294B38]">House / street / area
                  <textarea required autoComplete="street-address" rows={3} value={deliveryForm.addressLine} onChange={(event) => setDeliveryForm({ ...deliveryForm, addressLine: event.target.value })} className="mt-2 w-full resize-y rounded-xl border border-[#294B38]/15 bg-white/70 px-4 py-3 font-normal outline-none focus:border-[#B9573C]" placeholder="Door number, street, locality" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-[#294B38]">City / town
                    <input required autoComplete="address-level2" value={deliveryForm.city} onChange={(event) => setDeliveryForm({ ...deliveryForm, city: event.target.value })} className="mt-2 w-full rounded-xl border border-[#294B38]/15 bg-white/70 px-4 py-3 font-normal outline-none focus:border-[#B9573C]" placeholder="e.g. Chennai" />
                  </label>
                  <label className="block text-sm font-medium text-[#294B38]">PIN code
                    <input required inputMode="numeric" autoComplete="postal-code" maxLength={6} value={deliveryForm.pincode} onChange={(event) => setDeliveryForm({ ...deliveryForm, pincode: event.target.value.replace(/\D/g, "").slice(0, 6) })} className="mt-2 w-full rounded-xl border border-[#294B38]/15 bg-white/70 px-4 py-3 font-normal outline-none focus:border-[#B9573C]" placeholder="6-digit PIN" />
                  </label>
                </div>
                <label className="block text-sm font-medium text-[#294B38]">Delivery note <span className="font-normal text-[#746D60]">(optional)</span>
                  <input value={deliveryForm.notes} onChange={(event) => setDeliveryForm({ ...deliveryForm, notes: event.target.value })} className="mt-2 w-full rounded-xl border border-[#294B38]/15 bg-white/70 px-4 py-3 font-normal outline-none focus:border-[#B9573C]" placeholder="Landmark or delivery instructions" />
                </label>

                <div>
                  <h3 className="flex items-center gap-2 font-serif text-xl text-[#294B38]"><CreditCard size={19} /> Payment method</h3>
                  <p className="mt-1 text-xs leading-5 text-[#746D60]">Choose a demo option. This prototype does not process real payments.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {["Cash on delivery", "UPI (demo)", "Card (demo)"].map((method) => (
                      <label key={method} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${paymentMethod === method ? "border-[#294B38] bg-[#DCE4D6]/60" : "border-[#294B38]/15 bg-white/40"}`}>
                        <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-[#294B38]" />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {checkoutError && <p role="alert" className="rounded-xl bg-[#B9573C]/10 p-3 text-sm text-[#9B3D29]">{checkoutError}</p>}
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#294B38] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#203B2C]">
                  Place demo order · ₹{orderTotal.toLocaleString("en-IN")} <ArrowRight size={17} />
                </button>
                <p className="text-center text-xs leading-5 text-[#746D60]">By placing this demo order, you are testing the Kaveri Heritage Foods prototype. No real transaction occurs.</p>
              </form>
            </section>

            <aside className="border-t border-[#294B38]/10 bg-[#EEE6D8] p-5 sm:p-8 md:border-l md:border-t-0">
              <h3 className="font-serif text-2xl text-[#294B38]">Order summary</h3>
              <div className="mt-5 space-y-4">
                {products.filter((product) => (cart[product.id] ?? 0) > 0).map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-14 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#294B38]">{product.name}</p>
                      <p className="mt-1 text-xs text-[#746D60]">Qty {cart[product.id]} × ₹{product.price}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#294B38]">₹{product.price * cart[product.id]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 border-t border-[#294B38]/15 pt-5 text-sm">
                <div className="flex justify-between"><span className="text-[#746D60]">Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-[#746D60]">Delivery</span><span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span></div>
                <div className="flex justify-between border-t border-[#294B38]/15 pt-4 text-base font-semibold text-[#294B38]"><span>Total</span><span>₹{orderTotal.toLocaleString("en-IN")}</span></div>
              </div>
              <div className="mt-6 rounded-2xl bg-white/60 p-4 text-sm leading-6 text-[#746D60]"><MapPin size={17} className="mb-2 text-[#B9573C]" />Delivery is simulated for this prototype. A real version would validate serviceability and delivery estimates.</div>
            </aside>
          </div>
        </div>
      )}

      {/* Order tracking and order history */}
      {ordersOpen && (
        <div className="fixed inset-0 z-[65] flex items-start justify-center overflow-y-auto bg-black/45 p-3 backdrop-blur-sm sm:p-6">
          <motion.section
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-4 w-full max-w-3xl overflow-hidden rounded-3xl bg-[#F8F3E9] shadow-2xl sm:my-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="orders-title"
          >
            <div className="flex items-center justify-between border-b border-[#294B38]/10 px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B9573C]">Your Kaveri Heritage Foods account</p>
                <h2 id="orders-title" className="mt-1 font-serif text-2xl text-[#294B38] sm:text-3xl">Order tracking & history</h2>
                <p className="mt-1 text-sm text-[#746D60]">Your demo orders are saved in this browser.</p>
              </div>
              <button onClick={() => setOrdersOpen(false)} aria-label="Close order history" className="rounded-full p-2 transition hover:bg-[#294B38]/10"><X size={21} /></button>
            </div>

            <div className="max-h-[72vh] space-y-5 overflow-y-auto p-4 sm:p-7">
              {orders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#294B38]/20 px-5 py-14 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE4D6] text-[#294B38]"><PackageCheck size={27} /></span>
                  <h3 className="mt-4 font-serif text-xl text-[#294B38]">No orders yet</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#746D60]">Once you place a demo order, its ID, items, status and estimated delivery will appear here.</p>
                  <button onClick={() => { setOrdersOpen(false); scrollToShop(); }} className="mt-5 rounded-full bg-[#294B38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#203B2C]">Explore products</button>
                </div>
              ) : (
                orders.map((order) => {
                  const statusIndex = orderStatuses.indexOf(order.status);
                  return (
                    <article key={order.orderId} className="overflow-hidden rounded-2xl border border-[#294B38]/12 bg-white/55">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#294B38]/10 p-4 sm:p-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-[#746D60]">Order ID</p>
                          <h3 className="mt-1 font-semibold text-[#294B38]">{order.orderId}</h3>
                          <p className="mt-1 text-xs text-[#746D60]">Placed on {formatOrderDate(order.createdAt)}</p>
                        </div>
                        <div className="rounded-full bg-[#DCE4D6] px-3 py-1.5 text-xs font-semibold text-[#294B38]">{order.status}</div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl bg-[#F0E9DC] p-3.5">
                            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#746D60]"><Truck size={14} /> Estimated delivery</p>
                            <p className="mt-2 font-semibold text-[#294B38]">{order.status === "Delivered" ? "Marked delivered in demo" : formatOrderDate(order.estimatedDelivery)}</p>
                            <p className="mt-1 text-xs leading-5 text-[#746D60]">Illustrative estimate for this prototype, not live courier tracking.</p>
                          </div>
                          <div className="rounded-xl bg-[#F0E9DC] p-3.5">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#746D60]">Order total</p>
                            <p className="mt-2 font-serif text-2xl text-[#294B38]">₹{order.total.toLocaleString("en-IN")}</p>
                            <p className="mt-1 text-xs text-[#746D60]">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) · {order.paymentMethod}</p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#746D60]">Order progress</p>
                          <div className="grid grid-cols-5 gap-1">
                            {orderStatuses.map((status, index) => (
                              <div key={status} className="min-w-0 text-center">
                                <div className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${index <= statusIndex ? "bg-[#294B38] text-white" : "border border-[#294B38]/20 bg-white text-[#746D60]"}`}>
                                  {index < statusIndex ? <Check size={14} /> : index + 1}
                                </div>
                                <p className={`mt-2 text-[9px] leading-4 sm:text-[11px] ${index <= statusIndex ? "font-semibold text-[#294B38]" : "text-[#746D60]"}`}>{status}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 border-t border-[#294B38]/10 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#746D60]">Purchased products</p>
                          <div className="mt-2 divide-y divide-[#294B38]/10">
                            {order.items.map((item) => (
                              <div key={item.name} className="flex items-start justify-between gap-3 py-2 text-sm">
                                <span className="text-[#292D24]">{item.name} <span className="text-[#746D60]">× {item.quantity}</span></span>
                                <span className="shrink-0 font-medium text-[#294B38]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-[#294B38]/10 pt-3 text-xs text-[#746D60]">
                            <span>Deliver to: {order.customerName}, {order.address}</span>
                            <span>Delivery: {order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</span>
                          </div>
                        </div>

                        {order.status !== "Delivered" && (
                          <button onClick={() => advanceDemoOrderStatus(order.orderId)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#294B38]/20 px-4 py-2.5 text-xs font-semibold text-[#294B38] transition hover:bg-[#DCE4D6]">
                            Advance demo status <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
            <div className="border-t border-[#294B38]/10 bg-[#EEE6D8] px-5 py-4 text-xs leading-5 text-[#746D60] sm:px-7">
              Prototype note: order status can be advanced manually for demonstration. No real courier integration or live delivery updates are connected.
            </div>
          </motion.section>
        </div>
      )}

      {/* Demo order confirmation */}
      {orderConfirmation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm">
          <motion.section initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} className="my-6 w-full max-w-lg rounded-3xl bg-[#F8F3E9] p-6 text-center shadow-2xl sm:p-9" role="dialog" aria-modal="true" aria-labelledby="order-confirmation-title">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCE4D6] text-[#294B38]"><CheckCircle2 size={34} /></span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#B9573C]">Order placed · demo</p>
            <h2 id="order-confirmation-title" className="mt-2 font-serif text-3xl text-[#294B38]">Thank you, {orderConfirmation.customerName.split(" ")[0]}!</h2>
            <p className="mt-3 text-sm leading-6 text-[#746D60]">Your sample order has been saved in this browser. No payment was processed.</p>
            <div className="mt-6 rounded-2xl border border-[#294B38]/10 bg-white/50 p-4 text-left">
              <div className="flex justify-between gap-3 text-sm"><span className="text-[#746D60]">Order ID</span><strong className="text-[#294B38]">{orderConfirmation.orderId}</strong></div>
              <div className="mt-3 flex justify-between gap-3 text-sm"><span className="text-[#746D60]">Payment</span><span className="text-right text-[#294B38]">{orderConfirmation.paymentMethod}</span></div>
              <div className="mt-3 flex justify-between gap-3 text-sm"><span className="text-[#746D60]">Deliver to</span><span className="max-w-[65%] text-right text-[#294B38]">{orderConfirmation.address}</span></div>
              <div className="mt-4 border-t border-[#294B38]/10 pt-4">
                {orderConfirmation.items.map((item) => <div key={item.name} className="flex justify-between gap-3 py-1 text-sm"><span className="text-[#746D60]">{item.name} × {item.quantity}</span><span>₹{item.price * item.quantity}</span></div>)}
              </div>
              <div className="mt-3 space-y-2 border-t border-[#294B38]/10 pt-4 text-sm">
                <div className="flex justify-between"><span className="text-[#746D60]">Subtotal</span><span>₹{orderConfirmation.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-[#746D60]">Delivery</span><span>{orderConfirmation.delivery === 0 ? "FREE" : `₹${orderConfirmation.delivery}`}</span></div>
                <div className="flex justify-between pt-2 text-base font-semibold text-[#294B38]"><span>Order total</span><span>₹{orderConfirmation.total}</span></div>
              </div>
            </div>
            <button onClick={() => { setOrderConfirmation(null); setCheckoutError(""); scrollToShop(); }} className="mt-6 w-full rounded-full bg-[#294B38] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#203B2C]">Continue exploring Kaveri Heritage Foods</button>
          </motion.section>
        </div>
      )}

      {/* Admin dashboard — moderation, operations and settlements demo */}
      {adminOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#F8F3E9] text-[#294B38]">
          <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-[#294B38]/10 bg-[#F8F3E9]/95 backdrop-blur">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#294B38] text-white"><ShieldCheck size={22}/></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B9573C]">Kaveri Heritage Foods operations</p><h1 className="font-serif text-2xl">Admin dashboard</h1></div></div>
                <button onClick={() => setAdminOpen(false)} className="inline-flex items-center gap-2 rounded-full bg-[#294B38] px-4 py-3 text-sm font-semibold text-white hover:bg-[#203B2C]"><X size={17}/> Back to shop</button>
              </div>
              <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-4 sm:px-8">
                {(["Overview", "Manufacturers", "Products", "Orders & logistics", "Settlements"] as AdminTab[]).map((tab) => <button key={tab} onClick={() => { setAdminTab(tab); setAdminNotice(""); }} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition ${adminTab === tab ? "bg-[#294B38] text-white" : "border border-[#294B38]/15 bg-white/60 text-[#294B38] hover:bg-white"}`}>{tab}</button>)}
              </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
              <div className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B9573C]">Marketplace control centre</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">{adminTab}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#746D60]">Review makers and listings, handle delivery exceptions, and calculate maker payouts. Actions are saved locally for this prototype.</p></div><span className="rounded-full border border-[#B9573C]/20 bg-white/70 px-3 py-2 text-xs text-[#B9573C]">Demo mode · no real payments</span></div>
              {adminNotice && <div role="status" className="mb-6 flex items-center gap-2 rounded-xl border border-[#294B38]/15 bg-white p-3 text-sm text-[#294B38]"><Check size={17}/>{adminNotice}</div>}

              {adminTab === "Overview" && <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[{label:"Manufacturers awaiting review",value:Object.values(manufacturerVerification).filter((status) => status === "Pending").length,detail:"Identity / business verification",icon:Store},{label:"Products awaiting approval",value:Object.values(productApproval).filter((status) => status === "Pending").length,detail:"Listing moderation queue",icon:ClipboardList},{label:"Orders to monitor",value:orders.filter((order) => order.status !== "Delivered").length,detail:"Not yet delivered",icon:Truck},{label:"Pending settlements",value:orders.filter((order) => settlementStatus[order.orderId] !== "Paid").length,detail:"Demo maker payouts",icon:IndianRupee}].map((card) => <div key={card.label} className="rounded-2xl border border-[#294B38]/10 bg-white p-5"><div className="flex items-center justify-between gap-3"><span className="text-sm text-[#746D60]">{card.label}</span><card.icon size={19} className="text-[#B9573C]"/></div><p className="mt-4 font-serif text-4xl">{card.value}</p><p className="mt-1 text-xs text-[#746D60]">{card.detail}</p></div>)}
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><h3 className="font-serif text-2xl">Needs attention</h3><div className="mt-4 space-y-3">{Object.entries(manufacturerVerification).filter(([,status]) => status === "Pending").length + Object.values(productApproval).filter((status) => status === "Pending").length + orders.filter((order) => orderExceptions[order.orderId]).length === 0 ? <p className="rounded-xl bg-[#DCE4D6]/60 p-4 text-sm">No pending reviews or flagged orders. You're all caught up.</p> : <>{Object.entries(manufacturerVerification).filter(([,status]) => status === "Pending").map(([name]) => <button key={name} onClick={() => setAdminTab("Manufacturers")} className="flex w-full items-center justify-between rounded-xl bg-[#F8F3E9] p-4 text-left"><span><strong className="block text-sm">{name}</strong><span className="text-xs text-[#746D60]">Manufacturer verification</span></span><span className="text-xs font-semibold text-[#B9573C]">Review →</span></button>)}{products.filter((product) => productApproval[product.id] === "Pending").map((product) => <button key={product.id} onClick={() => setAdminTab("Products")} className="flex w-full items-center justify-between rounded-xl bg-[#F8F3E9] p-4 text-left"><span><strong className="block text-sm">{product.name}</strong><span className="text-xs text-[#746D60]">Product approval</span></span><span className="text-xs font-semibold text-[#B9573C]">Review →</span></button>)}{orders.filter((order) => orderExceptions[order.orderId]).map((order) => <button key={order.orderId} onClick={() => setAdminTab("Orders & logistics")} className="flex w-full items-center justify-between rounded-xl bg-[#F8F3E9] p-4 text-left"><span><strong className="block text-sm">{order.orderId}</strong><span className="text-xs text-[#746D60]">Flagged order exception</span></span><span className="text-xs font-semibold text-[#B9573C]">Inspect →</span></button>)}</>}</div></section>
                  <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h3 className="font-serif text-2xl">Commission settings</h3><IndianRupee size={20} className="text-[#B9573C]"/></div><p className="mt-2 text-sm leading-6 text-[#746D60]">Choose the marketplace commission rate used for demo settlement calculations.</p><div className="mt-5 flex items-center justify-between"><label htmlFor="admin-commission" className="text-sm">Commission rate</label><strong className="font-serif text-3xl">{commissionRate}%</strong></div><input id="admin-commission" type="range" min="0" max="25" step="0.5" value={commissionRate} onChange={(event) => setCommissionRate(Number(event.target.value))} className="mt-4 w-full accent-[#294B38]"/><div className="mt-2 flex justify-between text-xs text-[#746D60]"><span>0% · No commission</span><span>25% · Upper limit</span></div><div className="mt-5 rounded-xl bg-[#F8F3E9] p-4 text-sm"><div className="flex justify-between gap-3"><span className="text-[#746D60]">Gross order value</span><strong>₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString("en-IN")}</strong></div><div className="mt-2 flex justify-between gap-3"><span className="text-[#746D60]">Estimated platform commission</span><strong>₹{Math.round(orders.reduce((sum, order) => sum + order.subtotal, 0) * commissionRate / 100).toLocaleString("en-IN")}</strong></div><p className="mt-3 text-xs leading-5 text-[#746D60]">Illustrative only: actual marketplace fees may need taxes, refunds, shipping rules and maker contracts.</p></div></section>
                </div>
              </>}

              {adminTab === "Manufacturers" && <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="font-serif text-2xl">Manufacturer verification</h3><p className="mt-1 text-sm text-[#746D60]">Review the demo maker records before allowing them to sell.</p></div><span className="rounded-full bg-[#F8F3E9] px-3 py-2 text-xs">{Object.keys(manufacturerVerification).length} maker records</span></div><div className="mt-5 space-y-3">{Object.entries(manufacturerVerification).map(([name,status]) => <article key={name} className="flex flex-col gap-4 rounded-xl border border-[#294B38]/10 p-4 sm:flex-row sm:items-center"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCE4D6]"><Store size={21}/></div><div className="min-w-0 flex-1"><p className="font-semibold">{name}</p><p className="mt-1 text-xs text-[#746D60]">Demo record · business documents not connected</p></div><span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${status === "Verified" ? "bg-[#DCE4D6] text-[#294B38]" : status === "Rejected" ? "bg-[#F4DDD5] text-[#8B3E2C]" : "bg-[#E7C98E]/40 text-[#6B5420]"}`}>{status}</span><div className="flex flex-wrap gap-2"><button onClick={() => setVerification(name,"Verified")} className="rounded-full bg-[#294B38] px-3 py-2 text-xs font-semibold text-white">Verify</button><button onClick={() => setVerification(name,"Pending")} className="rounded-full border border-[#294B38]/20 px-3 py-2 text-xs">Needs review</button><button onClick={() => setVerification(name,"Rejected")} className="rounded-full border border-[#B9573C]/25 px-3 py-2 text-xs text-[#B9573C]">Reject</button></div></article>)}</div><p className="mt-5 text-xs leading-5 text-[#746D60]">Production note: real verification should require authorized staff, document review, audit history and secure server-side permissions.</p></section>}

              {adminTab === "Products" && <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><div><h3 className="font-serif text-2xl">Product approvals</h3><p className="mt-1 text-sm text-[#746D60]">Approved products can appear in the customer storefront. Pending and rejected listings stay hidden.</p></div><div className="mt-5 space-y-3">{products.map((product) => { const status = productApproval[product.id] || "Pending"; return <article key={product.id} className="flex flex-col gap-4 rounded-xl border border-[#294B38]/10 p-4 sm:flex-row sm:items-center"><img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="font-semibold">{product.name}</p><p className="mt-1 text-xs text-[#746D60]">{product.maker} · {product.category} · ₹{product.price}</p><p className="mt-1 text-xs text-[#746D60]">Demo review: product details and food-label compliance must be checked by staff.</p></div><span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${status === "Approved" ? "bg-[#DCE4D6]" : status === "Rejected" ? "bg-[#F4DDD5] text-[#8B3E2C]" : "bg-[#E7C98E]/40 text-[#6B5420]"}`}>{status}</span><div className="flex flex-wrap gap-2"><button onClick={() => setApproval(product.id,"Approved")} className="rounded-full bg-[#294B38] px-3 py-2 text-xs font-semibold text-white">Approve</button><button onClick={() => setApproval(product.id,"Pending")} className="rounded-full border border-[#294B38]/20 px-3 py-2 text-xs">Pending</button><button onClick={() => setApproval(product.id,"Rejected")} className="rounded-full border border-[#B9573C]/25 px-3 py-2 text-xs text-[#B9573C]">Reject</button></div></article>; })}</div></section>}

              {adminTab === "Orders & logistics" && <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><div><h3 className="font-serif text-2xl">Order exceptions & logistics</h3><p className="mt-1 text-sm text-[#746D60]">Advance demo order statuses and flag orders that need manual attention.</p></div>{orders.length === 0 ? <div className="mt-5 rounded-xl border border-dashed border-[#294B38]/20 p-10 text-center"><PackageOpen size={28} className="mx-auto text-[#B9573C]"/><p className="mt-3 font-medium">No orders to manage yet</p><p className="mt-1 text-sm text-[#746D60]">Place a demo order from the storefront first.</p></div> : <div className="mt-5 space-y-3">{orders.map((order) => <article key={order.orderId} className="rounded-xl border border-[#294B38]/10 p-4"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong>{order.orderId}</strong><span className="rounded-full bg-[#DCE4D6] px-3 py-1 text-xs">{order.status}</span>{orderExceptions[order.orderId] && <span className="rounded-full bg-[#F4DDD5] px-3 py-1 text-xs text-[#8B3E2C]">Exception flagged</span>}</div><p className="mt-2 text-sm">{order.customerName} · ₹{order.total.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-[#746D60]">{order.address}</p><p className="mt-1 text-xs text-[#746D60]">Courier tracking is simulated; no carrier API is connected.</p></div><div className="flex flex-wrap gap-2">{order.status !== "Delivered" && <button onClick={() => advanceDemoOrderStatus(order.orderId)} className="inline-flex items-center gap-2 rounded-full bg-[#294B38] px-3 py-2 text-xs font-semibold text-white">Advance status <ArrowRight size={14}/></button>}<button onClick={() => toggleOrderException(order.orderId)} className={`rounded-full px-3 py-2 text-xs font-semibold ${orderExceptions[order.orderId] ? "bg-[#F4DDD5] text-[#8B3E2C]" : "border border-[#294B38]/20"}`}>{orderExceptions[order.orderId] ? "Clear exception" : "Flag exception"}</button></div></div></article>)}</div>}</section>}

              {adminTab === "Settlements" && <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="font-serif text-2xl">Maker settlements</h3><p className="mt-1 text-sm text-[#746D60]">Estimated maker payout = order subtotal less the configured commission.</p></div><span className="rounded-full bg-[#F8F3E9] px-3 py-2 text-xs">Commission {commissionRate}%</span></div>{orders.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-[#294B38]/20 p-8 text-center text-sm text-[#746D60]">No settlements until a demo order is placed.</p> : <div className="mt-5 space-y-3">{orders.map((order) => { const fee = Math.round(order.subtotal * commissionRate / 100); const payout = order.subtotal - fee; const status = settlementStatus[order.orderId] || "Pending"; return <article key={order.orderId} className="flex flex-col gap-4 rounded-xl border border-[#294B38]/10 p-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="font-semibold">{order.orderId}</p><p className="mt-1 text-xs text-[#746D60]">{order.customerName} · {formatOrderDate(order.createdAt)}</p><p className="mt-2 text-xs text-[#746D60]">Subtotal ₹{order.subtotal.toLocaleString("en-IN")} − commission ₹{fee.toLocaleString("en-IN")}</p></div><div className="sm:text-right"><p className="font-serif text-2xl">₹{payout.toLocaleString("en-IN")}</p><span className={`text-xs font-semibold ${status === "Paid" ? "text-[#47734C]" : "text-[#B9573C]"}`}>{status}</span></div><div className="flex flex-wrap gap-2"><button onClick={() => markSettlement(order.orderId,"Pending")} className="rounded-full border border-[#294B38]/20 px-3 py-2 text-xs">Mark pending</button><button onClick={() => markSettlement(order.orderId,"Paid")} className="rounded-full bg-[#294B38] px-3 py-2 text-xs font-semibold text-white">Mark paid</button></div></article>; })}</div>}<p className="mt-5 text-xs leading-5 text-[#746D60]">Settlement is a local demo status only. No bank transfer, invoice, GST, refund or payment-gateway operation is performed.</p></section>}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#294B38]/10 py-6 text-xs text-[#746D60]"><span>Kaveri Heritage Foods Admin Workspace · Prototype only</span><button onClick={() => setAdminOpen(false)} className="font-semibold text-[#294B38] underline underline-offset-4">Return to customer storefront</button></div>
            </main>
          </div>
        </div>
      )}

      {/* Manufacturer dashboard — demo workspace */}
      {manufacturerOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#F8F3E9] text-[#292D24]">
          <div className="sticky top-0 z-20 border-b border-[#294B38]/10 bg-[#F8F3E9]/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#294B38] text-white"><Store size={22} /></span>
                <div><p className="font-serif text-2xl text-[#294B38]">Maker workspace</p><p className="text-xs text-[#746D60]">Kaveri Heritage Foods · Manufacturer demo portal</p></div>
              </div>
              <button onClick={() => setManufacturerOpen(false)} className="inline-flex items-center gap-2 rounded-full bg-[#294B38] px-4 py-3 text-sm font-medium text-white hover:bg-[#203B2C]"><X size={17} /> Back to shop</button>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B9573C]">Small-batch operations</p><h1 className="mt-2 font-serif text-4xl text-[#294B38] sm:text-5xl">Your maker dashboard</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#746D60]">Manage sample catalogue visibility, stock, incoming orders and production batches in one place.</p></div>
              <div className="rounded-2xl border border-[#E7C98E] bg-[#E7C98E]/20 px-4 py-3 text-xs leading-5 text-[#5D5035]">Prototype workspace<br /><strong>Changes are stored in this browser only.</strong></div>
            </div>

            {manufacturerNotice && <div role="status" className="mt-6 flex items-start gap-2 rounded-xl border border-[#294B38]/15 bg-white px-4 py-3 text-sm text-[#294B38]"><Check size={17} className="mt-0.5 shrink-0" />{manufacturerNotice}<button className="ml-auto" aria-label="Dismiss message" onClick={() => setManufacturerNotice("")}><X size={16} /></button></div>}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-[#294B38]/10 bg-white p-5"><div className="flex items-center justify-between text-sm text-[#746D60]"><span>Catalogue products</span><Boxes size={19} className="text-[#B9573C]" /></div><p className="mt-4 font-serif text-3xl text-[#294B38]">{products.length}</p><p className="mt-1 text-xs text-[#746D60]">{products.filter((product) => makerStock[product.id]?.listed !== false).length} listed in demo shop</p></div>
              <div className="rounded-2xl border border-[#294B38]/10 bg-white p-5"><div className="flex items-center justify-between text-sm text-[#746D60]"><span>Incoming orders</span><ClipboardList size={19} className="text-[#B9573C]" /></div><p className="mt-4 font-serif text-3xl text-[#294B38]">{activeOrders.length}</p><p className="mt-1 text-xs text-[#746D60]">{activeOrders.filter((order) => order.status === "Order placed").length} awaiting acceptance</p></div>
              <div className="rounded-2xl border border-[#294B38]/10 bg-white p-5"><div className="flex items-center justify-between text-sm text-[#746D60]"><span>Low-stock alerts</span><PackageOpen size={19} className="text-[#B9573C]" /></div><p className="mt-4 font-serif text-3xl text-[#294B38]">{lowStockCount}</p><p className="mt-1 text-xs text-[#746D60]">Products with 5 units or fewer</p></div>
              <div className="rounded-2xl border border-[#294B38]/10 bg-white p-5"><div className="flex items-center justify-between text-sm text-[#746D60]"><span>Estimated product sales</span><IndianRupee size={19} className="text-[#B9573C]" /></div><p className="mt-4 font-serif text-3xl text-[#294B38]">₹{makerProductSales.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-[#746D60]">Before fees · across demo orders</p></div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-serif text-2xl text-[#294B38]">Product & stock management</h2><p className="mt-1 text-sm text-[#746D60]">Update available units or temporarily hide a product.</p></div><span className="rounded-full bg-[#DCE4D6] px-3 py-1.5 text-xs text-[#294B38]">Inventory</span></div>
                <div className="mt-5 space-y-3">
                  {products.map((product) => {
                    const inventory = makerStock[product.id] ?? { stock: 0, listed: true };
                    return <div key={product.id} className="flex flex-col gap-4 rounded-xl border border-[#294B38]/10 p-4 sm:flex-row sm:items-center">
                      <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1"><p className="font-medium text-[#294B38]">{product.name}</p><p className="mt-1 text-xs text-[#746D60]">{product.maker} · ₹{product.price} · {product.category}</p><p className={`mt-1 text-xs ${inventory.stock <= 5 ? "text-[#B9573C]" : "text-[#47734C]"}`}>{inventory.stock <= 5 ? "Low stock" : "In stock"} · {inventory.stock} units</p></div>
                      <div className="flex flex-wrap items-center gap-2"><label className="text-xs text-[#746D60]">Units <input aria-label={`Stock for ${product.name}`} type="number" min="0" max="9999" value={inventory.stock} onChange={(event) => updateStock(product.id, Number(event.target.value))} className="ml-2 w-20 rounded-lg border border-[#294B38]/20 bg-[#F8F3E9] px-2 py-2 text-sm text-[#294B38]" /></label><button onClick={() => toggleProductListing(product.id)} className={`rounded-full px-3 py-2 text-xs font-medium ${inventory.listed ? "bg-[#DCE4D6] text-[#294B38]" : "bg-[#F4DDD5] text-[#8B3E2C]"}`}>{inventory.listed ? "Listed" : "Hidden"}</button></div>
                    </div>;
                  })}
                </div>
              </section>

              <div className="space-y-6">
                <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><Clock3 size={19} className="text-[#B9573C]"/><h2 className="font-serif text-2xl text-[#294B38]">Production capacity</h2></div><p className="mt-2 text-sm leading-6 text-[#746D60]">Set the number of product units your operation can prepare in one production cycle.</p><div className="mt-5 flex items-end justify-between gap-4"><label htmlFor="production-capacity" className="text-sm text-[#746D60]">Units per cycle</label><strong className="font-serif text-3xl text-[#294B38]">{productionCapacity}</strong></div><input id="production-capacity" type="range" min="10" max="500" step="10" value={productionCapacity} onChange={(event) => setProductionCapacity(Number(event.target.value))} className="mt-4 w-full accent-[#294B38]"/><div className="mt-2 flex justify-between text-xs text-[#746D60]"><span>10 units</span><span>500 units</span></div><div className="mt-5 rounded-xl bg-[#F8F3E9] p-4 text-sm"><div className="flex justify-between gap-3"><span className="text-[#746D60]">Open orders</span><strong>{activeOrders.length}</strong></div><div className="mt-2 flex justify-between gap-3"><span className="text-[#746D60]">Capacity indicator</span><strong className={activeOrders.length > productionCapacity ? "text-[#B9573C]" : "text-[#294B38]"}>{activeOrders.length > productionCapacity ? "Review capacity" : "Within capacity"}</strong></div></div></section>
                <section className="rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6"><h2 className="font-serif text-2xl text-[#294B38]">Batch consolidation</h2><p className="mt-2 text-sm leading-6 text-[#746D60]">Select two or more orders to group them into a simulated production batch.</p><button onClick={consolidateSelectedOrders} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#294B38] px-4 py-3 text-sm font-semibold text-white hover:bg-[#203B2C]"><Boxes size={17}/> Consolidate {selectedBatchOrders.length || "selected"} orders</button><div className="mt-4 space-y-2">{batches.length === 0 ? <p className="rounded-xl border border-dashed border-[#294B38]/20 p-4 text-sm text-[#746D60]">No batches created yet.</p> : batches.slice(0, 5).map((batch) => <div key={batch.batchId} className="rounded-xl bg-[#F8F3E9] p-3"><div className="flex justify-between gap-3 text-sm"><strong className="text-[#294B38]">{batch.batchId}</strong><span className="text-xs text-[#746D60]">{batch.orderIds.length} orders</span></div><p className="mt-1 text-xs text-[#746D60]">Created {formatOrderDate(batch.createdAt)}</p></div>)}</div></section>
              </div>
            </div>

            <section className="mt-8 rounded-2xl border border-[#294B38]/10 bg-white p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="font-serif text-2xl text-[#294B38]">Incoming orders</h2><p className="mt-1 text-sm text-[#746D60]">Orders placed through customer checkout appear here. Status changes are shared with customer tracking and the admin logistics queue.</p></div><span className="text-xs text-[#746D60]">{orders.length} total orders</span></div>
              {orders.length === 0 ? <div className="mt-5 rounded-xl border border-dashed border-[#294B38]/20 px-5 py-10 text-center"><PackageOpen size={28} className="mx-auto text-[#B9573C]"/><p className="mt-3 font-medium text-[#294B38]">No incoming orders yet</p><p className="mt-1 text-sm text-[#746D60]">Place a test order from the shop to see the order queue here.</p></div> : <div className="mt-5 space-y-3">{orders.map((order) => <div key={order.orderId} className="rounded-xl border border-[#294B38]/10 p-4"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-start"><div className="flex items-start gap-3"><input type="checkbox" aria-label={`Select order ${order.orderId} for batch`} checked={selectedBatchOrders.includes(order.orderId)} onChange={(event) => setSelectedBatchOrders((current) => event.target.checked ? [...current, order.orderId] : current.filter((id) => id !== order.orderId))} className="mt-1 h-4 w-4 accent-[#294B38]"/><div><p className="font-semibold text-[#294B38]">{order.orderId}</p><p className="mt-1 text-xs text-[#746D60]">{formatOrderDate(order.createdAt)} · {order.customerName}</p><div className="mt-2 flex flex-wrap gap-2">{order.items.map((item) => <span key={item.name} className="rounded-full bg-[#F8F3E9] px-3 py-1 text-xs text-[#746D60]">{item.name} × {item.quantity}</span>)}</div><p className="mt-2 text-xs text-[#746D60]">Deliver to: {order.address}</p></div></div><div className="flex flex-wrap items-center justify-between gap-3 md:justify-end"><div className="md:text-right"><p className="font-serif text-xl text-[#294B38]">₹{order.total.toLocaleString("en-IN")}</p><span className="mt-1 inline-block rounded-full bg-[#E7C98E]/35 px-3 py-1 text-xs text-[#5D5035]">{order.status}</span></div>{order.status !== "Delivered" && <button onClick={() => updateManufacturerOrder(order.orderId)} className="inline-flex items-center gap-2 rounded-full border border-[#294B38]/20 px-4 py-2.5 text-xs font-semibold text-[#294B38] hover:bg-[#294B38] hover:text-white">Advance status <ArrowRight size={14}/></button>}</div></div></div>)}</div>}
              <p className="mt-5 text-xs leading-5 text-[#746D60]">Demo note: all catalogue items are shown in this sample maker workspace. A real marketplace would restrict this queue to the authenticated maker's own products and orders.</p>
            </section>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#294B38]/10 py-6 text-xs text-[#746D60]"><span>Kaveri Heritage Foods Maker Workspace · Prototype only</span><button onClick={() => setManufacturerOpen(false)} className="font-semibold text-[#294B38] underline underline-offset-4">Return to customer storefront</button></div>
          </div>
        </div>
      )}

      {/* Dedicated brand story page */}
      {storyPageOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#F8F3E9] text-[#292D24]" role="dialog" aria-modal="true" aria-labelledby="kaveri-story-title">
          <header className="sticky top-0 z-10 border-b border-[#294B38]/10 bg-[#F8F3E9]/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <div><p className="text-[10px] font-semibold tracking-[0.2em] text-[#B9573C]">KAVERI HERITAGE</p><p className="font-serif text-xl font-bold text-[#294B38]">Our story</p></div>
              <button type="button" onClick={() => setStoryPageOpen(false)} className="inline-flex items-center gap-2 rounded-full border border-[#294B38]/20 px-4 py-2.5 text-sm font-semibold text-[#294B38] hover:bg-white" aria-label="Close story page"><X size={17}/> Back to shop</button>
            </div>
          </header>
          <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:px-12">
            <div><p className="inline-flex rounded-full border border-[#B9573C]/20 bg-white/60 px-4 py-2 text-xs font-semibold tracking-wide text-[#B9573C]">THANJAVUR, TAMIL NADU · EST. 1987</p><h1 id="kaveri-story-title" className="mt-6 font-serif text-5xl leading-tight text-[#294B38] sm:text-6xl">A home-grown tradition, <span className="italic text-[#B9573C]">made to be shared.</span></h1><p className="mt-6 max-w-2xl text-base leading-8 text-[#746D60]">Kaveri Heritage Foods is presented as a traditional foods and agro enterprise rooted in Thanjavur. Our story is inspired by the familiar warmth of the Tamil home: a welcoming thinnai, a kitchen alive with the aroma of roasted spices, and recipes remembered by watching, tasting and learning from the generations before us.</p><p className="mt-4 max-w-2xl text-base leading-8 text-[#746D60]">The year 1987 marks the heritage story shared for this prototype. The aim is to bring that sense of continuity into a modern food experience—clear product information, careful packing, convenient ordering and a closer connection between the food and the people who prepare it.</p><button type="button" onClick={() => { setStoryPageOpen(false); scrollToShop(); }} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#294B38] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#203B2C]">Explore the collection <ArrowRight size={17}/></button></div>
            <div className="relative"><div className="absolute -inset-3 rounded-[2rem] border border-[#B9573C]/25"/><img src="https://d31ajqzatc2qj3.cloudfront.net/xl_22_Thinnai_1_Under_the_warm_glow_of_evening_lights_Shruti_s_traditional_thinnai_invites_peaceful_contemplation_022ecf7df2.webp" alt="Traditional Tamil thinnai verandah with tiled roof and welcoming courtyard" className="relative h-[340px] w-full rounded-[1.7rem] object-cover sm:h-[460px]"/><p className="absolute bottom-4 left-4 rounded-full bg-[#F8F3E9]/90 px-4 py-2 text-xs font-semibold text-[#294B38]">The warmth of a Tamil home</p></div>
          </section>
          <section className="border-y border-[#294B38]/10 bg-[#EDE9DC] px-5 py-14 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold tracking-[0.22em] text-[#B9573C]">OUR MANUFACTURER PROFILE</p><h2 className="mt-3 font-serif text-3xl text-[#294B38] sm:text-4xl">Kaveri Heritage Foods</h2><p className="mt-2 text-sm font-semibold text-[#746D60]">Traditional Foods &amp; Agro Enterprise</p><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["Location","Thanjavur, Tamil Nadu – 613001"],["Established","1987 · heritage detail supplied for this prototype"],["Product category","Traditional sweets, savories and pickles"],["Entrepreneur name","Kaveri Heritage Foods Co."],["Registration","FSSAI No. 67676767676767 — verify before commercial publication"],["Order availability","Bulk and retail orders · demo status"],["Estimated delivery","1–3 business days; confirm by delivery address"],["Regional roots","South Indian culinary heritage"],["Rating","4.8 / 5.0 · prototype display value"]].map(([label,value]) => <div key={label} className="rounded-2xl border border-[#294B38]/10 bg-white/80 p-5"><p className="text-xs font-medium text-[#746D60]">{label}</p><p className="mt-2 text-sm font-semibold leading-6 text-[#294B38]">{value}</p></div>)}</div></div></section>
          <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12"><div className="overflow-hidden rounded-3xl bg-white"><img src="https://lalithaskitchen.shop/assets/our-story-BQPbXzFj.jpg" alt="Tamil woman in a sari preparing food in a traditional home kitchen" className="h-72 w-full object-cover sm:h-96"/><div className="p-6"><p className="text-xs font-semibold tracking-[0.2em] text-[#B9573C]">THE HANDS BEHIND THE RECIPES</p><h2 className="mt-3 font-serif text-3xl text-[#294B38]">Tradition is kept by people.</h2><p className="mt-3 text-sm leading-7 text-[#746D60]">Tamil home cooks have long passed down food knowledge through observation, shared work and family gatherings. This maker story celebrates those women and families without claiming that the pictured person is the owner or manufacturer.</p></div></div><div className="flex flex-col justify-center"><p className="text-xs font-semibold tracking-[0.22em] text-[#B9573C]">THE WAY WE THINK ABOUT FOOD</p><h2 className="mt-3 font-serif text-3xl text-[#294B38] sm:text-4xl">Small batches. Thoughtful ingredients. Familiar flavours.</h2><div className="mt-6 space-y-5">{[["Recipes with roots","The featured collection draws on familiar South Indian sweets and savories: Ashoka halwa, murukku, mango pickle, karupatti sweets and more."],["A considered process","The product stories highlight roasting, hand shaping, spice blending and careful packing. Actual ingredients, methods and shelf life should always match the product label."],["Clear information","Every listing should tell customers its weight, ingredients, allergens, storage guidance and estimated dispatch time before they order."],["Care beyond checkout","The demo includes order tracking and manufacturer/admin workspaces so customers can follow an order and the team can manage listings and dispatch status."]].map(([title,body]) => <div key={title} className="border-b border-[#294B38]/10 pb-5"><h3 className="font-serif text-xl text-[#294B38]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#746D60]">{body}</p></div>)}</div></div></section>
          <section className="bg-[#294B38] px-5 py-12 text-center text-[#F8F3E9] sm:px-8"><p className="text-xs font-semibold tracking-[0.22em] text-[#E7C98E]">KAVERI HERITAGE FOODS</p><h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl sm:text-4xl">Ancient recipes, modern love.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">Traditional Foods &amp; Agro Enterprise · Thanjavur, Tamil Nadu – 613001</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => { setStoryPageOpen(false); scrollToShop(); }} className="rounded-full bg-[#E7C98E] px-6 py-3.5 text-sm font-semibold text-[#294B38]">Shop the collection</button><button type="button" onClick={() => setStoryPageOpen(false)} className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white">Return to home</button></div></section>
        </div>
      )}

      {/* Back to top */}
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth",
          })
        }
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[#294B38] text-white shadow-lg transition hover:bg-[#B9573C]"
      >
        <ArrowUpRight size={20} className="-rotate-45" />
      </button>

      {!manufacturerOpen && <button onClick={() => { setManufacturerOpen(true); setManufacturerNotice(""); }} className="fixed bottom-20 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-[#294B38]/15 bg-[#F8F3E9] px-4 py-3 text-xs font-semibold text-[#294B38] shadow-lg lg:hidden"><Store size={15}/> Maker portal</button>}
      {!manufacturerOpen && !adminOpen && <button onClick={() => { setAdminOpen(true); setAdminTab("Overview"); setAdminNotice(""); }} className="fixed bottom-32 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-[#B9573C]/20 bg-[#F8F3E9] px-4 py-3 text-xs font-semibold text-[#B9573C] shadow-lg xl:hidden"><ShieldCheck size={15}/> Admin demo</button>}

      {/* Demo status */}
      <div className="fixed bottom-5 left-5 z-30 hidden items-center gap-2 rounded-full border border-[#294B38]/10 bg-white/95 px-3 py-2 text-[10px] text-[#746D60] shadow-md sm:flex">
        <Clock3 size={12} />
        Interactive demo
      </div>
    </main>
  );
}
