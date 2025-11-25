/* ——— إعداد Supabase ——— */
const SUPABASE_URL = "https://ztwbgqkxmdhpzqhnefty.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d2JncWt4bWRocHpxaG5lZnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTQwMDEsImV4cCI6MjA3OTU5MDAwMX0.6W_V9v5VxQpPfv65Ygc51-m7G1Z8sl8fx1B8bWyA6Xg";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ——— بيانات عامة ——— */
let categories = [];
let products = [];
let cart = [];

/* ——— تحميل البيانات ——— */
async function loadData() {
    const { data: cats } = await supabase.from("categories").select("*");
    const { data: prods } = await supabase.from("products").select("*");

    categories = cats || [];
    products = prods || [];

    renderCategories();
    renderMeals("all");
}

/* ——— عرض الأقسام ——— */
function renderCategories(){
    const sec = document.getElementById("sections");
    sec.innerHTML = `<button class="section-btn active" data-id="all">الكل</button>`;

    categories.forEach(cat=>{
        sec.innerHTML += `
        <button class="section-btn" data-id="${cat.id}">${cat.name}</button>`;
    });

    document.querySelectorAll(".section-btn").forEach(btn=>{
        btn.onclick = ()=>{
            document.querySelector(".section-btn.active")?.classList.remove("active");
            btn.classList.add("active");
            renderMeals(btn.dataset.id);
        };
    });
}

/* ——— عرض المنتجات ——— */
function renderMeals(sectionId){
    const meals = document.getElementById("meals");
    meals.innerHTML = "";

    let list = sectionId === "all"
        ? products
        : products.filter(p => p.category_id == sectionId);

    list.forEach(p=>{
        meals.innerHTML += `
        <div class="meal">
            <div class="img"><img src="${p.image_url}"></div>
            <div class="info">
                <h3>${p.name}</h3>
                <div class="price">${p.price} ر.س</div>
                <button class="add-to-cart" data-id="${p.id}">إضافة للسلة</button>
            </div>
        </div>`;
    });
}

/* ——— إضافة للسلة ——— */
document.addEventListener("click", e=>{
    if(e.target.classList.contains("add-to-cart")){
        const id = e.target.dataset.id;
        const product = products.find(p => p.id == id);

        const found = cart.find(i => i.id == id);
        if(found) found.qty++;
        else cart.push({ ...product, qty:1 });

        updateCartUI();
    }
});

/* ——— تحديث واجهة السلة ——— */
function updateCartUI(){
    const itemsDiv = document.getElementById("cartItems");
    itemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, idx)=>{
        total += item.qty * item.price;

        itemsDiv.innerHTML += `
        <div class="cart-item">
            <strong>${item.name}</strong>
            <div>${item.price} × ${item.qty}</div>
        </div>`;
    });

    document.getElementById("cartCount").textContent = cart.length;
    document.getElementById("cartTotal").textContent = total + " ر.س";
}

/* ——— بدء التشغيل ——— */
loadData();