import React, { useEffect, useMemo, useState } from "react";
import logo from './assets/images/logo.jpeg';

// ------- CONFIG -------
const BUSINESS = {
  // Replace with your WhatsApp number in international format (no + or spaces)
  whatsappNumber: "351900000000", // e.g., Portugal: 3519XXXXXXXX
  shopName: "Aves Massapez"
};

const CURRENCY = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

// Demo catalog (dummy images). Replace prices/images/names as needed.
const PRODUCTS = [
  { id: "african-grey", name: "African Grey Parrot", price: 1800, image: "https://placehold.co/600x400?text=African+Grey" },
  { id: "blue-and-gold-macaw", name: "Blue-and-Gold Macaw", price: 2400, image: "https://placehold.co/600x400?text=Blue+%26+Gold+Macaw" },
  { id: "scarlet-macaw", name: "Scarlet Macaw", price: 2600, image: "https://placehold.co/600x400?text=Scarlet+Macaw" },
  { id: "cockatoo", name: "Umbrella Cockatoo", price: 2200, image: "https://placehold.co/600x400?text=Umbrella+Cockatoo" },
  { id: "eclectus", name: "Eclectus Parrot", price: 1900, image: "https://placehold.co/600x400?text=Eclectus+Parrot" },
  { id: "ringneck", name: "Indian Ringneck", price: 450, image: "https://placehold.co/600x400?text=Indian+Ringneck" },
  { id: "conure", name: "Sun Conure", price: 650, image: "https://placehold.co/600x400?text=Sun+Conure" },
  { id: "lovebird", name: "Fischer's Lovebird (pair)", price: 170, image: "https://placehold.co/600x400?text=Lovebirds" },
];

