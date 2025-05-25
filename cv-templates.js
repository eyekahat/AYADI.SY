/**
 * نظام قوالب السيرة الذاتية
 * يوفر 5 قوالب مختلفة مع إمكانية تخصيص الألوان
 */

// قوالب الألوان المختلفة
const CV_TEMPLATES = {
    template1: {
        name: 'القالب الكلاسيكي',
        icon: 'fas fa-briefcase',
        colors: {
            primary: '#00a86b',
            secondary: '#f0f9f4',
            accent: '#008c5a',
            text: '#2c3e50'
        }
    },
    template2: {
        name: 'القالب الأزرق',
        icon: 'fas fa-user-tie',
        colors: {
            primary: '#3498db',
            secondary: '#ebf3fd',
            accent: '#2980b9',
            text: '#2c3e50'
        }
    },
    template3: {
        name: 'القالب الأرجواني',
        icon: 'fas fa-graduation-cap',
        colors: {
            primary: '#9b59b6',
            secondary: '#f4ecf7',
            accent: '#8e44ad',
            text: '#2c3e50'
        }
    },
    template4: {
        name: 'القالب البرتقالي',
        icon: 'fas fa-rocket',
        colors: {
            primary: '#e67e22',
            secondary: '#fdf2e9',
            accent: '#d35400',
            text: '#2c3e50'
        }
    },
    template5: {
        name: 'القالب الأحمر',
        icon: 'fas fa-heart',
        colors: {
            primary: '#e74c3c',
            secondary: '#fdedec',
            accent: '#c0392b',
            text: '#2c3e50'
        }
    }
};

// تطبيق قالب معين
function applyTemplate(templateId) {
    const template = CV_TEMPLATES[templateId];
    if (!template) return;
    
    const root = document.documentElement;
    
    // تطبيق الألوان
    root.style.setProperty('--primary-color', template.colors.primary);
    root.style.setProperty('--primary-light', hexToRgba(template.colors.primary, 0.1));
    root.style.setProperty('--text-color', template.colors.text);
    
    // تحديث لون الخلفية
    document.body.style.background = `linear-gradient(135deg, ${template.colors.secondary} 0%, ${hexToRgba(template.colors.primary, 0.1)} 100%)`;
    
    // حفظ القالب المختار
    localStorage.setItem('selectedTemplate', templateId);
    
    // تحديث واجهة اختيار القوالب
    updateTemplateSelector(templateId);
    
    // إظهار رسالة نجاح
    showTemplateChangeMessage(`تم تطبيق ${template.name} بنجاح!`);
}

