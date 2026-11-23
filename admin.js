const $=id=>document.getElementById(id);
let records=[];
async function api(url,options={}){const r=await fetch(url,{credentials:"same-origin",...options});let data={};try{data=await r.json()}catch{}if(!r.ok)throw new Error(data.error||"요청을 처리하지 못했습니다.");return data}
async function refresh(){
 const state=await api("/api/admin/session");
 $("login-panel").classList.toggle("hidden",state.authenticated);$("dashboard").classList.toggle("hidden",!state.authenticated);
 if(state.authenticated){records=await api("/api/content?includeDrafts=1");renderList()}
}
function renderList(){
 $("record-list").innerHTML=records.map(x=>`<div class="admin-item"><div><strong>${esc(x.title)}</strong><div class="status">${esc(x.category)} · ${esc(x.status)}</div></div><div class="admin-actions"><button class="btn secondary" data-edit="${x.id}">EDIT</button><button class="btn secondary" data-delete="${x.id}">DELETE</button></div></div>`).join("")||"<p>아직 저장된 기록이 없습니다.</p>";
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function resetForm(){$("content-id").value="";$("category").value="world";$("type").value="";$("title").value="";$("body").value="";$("image").value="";$("image-url").value="";$("image-status").textContent="";$("editor-message").textContent=""}
async function save(status){
 try{
  let imageUrl=$("image-url").value;const file=$("image").files[0];
  if(file){const uploaded=await api("/api/upload",{method:"POST",headers:{"Content-Type":file.type,"X-File-Name":encodeURIComponent(file.name)},body:file});imageUrl=uploaded.url;$("image-url").value=imageUrl;$("image-status").textContent="이미지 업로드 완료"}
  const payload={category:$("category").value,type:$("type").value,title:$("title").value,body:$("body").value,image_url:imageUrl,status};
  if(!payload.title.trim())throw new Error("제목을 입력해 주세요.");
  const id=$("content-id").value;
  const result=await api("/api/content",{method:id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(id?{...payload,id}:payload)});
  $("content-id").value=result.id||id;$("editor-message").textContent=status==="draft"?"임시 저장했어요.":"게시했어요.";records=await api("/api/content?includeDrafts=1");renderList();
 }catch(e){$("editor-message").textContent=e.message}
}
$("login-form").addEventListener("submit",async e=>{e.preventDefault();$("login-message").textContent="";try{await api("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:$("secret").value})});$("secret").value="";await refresh()}catch(err){$("login-message").textContent=err.message}});
$("logout").addEventListener("click",async()=>{await api("/api/admin/logout",{method:"POST"});await refresh()});
$("save-draft").addEventListener("click",()=>save("draft"));$("publish").addEventListener("click",()=>save("published"));$("reset").addEventListener("click",resetForm);
$("record-list").addEventListener("click",async e=>{const edit=e.target.dataset.edit,del=e.target.dataset.delete;if(edit){const x=records.find(r=>r.id===edit);if(!x)return;$("content-id").value=x.id;$("category").value=x.category;$("type").value=x.type||"";$("title").value=x.title;$("body").value=x.body||"";$("image-url").value=x.image_url||"";$("editor-message").textContent="기존 기록을 수정 중입니다."}if(del&&confirm("이 기록을 삭제할까요?")){try{await api("/api/content",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:del})});records=await api("/api/content?includeDrafts=1");renderList()}catch(err){alert(err.message)}}});
refresh().catch(e=>{$("login-message").textContent="서버 설정을 확인해 주세요: "+e.message});
