const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-links');
function closeMenu(){nav?.classList.remove('open');if(menu){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','打开菜单');menu.textContent='☰'}}
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'关闭菜单':'打开菜单');menu.textContent=open?'×':'☰'});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