// تحويل hex إلى rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// إنشاء واجهة اختيار القوالب
function createTemplateSelector() {
    // إزالة أي واجهة موجودة
    const existingSelector = document.querySelector('.template-selector');
    if (existingSelector) {
        existingSelector.remove();
    }
    
    const templateSelector = document.createElement('div');
    templateSelector.className = 'template-selector';
    templateSelector.style.cssText = `
        position: fixed;
        top: 70px;
        left: 20px;
        background: white;
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        min-width: 250px;
        font-family: 'Cairo', sans-serif;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'اختر قالب السيرة الذاتية';
    title.style.cssText = `
        margin: 0 0 15px 0;
        color: var(--primary-color);
        text-align: center;
        font-size: 16px;
    `;
    templateSelector.appendChild(title);
    
    const templatesGrid = document.createElement('div');
    templatesGrid.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 15px;
    `;
    
    // إنشاء بطاقات القوالب
    Object.keys(CV_TEMPLATES).forEach(templateId => {
        const template = CV_TEMPLATES[templateId];
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card';
        templateCard.style.cssText = `
            background: ${template.colors.secondary};
            border: 2px solid ${template.colors.primary};
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        `;
        
        templateCard.innerHTML = `
            <i class="${template.icon}" style="font-size: 24px; color: ${template.colors.primary}; margin-bottom: 8px;"></i>
            <div style="font-size: 12px; color: ${template.colors.text}; font-weight: 600;">${template.name}</div>
            <div style="width: 100%; height: 4px; background: ${template.colors.primary}; border-radius: 2px; margin-top: 8px;"></div>
        `;
        
        // تأثيرات التفاعل
        templateCard.addEventListener('mouseenter', () => {
            templateCard.style.transform = 'translateY(-3px)';
            templateCard.style.boxShadow = `0 8px 25px ${hexToRgba(template.colors.primary, 0.3)}`;
        });
        
        templateCard.addEventListener('mouseleave', () => {
            templateCard.style.transform = 'translateY(0)';
            templateCard.style.boxShadow = 'none';
        });
        
        templateCard.addEventListener('click', () => {
            applyTemplate(templateId);
        });
        
        templatesGrid.appendChild(templateCard);
    });
    
    templateSelector.appendChild(templatesGrid);
    
    // زر الإغلاق
    const closeButton = document.createElement('button');
    closeButton.textContent = 'إغلاق';
    closeButton.style.cssText = `
        width: 100%;
        padding: 10px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s ease;
    `;
    
    closeButton.addEventListener('click', () => {
        templateSelector.remove();
    });
    
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = 'var(--primary-color)';
        closeButton.style.opacity = '0.8';
    });
    
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.opacity = '1';
    });
    
    templateSelector.appendChild(closeButton);
    
    document.body.appendChild(templateSelector);
    
    // إغلاق عند النقر خارج الواجهة
    document.addEventListener('click', function closeTemplateSelector(e) {
        if (!templateSelector.contains(e.target) && !e.target.classList.contains('template-selector-btn')) {
            templateSelector.remove();
            document.removeEventListener('click', closeTemplateSelector);
        }
    });
}

// تحديث واجهة اختيار القوالب
function updateTemplateSelector(selectedTemplateId) {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach((card, index) => {
        const templateId = Object.keys(CV_TEMPLATES)[index];
        if (templateId === selectedTemplateId) {
            card.style.borderWidth = '3px';
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.borderWidth = '2px';
            card.style.transform = 'scale(1)';
        }
    });
}

// إظهار رسالة تغيير القالب
function showTemplateChangeMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 2000);
}

// إضافة الأنيميشن للرسائل
function addTemplateAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .template-card:hover {
            transform: translateY(-3px) !important;
        }
        
        .template-selector {
            animation: fadeInScale 0.3s ease;
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// تحميل القالب المحفوظ عند بدء التشغيل
function loadSavedTemplate() {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate && CV_TEMPLATES[savedTemplate]) {
        applyTemplate(savedTemplate);
    }
}

// إضافة زر اختيار القوالب إلى شريط التنقل
function addTemplateButton() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // البحث عن مكان مناسب لإضافة الزر
    const colorSwitcher = navbar.querySelector('.color-switcher');
    if (!colorSwitcher) return;
    
    const templateButton = document.createElement('button');
    templateButton.className = 'template-selector-btn';
    templateButton.innerHTML = '<i class="fas fa-palette"></i>';
    templateButton.title = 'اختيار قالب';
    templateButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.3s ease;
        margin-left: 10px;
    `;
    
    templateButton.addEventListener('mouseenter', () => {
        templateButton.style.background = 'var(--primary-light)';
        templateButton.style.color = 'var(--primary-color)';
    });
    
    templateButton.addEventListener('mouseleave', () => {
        templateButton.style.background = 'none';
        templateButton.style.color = 'var(--text-color)';
    });
    
    templateButton.addEventListener('click', (e) => {
        e.stopPropagation();
        createTemplateSelector();
    });
    
    // إدراج الزر قبل مبدل الألوان
    colorSwitcher.parentNode.insertBefore(templateButton, colorSwitcher);
}

// تهيئة نظام القوالب
function initializeTemplateSystem() {
    // إضافة الأنيميشن
    addTemplateAnimations();
    
    // إضافة زر القوالب
    addTemplateButton();
    
    // تحميل القالب المحفوظ
    loadSavedTemplate();
}

// تصدير الوظائف للاستخدام الخارجي
window.CVTemplates = {
    applyTemplate,
    createTemplateSelector,
    initializeTemplateSystem,
    templates: CV_TEMPLATES
};