import React, { useEffect, useMemo, useState } from "react";
import logo from './assets/images/logo.jpeg';
import arara from './assets/images/arara.jpeg';
import papagaio from './assets/images/papagaio.jpeg';
import pavoesAzuis from './assets/images/pavoes_azuis.jpg';
import { loadCatalogFromCSV } from './utils/csvReader';

// ------- CONFIG -------
const BUSINESS = {
  // Replace with your WhatsApp number in international format (no + or spaces)
  whatsappNumber: process.env.REACT_APP_WHATSAPP_NUMBER || "351935135691", // fallback for development
  shopName: "Aves Massapez"
};

// ------- TRANSLATIONS -------
const TRANSLATIONS = {
  pt: {
    home: "Home",
    catalog: "Catálogo", 
    cart: "Carrinho",
    heroTitle: "Criador de aves exóticas e ornamentais.",
    heroSubtitle: "Veja o nosso catálogo e fale connosco.",
    heroUSP: "Mais de 15 anos a cuidar de aves raras e ornamentais",
    viewCatalog: "Ver Catálogo",
    wellbeing: "Bem-estar",
    enrichment: "Enriquecimento ambiental",
    veterinary: "Acompanhamento veterinário",
    aboutUs: "Sobre Nós",
    aboutUsText: "Somos uma empresa familiar especializada na criação responsável de aves exóticas. Com mais de uma década de experiência, priorizamos o bem-estar animal e a satisfação dos nossos clientes.",
    learnMore: "Saiba mais",
    add: "Adicionar",
    inCart: "No carrinho:",
    cartEmpty: "O seu carrinho está vazio. Adicione aves no catálogo.",
    summary: "Resumo",
    subtotal: "Subtotal",
    total: "Total",
    buyWhatsApp: "Comprar via WhatsApp",
    whatsAppNote: "Será aberta uma nova janela com uma mensagem pré-preenchida com o seu pedido.",
    qty: "Qtd.",
    remove: "Remover",
    price: "Preço:",
    rights: "Todos os direitos reservados.",
    viewCatalogFooter: "Ver catálogo",
    orderMessage: "Olá! Gostaria de comprar:",
    each: "cada",
    name: "Nome:",
    contact: "Contacto preferido:",
    instagram: "Instagram",
    backToCatalog: "Voltar ao Catálogo",
    color: "Cor:",
    age: "Idade:",
    addToCart: "Adicionar ao Carrinho",
    buy: "Comprar",
    from: "A partir de",
    inStock: "Em stock",
    outOfStock: "Esgotado", 
    lowStock: "Pouco stock"
  },
  en: {
    home: "Home",
    catalog: "Catalog",
    cart: "Cart", 
    heroTitle: "Exotic and ornamental birds breeder.",
    heroSubtitle: "Check our catalog and contact us.",
    heroUSP: "Over 15 years caring for rare and ornamental birds",
    viewCatalog: "View Catalog",
    wellbeing: "Well-being",
    enrichment: "Environmental enrichment", 
    veterinary: "Veterinary care",
    aboutUs: "About Us",
    aboutUsText: "We are a family business specialized in responsible breeding of exotic birds. With over a decade of experience, we prioritize animal welfare and customer satisfaction.",
    learnMore: "Learn more",
    add: "Add",
    inCart: "In cart:",
    cartEmpty: "Your cart is empty. Add birds from the catalog.",
    summary: "Summary",
    subtotal: "Subtotal",
    total: "Total", 
    buyWhatsApp: "Buy via WhatsApp",
    whatsAppNote: "A new window will open with a pre-filled message with your order.",
    qty: "Qty.",
    remove: "Remove",
    price: "Price:",
    rights: "All rights reserved.",
    viewCatalogFooter: "View catalog",
    orderMessage: "Hello! I would like to buy:",
    each: "each",
    name: "Name:",
    contact: "Preferred contact:",
    instagram: "Instagram",
    backToCatalog: "Back to Catalog",
    color: "Color:",
    age: "Age:",
    addToCart: "Add to Cart",
    buy: "Buy",
    from: "From",
    inStock: "In stock",
    outOfStock: "Out of stock",
    lowStock: "Low stock"
  }
};

const CURRENCY = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

