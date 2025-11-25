// ---------- إعداد Supabase ----------
const SUPABASE_URL = "https://ztwbgqkxmdhpzqhnefty.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d2JncWt4bWRocHpxaG5lZnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTQwMDEsImV4cCI6MjA3OTU5MDAwMX0.6W_V9v5VxQpPfv65Ygc51-m7G1Z8sl8fx1B8bWyA6Xg";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== تحميل الأقسام والمنتجات ==========
async function loadMenu() {
    // جلب الأقسام
    const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: true });

    if (catError) {
        console.error("خطأ جلب الأقسام:", catError);
        return;
    }

    // جلب المنتجات
    const { data: products, error: prodError } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

    if (prodError) {
        console.error("خطأ جلب المنتجات:", prodError);
        return;
    }

    renderSections(categories);
    renderProducts(categories, products);
}

// ========== إضافة قسم ثابت "الكل" ==========
function renderSections(categories) {
    const secDiv = document.getElementById("sections");
    secDiv.innerHTML = "";

    // قسم الكل
    secDiv.innerHTML += `
        <button class="section-btn active" data-section="all">الكل</button>
    `;

    categories.forEach(cat => {
        secDiv.innerHTML += `
            <button class="section-btn" data-section="${cat.id}">${cat.name}</button>
        `;
    });

    document.querySelectorAll(".section-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelector(".section-btn.active")?.classList.remove("active");
            btn.classList.add("active");
            renderSelected(btn.dataset.section);
        };
    });
}

// ========== عرض المنتجات ==========
let globalProducts = [];
let globalCategories = [];

function renderProducts(categories, products) {
    globalProducts = products;
    globalCategories = categories;
    renderSelected("all"); // عند الفتح يعرض الكل
}

function renderSelected(section) {
    const mealsDiv = document.getElementById("meals");
    mealsDiv.innerHTML = "";

    let shown = [];

    if (section === "all") {
        shown = globalProducts;
    } else {
        shown = globalProducts.filter(p => p.category_id == section);
    }

    shown.forEach(p => {
        mealsDiv.innerHTML += `
            <div class="meal">
                <div class="img">
                    <img src="${p.image_url ?? ""}">
                </div>
                <div class="info">
                    <h3>${p.name}</h3>
                    <div class="price">${p.price} ر.س</div>
                </div>
            </div>
        `;
    });
}

// ========== التحميل الرئيسي ==========
document.addEventListener("DOMContentLoaded", loadMenu);