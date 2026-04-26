const PAYPAL_USERNAME = "Fair4playAKgmbhspar";

const products = [
  {
    id: "green-special",
    name: "FC Barcelona Green Special Edition Jersey",
    price: 30,
    desc: "Fresh green/blue special edition Barça jersey with bold sponsor design.",
    images: ["green-special-front.jpg","green-special-back.jpg","green-special-detail.jpg"]
  },
  {
    id: "green-home",
    name: "FC Barcelona Green Home Style Jersey",
    price: 30,
    desc: "Clean green Barça jersey with Spotify sponsor and sleeve detail.",
    images: ["green-home-front.jpg","green-home-back.jpg","green-home-detail.jpg"]
  },
  {
    id: "white-yamal",
    name: "FC Barcelona Lamine Yamal 304 Special Edition Jersey",
    price: 30,
    desc: "White Lamine Yamal special edition jersey with 304 front print and back artwork.",
    images: ["white-yamal-front.jpg","white-yamal-back.jpg"]
  }
];

let cart = [];

function renderProducts(){
  const wrap = document.getElementById("products");
  wrap.innerHTML = products.map((p) => `
    <article class="product">
      <div class="gallery">
        <img id="main-${p.id}" src="${p.images[0]}" alt="${p.name}">
        <div class="thumbs">
          ${p.images.map(img => `<img src="${img}" onclick="changeImage('${p.id}','${img}')" alt="${p.name}">`).join("")}
        </div>
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <div class="price">${p.price}€</div>
        <p class="desc">${p.desc}</p>
        <div class="row">
          <select id="size-${p.id}">
            <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
          </select>
          <input id="qty-${p.id}" type="number" min="1" value="1">
        </div>
        <button class="btn main full" onclick="addToCart('${p.id}')">Add to cart</button>
      </div>
    </article>
  `).join("");
}

function changeImage(id, img){
  document.getElementById("main-" + id).src = img;
}

function addToCart(id){
  const p = products.find(x => x.id === id);
  const size = document.getElementById("size-" + id).value;
  const qty = Number(document.getElementById("qty-" + id).value);
  const existing = cart.find(x => x.id === id && x.size === size);
  if(existing){ existing.qty += qty; }
  else { cart.push({ ...p, size, qty }); }
  renderCart();
  document.getElementById("checkout").scrollIntoView({behavior:"smooth"});
}

function renderCart(){
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("total");
  if(cart.length === 0){
    box.innerHTML = "Your cart is empty.";
    totalBox.textContent = "0€";
    return;
  }
  box.innerHTML = cart.map(item => `
    <div><b>${item.qty}x ${item.name}</b><br>Size: ${item.size} — ${item.qty * item.price}€</div>
  `).join("<hr style='border-color:rgba(255,255,255,.12);margin:12px 0'>");
  totalBox.textContent = getTotal() + "€";
}

function getTotal(){
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

document.getElementById("checkoutForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(cart.length === 0){
    alert("Please add a jersey to the cart first.");
    return;
  }

  const total = getTotal();
  const orderText = cart.map(i => `${i.qty}x ${i.name} Size ${i.size}`).join(", ");
  localStorage.setItem("fair4play_order", JSON.stringify({
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    notes: document.getElementById("notes").value,
    order: orderText,
    total: total + "€"
  }));

  window.location.href = `https://paypal.me/${PAYPAL_USERNAME}/${total}`;
});

renderProducts();
renderCart();
