(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const K="AIzaSyASHO1pu81Otv0iJsjox_tFpmOsOn6fGRY",M="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";class _{constructor(e){this.apiKey=e}async analyzePhoto(e){var n,a,o,r,i,m;try{const s=e.includes(",")?e.split(",")[1]:e,u=await fetch(`${M}?key=${this.apiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:`Sen bir İş Sağlığı ve Güvenliği (İSG) uzmanısın. Bu saha fotoğrafını İSG açısından detaylı analiz et.

GÖREVIN:
1. Fotoğrafta gördüğün tüm iş güvenliği sorunlarını tespit et
2. Risk seviyesini değerlendir
3. Alınması gereken önlemleri belirle

YANIT FORMATI (SADECE JSON):
{
  "bulgular": "Tespit edilen güvenlik sorunlarını kısa ve net Türkçe cümlelerle listele. Her sorunu ayrı satıra yaz.",
  "alinmasiGerekenAksiyon": "Bu sorunlar için alınması gereken somut önlemleri liste halinde Türkçe yaz."
}

ÖNEMLİ KURALLAR:
- Yanıtını SADECE JSON formatında ver
- Türkçe karakter kullan (ş, ğ, ı, ö, ü, ç)
- Eğer ciddi bir güvenlik sorunu yoksa, "Güvenlik standartlarına uygun görünüyor" yaz
- Kısa ve öz cümleler kullan
- JSON dışında hiçbir şey yazma

ŞİMDİ ANALİZ ET:`},{inline_data:{mime_type:"image/jpeg",data:s}}]}],generationConfig:{temperature:.4,topK:32,topP:1,maxOutputTokens:2048}})});if(!u.ok){const y=await u.json();throw new Error(`API Error: ${u.status} - ${((n=y.error)==null?void 0:n.message)||"Unknown error"}`)}const p=(m=(i=(r=(o=(a=(await u.json()).candidates)==null?void 0:a[0])==null?void 0:o.content)==null?void 0:r.parts)==null?void 0:i[0])==null?void 0:m.text;if(!p)throw new Error("No response from AI");const I=p.match(/\{[\s\S]*\}/);if(!I)throw new Error("Invalid JSON response from AI");const g=JSON.parse(I[0]);if(!g.bulgular||!g.alinmasiGerekenAksiyon)throw new Error("Invalid response structure from AI");return{bulgular:g.bulgular.trim(),alinmasiGerekenAksiyon:g.alinmasiGerekenAksiyon.trim()}}catch(s){throw console.error("AI Analysis Error:",s),s}}async testConnection(){try{const e=await fetch(`${M}?key=${this.apiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"test"}]}]})});return e.ok||e.status===400}catch{return!1}}}const J=new _(K);window.aiAnalyzer=J;const Y={apiKey:"AIzaSyAjNnt7e39kI6loOoTyb9uORR6CqUBqznc",authDomain:"saha-kontrol-7a1fb.firebaseapp.com",projectId:"saha-kontrol-7a1fb",storageBucket:"saha-kontrol-7a1fb.firebasestorage.app",messagingSenderId:"347469985700",appId:"1:347469985700:web:4cf0476eaefd0a2ea63331"};firebase.apps.length||firebase.initializeApp(Y);const H=new FirebaseAuthManager;window.authManager=H;window.storage=firebase.storage();const F=firebase.firestore(),V=window.storage;function W(t){const e=t.split(","),n=e[0].match(/:(.*?);/)[1],a=atob(e[1]),o=a.length,r=new Uint8Array(o);for(let i=0;i<o;++i)r[i]=a.charCodeAt(i);return new Blob([r],{type:n})}async function q(t){const e=window.authManager.getCurrentUser(),n=Date.now(),a=Math.random().toString(36).substring(7),o=`inspections/${e.uid}/${n}_${a}.jpg`,r=V.ref(o),i={contentType:"image/jpeg",customMetadata:{uploadedBy:e.email,uploadedAt:new Date().toISOString()}};console.log("📤 Uploading photo to Storage:",o);const s=await(await r.put(t,i)).ref.getDownloadURL();return console.log("✅ Photo uploaded, URL:",s),s}const l=t=>document.getElementById(t);let L,z,N,E,R,T,S,b,D,C,k,w;function Z(){L=l("startCameraBtn"),z=l("captureBtn"),N=l("retakeBtn"),E=l("cameraPreview"),R=l("photoCanvas"),T=l("capturedPhoto"),S=l("formSection"),b=l("cameraSection"),D=l("inspectionForm"),l("cancelBtn"),C=l("recordsList"),k=l("recordCount"),w=l("exportExcelBtn"),l("logoutBtn")}let v=null,h=null,c=[],A=null;document.addEventListener("DOMContentLoaded",()=>{U()});const P=()=>{const t=window.authManager;if(!t){console.warn("⚠️ authManager not ready, retrying auth listener..."),setTimeout(P,100);return}t.onAuthStateChanged(e=>{if(console.log("📬 App auth listener received state:",e?e.email:"No user"),!e){console.log("🚫 No user session, redirecting to login.html");const n="/isg-saha-kontrol/",a=window.location.pathname.includes(n)?n+"login.html":"login.html";window.location.href=a;return}console.log("✅ User logged in:",e.email,"| Role:",e.role),Z(),Q(),X(),te(),ee()})};P();function Q(){const t=window.authManager.getCurrentUser();document.getElementById("userName").textContent=t.displayName;const e=document.getElementById("userRole");e.textContent=t.role==="admin"?"Admin":"Teknik Ekip",e.classList.add(t.role)}function X(){const t=window.authManager.isAdmin(),e=window.authManager.getCurrentUser();console.log("Setting up role-based UI for:",e),console.log("Is admin?",t),console.log("Camera section element:",b),t?b?(b.style.display="block",console.log("✅ Camera section shown for admin")):console.error("❌ Camera section element not found!"):b&&(b.style.display="none",console.log("🚫 Camera section hidden for technical team"))}function ee(){var e,n,a,o,r,i;console.log("👂 Setting up event listeners..."),authManager.isAdmin()&&(console.log("📸 Admin detected, enabling camera listeners"),(e=l("startCameraBtn"))==null||e.addEventListener("click",oe),(n=l("captureBtn"))==null||n.addEventListener("click",ae),(a=l("retakeBtn"))==null||a.addEventListener("click",ie),(o=l("cancelBtn"))==null||o.addEventListener("click",se),(r=l("inspectionForm"))==null||r.addEventListener("submit",ce)),(i=l("exportExcelBtn"))==null||i.addEventListener("click",pe);const t=l("logoutBtn");t?(t.addEventListener("click",m=>{m.preventDefault(),console.log("🖱️ Logout button clicked"),window.authManager.logout()}),console.log("✅ Logout button listener attached")):console.error("❌ Logout button NOT found in DOM!")}function U(){const t=new Date().toISOString().split("T")[0];document.getElementById("kontrolTarihi").value=t,document.getElementById("terminTarihi").value=t}function te(){A&&A(),A=F.collection("inspections").orderBy("createdAt","desc").onSnapshot(t=>{c=[],t.forEach(e=>{c.push({id:e.id,...e.data()})}),B()},t=>{console.error("Firestore error:",t),ne()})}function ne(){try{const t=localStorage.getItem("isg_records");c=t?JSON.parse(t):[],B()}catch(t){console.error("Local storage load error:",t),c=[],B()}}async function oe(){try{const t={video:{facingMode:"environment",width:{ideal:1920},height:{ideal:1080}}};v=await navigator.mediaDevices.getUserMedia(t),E.srcObject=v,E.style.display="block",L.style.display="none",z.style.display="block"}catch(t){console.error("Camera access error:",t),alert("Kameraya erişilemiyor. Lütfen kamera izinlerini kontrol edin.")}}function ae(){const t=R,e=E;t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0,t.width,t.height),h=t.toDataURL("image/jpeg",.8),T.src=h,T.style.display="block",E.style.display="none",le(),z.style.display="none",N.style.display="block",de(),S.style.display="block",S.scrollIntoView({behavior:"smooth"}),re()}async function re(){const t=document.getElementById("aiLoading"),e=document.getElementById("bulgular"),n=document.getElementById("alinmasiGerekenAksiyon");try{t&&(t.style.display="block"),e.placeholder="🤖 AI analiz ediyor...",n.placeholder="🤖 AI analiz ediyor...",e.disabled=!0,n.disabled=!0,console.log("🤖 Starting AI analysis...");const a=await window.aiAnalyzer.analyzePhoto(h);console.log("✅ AI analysis complete:",a),e.value=a.bulgular,n.value=a.alinmasiGerekenAksiyon,O("✅ Yapay zeka analizi tamamlandı!","success")}catch(a){console.error("❌ AI analysis failed:",a),O("⚠️ AI analizi başarısız, lütfen manuel girin","warning"),e.placeholder="Bulgular...",n.placeholder="Gerekli aksiyon..."}finally{t&&(t.style.display="none"),e.disabled=!1,n.disabled=!1,e.focus()}}function O(t,e="info"){const n=document.createElement("div");n.className=`notification notification-${e}`,n.textContent=t,n.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${e==="success"?"#2ecc71":e==="warning"?"#f39c12":"#3498db"};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `,document.body.appendChild(n),setTimeout(()=>{n.style.animation="slideOut 0.3s ease-out",setTimeout(()=>n.remove(),300)},4e3)}function ie(){h=null,T.style.display="none",N.style.display="none",L.style.display="block",S.style.display="none"}function le(){v&&(v.getTracks().forEach(t=>t.stop()),v=null)}function se(){confirm("Formu iptal etmek istediğinizden emin misiniz?")&&G()}function G(){D.reset(),h=null,T.style.display="none",N.style.display="none",L.style.display="block",S.style.display="none",U(),document.getElementById("maddeNo").value=""}function de(){let t=0;c.forEach(a=>{const o=parseInt(a.maddeNo);!isNaN(o)&&o>t&&(t=o)});const e=t+1,n=String(e).padStart(3,"0");document.getElementById("maddeNo").value=n}async function ce(t){if(t.preventDefault(),!h){alert("Lütfen önce fotoğraf çekin!");return}const e=document.getElementById("maddeNo").value.trim(),n=document.getElementById("bulgular").value.trim(),o=c.some(s=>s.maddeNo===e)?`${n} (Tekrar eden bulgu)`:n,r=window.authManager.getCurrentUser(),i=t.target.querySelector('button[type="submit"]'),m=i.textContent;try{i.disabled=!0,i.textContent="📤 Fotoğraf yükleniyor...",console.log("🔄 Converting photo to Blob...");const s=W(h);console.log("📤 Uploading to Firebase Storage...");const f=await q(s);console.log("✅ Photo URL received:",f),i.textContent="💾 Kayıt kaydediliyor...";const u={kontrolTarihi:document.getElementById("kontrolTarihi").value,maddeNo:e,bulgular:o,alinmasiGerekenAksiyon:document.getElementById("alinmasiGerekenAksiyon").value.trim(),alinanAksiyon:"",terminTarihi:document.getElementById("terminTarihi").value,durum:document.getElementById("durum").value,fotograf:f,createdBy:r.email,createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:r.email};await F.collection("inspections").add(u),localStorage.setItem("isg_records",JSON.stringify([u,...c])),G(),alert("✅ Kayıt başarıyla eklendi!")}catch(s){console.error("❌ Save error:",s),alert("❌ Kayıt eklenirken hata oluştu: "+s.message)}finally{i.disabled=!1,i.textContent=m}}function B(){if(!C){console.warn("⚠️ recordsList element not found, retrying..."),setTimeout(B,100);return}if(c.length===0){C.innerHTML='<p class="empty-state">Henüz kayıt yok. Fotoğraf çekerek başlayın.</p>',w&&(w.style.display="none"),k&&(k.textContent="0");return}k&&(k.textContent=c.length),w&&(w.style.display="block");const t=window.authManager.isAdmin();window.authManager.getCurrentUser(),C.innerHTML=c.map(e=>{const n=e.fotograf||"",a=n.startsWith("data:image");return`
        <div class="record-card">
            <div class="record-header">
                <div class="record-meta">
                    <h3>Madde ${e.maddeNo}</h3>
                    <p>${x(e.kontrolTarihi)}</p>
                </div>
                <div class="record-actions">
                    ${t?`
                        <button class="btn btn-danger btn-small" onclick="deleteRecord('${e.id}')">
                            🗑️ Sil
                        </button>
                    `:""}
                    ${t?"":`
                        <select class="status-select" onchange="updateStatus('${e.id}', this.value)">
                            <option value="Tamamlanmadı" ${e.durum==="Tamamlanmadı"?"selected":""}>Tamamlanmadı</option>
                            <option value="Tamamlandı" ${e.durum==="Tamamlandı"?"selected":""}>Tamamlandı</option>
                        </select>
                    `}
                </div>
            </div>
            
            <div class="record-content">
                <div class="record-field">
                    <label>Bulgular</label>
                    <p>${e.bulgular}</p>
                </div>
                
                <div class="record-field">
                    <label>Alınması Gereken Aksiyon</label>
                    <p>${e.alinmasiGerekenAksiyon}</p>
                </div>
                
                <div class="record-field">
                    <label>Termin Tarihi</label>
                    <p>${x(e.terminTarihi)}</p>
                </div>
                
                <div class="record-field">
                    <label>Durum</label>
                    <p><span class="status-badge ${e.durum==="Tamamlandı"?"status-tamamlandi":"status-tamamlanmadi"}">
                        ${e.durum}
                    </span></p>
                </div>
            </div>
            
            <div class="record-photo" onclick="viewPhoto('${e.id}')">
                ${n?`
                    <img src="${n}" alt="Saha Fotoğrafı" loading="lazy">
                    ${a?'<span class="photo-badge">💾 Yerel</span>':'<span class="photo-badge">☁️ Cloud</span>'}
                `:"<p>Fotoğraf yok</p>"}
            </div>
        </div>
        `}).join("")}async function ue(t,e){const n=window.authManager.getCurrentUser();try{await F.collection("inspections").doc(t).update({durum:e,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:n.email}),alert("✅ Durum güncellendi!")}catch(a){console.error("Update error:",a),alert("❌ Güncelleme hatası: "+a.message)}}async function me(t){if(!window.authManager.isAdmin()){alert("❌ Bu işlem için yetkiniz yok!");return}if(confirm("Bu kaydı silmek istediğinizden emin misiniz?"))try{await F.collection("inspections").doc(t).delete(),alert("✅ Kayıt silindi!")}catch(e){console.error("Delete error:",e),alert("❌ Silme hatası: "+e.message)}}window.deleteRecord=me;window.updateStatus=ue;window.viewPhoto=ge;function ge(t){const e=c.find(n=>n.id===t);e&&window.open("","_blank").document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Fotoğraf - Madde ${e.maddeNo}</title>
                <style>
                    body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                    img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                </style>
            </head>
            <body>
                <img src="${e.fotograf}" alt="Saha Fotoğrafı">
            </body>
            </html>
        `)}function x(t){if(!t)return"-";const[e,n,a]=t.split("-");return`${a}.${n}.${e}`}async function pe(){if(c.length===0){alert("Dışa aktarılacak kayıt yok!");return}const t=document.getElementById("exportExcelBtn"),e=t.textContent;t.textContent="⏳ Hazırlanıyor...",t.disabled=!0;try{const n=new ExcelJS.Workbook,a=n.addWorksheet("Saha Kontrol");a.columns=[{header:"No",key:"no",width:10},{header:"Kontrol Tarihi",key:"kontrolTarihi",width:15},{header:"Termin Tarihi",key:"terminTarihi",width:15},{header:"Bulgu",key:"bulgu",width:50},{header:"Çekilen Fotoğraf",key:"fotograf",width:25},{header:"Alınması Gereken Aksiyon",key:"alinmasiGerekenAksiyon",width:40},{header:"Alınan Aksiyon",key:"alinanAksiyon",width:40},{header:"Durum",key:"durum",width:15}];const o=a.getRow(1);o.font={bold:!0,color:{argb:"FFFFFFFF"}},o.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF4A90E2"}},o.alignment={vertical:"middle",horizontal:"center"},o.height=25,c.forEach((d,p)=>{const I={no:d.maddeNo,kontrolTarihi:x(d.kontrolTarihi),terminTarihi:x(d.terminTarihi),bulgu:d.bulgular,fotograf:"",alinmasiGerekenAksiyon:d.alinmasiGerekenAksiyon,alinanAksiyon:d.alinanAksiyon,durum:d.durum},g=a.addRow(I);if(g.height=120,g.alignment={vertical:"top",wrapText:!0},d.fotograf)try{const $=d.fotograf.split(",")[1],j=n.addImage({base64:$,extension:"jpeg"});a.addImage(j,{tl:{col:4,row:p+1},br:{col:5,row:p+2},editAs:"oneCell"})}catch($){console.error("Photo add error:",$),g.getCell("fotograf").value="Var"}const y=g.getCell("durum");d.durum==="Tamamlandı"?(y.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF2ECC71"}},y.font={color:{argb:"FFFFFFFF"},bold:!0}):(y.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FFE74C3C"}},y.font={color:{argb:"FFFFFFFF"},bold:!0}),y.alignment={vertical:"middle",horizontal:"center"}}),a.eachRow(d=>{d.eachCell(p=>{p.border={top:{style:"thin"},left:{style:"thin"},bottom:{style:"thin"},right:{style:"thin"}}})});const r=new Date,i=`ISG_Saha_Kontrol_${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}-${String(r.getDate()).padStart(2,"0")}.xlsx`,m=await n.xlsx.writeBuffer(),s=new Blob([m],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),f=window.URL.createObjectURL(s),u=document.createElement("a");u.href=f,u.download=i,u.click(),window.URL.revokeObjectURL(f),t.textContent=e,t.disabled=!1,alert("✅ Excel dosyası başarıyla indirildi!")}catch(n){console.error("Excel creation error:",n),alert("❌ Excel oluşturulurken hata oluştu: "+n.message),t.textContent=e,t.disabled=!1}}window.addEventListener("beforeunload",()=>{A&&A()});
