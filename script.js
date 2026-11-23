const menu=document.querySelector(".site-nav"),toggle=document.querySelector(".menu-toggle");
if(menu&&toggle){
 const current=location.pathname.split("/").pop()||"index.html";
 document.querySelectorAll(".menu-panel a").forEach(a=>{if(a.getAttribute("href")===current)a.classList.add("active")});
 toggle.addEventListener("click",()=>{const open=menu.classList.toggle("is-open");toggle.setAttribute("aria-expanded",String(open))});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){menu.classList.remove("is-open");toggle.setAttribute("aria-expanded","false")}});
 document.addEventListener("click",e=>{if(!menu.contains(e.target)){menu.classList.remove("is-open");toggle.setAttribute("aria-expanded","false")}});
}
async function loadPublished(){
 const target=document.getElementById("published-content");if(!target)return;
 try{const r=await fetch("/api/content");if(!r.ok)return;const data=await r.json();
 const page=target.dataset.page;const rows=data.filter(x=>x.category===page&&x.status==="published");
 target.innerHTML=rows.map(x=>`<article class="content-entry"><div class="entry-meta">${escapeHtml(x.type||"RECORD")}</div><h3>${escapeHtml(x.title)}</h3><div class="entry-body">${escapeHtml(x.body||"").replace(/\n/g,"<br>")}</div>${x.image_url?`<img src="${escapeAttr(x.image_url)}" alt="">`:""}</article>`).join("");
 }catch(e){console.warn("Published content could not be loaded",e)}
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function escapeAttr(s){return escapeHtml(s)}
loadPublished();
