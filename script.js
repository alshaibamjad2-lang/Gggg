// ---------- Supabase ----------
const SUPABASE_URL = "https://ztwbgqkxmdhpzqhnefty.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d2JncWt4bWRocHpxaG5lZnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTQwMDEsImV4cCI6MjA3OTU5MDAwMX0.6W_V9v5VxQpPfv65Ygc51-m7G1Z8sl8fx1B8bWyA6Xg";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let globalCategories = [];
let globalProducts = [];
let currentSection = "all";

// -------- تحميل البيانات --------
async function loadMenu() {

    const { data: categories } = await client
        .from("categories")
        .select("*")
        .order("id");

    const { data: products } = await client
        .from("products")
        .select("*")
        .order("id");

    globalCategories = categories || [];
    globalProducts = products || [];

    renderSections();
    renderMeals();
}

// -------- الأقسام --------
function renderSections(){
    const sec = document.getElementById("sections");
    sec.innerHTML = `<button class="section-btn active" data-section="all">الكل</button>`;

    globalCategories.forEach(cat =>{
        sec.innerHTML += `<button class="section-btn" data-section="${cat.id}">${cat.name}</button>`;
    });

    document.querySelectorAll(".section-btn").forEach(btn=>{
        btn.onclick = ()=>{
            document.querySelector(".active")?.classList.remove("active");
            btn.classList.add("active");
            currentSection = btn.dataset.section;
            renderMeals();
        };
    });
}

// -------- العرض --------
const views = [
  { cls:'mode-grid', label:'Grid 2×2' },
  { cls:'mode-grid3', label:'Grid 3×3' },
  { cls:'mode-row', label:'صف كامل' }
];
let viewIndex = 0;

function applyViewClass(){
    document.getElementById("meals").className = "meals " + views[viewIndex].cls;
    document.getElementById("viewName").textContent = views[viewIndex].label;
}

document.getElementById("toggleView").onclick = ()=>{
    viewIndex = (viewIndex + 1) % views.length;
    renderMeals();
};

// -------- المنتجات --------
function renderMeals(){
    const box = document.getElementById("meals");
    box.innerHTML = "";

    let shown = currentSection === "all"
        ? globalProducts
        : globalProducts.filter(p ⇒ p.category_id == currentSection);

    shown.forEach(p=>{
        box.innerHTML += `
            <div class="meal">
                <div class="img"><img src="${p.image || ""}"></div>
                <div class="info">
                    <h3>${p.name}</h3>
                    <div class="price">${p.price} ر.س</div>
                    <button class="add-to-cart" data-name="${p.name}" data-price="${p.price}">إضافة</button>
                </div>
            </div>
        `;
    });

    applyViewClass();
}

// -------- السلة --------
let cart = [];

document.addEventListener("click", e => {

    if(e.target.classList.contains("add-to-cart")){
        let name = e.target.dataset.name;
        let price = Number(e.target.dataset.price);

        let item = cart.find(i => i.name === name);
        if(item){ item.qty++; }
        else cart.push({name, price, qty:1});

        updateCartUI();
    }

    if(e.target.classList.contains("remove")){
        let i = e.target.dataset.index;
        cart.splice(i,1);
        updateCartUI();
    }

});

function updateCartUI(){
    let div = document.getElementById("cartItems");
    let totalEl = document.getElementById("cartTotal");
    let countEl = document.getElementById("cartCount");

    div.innerHTML = "";
    let total = 0;

    cart.forEach((c,i)=>{
        total += c.qty * c.price;

        div.innerHTML += `
            <div class="cart-item">
                <div><b>${c.name}</b><br>${c.price} × ${c.qty}</div>
                <div class="remove" data-index="${i}" style="color:var(--gold);cursor:pointer">حذف</div>
            </div>
        `;
    });

    totalEl.textContent = total + " ر.س";
    countEl.textContent = cart.length;
}

document.getElementById("openCart").onclick = ()=>{
    document.getElementById("cartSidebar").classList.add("open");
    document.getElementById("cartOverlay").classList.add("show");
};
document.getElementById("cartOverlay").onclick = ()=>{
    document.getElementById("cartSidebar").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("show");
};

document.getElementById("clearCart").onclick = ()=>{
    cart = [];
    updateCartUI();
};

// ---- بدء التشغيل ----
document.addEventListener("DOMContentLoaded", loadMenu);