// Fallback products function that handles language
function getFallbackProducts(language) {
  const descriptions = {
    pt: {
      "pavoes-azuis": "Lindos pavões azuis criados com muito cuidado e carinho. Aves saudáveis e bem socializadas.",
      "arara": "Majestosa arara vermelha, ave símbolo da fauna brasileira.",
      "papagaio": "Papagaio cinzento africano, conhecido pela inteligência."
    },
    en: {
      "pavoes-azuis": "Beautiful blue peacocks raised with great care and affection. Healthy and well-socialized birds.",
      "arara": "Majestic red macaw, symbolic bird of Brazilian fauna.",
      "papagaio": "African grey parrot, known for its intelligence."
    }
  };
  
  const names = {
    pt: { "pavoes-azuis": "Pavões Azuis", "arara": "Arara Vermelha", "papagaio": "Papagaio Cinzento" },
    en: { "pavoes-azuis": "Blue Peacocks", "arara": "Red Macaw", "papagaio": "African Grey Parrot" }
  };
  
  const colorNames = {
    pt: {
      "blue": "Azul Tradicional", "royal-blue": "Azul Real", "peacock-green": "Verde Pavão",
      "red": "Vermelho Clássico", "scarlet": "Escarlate", "grey": "Cinzento"
    },
    en: {
      "blue": "Traditional Blue", "royal-blue": "Royal Blue", "peacock-green": "Peacock Green", 
      "red": "Classic Red", "scarlet": "Scarlet", "grey": "Grey"
    }
  };
  
  const ageNames = {
    pt: {
      "young-peacock": "Jovem (3-6 meses)", "adult-peacock": "Adulto (6-12 meses)", "mature-peacock": "Adulto (1+ anos)",
      "young-macaw": "Jovem (6-12 meses)", "adult-macaw": "Adulto (1-2 anos)",
      "young-parrot": "Jovem (4-8 meses)", "adult-parrot": "Adulto (8+ meses)"
    },
    en: {
      "young-peacock": "Young (3-6 months)", "adult-peacock": "Adult (6-12 months)", "mature-peacock": "Mature (1+ years)",
      "young-macaw": "Young (6-12 months)", "adult-macaw": "Adult (1-2 years)", 
      "young-parrot": "Young (4-8 months)", "adult-parrot": "Adult (8+ months)"
    }
  };

  return [
    { 
      id: "pavoes-azuis", 
      name: names[language]["pavoes-azuis"],
      basePrice: 50,
      eggPrice: 50,
      image: pavoesAzuis,
      images: [pavoesAzuis, arara, papagaio],
      description: descriptions[language]["pavoes-azuis"],
      stock: "in",
      colors: [
        { id: "blue", name: colorNames[language]["blue"], priceModifier: 0 },
        { id: "royal-blue", name: colorNames[language]["royal-blue"], priceModifier: 30 },
        { id: "peacock-green", name: colorNames[language]["peacock-green"], priceModifier: 20 }
      ],
      ages: [
        { id: "egg", name: language === 'pt' ? "Ovo" : "Egg", priceModifier: 0 },
        { id: "1week", name: language === 'pt' ? "1 semana" : "1 week", priceModifier: 10 },
        { id: "2weeks", name: language === 'pt' ? "2 semanas" : "2 weeks", priceModifier: 20 },
        { id: "3weeks", name: language === 'pt' ? "3 semanas" : "3 weeks", priceModifier: 30 },
        { id: "1month", name: language === 'pt' ? "1 mês" : "1 month", priceModifier: 70 },
        { id: "2months", name: language === 'pt' ? "2 meses" : "2 months", priceModifier: 10 },
        { id: "3months", name: language === 'pt' ? "3 meses" : "3 months", priceModifier: 20 },
        { id: "4months", name: language === 'pt' ? "4 meses" : "4 months", priceModifier: 30 },
        { id: "5months", name: language === 'pt' ? "5 meses" : "5 months", priceModifier: 40 },
        { id: "6months", name: language === 'pt' ? "6 meses" : "6 months", priceModifier: 50 },
        { id: "7months", name: language === 'pt' ? "7 meses" : "7 months", priceModifier: 60 },
        { id: "8months", name: language === 'pt' ? "8 meses" : "8 months", priceModifier: 70 },
        { id: "9months", name: language === 'pt' ? "9 meses" : "9 months", priceModifier: 80 },
        { id: "10months", name: language === 'pt' ? "10 meses" : "10 months", priceModifier: 90 },
        { id: "11months", name: language === 'pt' ? "11 meses" : "11 months", priceModifier: 100 },
        { id: "12months", name: language === 'pt' ? "12 meses" : "12 months", priceModifier: 110 }
      ]
    },
    { 
      id: "arara", 
      name: names[language]["arara"],
      basePrice: 1200,
      eggPrice: 1200,
      image: arara,
      images: [arara, pavoesAzuis],
      description: descriptions[language]["arara"],
      stock: "low",
      colors: [
        { id: "red", name: colorNames[language]["red"], priceModifier: 0 },
        { id: "scarlet", name: colorNames[language]["scarlet"], priceModifier: 100 }
      ],
      ages: [
        { id: "egg", name: language === 'pt' ? "Ovo" : "Egg", priceModifier: 0 },
        { id: "1week", name: language === 'pt' ? "1 semana" : "1 week", priceModifier: 200 },
        { id: "2weeks", name: language === 'pt' ? "2 semanas" : "2 weeks", priceModifier: 400 },
        { id: "3weeks", name: language === 'pt' ? "3 semanas" : "3 weeks", priceModifier: 600 },
        { id: "1month", name: language === 'pt' ? "1 mês" : "1 month", priceModifier: 1200 },
        { id: "2months", name: language === 'pt' ? "2 meses" : "2 months", priceModifier: 100 },
        { id: "3months", name: language === 'pt' ? "3 meses" : "3 months", priceModifier: 200 },
        { id: "4months", name: language === 'pt' ? "4 meses" : "4 months", priceModifier: 250 },
        { id: "5months", name: language === 'pt' ? "5 meses" : "5 months", priceModifier: 280 },
        { id: "6months", name: language === 'pt' ? "6 meses" : "6 months", priceModifier: 300 },
        { id: "7months", name: language === 'pt' ? "7 meses" : "7 months", priceModifier: 320 },
        { id: "8months", name: language === 'pt' ? "8 meses" : "8 months", priceModifier: 340 },
        { id: "9months", name: language === 'pt' ? "9 meses" : "9 months", priceModifier: 360 },
        { id: "10months", name: language === 'pt' ? "10 meses" : "10 months", priceModifier: 380 },
        { id: "11months", name: language === 'pt' ? "11 meses" : "11 months", priceModifier: 400 },
        { id: "12months", name: language === 'pt' ? "12 meses" : "12 months", priceModifier: 450 }
      ]
    },
    { 
      id: "papagaio", 
      name: names[language]["papagaio"],
      basePrice: 400,
      eggPrice: 400,
      image: papagaio,
      images: [papagaio, arara],
      description: descriptions[language]["papagaio"],
      stock: "out",
      colors: [
        { id: "grey", name: colorNames[language]["grey"], priceModifier: 0 }
      ],
      ages: [
        { id: "egg", name: language === 'pt' ? "Ovo" : "Egg", priceModifier: 0 },
        { id: "1week", name: language === 'pt' ? "1 semana" : "1 week", priceModifier: 50 },
        { id: "2weeks", name: language === 'pt' ? "2 semanas" : "2 weeks", priceModifier: 100 },
        { id: "3weeks", name: language === 'pt' ? "3 semanas" : "3 weeks", priceModifier: 150 },
        { id: "1month", name: language === 'pt' ? "1 mês" : "1 month", priceModifier: 400 },
        { id: "2months", name: language === 'pt' ? "2 meses" : "2 months", priceModifier: 20 },
        { id: "3months", name: language === 'pt' ? "3 meses" : "3 months", priceModifier: 40 },
        { id: "4months", name: language === 'pt' ? "4 meses" : "4 months", priceModifier: 60 },
        { id: "5months", name: language === 'pt' ? "5 meses" : "5 months", priceModifier: 80 },
        { id: "6months", name: language === 'pt' ? "6 meses" : "6 months", priceModifier: 100 },
        { id: "7months", name: language === 'pt' ? "7 meses" : "7 months", priceModifier: 120 },
        { id: "8months", name: language === 'pt' ? "8 meses" : "8 months", priceModifier: 140 },
        { id: "9months", name: language === 'pt' ? "9 meses" : "9 months", priceModifier: 150 },
        { id: "10months", name: language === 'pt' ? "10 meses" : "10 months", priceModifier: 160 },
        { id: "11months", name: language === 'pt' ? "11 meses" : "11 months", priceModifier: 170 },
        { id: "12months", name: language === 'pt' ? "12 meses" : "12 months", priceModifier: 180 }
      ]
    }
  ];
}

