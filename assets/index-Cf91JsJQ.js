(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const x=document.querySelector("#theme");let a=JSON.parse(localStorage.getItem("todos"))??[],k=a.length>0?a[a.length-1].id:0;const f=document.querySelector("#new-todo-text"),D=document.querySelector(".new-todo-dd-wrapper"),g=document.querySelector("#new-todo-dd"),b=document.querySelector(".date-overlay span"),M=document.querySelector("#new-todo-add");let d=JSON.parse(localStorage.getItem("categories"))||[{id:0,name:"None",count:0,colorClass:"cat0"},{id:1,name:"Work",count:0,colorClass:"cat1"},{id:2,name:"Personal",count:0,colorClass:"cat2"},{id:3,name:"Pets",count:0,colorClass:"cat3"},{id:4,name:"Groceries",count:0,colorClass:"cat4"}];const v=document.querySelector(".todo-categories");let m="None",w=null;const l=document.querySelector(".todo-list-wrapper"),N=document.querySelector(".todo-count span"),q=document.querySelector(".layout-todo-footer"),I=document.querySelector(".todo-footer-actions");document.querySelector(".btn--bin");const y=document.querySelector(".container-bin"),H=document.querySelector(".bin-wrapper"),p=document.querySelector(".bin-list-wrapper");document.querySelector(".btn--restore");document.querySelector(".btn--delete");const A=document.querySelector(".bin-todo-count span");document.querySelector(".btn--delete-all");const B=()=>{localStorage.setItem("todos",JSON.stringify(a))},j=()=>{localStorage.setItem("categories",JSON.stringify(d))},L=()=>{const t=document.documentElement.classList.contains("dk-theme"),e="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",o="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z";x.innerHTML=`
      <svg aria-label="${t?"Sun Icon":"Moon Icon"}"
      xmlns="http://www.w3.org/2000/svg" 
      fill="currentColor"
      width="2.5rem"
      height="2.5rem"        
      viewBox="0 0 24 24" 
      stroke-width="${t?"1.5":"0"}" 
      stroke="currentColor"  
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        d="${t?e:o}" 
      />
    </svg>    
    `},P=()=>{v.innerHTML="",d.forEach(o=>{if(o.id!==0){const n=document.createElement("div");m!=="None"&&o.name!==m?n.className="todo-category btn--dimmed-cat":n.className=`todo-category btn--${o.colorClass}`;const r=document.createElement("button");r.className=`btn ${o.name} category-name`,r.textContent=o.name,r.dataset.categoryId=o.id,r.tabIndex=0;const s=document.createElement("span");s.className="category-count text-md-bold",s.setAttribute("aria-label","Amount of items in category");const c=a.filter(u=>o.name===u.category&&u.cleared===!1).length;o.count=c,s.textContent=c,n.append(r,s),v.appendChild(n)}});const t=document.querySelector(".new-todo-category-wrapper");t.innerHTML="";const e=o=>o.length>12?`${o.substring(0,12)}...`:o;t.insertAdjacentHTML("afterbegin",`
      <select id="new-todo-category" class="new-todo-category" name="new-todo-select" tabindex="0">
        <option value="None">None</option>
        <option value="${d[1].name}">${e(d[1].name)}</option>
        <option value="${d[2].name}">${e(d[2].name)}</option>
        <option value="${d[3].name}">${e(d[3].name)}</option>
        <option value="${d[4].name}">${e(d[4].name)}</option>
      </select>   
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24" 
        stroke-width="1.75" 
        stroke="currentColor"
        aria-hidden="true"                
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="m19.5 8.25-7.5 7.5-7.5-7.5" 
        />
      </svg>           
    `)},O=()=>{const t=a.filter(e=>e.cleared===!1);if(l.innerHTML="",t.length>0){const e=document.createElement("ul");e.className="todo-list",l.classList.remove("todo-list-empty"),l.appendChild(e),t.forEach(o=>{if(m==="None"||o.category===m){const{checkboxIcon:n,isCompleted:r}=E(o),s=d.find(u=>u.name===o.category),c=h(o.dueDate);e.insertAdjacentHTML("afterbegin",`
            <li class="todo-item ${s.colorClass}" data-id="${o.id}">
              <div class="checkbox-text">
                ${n}
                <div class="todo-text-wrapper">
                  <span class="todo-text ${r}" tabindex="0">
                    ${o.text}
                  </span> 
                ${o.dueDate?`
                  <span class="todo-dd text-xs ${c.class} ${r}">
                    Due: ${c.text}
                  </span>
                  `:""}
                </div>
              </div>
              <div class="todo-item-actions">
                <button class="btn btn--clear" aria-label="Clear">
                  <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  width="1.35rem"
                  height="1.35rem"                
                  viewBox="0 0 24 24" 
                  stroke-width="2.5" 
                  stroke="currentColor"
                  aria-hidden="true"
                  >
                    <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    d="M5 12h14" />
                  </svg>
                </button>
              </div>
            </li>
          `)}})}else l.classList.add("todo-list-empty"),l.insertAdjacentHTML("afterbegin",`
        <div class="todo-list-placeholder">
          <div class="placeholder-title">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              width="2.25rem"
              height="2.25rem"           
              viewBox="0 0 24 24" 
              stroke-width="1.75" 
              stroke="currentColor"
              aria-hidden="true"              
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
              />
            </svg>
            <span class="text-lg">
              Start by adding a new todo
            </span>
          </div>   
          <p class="placeholder-instructions text-sm">
            Click categories to toggle filters. </br>
            Double-click the text in categories or todo items to edit.
          </p>
        </div>         
      `);N.textContent=t.length},W=()=>{let t=a.filter(e=>e.cleared);if(p.innerHTML="",t.length>0){const e=document.createElement("ul");e.className="todo-list bin-list",p.classList.remove("bin-list-empty"),p.appendChild(e),t.forEach(o=>{const{checkboxIcon:n,isCompleted:r}=E(o),s=d.find(u=>u.name===o.category),c=h(o.dueDate);e.insertAdjacentHTML("afterbegin",`
        <li class="todo-item todo-item--bin ${s.colorClass}" data-id="${o.id}">
          <div class="checkbox-text">
              ${n}
            <div class="todo-text-wrapper">
              <span class="todo-text ${r}">
                  ${o.text}
              </span> 
                ${o.dueDate?`
                  <span class="todo-dd text-xs ${c.class} ${r}">
                    Due: ${c.text}
                  </span>
                  `:""}
            </div>
          </div>
          <div class="todo-item-actions">
            <button class="btn btn--restore" aria-label="Restore">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                width="1.25rem"
                height="1.25rem"                
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
                aria-hidden="true"                
              >
                <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" 
                />
              </svg>
            </button>            
            <button class="btn btn--delete" aria-label="Delete">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                width="1.25rem"
                height="1.25rem"
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M6 18 18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </li>      
      `)})}else p.classList.add("bin-list-empty"),p.insertAdjacentHTML("afterbegin",`
        <div class="bin-list-placeholder">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            width="2.5rem"
            height="2.5rem"
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor"
            aria-hidden="true"            
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" 
            />
          </svg>        
          <span class="text-lg">
            Cleared items will be added here
          </span>
        </div>         
      `);A.textContent=t.length},i=()=>{L(),P(),O(),W(),C(),B(),j()},h=t=>{if(!t)return b.textContent="Pick a day","";const e={day:"numeric",month:"short",year:"numeric"},o=new Date(t+"T00:00:00").toLocaleDateString("en-GB",e);b.textContent=o;const n=new Date().setHours(0,0,0,0),s=new Date(t+"T00:00:00").setHours(0,0,0,0)<n?"past-due":"";return{text:o,class:s}},C=()=>{g.value="",h("")},E=t=>{let e="";t.completed?e=`
      <button class="btn btn--checkbox is-checked" aria-label="Mark as complete" aria-pressed="true">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="2rem"
          width="2rem"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.25" 
          stroke="currentColor"
          aria-hidden="true"
        >

          <circle cx="12" cy="12" r="9" class="checkbox-bg" />
          
          <path 
            class="checkbox-mark"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M9 12.75 11.25 15 15 9.75" 
          />
        </svg>               
      </button>`:e=`
      <button class="btn btn--checkbox" aria-label="Mark as complete" aria-pressed="false">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="2rem"
          width="2rem"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.25" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      </button>`;const o=t.completed?"is-completed":"";return{checkboxIcon:e,isCompleted:o}},T=t=>{const e=a.find(o=>o.id===t);e&&(e.completed=!e.completed,i())},S=()=>{const t=document.querySelector("#new-todo-category"),e=f.value.trim();e!==""&&(k++,a.push({id:k,text:e,category:t.value,dueDate:g.value,completed:!1,cleared:!1,deleted:!1}),i(),f.value="",g.value="",h(""))},Z=t=>{const e=d.find(o=>o.id===t);if(e){const o=document.querySelector(`[data-category-id="${t}"]`),n=document.createElement("input");n.classList.add("category-edit"),n.style.width=`${o.offsetWidth}px`,n.style.height=`${o.offsetHeight}px`;const r=()=>{if(n.value.trim()===""){n.value=e.name,i();return}const s=e.name,c=n.value.trim();e.name=c,m===s&&(m=c),a.forEach(u=>{u.category===s&&(u.category=c)}),i()};n.value=e.name,o.replaceWith(n),n.focus(),n.addEventListener("blur",r,{once:!0}),n.addEventListener("keydown",s=>{s.key==="Enter"&&r()})}},$=t=>{const e=a.find(o=>o.id===t);if(e){const o=document.querySelector(`[data-id="${t}"] .todo-text`),n=document.createElement("textarea");n.classList.add("todo-edit"),n.style.width=`${o.offsetWidth}px`,n.style.height=`${o.offsetHeight}px`;const r=()=>{if(n.value.trim()===""){n.value=e.text,i();return}e.text=n.value.trim(),i()};n.value=e.text,o.replaceWith(n),n.focus(),n.addEventListener("blur",r,{once:!0}),n.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),r())})}},F=t=>{const e=a.find(o=>o.id===t);e&&(e.cleared=!0,i())},J=()=>{a.filter(e=>e.completed).forEach(e=>{e.cleared=!0}),i()},V=()=>{a.forEach(t=>{t.cleared=!0}),i()},G=t=>{const e=a.find(o=>o.id===t);e&&(e.cleared=!1,i())},R=()=>{a.filter(e=>e.cleared).forEach(e=>{e.cleared=!1}),i()},K=t=>{const e=a.find(o=>o.id===t);e&&(e.deleted=!0,a=a.filter(o=>!o.deleted),i())},z=()=>{a.filter(e=>e.cleared).forEach(e=>{e.deleted=!0}),a=a.filter(e=>!e.deleted),i()},Q=()=>{y.showModal(),document.activeElement.blur()},U=()=>{y.close()};x.addEventListener("click",()=>{const t=document.documentElement.classList.toggle("dk-theme");localStorage.setItem("theme",t?"dark":"light"),L()});M.addEventListener("click",t=>{t.preventDefault(),S()});f.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),S())});v.addEventListener("click",t=>{const e=t.target.closest(".todo-category");e&&(clearTimeout(w),w=setTimeout(()=>{const o=e.querySelector(".category-name").textContent;m===o?m="None":m=o,i(),console.log("Single click: Filtering...")},200))});v.addEventListener("dblclick",t=>{clearTimeout(w);let e=t.target.closest(".category-name")?.dataset.categoryId;e&&(e=Number(e),Z(e))});l.addEventListener("mousedown",t=>{t.detail>1&&t.target.closest(".todo-text")&&t.preventDefault()});D.addEventListener("click",()=>{g.showPicker()});g.addEventListener("change",t=>{const e=t.target.value;h(e)});g.addEventListener("blur",()=>{g.value===""&&(b.textContent="Pick a day")});window.addEventListener("load",()=>{setTimeout(()=>{C()},1)});l.addEventListener("click",t=>{let e=t.target.closest(".todo-item")?.dataset.id;e&&(e=Number(e),t.target.closest(".btn--checkbox")&&T(e),t.target.closest(".btn--clear")&&setTimeout(()=>{F(e)},10))});l.addEventListener("dblclick",t=>{let e=t.target.closest(".todo-item")?.dataset.id;e&&(e=Number(e),t.target.closest(".todo-text")&&$(e))});l.addEventListener("keydown",t=>{if(t.key==="Enter"){t.preventDefault();let e=t.target.closest(".todo-item")?.dataset.id;e&&t.target.classList.contains("todo-text")&&(e=Number(e),$(e))}});l.addEventListener("click",t=>{l.classList.contains("todo-list-empty")&&f.focus()});I.addEventListener("click",t=>{t.target.closest(".btn--clear-all")&&V(),t.target.closest(".btn--clear-completed-todos")&&J()});H.addEventListener("click",t=>{t.stopPropagation();let e=t.target.closest(".todo-item--bin")?.dataset.id;e&&(e=Number(e),t.target.closest(".btn--checkbox")&&T(e),t.target.closest(".btn--restore")&&G(e),t.target.closest(".btn--delete")&&K(e)),t.target.closest(".btn--restore-all")&&R(),t.target.closest(".btn--delete-all")&&z()});q.addEventListener("click",t=>{t.target.closest(".btn--bin")&&Q()});y.addEventListener("click",t=>{t.target.closest(".bin-wrapper")||U()});document.addEventListener("click",t=>{console.log("Clicking on",t.target)});i();
