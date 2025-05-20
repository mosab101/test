document.addEventListener('DOMContentLoaded', function() {
    // القائمة المتنقلة
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // تغيير لون الشريط عند التمرير
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // تصفية القائمة حسب الفئة
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // إزالة التنشيط من جميع الأزرار
            tabBtns.forEach(btn => btn.classList.remove('active'));
            // إضافة التنشيط للزر المحدد
            this.classList.add('active');
            
            // تصفية العناصر
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // التمرير إلى القسم المحدد
            if (category !== 'all') {
                const section = document.getElementById(category);
                if (section) {
                    window.scrollTo({
                        top: section.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // سلة التسوق
    const cartBtn = document.querySelector('.cart-btn');
    const closeCart = document.querySelector('.close-cart');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-price');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = [];
    
    // فتح/إغلاق سلة التسوق
    cartBtn.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    // إضافة عنصر إلى السلة
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = menuItem.dataset.category + '-' + Math.floor(Math.random() * 1000);
            const itemTitle = menuItem.querySelector('h3').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.item-price').textContent);
            const itemImg = menuItem.querySelector('img').src;
            
            // التحقق إذا كان العنصر موجودًا بالفعل في السلة
            const existingItem = cart.find(item => item.title === itemTitle);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: itemId,
                    title: itemTitle,
                    price: itemPrice,
                    img: itemImg,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // تأثير عند الإضافة
            this.textContent = 'تمت الإضافة!';
            this.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.textContent = 'إضافة إلى السلة';
                this.style.backgroundColor = 'var(--primary-color)';
            }, 1000);
        });
    });
    
    // تحديث سلة التسوق
    function updateCart() {
        renderCartItems();
        updateCartTotal();
        updateCartCount();
    }
    
    // عرض عناصر السلة
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center;">سلة التسوق فارغة</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="cart-item-price">${item.price * item.quantity} ر.س</p>
                    <div class="cart-item-actions">
                        <button class="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase">+</button>
                        <button class="remove-item"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // إضافة أحداث للأزرار
            const increaseBtn = cartItemElement.querySelector('.increase');
            const decreaseBtn = cartItemElement.querySelector('.decrease');
            const removeBtn = cartItemElement.querySelector('.remove-item');
            
            increaseBtn.addEventListener('click', () => {
                item.quantity += 1;
                updateCart();
            });
            
            decreaseBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    updateCart();
                }
            });
            
            removeBtn.addEventListener('click', () => {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                updateCart();
            });
        });
    }
    
    // تحديث المجموع الكلي
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total + ' ر.س';
    }
    
    // تحديث عداد السلة
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    }
    
    // إتمام الطلب
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('سلة التسوق فارغة!');
            return;
        }
        
        // هنا يمكنك إضافة كود إتمام الطلب
        alert('تم إرسال طلبك بنجاح! شكراً لاختيارك مطعمنا.');
        cart = [];
        updateCart();
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    // تأثيرات الحركة عند التمرير
    const fadeElements = document.querySelectorAll('.menu-section');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    }
    
    window.addEventListener('scroll', checkFade);
    window.addEventListener('load', checkFade);
});