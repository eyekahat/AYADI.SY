// وظيفة تصدير السيرة الذاتية كملف HTML
function exportAsHTML() {
    // إظهار رسالة للمستخدم
    const message = document.createElement('div');
    message.className = 'download-message';
    message.textContent = 'جاري تحميل السيرة الذاتية كملف HTML...';
    document.body.appendChild(message);
    
    try {
        // إخفاء عناصر واجهة المستخدم للتصدير النظيف
        const elementsToHide = document.querySelectorAll('.navbar, .density-controls, .export-buttons, .color-switcher, .menu-toggle');
        const originalVisibility = [];
        
        // حفظ حالات العرض الأصلية وإخفاء العناصر
        elementsToHide.forEach(el => {
            originalVisibility.push(el.style.display);
            el.style.display = 'none';
        });
        
        // تعيين padding-top إلى 0
        const originalPaddingTop = document.body.style.paddingTop;
        document.body.style.paddingTop = '0';
        
        // إنشاء HTML كامل للتصدير
        const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>السيرة الذاتية</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif; }
                :root {
                    --primary-color: #00a86b;
                    --primary-light: rgba(0, 168, 107, 0.1);
                    --glass-bg: rgba(255, 255, 255, 0.1);
                    --glass-border: rgba(255, 255, 255, 0.2);
                    --text-color: #2c3e50;
                    --sidebar-width: 320px;
                }
                body { 
                    background-color: #f0f9f4; 
                    color: #2c3e50; 
                    direction: rtl; 
                    padding-top: 0 !important;
                    margin: 0;
                    font-family: 'Cairo', sans-serif;
                }
                .controls {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    display: flex;
                    gap: 10px;
                    z-index: 1000;
                }
                .btn {
                    padding: 10px 15px;
                    background-color: #00a86b;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-family: 'Cairo', sans-serif;
                    font-weight: 600;
                }
                .btn:hover {
                    background-color: #008c5a;
                }
                @media print {
                    .controls { display: none !important; }
                }
                ${document.querySelector('style')?.innerHTML || ''}
            </style>
        </head>
        <body>
            <div class="controls">
                <button class="btn" onclick="window.print()">طباعة / حفظ كـ PDF</button>
                <button class="btn" onclick="window.close()">إغلاق</button>
            </div>
            ${document.querySelector('.main-layout').outerHTML}
        </body>
        </html>
        `;
        
        // إنشاء بلوب وإنشاء URL له
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        
        // إنشاء رابط للتنزيل
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'ahmed-cv.html';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        
        // تنفيذ التنزيل
        downloadLink.click();
        
        // التنظيف
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobUrl);
            
            // استعادة حالات العرض
            elementsToHide.forEach((el, index) => {
                el.style.display = originalVisibility[index] || '';
            });
            
            // استعادة padding-top
            document.body.style.paddingTop = originalPaddingTop || '60px';
            
            // إظهار رسالة نجاح
            message.textContent = 'تم تنزيل السيرة الذاتية كملف HTML بنجاح!';
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 2000);
        }, 1000);
    } catch (error) {
        console.error("خطأ في تصدير HTML:", error);
        message.textContent = 'حدث خطأ أثناء تحميل السيرة الذاتية كملف HTML.';
        message.classList.add('error');
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }
} 