// ------- HELPERS -------
function formatPrice(value) {
  return CURRENCY.format(value);
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// ------- APP -------
export default function App() {
  const [route, setRoute] = useState("home"); // 'home' | 'catalog' | 'cart'
  const [cart, setCart] = useState({}); // { [productId]: quantity }
  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  useEffect(() => {
    const saved = localStorage.getItem("birdshop_cart");
    if (saved) { try { setCart(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("birdshop_cart", JSON.stringify(cart));
  }, [cart]);

  const cartItems = useMemo(() =>
    PRODUCTS.filter(p => cart[p.id] > 0)
      .map(p => ({ product: p, qty: cart[p.id], subtotal: p.price * cart[p.id] })), [cart]);

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
    const lines = cartItems.map(i => `- ${i.product.name} x${i.qty} — ${formatPrice(i.product.price)} cada`);
    const body = [
      `Olá! Gostaria de comprar:`,
      ...lines,
      ``,
      `Total: ${formatPrice(cartTotal)}`,
      ``,
      `Nome:`,
      `Contacto preferido:`,
    ].join("\n");
    return body;
  }

  function checkoutWhatsApp() {
    if (cartItems.length === 0) return;
    const text = encodeURIComponent(buildOrderMessage());
    const url = `https://wa.me/${BUSINESS.whatsappNumber}?text=${text}`;
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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦜</span>
            <span className="font-semibold text-xl">{BUSINESS.shopName}</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            <NavBtn active={route === "home"} onClick={() => setRoute("home")}>Home</NavBtn>
            <NavBtn active={route === "catalog"} onClick={() => setRoute("catalog")}>Catálogo</NavBtn>
            <button
              onClick={() => setRoute("cart")}
              className="relative px-3 py-2 rounded-xl text-sm bg-stone-900 text-white hover:bg-stone-800 transition"
              aria-label={`Abrir carrinho com ${cartCount} item(s)`}
            >
              Carrinho
              <span className="ml-2 inline-flex items-center justify-center min-w-6 h-6 text-xs font-semibold bg-white text-stone-900 rounded-full px-1">
                {cartCount}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* ROUTES */}
      <main className="flex-1">
        {route === "home" && <Home onShopNow={() => setRoute("catalog")} onHowItWorks={goToCatalog} />}
        {route === "catalog" && <Catalog onAdd={addToCart} cart={cart} />}
        {route === "cart" && (
          <Cart
            items={cartItems}
            total={cartTotal}
            onQty={setQty}
            onRemove={removeFromCart}
            onCheckoutWhatsApp={checkoutWhatsApp}
          />
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {BUSINESS.shopName}. Todos os direitos reservados.</p>
          <p>
            <button className="underline underline-offset-4 decoration-dotted" onClick={() => setRoute("catalog")}>
              Ver catálogo
            </button>
            <span className="mx-2">•</span>
            <button className="underline underline-offset-4 decoration-dotted" onClick={() => setRoute("cart")}>
              Carrinho ({cartCount})
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}

// ------- UI SECTIONS -------
function Home({ onShopNow, onHowItWorks }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-lime-100 via-amber-100 to-sky-100" />
      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Criador de aves exóticas e ornamentais.
          </h1>
          <p className="mt-4 text-lg text-stone-700">
            Veja o nosso catálogo e fale connosco.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={onShopNow} className="px-5 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition">
              Ver Catálogo
            </button>
          </div>
          <ul className="mt-6 text-sm text-stone-600 grid grid-cols-2 gap-2">
            <li>✓ Bem-estar</li>
            <li>✓ Enriquecimento ambiental</li>
            <li>✓ Acompanhamento veterinário</li>
          </ul>
        </div>
        <div className="aspect-square rounded-full flex items-center justify-center w-80 h-80 mx-auto">
          <img src={logo} alt="Exotic Birds" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Catalog({ onAdd, cart }) {
  return (
    <section id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Catálogo</h2>

        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => (
          <article key={p.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col">
            <img src={p.image} alt={`Foto de ${p.name} (placeholder)`} className="w-full aspect-[4/3] object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg leading-tight">{p.name}</h3>
              <p className="mt-1 text-stone-700 font-medium">{formatPrice(p.price)}</p>
              <div className="mt-auto pt-4 flex items-center gap-3">
                <button
                  onClick={() => onAdd(p.id, 1)}
                  className="flex-1 px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition"
                >
                  Adicionar
                </button>
                {cart[p.id] > 0 && (
                  <span className="text-sm text-stone-600">No carrinho: {cart[p.id]}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Cart({ items, total, onQty, onRemove, onCheckoutWhatsApp }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold">Carrinho</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-stone-600">O seu carrinho está vazio. Adicione aves no catálogo.</p>
      ) : (
        <div className="mt-6 grid lg:grid-cols-[1fr,380px] gap-6 items-start">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-stone-200">
              {items.map(({ product, qty, subtotal }) => (
                <li key={product.id} className="p-4 flex items-center gap-4">
                  <img src={product.image} alt="" className="w-20 h-20 rounded-lg object-cover border border-stone-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-stone-600">Preço: {formatPrice(product.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor={`qty-${product.id}`} className="text-sm text-stone-600">Qtd.</label>
                      <input
                        id={`qty-${product.id}`}
                        type="number"
                        min={0}
                        max={99}
                        value={qty}
                        onChange={(e) => onQty(product.id, e.target.value)}
                        className="w-20 rounded-lg border border-stone-300 px-2 py-1"
                      />
                      <button onClick={() => onRemove(product.id)} className="px-3 py-1 rounded-lg border border-stone-300 hover:bg-stone-50">Remover</button>
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
            <h3 className="font-semibold text-lg">Resumo</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
              <div className="pt-2 border-t border-dashed border-stone-200 flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="mt-5 grid gap-3">
              <button
                onClick={onCheckoutWhatsApp}
                className="w-full px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
              >
                Comprar via WhatsApp
              </button>
              <p className="text-xs text-stone-500">Será aberta uma nova janela com uma mensagem pré-preenchida com o seu pedido.</p>
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