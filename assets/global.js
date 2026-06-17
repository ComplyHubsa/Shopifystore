/* ============ Sleeq theme — global.js ============ */
(function () {
  'use strict';

  function money(cents) {
    var value = (cents / 100).toFixed(2);
    var fmt = window.moneyFormat || '{{amount}}';
    return fmt.replace(/\{\{\s*amount\s*\}\}/, value);
  }

  /* ---- Mobile nav ---- */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-nav-toggle]');
    if (toggle) {
      var nav = document.getElementById('SiteNav');
      if (nav) nav.classList.toggle('is-open');
    }
  });

  /* ---- Product gallery thumbnails ---- */
  document.addEventListener('click', function (e) {
    var thumb = e.target.closest('[data-thumb]');
    if (!thumb) return;
    var main = document.querySelector('[data-main-image]');
    if (main) {
      main.src = thumb.dataset.full;
      main.srcset = '';
    }
    document.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.remove('is-active'); });
    thumb.classList.add('is-active');
  });

  /* ---- Quantity steppers ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-qty]');
    if (!btn) return;
    var wrap = btn.closest('.qty');
    var input = wrap.querySelector('input');
    var val = parseInt(input.value, 10) || 1;
    val += btn.dataset.qty === 'up' ? 1 : -1;
    if (val < 1) val = 1;
    input.value = val;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---- Variant selection -> update price & hidden id ---- */
  function initVariants(root) {
    var form = root.querySelector('[data-product-form]');
    if (!form) return;
    var data = root.querySelector('[data-variant-data]');
    if (!data) return;
    var variants = JSON.parse(data.textContent);
    var idInput = form.querySelector('[name="id"]');
    var priceEl = root.querySelector('[data-price-current]');
    var compareEl = root.querySelector('[data-price-compare]');
    var addBtn = form.querySelector('[data-add-btn]');

    function selected() {
      var pills = form.querySelectorAll('input[data-option]:checked');
      var chosen = [];
      pills.forEach(function (p) { chosen[parseInt(p.dataset.optionIndex, 10)] = p.value; });
      return variants.find(function (v) {
        return v.options.every(function (opt, i) { return chosen[i] === undefined || opt === chosen[i]; });
      });
    }

    function update() {
      var v = selected();
      if (!v) return;
      idInput.value = v.id;
      if (priceEl) priceEl.textContent = money(v.price);
      if (compareEl) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          compareEl.textContent = money(v.compare_at_price);
          compareEl.style.display = '';
        } else {
          compareEl.style.display = 'none';
        }
      }
      if (addBtn) {
        addBtn.disabled = !v.available;
        addBtn.textContent = v.available ? addBtn.dataset.add : addBtn.dataset.soldout;
      }
    }

    form.querySelectorAll('input[data-option]').forEach(function (el) {
      el.addEventListener('change', update);
    });
    update();
  }

  /* ---- AJAX add to cart ---- */
  function initAddToCart(root) {
    var form = root.querySelector('[data-product-form]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[data-add-btn]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Adding…';
      fetch(window.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          id: form.querySelector('[name="id"]').value,
          quantity: parseInt(form.querySelector('[name="quantity"]') ? form.querySelector('[name="quantity"]').value : 1, 10)
        })
      })
        .then(function (r) { return r.json(); })
        .then(function () { return fetch(window.routes.cart_url + '.js').then(function (r) { return r.json(); }); })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          btn.textContent = '✓ Added';
          setTimeout(function () { window.location.href = window.routes.cart_url; }, 500);
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  document.querySelectorAll('[data-product-root]').forEach(function (root) {
    initVariants(root);
    initAddToCart(root);
  });
})();
