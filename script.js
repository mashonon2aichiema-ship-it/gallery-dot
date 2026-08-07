const qs=(s,c=document)=>c.querySelector(s);const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const heroSlides = qsa(".hero__slide");
let currentHeroSlide = 0;

if (heroSlides.length > 1) {
  window.setInterval(() => {
    heroSlides[currentHeroSlide].classList.remove("is-active");

    currentHeroSlide =
      (currentHeroSlide + 1) % heroSlides.length;

    heroSlides[currentHeroSlide].classList.add("is-active");
  }, 5000);
}
const menuBtn=qs('.menu-btn'),drawer=qs('.drawer');
function closeMenu(){menuBtn.classList.remove('is-open');menuBtn.setAttribute('aria-expanded','false');drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');document.body.style.overflow=''}
menuBtn.addEventListener('click',()=>{const open=!drawer.classList.contains('is-open');drawer.classList.toggle('is-open',open);menuBtn.classList.toggle('is-open',open);menuBtn.setAttribute('aria-expanded',String(open));drawer.setAttribute('aria-hidden',String(!open));document.body.style.overflow=open?'hidden':''});
qsa('.drawer a').forEach(a=>a.addEventListener('click',closeMenu));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -35px'});qsa('.reveal,.image-reveal').forEach(el=>observer.observe(el));
const counterObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;qsa('[data-count]',e.target).forEach(node=>{const end=Number(node.dataset.count);let start=0;const t0=performance.now();function tick(t){const p=Math.min((t-t0)/900,1);node.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)});counterObs.unobserve(e.target)}),{threshold:.5});const inv=qs('.inventory');if(inv)counterObs.observe(inv);
const modal=qs('.modal');qsa('.work-card').forEach(card=>card.addEventListener('click',()=>{qs('img',modal).src=card.dataset.image;qs('img',modal).alt=card.dataset.title;qs('p',modal).textContent=card.dataset.title;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}));function closeModal(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}qs('.modal__close').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
const toast=qs('.toast');let toastTimer;function showToast(text){toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}qsa('[data-toast]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showToast(el.dataset.toast)}));
const form = qs(".reserve-form");
const success = qs(".form-success");

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwVQTlOQQOvnFn9PgTd-qct7BqMHkmkc_AaHGcbOR_RpEY5xwar5nIV2JJ53Sc-MTPJJA/exec";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // 前回のエラー表示を削除
  qsa(".field-error", form).forEach((error) => error.remove());
  qsa(".error", form).forEach((field) =>
    field.classList.remove("error")
  );

  let valid = true;

  // 必須項目のチェック
  qsa("[required]", form).forEach((field) => {
    const isInvalid =
      field.type === "checkbox"
        ? !field.checked
        : !field.value.trim();

    if (isInvalid) {
      valid = false;
      field.classList.add("error");

      const message = document.createElement("span");
      message.className = "field-error";
      message.textContent = "この項目を入力してください";
      field.closest("label").append(message);
    }
  });

  // メールアドレスの形式チェック
  const email = qs('[name="email"]', form);

  if (
    email.value &&
    !/^\S+@\S+\.\S+$/.test(email.value)
  ) {
    valid = false;
    email.classList.add("error");

    const message = document.createElement("span");
    message.className = "field-error";
    message.textContent =
      "正しいメールアドレスを入力してください";
    email.closest("label").append(message);
  }

  if (!valid) {
    showToast("入力内容をご確認ください");
    return;
  }

  const submitButton = qs(
    'button[type="submit"]',
    form
  );

  const originalButtonHTML = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.textContent = "送信中…";

  const formData = new FormData(form);

  const sendData = {
    name: formData.get("name") || "",
    email: formData.get("email") || "",
    tel: formData.get("tel") || "",
    date: formData.get("date") || "",
    time: formData.get("time") || "",
    guests: formData.get("guests") || "0",
    line: formData.get("line")
      ? "同意する"
      : "同意しない",
    terms: formData.get("terms")
      ? "同意する"
      : "同意しない"
  };

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(sendData)
    });

    form.reset();

    success.classList.add("is-open");
    success.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

  } catch (error) {
    console.error(error);
    showToast(
      "送信できませんでした。もう一度お試しください"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonHTML;
  }
});

qs(".form-success button").addEventListener(
  "click",
  () => {
    success.classList.remove("is-open");
    success.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
);
window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeModal();success.classList.remove('is-open');success.setAttribute('aria-hidden','true');document.body.style.overflow=''}});
 (() => {
      const track = document.querySelector('.concept-gallery__track');
      if (!track) return;

      let isDown = false;
      let startX = 0;
      let startScrollLeft = 0;

      track.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') return;
        isDown = true;
        startX = event.clientX;
        startScrollLeft = track.scrollLeft;
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
      });

      track.addEventListener('pointermove', (event) => {
        if (!isDown) return;
        track.scrollLeft = startScrollLeft - (event.clientX - startX);
      });

      const stopDrag = (event) => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
        if (event.pointerId !== undefined && track.hasPointerCapture(event.pointerId)) {
          track.releasePointerCapture(event.pointerId);
        }
      };

      track.addEventListener('pointerup', stopDrag);
      track.addEventListener('pointercancel', stopDrag);
      track.addEventListener('pointerleave', stopDrag);
    })();

    const openWorkModal = (card) => {
  qs("img", modal).src = card.dataset.image;
  qs("img", modal).alt = card.dataset.title;
  qs("p", modal).textContent = card.dataset.title;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

qsa(".work-card").forEach((card) => {
  card.addEventListener("click", () => openWorkModal(card));

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWorkModal(card);
    }
  });
});