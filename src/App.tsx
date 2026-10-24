
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

const products: Product[] = [
  {
    id: 1,
    name: "Andhra Avakaya Pickle",
    maker: "Amma's Pantry",
    price: 249,
    category: "Pickles",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
    description: "A bold, tangy favourite for everyday meals.",
    label: "Local favourite",
    rating: "4.8",
    netWeight: "300 g",
    ingredients: ["Raw mango", "Mustard", "Red chilli", "Sesame oil", "Salt"],
    allergens: "Contains mustard. Prepared in a kitchen that may handle peanuts.",
    shelfLife: "6 months from packing (demo information)",
    storage: "Store in a cool, dry place. Use a clean, dry spoon.",
    preparationTime: "Ready to eat",
    availability: "Ready to dispatch",
    dispatchEstimate: "Usually dispatched in 1–2 working days",
  },
  {
    id: 2,
    name: "Traditional Idli Podi",
    maker: "Paati's Kitchen",
    price: 149,
    category: "Podis",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
    description: "Aromatic spices for your morning idlis.",
    label: "Small batch",
    rating: "4.9",
    netWeight: "200 g",
    ingredients: ["Roasted lentils", "Red chilli", "Sesame", "Curry leaves", "Salt"],
    allergens: "Contains sesame. Check the maker’s label for cross-contact details.",
    shelfLife: "4 months from packing (demo information)",
    storage: "Keep airtight in a cool, dry place.",
    preparationTime: "Ready to serve; mix with oil or ghee",
    availability: "Made to order",
    dispatchEstimate: "Prepared in small batches; dispatch in 3–5 working days",
  },
  {
    id: 3,
    name: "Handmade Murukku",
    maker: "Namma Snacks",
    price: 199,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=85",
    description: "A crunchy snack for tea-time cravings.",
    rating: "4.7",
    netWeight: "250 g",
    ingredients: ["Rice flour", "Urad dal flour", "Butter", "Cumin", "Salt"],
    allergens: "Contains dairy. Check the maker’s label for cross-contact details.",
    shelfLife: "30 days from packing (demo information)",
    storage: "Keep sealed in an airtight container away from moisture.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Next small-batch dispatch in 2–4 working days",
  },
  {
    id: 4,
    name: "Homestyle Spice Blend",
    maker: "The Spice Paati",
    price: 179,
    category: "Podis",
    image:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=85",
    description: "A fragrant blend made for traditional cooking.",
    label: "Maker's pick",
    rating: "4.8",
    netWeight: "150 g",
    ingredients: ["Coriander", "Cumin", "Black pepper", "Red chilli", "Fenugreek"],
    allergens: "May contain traces of sesame and peanuts.",
    shelfLife: "5 months from packing (demo information)",
    storage: "Store airtight, away from direct sunlight.",
    preparationTime: "Ready to use in cooking",
    availability: "Made to order",
    dispatchEstimate: "Prepared after order; dispatch in 3–5 working days",
  },
  {
    id: 5,
    name: "Festival Sweet Bites",
    maker: "Anbu Homemade",
    price: 229,
    category: "Sweets",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
    description: "Sweet little bites for sharing with family.",
    rating: "4.6",
    netWeight: "200 g",
    ingredients: ["Gram flour", "Sugar", "Ghee", "Cardamom", "Cashew"],
    allergens: "Contains dairy and cashew nuts.",
    shelfLife: "21 days from packing (demo information)",
    storage: "Store in a cool, dry place and reseal after opening.",
    preparationTime: "Ready to eat",
    availability: "Limited batch",
    dispatchEstimate: "Small-batch dispatch in 2–4 working days",
  },
  {
    id: 6,
    name: "Traditional Snack Mix",
    maker: "Namma Snacks",
    price: 159,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    description: "A crunchy companion for your evening chai.",
    rating: "4.7",
    netWeight: "250 g",
    ingredients: ["Flattened rice", "Peanuts", "Roasted gram", "Curry leaves", "Spices"],
    allergens: "Contains peanuts. Check label for other allergens.",
    shelfLife: "45 days from packing (demo information)",
    storage: "Keep sealed in a cool, dry place.",
    preparationTime: "Ready to eat",
    availability: "Ready to dispatch",
    dispatchEstimate: "Usually dispatched in 1–2 working days",
  },
];

