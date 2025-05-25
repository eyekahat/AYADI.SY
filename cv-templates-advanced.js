// نظام القوالب المتقدم للسيرة الذاتية
class AdvancedCVTemplates {
    constructor() {
        this.currentTemplate = 'classic';
        this.templates = {
            classic: {
                name: 'القالب الكلاسيكي',
                colors: {
                    primary: '#00a86b',
                    secondary: '#ffffff',
                    text: '#333333',
                    accent: '#f8f9fa'
                },
                layout: 'single-column',
                headerStyle: 'centered',
                sectionStyle: 'cards'
            },
            modern: {
                name: 'القالب العصري',
                colors: {
                    primary: '#2c3e50',
                    secondary: '#ecf0f1',
                    text: '#2c3e50',
                    accent: '#3498db'
                },
                layout: 'two-column',
                headerStyle: 'left-aligned',
                sectionStyle: 'minimal'
            },
            creative: {
                name: 'القالب الإبداعي',
                colors: {
                    primary: '#e74c3c',
                    secondary: '#ffffff',
                    text: '#2c3e50',
                    accent: '#f39c12'
                },
                layout: 'asymmetric',
                headerStyle: 'creative',
                sectionStyle: 'artistic'
            },
            professional: {
                name: 'القالب المهني',
                colors: {
                    primary: '#34495e',
                    secondary: '#ffffff',
                    text: '#2c3e50',
                    accent: '#95a5a6'
                },
                layout: 'traditional',
                headerStyle: 'formal',
                sectionStyle: 'structured'
            },
            elegant: {
                name: 'القالب الأنيق',
                colors: {
                    primary: '#8e44ad',
                    secondary: '#ffffff',
                    text: '#2c3e50',
                    accent: '#e8daef'
                },
                layout: 'elegant',
                headerStyle: 'sophisticated',
                sectionStyle: 'refined'
            }
        };
        
        this.colorPalettes = {
            green: { primary: '#00a86b', accent: '#e8f5e8' },
            blue: { primary: '#3498db', accent: '#e3f2fd' },
            red: { primary: '#e74c3c', accent: '#ffebee' },
            purple: { primary: '#8e44ad', accent: '#f3e5f5' },
            orange: { primary: '#f39c12', accent: '#fff3e0' },
            teal: { primary: '#1abc9c', accent: '#e0f2f1' },
            indigo: { primary: '#3f51b5', accent: '#e8eaf6' },
            pink: { primary: '#e91e63', accent: '#fce4ec' }
        };
    }

    // تهيئة نظام القوالب
    initializeTemplateSystem() {
        this.loadSavedTemplate();
        this.createTemplateSelector();
        this.applyTemplate(this.currentTemplate);
    }

    // تحميل القالب المحفوظ
    loadSavedTemplate() {
        const saved = localStorage.getItem('cv-template');
        if (saved) {
            this.currentTemplate = saved;
        }
    }

    // حفظ القالب المختار
    saveTemplate(templateName) {
        localStorage.setItem('cv-template', templateName);
        this.currentTemplate = templateName;
    }

