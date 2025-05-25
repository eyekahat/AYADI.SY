// نظام تصدير PDF محسن مع إصلاح مشاكل الصور واللغة
class EnhancedPDFExporter {
    constructor() {
        this.isProcessing = false;
        this.translations = {
            // ترجمات المحتوى
            'أحمد الإبراهيم': 'Ahmed Al-Ibrahim',
            'محاسب | خبير في الذكاء الاصطناعي وإدارة البيانات': 'Accountant | AI Expert & Data Management Specialist',
            'سوريا – حلب': 'Syria - Aleppo',
            'متزوج': 'Married',
            'الصفحة الرئيسية': 'Home',
            'الوظائف': 'Jobs',
            'بدء': 'Start',
            'الدعم': 'Support',
            'تحميل السيرة': 'Download CV',
            'تسجيل الخروج': 'Logout',
            'الملف الشخصي': 'Profile',
            'بيدة شخصية': 'Personal Profile',
            'الوظائف': 'Experience',
            'التعليم': 'Education',
            'المهارات': 'Skills',
            'اللغات': 'Languages',
            'العربية': 'Arabic',
            'التركية': 'Turkish',
            'ممتاز': 'Excellent',
            'جيد': 'Good',
            'مبتدئ': 'Beginner',
            'متوسط': 'Intermediate',
            'متقدم': 'Advanced'
        };
    }

