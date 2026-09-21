// Central content for the landing page. Keeps components clean and easy to edit.

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Reviews", href: "#reviews" },
];

export const stats = [
  { value: "2.5k+", label: "Happy Clients" },
  { value: "150+", label: "Master Chefs" },
  { value: "4.9 ★", label: "Overall Rating" },
];

export const services = [
  {
    icon: "🥗",
    title: "Fresh Ingredients",
    text: "Locally sourced, seasonal produce delivered daily to our kitchen.",
  },
  {
    icon: "👨‍🍳",
    title: "Master Chefs",
    text: "Award-winning chefs bringing decades of culinary expertise.",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    text: "Piping hot meals at your door in 30 minutes or it's free.",
  },
  {
    icon: "💳",
    title: "Easy Payment",
    text: "Multiple secure payment options for a seamless checkout.",
  },
];

// Note: menu items are now loaded from the backend (see components/Menu.jsx
// and api/browse.js). The old static `menuFilters`/`dishes` were removed.

export const reviews = [
  {
    id: 1,
    text: "The best food delivery experience I've ever had. Fresh, fast, and absolutely delicious every single time!",
    name: "Sarah Mitchell",
    role: "Food Blogger",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    id: 2,
    text: "Amazing flavors and the delivery is always on time. Foodie has become our family's weekend tradition.",
    name: "James Rodriguez",
    role: "Regular Customer",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: 3,
    text: "Restaurant-quality meals at home. The presentation and taste exceed every expectation. Highly recommend!",
    name: "Emily Chen",
    role: "Chef & Enthusiast",
    avatar: "https://i.pravatar.cc/80?img=45",
  },
];

export const footerCols = [
  {
    title: "Company",
    links: ["About Us", "Services", "Our Menu", "Reviews"],
  },
  {
    title: "Support",
    links: ["Help Center", "Terms of Service", "Privacy Policy", "Contact Us"],
  },
];

export const contactInfo = [
  "📍 123 Flavor Street, Food City",
  "📞 +1 (555) 123-4567",
  "✉️ hello@foodie.com",
];
