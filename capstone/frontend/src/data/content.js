// Central content for the landing page. Keeps components clean and easy to edit.

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
]

export const stats = [
  { value: '2.5k+', label: 'Happy Clients' },
  { value: '150+', label: 'Master Chefs' },
  { value: '4.9 ★', label: 'Overall Rating' },
]

export const services = [
  {
    icon: '🥗',
    title: 'Fresh Ingredients',
    text: 'Locally sourced, seasonal produce delivered daily to our kitchen.',
  },
  {
    icon: '👨‍🍳',
    title: 'Master Chefs',
    text: 'Award-winning chefs bringing decades of culinary expertise.',
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    text: "Piping hot meals at your door in 30 minutes or it's free.",
  },
  {
    icon: '💳',
    title: 'Easy Payment',
    text: 'Multiple secure payment options for a seamless checkout.',
  },
]

export const menuFilters = [
  { id: 'all', label: 'All' },
  { id: 'main', label: 'Main Course' },
  { id: 'fast', label: 'Fast Food' },
  { id: 'drinks', label: 'Drinks' },
]

export const dishes = [
  {
    id: 1,
    name: 'Grilled Salmon Bowl',
    category: 'main',
    price: 18.5,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Classic Beef Burger',
    category: 'fast',
    price: 12.0,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    category: 'main',
    price: 15.0,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Fresh Berry Smoothie',
    category: 'drinks',
    price: 7.5,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Crispy Chicken Wings',
    category: 'fast',
    price: 10.5,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Iced Caramel Latte',
    category: 'drinks',
    price: 5.5,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
  },
]

export const reviews = [
  {
    id: 1,
    text: "The best food delivery experience I've ever had. Fresh, fast, and absolutely delicious every single time!",
    name: 'Sarah Mitchell',
    role: 'Food Blogger',
    avatar: 'https://i.pravatar.cc/80?img=32',
  },
  {
    id: 2,
    text: 'Amazing flavors and the delivery is always on time. Foodie has become our family\'s weekend tradition.',
    name: 'James Rodriguez',
    role: 'Regular Customer',
    avatar: 'https://i.pravatar.cc/80?img=12',
  },
  {
    id: 3,
    text: 'Restaurant-quality meals at home. The presentation and taste exceed every expectation. Highly recommend!',
    name: 'Emily Chen',
    role: 'Chef & Enthusiast',
    avatar: 'https://i.pravatar.cc/80?img=45',
  },
]

export const footerCols = [
  {
    title: 'Company',
    links: ['About Us', 'Services', 'Our Menu', 'Reviews'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Contact Us'],
  },
]

export const contactInfo = [
  '📍 123 Flavor Street, Food City',
  '📞 +1 (555) 123-4567',
  '✉️ hello@foodie.com',
]
