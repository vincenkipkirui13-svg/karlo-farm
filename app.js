const DEFAULT_SETTINGS={name:"Karlo Farm",phone:"0762886726",whatsapp:"254762886726",heroTitle:"Quality You Can Trust",heroText:"Karlo Farm is your trusted source for premium products, well-bred healthy livestock, poultry, fish and quality farm supplies in Kenya.",aboutTitle:"Your partner in farming",aboutText:"Karlo Farm connects livestock buyers with trusted breeders and suppliers offering quality farm animals and agricultural products."};
const DEFAULT_LIVESTOCK=[
{name:"Dairy Cattle",category:"Cattle",price:"Contact for price",description:"Healthy dairy cattle. Ask for breed, age and availability."},
{name:"Beef Cattle",category:"Cattle",price:"Contact for price",description:"Beef cattle options subject to current availability."},
{name:"Goats",category:"Goats",price:"Contact for price",description:"Ask about breeds, age, sex and quantity available."},
{name:"Sheep",category:"Sheep",price:"Contact for price",description:"Ask about breeds, age and current stock."},
{name:"Pigs",category:"Pigs",price:"Contact for price",description:"Pigs available subject to stock and size."},
{name:"Rabbits",category:"Rabbits",price:"Contact for price",description:"Ask about rabbits and breeding stock."}
];
const DEFAULT_PRODUCTS=[
{name:"Broiler Chicks",category:"Poultry",price:"Contact for price",description:"Ask about age, quantity and availability."},
{name:"Layers Chicks",category:"Poultry",price:"Contact for price",description:"Ask about age, quantity and availability."},
{name:"Improved Kienyeji Chicken",category:"Poultry",price:"Contact for price",description:"Ask about birds, age and quantity."},
{name:"Turkey",category:"Poultry",price:"Contact for price",description:"Ask about current stock."},
{name:"Ducks",category:"Poultry",price:"Contact for price",description:"Ask about current stock."},
{name:"Fish Fingerlings",category:"Fish",price:"Contact for price",description:"Ask about species, size and quantity."},
{name:"Table Fish",category:"Fish",price:"Contact for price",description:"Ask about species, size and availability."},
{name:"Dairy Meal 50kg",category:"Feeds",price:"KSh 3,200",description:"Animal feed. Confirm current price and availability."},
{name:"Dairy Meal 70kg",category:"Feeds",price:"KSh 4,200",description:"Animal feed. Confirm current price and availability."},
{name:"Layers Mash",category:"Feeds",price:"KSh 3,600",description:"Poultry feed. Confirm current price and availability."},
{name:"Growers Mash",category:"Feeds",price:"KSh 3,400",description:"Poultry feed. Confirm current price and availability."},
{name:"Chick Mash",category:"Feeds",price:"KSh 3,800",description:"Poultry feed. Confirm current price and availability."},
{name:"Fish Feed 50kg",category:"Feeds",price:"KSh 4,500",description:"Fish feed. Confirm current price and availability."},
{name:"Dog Meal 20kg",category:"Feeds",price:"KSh 2,500",description:"Confirm current price and availability."},
{name:"Organic Fertilizer",category:"Seeds & fertilizer",price:"KSh 2,000",description:"Confirm packaging and availability."},
{name:"Hybrid Maize Seeds",category:"Seeds & fertilizer",price:"KSh 1,800",description:"Confirm variety and packet size."},
{name:"Napier Grass Seeds",category:"Seeds & fertilizer",price:"KSh 1,200",description:"Confirm packet size and availability."}
];
const STORE={settings:"karloFarmSettings",livestock:"karloFarmLivestock",products:"karloFarmProducts",photos:"karloFarmPhotos"};
function readStore(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
function getSettings(){return {...DEFAULT_SETTINGS,...readStore(STORE.settings,{})}}
function getLivestock(){return readStore(STORE.livestock,DEFAULT_LIVESTOCK)}
function getProducts(){return readStore(STORE.products,DEFAULT_PRODUCTS)}
function getPhotos(){return readStore(STORE.photos,{})}
function saveStore(key,value){localStorage.setItem(key,JSON.stringify(value))}
function digits(v){return String(v||"").replace(/\D/g,"")}
function waNumber(){let n=digits(getSettings().whatsapp);if(n.startsWith("0"))n="254"+n.slice(1);return n}
function waLink(message){return "https://wa.me/"+waNumber()+"?text="+encodeURIComponent(message)}
function renderPhoto(el,key){const photos=getPhotos();if(photos[key]){el.classList.remove("empty-photo");el.innerHTML="";const img=document.createElement("img");img.src=photos[key];img.alt="Karlo Farm gallery photo";el.appendChild(img)}}
function card(item,index,type){const card=document.createElement("article");card.className="product-card";const photo=document.createElement("div");photo.className="card-photo";const photoKey=(type==="livestock"?"livestock-":"product-")+index;photo.dataset.photo=photoKey;photo.classList.add("empty-photo");photo.innerHTML="<span>PHOTO TO BE ADDED IN ADMIN</span>";renderPhoto(photo,photoKey);const body=document.createElement("div");body.className="card-body";const category=document.createElement("span");category.className="product-category";category.textContent=item.category;const title=document.createElement("h3");title.textContent=item.name;const desc=document.createElement("p");desc.textContent=item.description||"";const price=document.createElement("div");price.className="product-price";price.textContent=item.price||"Contact for price";const btn=document.createElement("a");btn.className="btn btn-primary";btn.href=waLink("Hello Karlo Farm, I am interested in "+item.name+". Please share current availability and price.");btn.target="_blank";btn.rel="noopener";btn.textContent="Inquire on WhatsApp ↗";body.append(category,title,desc,price,btn);card.append(photo,body);return card}
function paintGrid(id,items,type){const grid=document.getElementById(id);if(!grid)return;grid.replaceChildren();if(!items.length){grid.innerHTML='<p class="empty-state">No items in this category yet. Add them from Admin.</p>';return}items.forEach((x,i)=>grid.appendChild(card(x,i,type)))}
function renderCatalog(){const livestock=getLivestock(),products=getProducts();const lf=document.querySelector("#livestockFilters");let lcat="All";if(lf){lf.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{lcat=b.dataset.filter;lf.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));paintGrid("livestockGrid",lcat==="All"?getLivestock():getLivestock().filter(x=>x.category===lcat),"livestock")})}paintGrid("livestockGrid",livestock,"livestock");const pf=document.querySelector("#productCategories");let pcat="All";if(pf){pf.querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>{pcat=b.dataset.category;pf.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));paintGrid("farmProductsGrid",pcat==="All"?getProducts():getProducts().filter(x=>x.category===pcat),"product")})}paintGrid("farmProductsGrid",products,"product")}
function applySettings(){const s=getSettings();const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};set("brandName",s.name);set("footerName",s.name);set("copyrightName",s.name);set("heroTitle",s.heroTitle);set("heroText",s.heroText);set("aboutTitle",s.aboutTitle);set("aboutText",s.aboutText);const phone=s.phone||"";["callHero","contactPhone"].forEach(id=>{const e=document.getElementById(id);if(e){e.href="tel:"+digits(phone);if(id==="callHero")e.innerHTML="Call Now: <span data-phone></span>";if(id==="contactPhone")e.textContent=phone}});document.querySelectorAll("[data-phone]").forEach(e=>e.textContent=phone);const w=waLink("Hello "+s.name+", I would like to make an inquiry.");["waHero","contactWhatsApp","floatingWhatsApp"].forEach(id=>{const e=document.getElementById(id);if(e)e.href=w});document.title=s.name+" | Livestock Marketplace";document.getElementById("year").textContent=new Date().getFullYear();document.querySelectorAll("[data-photo]").forEach(el=>{const k=el.dataset.photo;el.classList.add("empty-photo");el.innerHTML="<span>"+(k.startsWith("hero")?"ADD FARM PHOTO IN ADMIN":k.startsWith("about")?"ADD FARM PHOTO IN ADMIN":"ADD PRODUCT PHOTO IN ADMIN")+"</span>";renderPhoto(el,k)})}
function initMenu(){const toggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");if(toggle&&nav){toggle.onclick=()=>nav.classList.toggle("open");nav.querySelectorAll("a").forEach(a=>a.onclick=()=>nav.classList.remove("open"))}}
function initInquiry(){const form=document.getElementById("inquiryForm");if(!form)return;form.addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("customerName").value.trim(),phone=document.getElementById("customerPhone").value.trim(),interest=document.getElementById("customerInterest").value,msg=document.getElementById("customerMessage").value.trim();const s=getSettings();const text="Hello "+s.name+", I would like to make an inquiry.\nName: "+name+"\nPhone: "+phone+"\nInterested in: "+interest+"\nMessage: "+msg;window.open(waLink(text),"_blank","noopener")})}
applySettings();renderCatalog();initMenu();initInquiry();