    // تحويل الصورة إلى base64 مع معالجة القطع الدائري
    async processImage(imgElement) {
        return new Promise((resolve) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // تحديد حجم الصورة
                const size = 200;
                canvas.width = size;
                canvas.height = size;
                
                // إنشاء قطع دائري
                ctx.beginPath();
                ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                
                // رسم الصورة
                ctx.drawImage(imgElement, 0, 0, size, size);
                
                // تحويل إلى base64
                const dataURL = canvas.toDataURL('image/png', 1.0);
                resolve(dataURL);
            } catch (error) {
                console.error('خطأ في معالجة الصورة:', error);
                resolve(null);
            }
        });
    }

    // ترجمة النص
    translateText(text, toLang = 'en') {
        if (toLang === 'ar') return text;
        
        // ترجمة النصوص المعروفة
        for (const [arabic, english] of Object.entries(this.translations)) {
            text = text.replace(new RegExp(arabic, 'g'), english);
        }
        
        return text;
    }

    // تصدير PDF محسن - صفحة واحدة عربي
    async exportSinglePageArabic() {
        await this.exportToPDF('ar', 'single');
    }

    // تصدير PDF محسن - صفحة واحدة إنجليزي
    async exportSinglePageEnglish() {
        await this.exportToPDF('en', 'single');
    }

    // تصدير PDF محسن - صفحات متعددة عربي
    async exportMultiPageArabic() {
        await this.exportToPDF('ar', 'multi');
    }

    // تصدير PDF محسن - صفحات متعددة إنجليزي
    async exportMultiPageEnglish() {
        await this.exportToPDF('en', 'multi');
    }

    // تصدير PDF الأساسي
    async exportToPDF(language = 'ar', pageType = 'single') {
        if (this.isProcessing) {
            alert('جاري معالجة طلب سابق، يرجى الانتظار...');
            return;
        }

        this.isProcessing = true;
        
        try {
            this.showLoadingMessage('جاري إنشاء ملف PDF...');

            // الحصول على المحتوى
            const element = document.querySelector('.cv-container');
            if (!element) {
                throw new Error('لم يتم العثور على محتوى السيرة الذاتية');
            }

            // إنشاء نسخة للمعالجة
            const clonedElement = element.cloneNode(true);
            
            // معالجة الصور
            await this.processImagesInElement(clonedElement);
            
            // ترجمة المحتوى إذا لزم الأمر
            if (language === 'en') {
                this.translateElement(clonedElement);
            }

            // إنشاء حاوي مؤقت
            const tempContainer = document.createElement('div');
            tempContainer.style.cssText = `
                position: absolute;
                top: -9999px;
                left: -9999px;
                width: 210mm;
                background: white;
                font-family: 'Cairo', sans-serif;
                direction: ${language === 'ar' ? 'rtl' : 'ltr'};
            `;
            
            // إضافة الأنماط المناسبة
            this.addPrintStyles(tempContainer, pageType);
            tempContainer.appendChild(clonedElement);
            document.body.appendChild(tempContainer);

            // تحويل إلى PDF
            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: tempContainer.scrollWidth,
                height: tempContainer.scrollHeight
            });

            // إنشاء PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // تنظيف
            document.body.removeChild(tempContainer);

            // تحميل الملف
            const fileName = `Ahmed_CV_${language}_${pageType}_${Date.now()}.pdf`;
            pdf.save(fileName);

            this.hideLoadingMessage();
            this.showSuccessMessage('تم تحميل السيرة الذاتية بنجاح!');

        } catch (error) {
            console.error('خطأ في تصدير PDF:', error);
            this.hideLoadingMessage();
            this.showErrorMessage('حدث خطأ أثناء إنشاء ملف PDF');
        } finally {
            this.isProcessing = false;
        }
    }

    // معالجة الصور في العنصر
    async processImagesInElement(element) {
        const images = element.querySelectorAll('img');
        for (const img of images) {
            try {
                const originalImg = document.querySelector(`img[src="${img.src}"]`);
                if (originalImg && originalImg.complete) {
                    const processedImage = await this.processImage(originalImg);
                    if (processedImage) {
                        img.src = processedImage;
                    }
                }
            } catch (error) {
                console.error('خطأ في معالجة الصورة:', error);
            }
        }
    }

    // ترجمة العنصر
    translateElement(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.trim()) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const originalText = textNode.nodeValue;
            const translatedText = this.translateText(originalText, 'en');
            textNode.nodeValue = translatedText;
        });
    }

    // إضافة أنماط الطباعة
    addPrintStyles(container, pageType) {
        const style = document.createElement('style');
        
        let css = `
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            
            body, .cv-container {
                font-family: 'Cairo', sans-serif !important;
                background: white !important;
                color: #333 !important;
            }
            
            .template-btn, .download-btn, .logout-btn, nav, .navigation, button {
                display: none !important;
            }
            
            .hero-section {
                padding: 20px !important;
                margin-bottom: 15px !important;
            }
            
            .content-section {
                margin-bottom: 15px !important;
                padding: 15px !important;
                page-break-inside: avoid;
            }
            
            .section-title {
                margin-bottom: 10px !important;
                font-size: 18px !important;
                font-weight: bold !important;
            }
            
            .progress-bar {
                height: 8px !important;
                margin-top: 5px !important;
            }
            
            p, div {
                line-height: 1.4 !important;
                margin-bottom: 8px !important;
            }
        `;

        if (pageType === 'single') {
            css += `
                .hero-section {
                    padding: 15px !important;
                }
                .content-section {
                    padding: 10px !important;
                    margin-bottom: 10px !important;
                }
                body {
                    font-size: 12px !important;
                }
            `;
        }

        style.textContent = css;
        container.appendChild(style);
    }

    // تصدير كصورة
    async exportAsImage() {
        if (this.isProcessing) {
            alert('جاري معالجة طلب سابق، يرجى الانتظار...');
            return;
        }

        this.isProcessing = true;

        try {
            this.showLoadingMessage('جاري إنشاء صورة السيرة الذاتية...');

            const element = document.querySelector('.cv-container');
            if (!element) {
                throw new Error('لم يتم العثور على محتوى السيرة الذاتية');
            }
            
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Ahmed_CV_Image_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.hideLoadingMessage();
                this.showSuccessMessage('تم تحميل صورة السيرة الذاتية بنجاح!');
            }, 'image/png', 1.0);

        } catch (error) {
            console.error('خطأ في تصدير الصورة:', error);
            this.hideLoadingMessage();
            this.showErrorMessage('حدث خطأ أثناء إنشاء الصورة');
        } finally {
            this.isProcessing = false;
        }
    }

    // إظهار رسالة التحميل
    showLoadingMessage(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'pdf-loading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            z-index: 9999;
            font-size: 16px;
            text-align: center;
        `;
        loadingDiv.innerHTML = `
            <div style="margin-bottom: 10px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i>
            </div>
            <div>${message}</div>
        `;
        document.body.appendChild(loadingDiv);
    }

    // إخفاء رسالة التحميل
    hideLoadingMessage() {
        const loadingDiv = document.getElementById('pdf-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // إظهار رسالة نجاح
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    // إظهار رسالة خطأ
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// إنشاء مثيل عام
window.EnhancedPDFExporter = new EnhancedPDFExporter();