const WHATSAPP = "6287774402822";

const products = [
  {
    id: 1,
    name: "-",
    type: "-",
    gender: "-",
    age: "-",
    weight: "-",
    price: 000000,
    featured: true,
    img: "img/kambing4.jpg",
    desc: "-"
  },
  {
    id: 2,
    name: "-",
    type: "-",
    gender: "-",
    age: "-",
    weight: "-",
    price: 000000,
    featured: true,
    img: "img/kambing3.jpg",
    desc: "-"
  }
];


// ==============================
// FORMAT HARGA
// ==============================

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n);


// ==============================
// LINK WHATSAPP
// ==============================

const wa = (p) => {
  const message =
    "Halo Ka, saya tertarik dengan " +
    p.name +
    " (" +
    rupiah(p.price) +
    "). Apakah masih tersedia?";

  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
};


// ==============================
// CARD PRODUK
// ==============================

function card(p) {
  return `
    <article class="product-card">

      <img
        src="${p.img}"
        alt="${p.name}"
        loading="lazy"
      >

      <div class="product-body">

        <span class="tag">${p.type}</span>

        <h3>${p.name}</h3>

        <div class="meta">
          <span>♂/♀ ${p.gender}</span>
          <span>•</span>
          <span>${p.age}</span>
          <span>•</span>
          <span>${p.weight}</span>
        </div>

        <div class="price">
          ${rupiah(p.price)}
        </div>

        <div class="card-actions">

          <a
            class="btn btn-light"
            href="detail.html?id=${p.id}"
          >
            Detail
          </a>

          <a
            class="btn btn-primary"
            href="${wa(p)}"
            target="_blank"
            rel="noopener"
          >
            WhatsApp
          </a>

        </div>
      </div>
    </article>
  `;
}


// ==============================
// PRODUK UNGGULAN
// ==============================

function renderFeatured() {
  const el = document.getElementById("featuredProducts");

  if (el) {
    el.innerHTML = products
      .filter((p) => p.featured)
      .map(card)
      .join("");
  }
}


// ==============================
// DAFTAR PRODUK + FILTER
// ==============================

function renderProducts() {
  const list = document.getElementById("productList");
  const search = document.getElementById("searchInput");
  const type = document.getElementById("typeFilter");
  const gender = document.getElementById("genderFilter");
  const price = document.getElementById("priceFilter");

  function filter() {
    const q = search.value.toLowerCase();
    const t = type.value;
    const g = gender.value;
    const pr = price.value;

    const out = products.filter((p) => {
      const text = `${p.name} ${p.type}`
        .toLowerCase()
        .includes(q);

      const tp = !t || p.type === t;
      const gd = !g || p.gender === g;

      const pc =
        !pr ||
        (pr === "1" && p.price < 3000000) ||
        (pr === "2" &&
          p.price >= 3000000 &&
          p.price <= 5000000) ||
        (pr === "3" && p.price > 5000000);

      return text && tp && gd && pc;
    });

    list.innerHTML = out.length
      ? out.map(card).join("")
      : `
        <div class="empty">
          🐐 Tidak ada kambing yang sesuai filter.
        </div>
      `;
  }

  [search, type, gender, price].forEach((x) => {
    x.addEventListener("input", filter);
  });

  filter();
}


// ==============================
// DETAIL PRODUK
// ==============================

function renderDetail() {
  const id = Number(
    new URLSearchParams(location.search).get("id")
  );

  const p = products.find((x) => x.id === id);
  const el = document.getElementById("detailProduct");

  if (!p) {
    el.innerHTML = `
      <div class="empty">

        <h2>Produk tidak ditemukan</h2>

        <a
          class="btn btn-primary"
          href="produk.html"
        >
          Kembali ke daftar
        </a>

      </div>
    `;

    return;
  }

  el.innerHTML = `
    <div class="detail">

      <div>
        <img
          src="${p.img}"
          alt="${p.name}"
        >
      </div>

      <div>

        <span class="eyebrow">
          DETAIL PRODUK
        </span>

        <h1>${p.name}</h1>

        <div class="price">
          ${rupiah(p.price)}
        </div>

        <p>
          ${p.desc}
        </p>

        <div class="detail-info">

          <div class="specs">

            <div class="spec">
              <b>Jenis</b>
              <br>
              ${p.type}
            </div>

            <div class="spec">
              <b>Kelamin</b>
              <br>
              ${p.gender}
            </div>

            <div class="spec">
              <b>Umur</b>
              <br>
              ${p.age}
            </div>

            <div class="spec">
              <b>Bobot</b>
              <br>
              ${p.weight}
            </div>

          </div>

        </div>

        <div class="hero-buttons">

          <a
            class="btn btn-primary"
            href="${wa(p)}"
            target="_blank"
            rel="noopener"
          >
            💬 Pesan via WhatsApp
          </a>

          <a
            class="btn btn-light"
            href="pemesanan.html"
          >
            📝 Form Pemesanan
          </a>

        </div>

      </div>

    </div>
  `;
}


// ==============================
// FORM PEMESANAN
// ==============================

function initOrderForm() {
  const sel = document.getElementById("buyerGoat");

  products.forEach((p) => {
    const o = document.createElement("option");

    o.value = p.id;
    o.textContent = `${p.name} — ${rupiah(p.price)}`;

    sel.appendChild(o);
  });

  document
    .getElementById("orderForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const p = products.find(
        (x) => x.id == sel.value
      );

      const msg = `
Halo PT Zizu Putera Farm,

Saya ingin memesan/menanyakan:

🐐 ${p.name}
💰 Harga: ${rupiah(p.price)}
👤 Nama: ${document.getElementById("buyerName").value}
📞 WhatsApp: ${document.getElementById("buyerPhone").value}
🔢 Jumlah: ${document.getElementById("buyerQty").value}
🎯 Kebutuhan: ${document.getElementById("buyerNeed").value}
📝 Catatan: ${document.getElementById("buyerNote").value}
      `.trim();

      window.open(
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    });
}


// ==============================
// MENU MOBILE
// ==============================

document
  .querySelector(".menu-toggle")
  ?.addEventListener("click", () => {
    document
      .getElementById("navMenu")
      .classList.toggle("open");
  });


// ==============================
// TAHUN FOOTER
// ==============================

document
  .querySelectorAll("#year")
  .forEach((x) => {
    x.textContent = new Date().getFullYear();
  });