const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-links');
function closeMenu(){nav?.classList.remove('open');if(menu){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','打开菜单');menu.textContent='☰'}}
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'关闭菜单':'打开菜单');menu.textContent=open?'×':'☰'});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();if(document.activeElement?.closest('.site-links'))menu?.focus()}});
const toc=document.querySelector('.toc-disclosure');
if(toc){
 const compact=matchMedia('(max-width:900px)');
 const adapt=()=>{toc.open=!compact.matches};adapt();compact.addEventListener('change',adapt);
 const links=[...toc.querySelectorAll('a')];
 links.forEach(link=>link.addEventListener('click',event=>{const target=document.querySelector(link.hash);if(target){event.preventDefault();if(compact.matches)toc.open=false;history.replaceState(null,'',link.hash);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'})}}));
 const sections=links.map(link=>({link,node:document.querySelector(link.hash)})).filter(x=>x.node);
 let pending=false;
 function active(){let current=sections[0];for(const s of sections){if(s.node.getBoundingClientRect().top<190)current=s}links.forEach(link=>{if(link===current?.link)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{active();pending=false})}},{passive:true});active();
}