// ------- HELPERS -------
function formatPrice(value) {
  return CURRENCY.format(value);
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function getStockStatus(stock, t) {
  switch (stock) {
    case "in":
      return { text: t.inStock, color: "bg-green-500", textColor: "text-green-800" };
    case "low":
      return { text: t.lowStock, color: "bg-yellow-500", textColor: "text-yellow-800" };
    case "out":
      return { text: t.outOfStock, color: "bg-red-500", textColor: "text-red-800" };
    default:
      return { text: t.inStock, color: "bg-green-500", textColor: "text-green-800" };
  }
}

// ------- APP -------
export default function App() {
  const [route, setRoute] = useState("home"); // 'home' | 'catalog' | 'cart' | 'product-detail'
  const [cart, setCart] = useState({}); // { [productId]: quantity }
  const [language, setLanguage] = useState("pt"); // 'pt' | 'en'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const saved = localStorage.getItem("birdshop_cart");
    if (saved) { try { setCart(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("birdshop_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        // Temporarily force fallback to test
        throw new Error('Testing fallback');
        const catalogProducts = await loadCatalogFromCSV('/catalog.csv', language);
        
        console.log('Loaded products for language:', language, catalogProducts);
        
        // Map image paths to imported images
        const productsWithImages = catalogProducts.map(product => ({
          ...product,
          image: getImageForProduct(product.image),
          images: product.images ? product.images.map(getImageForProduct) : [getImageForProduct(product.image)]
        }));
        
        setProducts(productsWithImages);
        
        // Update selected product if we're viewing product details
        if (selectedProduct) {
          const updatedProduct = productsWithImages.find(p => p.id === selectedProduct.id);
          if (updatedProduct) {
            setSelectedProduct(updatedProduct);
          }
        }
      } catch (error) {
        console.error('Failed to load catalog:', error);
        // Fallback to hardcoded products
        const fallbackProducts = getFallbackProducts(language);
        setProducts(fallbackProducts);
        
        // Update selected product with fallback data
        if (selectedProduct) {
          const updatedProduct = fallbackProducts.find(p => p.id === selectedProduct.id);
          if (updatedProduct) {
            setSelectedProduct(updatedProduct);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadCatalog();
  }, [language, selectedProduct?.id]);

  function getImageForProduct(imagePath) {
    if (imagePath.includes('pavoes_azuis')) return pavoesAzuis;
    if (imagePath.includes('arara')) return arara;
    if (imagePath.includes('papagaio')) return papagaio;
    return imagePath; // Return original path as fallback
  }

  const cartItems = useMemo(() =>
    products.filter(p => cart[p.id] > 0)
      .map(p => ({ product: p, qty: cart[p.id], subtotal: (p.basePrice || p.price) * cart[p.id] })), [cart, products]);

  const cartTotal = useMemo(() => cartItems.reduce((sum, i) => sum + i.subtotal, 0), [cartItems]);

  function addToCart(productId, qty = 1) {
    setCart(prev => ({ ...prev, [productId]: clamp((prev[productId] || 0) + qty, 0, 99) }));
  }
  function setQty(productId, qty) {
    const q = clamp(Number(qty) || 0, 0, 99);
    setCart(prev => {
      const next = { ...prev, [productId]: q };
      if (q === 0) delete next[productId];
      return next;
    });
  }
  function removeFromCart(productId) {
    setCart(prev => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  // Build checkout message
  function buildOrderMessage() {
    const lines = cartItems.map(i => `- ${i.product.name} x${i.qty} — ${formatPrice(i.product.price)} ${t.each}`);
    const body = [
      `${t.orderMessage}`,
      ...lines,
      ``,
      `${t.total}: ${formatPrice(cartTotal)}`,
      ``,
      `${t.name}`,
      `${t.contact}`,
    ].join("\n");
    return body;
  }

  function checkoutWhatsApp() {
    if (cartItems.length === 0) return;
    const text = encodeURIComponent(buildOrderMessage());
    const url = `https://api.whatsapp.com/send?phone=${BUSINESS.whatsappNumber}&text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Smooth navigate to catalog for "Como funciona"
  function goToCatalog() {
    setRoute("catalog");
    setTimeout(() => {
      const el = document.getElementById("catalogo");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function viewProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setRoute("product-detail");
  }

  return (
    <div className="min-h-screen text-stone-900 flex flex-col" style={{background: route === "home" ? "linear-gradient(to bottom right, #ecfccb, #fef3c7, #e0f2fe)" : "#fafaf9"}}>
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Aves Massapez Logo" className="w-10 h-10 rounded-full object-cover shadow-md" />
            <span className="font-semibold text-xl">{BUSINESS.shopName}</span>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 sm:gap-3">
            <NavBtn active={route === "home"} onClick={() => setRoute("home")}>{t.home}</NavBtn>
            <NavBtn active={route === "catalog"} onClick={() => setRoute("catalog")}>{t.catalog}</NavBtn>
            <button
              onClick={() => setRoute("cart")}
              className={`relative px-3 py-2 rounded-xl text-sm border transition ${
                route === "cart"
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-800 border-stone-300 hover:border-stone-400"
              }`}
              aria-label={`${t.cart} (${cartCount})`}
            >
              {t.cart}
              <span className={`ml-2 inline-flex items-center justify-center min-w-6 h-6 text-xs font-semibold rounded-full px-1 ${
                route === "cart"
                  ? "bg-white text-stone-900"
                  : "bg-stone-900 text-white"
              }`}>
                {cartCount}
              </span>
            </button>
            <button
              onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
              className="px-3 py-2 rounded-xl text-sm border border-stone-300 bg-white text-stone-800 hover:border-stone-400 transition"
            >
              🌐 {language === "pt" ? "EN" : "PT"}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3">
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => {setRoute("home"); setMobileMenuOpen(false)}}
                className={`px-3 py-2 rounded-xl text-sm border transition text-center ${
                  route === "home"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-800 border-stone-300 hover:border-stone-400"
                }`}
              >
                {t.home}
              </button>
              <button
                onClick={() => {setRoute("catalog"); setMobileMenuOpen(false)}}
                className={`px-3 py-2 rounded-xl text-sm border transition text-center ${
                  route === "catalog"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-800 border-stone-300 hover:border-stone-400"
                }`}
              >
                {t.catalog}
              </button>
              <button
                onClick={() => {setRoute("cart"); setMobileMenuOpen(false)}}
                className={`relative px-3 py-2 rounded-xl text-sm border transition text-center ${
                  route === "cart"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-800 border-stone-300 hover:border-stone-400"
                }`}
              >
                {t.cart}
                <span className={`ml-2 inline-flex items-center justify-center min-w-6 h-6 text-xs font-semibold rounded-full px-1 ${
                  route === "cart"
                    ? "bg-white text-stone-900"
                    : "bg-stone-900 text-white"
                }`}>
                  {cartCount}
                </span>
              </button>
              <button
                onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
                className="px-3 py-2 rounded-xl text-sm border border-stone-300 bg-white text-stone-800 hover:border-stone-400 transition text-center"
              >
                🌐 {language === "pt" ? "EN" : "PT"}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ROUTES */}
      <main className="flex-1">
        {route === "home" && (
          <>
            <Home onShopNow={() => setRoute("catalog")} onHowItWorks={goToCatalog} t={t} />
            <AboutSection t={t} />
          </>
        )}
        {route === "catalog" && <Catalog products={products} loading={loading} onAdd={addToCart} cart={cart} onViewDetail={viewProductDetail} t={t} />}
        {route === "product-detail" && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onAdd={addToCart} 
            cart={cart} 
            onBackToCatalog={() => setRoute("catalog")} 
            t={t} 
          />
        )}
        {route === "cart" && (
          <Cart
            items={cartItems}
            total={cartTotal}
            onQty={setQty}
            onRemove={removeFromCart}
            onCheckoutWhatsApp={checkoutWhatsApp}
            t={t}
          />
        )}
      </main>

      {/* Fixed WhatsApp Button */}
      <a
        href={`https://api.whatsapp.com/send?phone=${BUSINESS.whatsappNumber}&text=${encodeURIComponent("Olá! Gostaria de saber mais sobre as aves disponíveis.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </a>

      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {BUSINESS.shopName}. {t.rights}</p>
          <p>
            <button className="underline underline-offset-4 decoration-dotted" onClick={() => setRoute("catalog")}>
              {t.viewCatalogFooter}
            </button>
            <span className="mx-2">•</span>
            <button className="underline underline-offset-4 decoration-dotted" onClick={() => setRoute("cart")}>
              {t.cart} ({cartCount})
            </button>
            <span className="mx-2">•</span>
            <a href="https://instagram.com/aves_massapez" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-dotted">
              {t.instagram}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// ------- UI SECTIONS -------
function Home({ onShopNow, onHowItWorks, t }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    { src: arara, position: 'center center' },
    { src: papagaio, position: 'center center' }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative overflow-hidden">
      {/* Background Images with Slideshow */}
      <div className="absolute inset-0">
        {backgroundImages.map((imageObj, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${imageObj.src})`,
              backgroundSize: 'contain',
              backgroundPosition: imageObj.position,
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#8fbc8f'
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Additional gradient overlay for the gaps */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/30 via-transparent to-sky-800/30"></div>
          </div>
        ))}
        {/* Additional gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime-900/20 via-amber-900/20 to-sky-900/20"></div>
      </div>
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20 flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white drop-shadow-lg">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-stone-100 mb-6 drop-shadow">
            {t.heroSubtitle}
          </p>
          <div className="mb-8">
            <button 
              onClick={onShopNow} 
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t.viewCatalog}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <ul className="text-sm text-stone-100 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <li className="flex items-center gap-2 drop-shadow">
              <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z"/>
              </svg>
              {t.wellbeing}
            </li>
            <li className="flex items-center gap-2 drop-shadow">
              <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              {t.enrichment}
            </li>
            <li className="flex items-center gap-2 drop-shadow">
              <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              {t.veterinary}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ t }) {
  return (
    <section className="bg-stone-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-sky-200 rounded-full blur-2xl opacity-30"></div>
              <img 
                src={logo} 
                alt="Aves Massapez Logo" 
                className="relative w-full h-full rounded-full object-cover shadow-2xl ring-4 ring-white/50" 
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-6">{t.aboutUs}</h2>
            <p className="text-lg text-stone-700 mb-8 leading-relaxed">
              {t.aboutUsText}
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=${BUSINESS.whatsappNumber}&text=${encodeURIComponent("Olá! Gostaria de saber mais sobre a vossa empresa.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              {t.learnMore}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Catalog({ products, loading, onAdd, cart, onViewDetail, t }) {
  if (loading) {
    return (
      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t.catalog}</h2>
          <p className="text-stone-600">Loading catalog...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">{t.catalog}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const stockStatus = getStockStatus(p.stock, t);
          return (
            <article key={p.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col">
              <div 
                className="cursor-pointer relative"
                onClick={() => onViewDetail(p.id)}
              >
                <img src={p.image} alt={`Foto de ${p.name}`} className="w-full aspect-[4/3] object-cover hover:opacity-90 transition-opacity" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg leading-tight">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                    <span className={`text-xs font-medium ${stockStatus.textColor}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-stone-700 font-medium">{t.from} {formatPrice(p.basePrice || p.price)}</p>
                <div className="mt-auto pt-4 flex items-center gap-3">
                  <button
                    onClick={() => onViewDetail(p.id)}
                    disabled={p.stock === "out"}
                    className={`flex-1 px-4 py-2 rounded-xl transition ${
                      p.stock === "out" 
                        ? "bg-stone-300 text-stone-500 cursor-not-allowed" 
                        : "bg-stone-900 text-white hover:bg-stone-800"
                    }`}
                  >
                    {p.stock === "out" ? t.outOfStock : t.buy}
                  </button>
                  {cart[p.id] > 0 && (
                    <span className="text-sm text-stone-600">{t.inCart} {cart[p.id]}</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProductDetail({ product, onAdd, cart, onBackToCatalog, t }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedAge, setSelectedAge] = useState(product.ages?.[0] || null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const finalPrice = useMemo(() => {
    let price = product.basePrice || product.price;
    if (selectedColor) price += selectedColor.priceModifier;
    if (selectedAge) {
      // Use absolute price if available, otherwise use price modifier
      price = selectedAge.absolutePrice || (price + selectedAge.priceModifier);
    }
    return price;
  }, [product, selectedColor, selectedAge]);

  const images = product.images || [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* Back button */}
      <button
        onClick={onBackToCatalog}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
{t.backToCatalog}
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative bg-white border border-stone-200 rounded-2xl overflow-hidden aspect-[4/3]">
            <img 
              src={images[currentImageIndex]} 
              alt={`${product.name} - Imagem ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-stone-300'
                  }`}
                >
                  <img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-emerald-600 font-semibold">{formatPrice(finalPrice)}</p>
            {product.description && (
              <p className="mt-4 text-stone-700 leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && (
            <div>
              <h3 className="font-semibold mb-3">{t.color}</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.colors.map((color) => (
                  <label
                    key={color.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                      selectedColor?.id === color.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="color"
                        value={color.id}
                        checked={selectedColor?.id === color.id}
                        onChange={() => setSelectedColor(color)}
                        className="sr-only"
                      />
                      <span className="font-medium">{color.name}</span>
                    </div>
                    {color.priceModifier > 0 && (
                      <span className="text-sm text-stone-600">+{formatPrice(color.priceModifier)}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Age Selection */}
          {product.ages && (
            <div>
              <h3 className="font-semibold mb-3">{t.age}</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.ages.map((age) => (
                  <label
                    key={age.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                      selectedAge?.id === age.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="age"
                        value={age.id}
                        checked={selectedAge?.id === age.id}
                        onChange={() => setSelectedAge(age)}
                        className="sr-only"
                      />
                      <span className="font-medium">{age.name}</span>
                    </div>
                    {age.priceModifier > 0 && (
                      <span className="text-sm text-stone-600">+{formatPrice(age.priceModifier)}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="space-y-3">
            <button
              onClick={() => onAdd(product.id, 1)}
              className="w-full px-6 py-4 text-lg font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
{t.addToCart} - {formatPrice(finalPrice)}
            </button>
            {cart[product.id] > 0 && (
              <p className="text-center text-stone-600">
                {t.inCart} {cart[product.id]}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Cart({ items, total, onQty, onRemove, onCheckoutWhatsApp, t }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold">{t.cart}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-stone-600">{t.cartEmpty}</p>
      ) : (
        <div className="mt-6 grid lg:grid-cols-[1fr,380px] gap-6 items-start">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-stone-200">
              {items.map(({ product, qty, subtotal }) => (
                <li key={product.id} className="p-4 flex items-center gap-4">
                  <img src={product.image} alt="" className="w-20 h-20 rounded-lg object-cover border border-stone-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-stone-600">{t.price} {formatPrice(product.basePrice || product.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor={`qty-${product.id}`} className="text-sm text-stone-600">{t.qty}</label>
                      <input
                        id={`qty-${product.id}`}
                        type="number"
                        min={0}
                        max={99}
                        value={qty}
                        onChange={(e) => onQty(product.id, e.target.value)}
                        className="w-20 rounded-lg border border-stone-300 px-2 py-1"
                      />
                      <button onClick={() => onRemove(product.id)} className="px-3 py-1 rounded-lg border border-stone-300 hover:bg-stone-50">{t.remove}</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(subtotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="bg-white border border-stone-200 rounded-2xl p-5 sticky top-24">
            <h3 className="font-semibold text-lg">{t.summary}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>{t.subtotal}</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
              <div className="pt-2 border-t border-dashed border-stone-200 flex justify-between font-semibold">
                <dt>{t.total}</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="mt-5 grid gap-3">
              <button
                onClick={onCheckoutWhatsApp}
                className="w-full px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
              >
                {t.buyWhatsApp}
              </button>
              <p className="text-xs text-stone-500">{t.whatsAppNote}</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

// ------- SMALL UI -------
function NavBtn({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={
        "px-3 py-2 rounded-xl text-sm border transition " +
        (active
          ? "bg-stone-900 text-white border-stone-900"
          : "bg-white text-stone-800 border-stone-300 hover:border-stone-400")
      }
    >
      {children}
    </button>
  );
}