    // إنشاء واجهة اختيار القوالب
    createTemplateSelector() {
        // إنشاء زر القوالب
        const templateBtn = document.createElement('button');
        templateBtn.innerHTML = '<i class="fas fa-palette"></i>';
        templateBtn.className = 'template-btn';
        templateBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(45deg, #00a86b, #3498db);
            color: white;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        // إضافة الزر للصفحة
        document.body.appendChild(templateBtn);

        // إنشاء واجهة القوالب
        templateBtn.addEventListener('click', () => {
            this.showTemplateSelector();
        });
    }

    // عرض واجهة اختيار القوالب
    showTemplateSelector() {
        // إزالة أي واجهة سابقة
        const existingModal = document.getElementById('template-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // إنشاء النافذة المنبثقة
        const modal = document.createElement('div');
        modal.id = 'template-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // إنشاء محتوى النافذة
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2c3e50; margin: 0; font-size: 28px;">اختر قالب السيرة الذاتية</h2>
                <p style="color: #7f8c8d; margin: 10px 0 0 0;">اختر التصميم الذي يناسب شخصيتك المهنية</p>
            </div>
            
            <div id="template-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                ${this.generateTemplateCards()}
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px; text-align: center;">اختر لوحة الألوان</h3>
                <div id="color-palette" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    ${this.generateColorPalette()}
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button id="close-template-modal" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                ">إغلاق</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // إضافة الأحداث
        this.addTemplateEvents(modal);
    }

    // إنشاء بطاقات القوالب
    generateTemplateCards() {
        return Object.keys(this.templates).map(key => {
            const template = this.templates[key];
            const isActive = key === this.currentTemplate;
            
            return `
                <div class="template-card" data-template="${key}" style="
                    border: 3px solid ${isActive ? template.colors.primary : '#ddd'};
                    border-radius: 15px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: ${template.colors.secondary};
                    position: relative;
                    overflow: hidden;
                ">
                    ${isActive ? '<div style="position: absolute; top: 10px; right: 10px; color: ' + template.colors.primary + '; font-size: 20px;"><i class="fas fa-check-circle"></i></div>' : ''}
                    
                    <div style="
                        width: 100%;
                        height: 80px;
                        background: linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent});
                        border-radius: 10px;
                        margin-bottom: 15px;
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            color: white;
                            font-weight: bold;
                        ">${template.name}</div>
                    </div>
                    
                    <div style="text-align: center; color: ${template.colors.text};">
                        <div style="font-weight: bold; margin-bottom: 5px;">${template.name}</div>
                        <div style="font-size: 12px; color: #666;">${this.getLayoutDescription(template.layout)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // إنشاء لوحة الألوان
    generateColorPalette() {
        return Object.keys(this.colorPalettes).map(key => {
            const palette = this.colorPalettes[key];
            
            return `
                <div class="color-option" data-color="${key}" style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${palette.primary};
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                " title="${this.getColorName(key)}"></div>
            `;
        }).join('');
    }

    // الحصول على وصف التخطيط
    getLayoutDescription(layout) {
        const descriptions = {
            'single-column': 'عمود واحد',
            'two-column': 'عمودين',
            'asymmetric': 'غير متماثل',
            'traditional': 'تقليدي',
            'elegant': 'أنيق'
        };
        return descriptions[layout] || layout;
    }

    // الحصول على اسم اللون
    getColorName(color) {
        const names = {
            green: 'أخضر',
            blue: 'أزرق',
            red: 'أحمر',
            purple: 'بنفسجي',
            orange: 'برتقالي',
            teal: 'أزرق مخضر',
            indigo: 'نيلي',
            pink: 'وردي'
        };
        return names[color] || color;
    }

    // إضافة أحداث القوالب
    addTemplateEvents(modal) {
        // أحداث بطاقات القوالب
        const templateCards = modal.querySelectorAll('.template-card');
        templateCards.forEach(card => {
            card.addEventListener('click', () => {
                const templateName = card.getAttribute('data-template');
                this.applyTemplate(templateName);
                this.saveTemplate(templateName);
                
                // تحديث الواجهة
                templateCards.forEach(c => c.style.border = '3px solid #ddd');
                card.style.border = `3px solid ${this.templates[templateName].colors.primary}`;
                
                // إظهار رسالة نجاح
                this.showSuccessMessage(`تم تطبيق ${this.templates[templateName].name} بنجاح!`);
            });
        });

        // أحداث لوحة الألوان
        const colorOptions = modal.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const colorName = option.getAttribute('data-color');
                this.applyColorPalette(colorName);
                
                // إظهار رسالة نجاح
                this.showSuccessMessage(`تم تطبيق لوحة الألوان ${this.getColorName(colorName)} بنجاح!`);
            });
        });

        // إغلاق النافذة
        const closeBtn = modal.querySelector('#close-template-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // إغلاق عند النقر خارج النافذة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // تطبيق القالب
    applyTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;

        // تطبيق الألوان
        this.applyColors(template.colors);
        
        // تطبيق التخطيط
        this.applyLayout(template.layout);
        
        // تطبيق أنماط الأقسام
        this.applySectionStyles(template.sectionStyle);
        
        this.currentTemplate = templateName;
    }

    // تطبيق الألوان
    applyColors(colors) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--secondary-color', colors.secondary);
        root.style.setProperty('--text-color', colors.text);
        root.style.setProperty('--accent-color', colors.accent);

        // تطبيق الألوان على العناصر المختلفة
        const header = document.querySelector('.hero-section');
        if (header) {
            header.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`;
        }

        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.backgroundColor = colors.secondary;
            section.style.color = colors.text;
        });
    }

    // تطبيق لوحة الألوان
    applyColorPalette(colorName) {
        const palette = this.colorPalettes[colorName];
        if (!palette) return;

        const currentTemplate = this.templates[this.currentTemplate];
        currentTemplate.colors.primary = palette.primary;
        currentTemplate.colors.accent = palette.accent;

        this.applyColors(currentTemplate.colors);
    }

    // تطبيق التخطيط
    applyLayout(layout) {
        const container = document.querySelector('.cv-container');
        if (!container) return;

        // إزالة فئات التخطيط السابقة
        container.classList.remove('single-column', 'two-column', 'asymmetric', 'traditional', 'elegant');
        
        // إضافة فئة التخطيط الجديدة
        container.classList.add(layout);
    }

    // تطبيق أنماط الأقسام
    applySectionStyles(style) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('cards', 'minimal', 'artistic', 'structured', 'refined');
            section.classList.add(style);
        });
    }

    // إظهار رسالة نجاح
    showSuccessMessage(message) {
        // إزالة أي رسالة سابقة
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // إنشاء رسالة جديدة
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            font-weight: bold;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        // إزالة الرسالة بعد 3 ثوان
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// إنشاء مثيل عام
window.AdvancedCVTemplates = new AdvancedCVTemplates();