const categories = [
  {
    name: "Pickles",
    subtitle: "Bold, tangy & homemade",
    image: products[0].image,
    background: "#F0DCCB",
  },
  {
    name: "Podis",
    subtitle: "A little spice, a lot of love",
    image: products[1].image,
    background: "#E7C98E",
  },
  {
    name: "Snacks",
    subtitle: "Crunchy little memories",
    image: products[2].image,
    background: "#DCE4D6",
  },
  {
    name: "Sweets",
    subtitle: "Made for sharing",
    image: products[4].image,
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
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    items: { name: string; quantity: number; price: number }[];
    subtotal: number;
    delivery: number;
    total: number;
    customerName: string;
    address: string;
    paymentMethod: string;
    createdAt: string;
  } | null>(null);
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
  }, [activeCategory, searchQuery]);

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
    };

    try {
      const previousOrders = JSON.parse(localStorage.getItem("oorsoru-orders") || "[]");
      localStorage.setItem("oorsoru-orders", JSON.stringify([order, ...previousOrders]));
    } catch {
      localStorage.setItem("oorsoru-orders", JSON.stringify([order]));
    }

    setOrderConfirmation(order);
    setCart({});
    setCheckoutOpen(false);
    setCartOpen(false);
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
    <main className="min-h-screen overflow-x-hidden bg-[#F8F3E9] text-[#292D24]">
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
                OorSoru
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
            <a href="#makers" className="transition hover:text-[#B9573C]">
              Our makers
            </a>
            <a href="#story" className="transition hover:text-[#B9573C]">
              Our story
            </a>
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
            A LITTLE TASTE OF HOME
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-xl font-serif text-5xl font-medium leading-[1.08] tracking-tight text-[#294B38] sm:text-6xl lg:text-7xl"
          >
            The goodness of tradition.
            <span className="mt-2 block italic text-[#B9573C]">
              Made for today.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-lg text-base leading-8 text-[#746D60] sm:text-lg"
          >
            Discover handcrafted pickles, podis, snacks and sweets from
            small-scale makers who keep our food traditions alive.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={scrollToShop}
              className="group inline-flex items-center gap-3 rounded-full bg-[#294B38] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#203B2C]"
            >
              Explore the collection
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <a
              href="#story"
              className="rounded-full px-5 py-4 text-sm font-medium text-[#294B38] transition hover:text-[#B9573C]"
            >
              Our story ↗
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
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90"
              alt="A colourful food spread with spices and fresh ingredients"
              className="h-[390px] w-full object-cover sm:h-[520px] lg:h-[590px]"
              fetchPriority="high"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17251B]/65 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9">
              <p className="text-xs tracking-[0.22em] text-white/80">
                FROM OUR HOMES TO YOURS
              </p>
              <p className="mt-2 font-serif text-3xl sm:text-4xl">
                A tradition worth sharing.
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
              Behind every jar and spice blend is someone who has perfected a
              recipe, protected a tradition and put their heart into making it.
              OorSoru helps independent makers reach more customers.
            </p>

            <a
              href="#story"
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#E7C98E] px-6 py-3.5 text-sm font-semibold text-[#294B38] transition hover:bg-[#F8F3E9]"
            >
              Discover our story
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="relative min-h-[300px] overflow-hidden md:min-h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85"
              alt="A welcoming home kitchen representing traditional food makers"
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
            OorSoru connects customers with small-scale food makers through
            demand-led ordering and thoughtful batch planning. By helping makers
            plan production around demand, we aim to support their businesses
            and reduce avoidable waste.
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
              <span className="font-serif text-3xl font-bold">OorSoru</span>
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
              <a href="#makers" className="hover:text-white">Our makers</a>
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
          <p>© 2026 OorSoru. Tradition, packed with love.</p>
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
                <p className="text-center text-xs leading-5 text-[#746D60]">By placing this demo order, you are testing the OorSoru prototype. No real transaction occurs.</p>
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
            <button onClick={() => { setOrderConfirmation(null); setCheckoutError(""); scrollToShop(); }} className="mt-6 w-full rounded-full bg-[#294B38] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#203B2C]">Continue exploring OorSoru</button>
          </motion.section>
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

      {/* Demo status */}
      <div className="fixed bottom-5 left-5 z-30 hidden items-center gap-2 rounded-full border border-[#294B38]/10 bg-white/95 px-3 py-2 text-[10px] text-[#746D60] shadow-md sm:flex">
        <Clock3 size={12} />
        Interactive demo
      </div>
    </main>
  );
}
