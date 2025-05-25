// وظيفة تصدير السيرة الذاتية بصيغة Markdown ثم تحويلها لـ PDF
function exportAsMarkdownPDF() {
    // إظهار رسالة للمستخدم
    const message = document.createElement('div');
    message.className = 'download-message';
    message.textContent = 'جاري تحويل السيرة الذاتية إلى Markdown...';
    document.body.appendChild(message);
    
    try {
        // تحويل السيرة الذاتية إلى Markdown
        const markdownContent = convertCVToMarkdown();
        
        // فتح موقع Markdown إلى PDF
        const markdownPDFUrl = 'https://md2pdf.netlify.app/';
        const newWindow = window.open(markdownPDFUrl, '_blank');
        
        if (!newWindow) {
            throw new Error('تم منع النوافذ المنبثقة. يرجى السماح بالنوافذ المنبثقة وإعادة المحاولة.');
        }
        
        // إظهار رسالة تعليمات
        message.textContent = 'تم فتح موقع تحويل Markdown إلى PDF. انسخ المحتوى من النافذة المنبثقة والصقه في الموقع.';
        message.style.width = '400px';
        message.style.textAlign = 'center';
        
        // إنشاء نافذة منبثقة تحتوي على المحتوى بصيغة Markdown
        const popupWindow = window.open('', 'markdownContent', 'width=800,height=600');
        if (!popupWindow) {
            throw new Error('تم منع النوافذة المنبثقة الثانية. يرجى السماح بالنوافذ المنبثقة وإعادة المحاولة.');
        }
        
        popupWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>محتوى Markdown</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 20px;
                        direction: rtl;
                        background-color: #f5f5f5;
                    }
                    .container {
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #00a86b;
                    }
                    textarea {
                        width: 100%;
                        height: 400px;
                        padding: 10px;
                        direction: rtl;
                        font-family: monospace;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    .instructions {
                        margin-bottom: 20px;
                        padding: 15px;
                        background-color: #f0f9f4;
                        border-radius: 8px;
                        border-right: 4px solid #00a86b;
                    }
                    .btn {
                        background-color: #00a86b;
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    }
                    .btn:hover {
                        background-color: #008c5a;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>محتوى السيرة الذاتية بتنسيق Markdown</h1>
                    
                    <div class="instructions">
                        <h3>تعليمات التحويل إلى PDF:</h3>
                        <ol>
                            <li>انقر على زر "نسخ المحتوى" أدناه لنسخ محتوى Markdown</li>
                            <li>انتقل إلى <a href="https://md2pdf.netlify.app/" target="_blank">موقع تحويل Markdown إلى PDF</a></li>
                            <li>الصق المحتوى المنسوخ في محرر الموقع</li>
                            <li>انقر على "Generate PDF"</li>
                            <li>اضبط الخيارات حسب رغبتك (إن وجدت)</li>
                            <li>انقر على "Download PDF"</li>
                        </ol>
                    </div>
                    
                    <textarea id="markdownContent" readonly>${markdownContent}</textarea>
                    <br><br>
                    <button class="btn" onclick="copyToClipboard()">نسخ المحتوى</button>
                </div>
                
                <script>
                    function copyToClipboard() {
                        const textarea = document.getElementById('markdownContent');
                        textarea.select();
                        document.execCommand('copy');
                        alert('تم نسخ المحتوى بنجاح!');
                    }
                </script>
            </body>
            </html>
        `);
        popupWindow.document.close();
        
        // إزالة الرسالة بعد فترة
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 10000);
        
    } catch (error) {
        console.error("خطأ في تصدير Markdown:", error);
        message.textContent = error.message || 'حدث خطأ أثناء تحويل السيرة الذاتية إلى Markdown.';
        message.classList.add('error');
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 5000);
    }
}

// تحويل السيرة الذاتية إلى Markdown
function convertCVToMarkdown() {
    // الحصول على العناصر الرئيسية
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let markdown = '';
    
    try {
        // إضافة معلومات القسم الجانبي
        const sidebarName = sidebar.querySelector('.sidebar-name')?.textContent || '';
        const sidebarTitle = sidebar.querySelector('.sidebar-title')?.textContent || '';
        const sidebarSummary = sidebar.querySelector('.sidebar-summary')?.textContent?.trim() || '';
        
        // إضافة العنوان والنبذة
        markdown += `# ${sidebarName}\n`;
        markdown += `## ${sidebarTitle}\n\n`;
        
        // إضافة معلومات الاتصال
        markdown += '## معلومات الاتصال\n\n';
        const contactInfoItems = sidebar.querySelectorAll('.sidebar-contact p');
        contactInfoItems.forEach(item => {
            const contactText = item.textContent.trim();
            markdown += `- ${contactText}\n`;
        });
        markdown += '\n';
        
        // إضافة النبذة الشخصية
        if (sidebarSummary) {
            markdown += '## نبذة شخصية\n\n';
            markdown += `${sidebarSummary}\n\n`;
        }
        
        // إضافة اللغات
        markdown += '## اللغات\n\n';
        const languageItems = sidebar.querySelectorAll('#languages-timeline-list .timeline-item');
        languageItems.forEach(item => {
            const langName = item.querySelector('h4')?.textContent || '';
            const langLevel = item.querySelector('.skill-level-text')?.textContent || '';
            const langPercent = item.querySelector('.skill-percentage-text')?.textContent || '';
            markdown += `- ${langName}: ${langLevel} (${langPercent})\n`;
        });
        markdown += '\n';
        
        // إضافة الهوايات
        markdown += '## الهوايات\n\n';
        const hobbyItems = sidebar.querySelectorAll('#hobbies-timeline-list .timeline-item');
        hobbyItems.forEach(item => {
            const hobbyName = item.querySelector('h4')?.textContent || '';
            markdown += `- ${hobbyName}\n`;
        });
        markdown += '\n';
        
        // إضافة المؤهلات العلمية
        markdown += '## المؤهلات العلمية\n\n';
        const qualificationItems = mainContent.querySelectorAll('#qualifications-timeline .timeline-item');
        qualificationItems.forEach(item => {
            const qualTitle = item.querySelector('h4')?.textContent || '';
            const qualDesc = item.querySelector('p')?.textContent || '';
            markdown += `### ${qualTitle}\n`;
            markdown += `${qualDesc}\n\n`;
        });
        
        // إضافة الدورات التدريبية
        markdown += '## الدورات التدريبية\n\n';
        const courseItems = mainContent.querySelectorAll('#courses-timeline .timeline-item');
        courseItems.forEach(item => {
            const courseTitle = item.querySelector('h4')?.textContent || '';
            const courseDesc = item.querySelector('p')?.textContent || '';
            markdown += `### ${courseTitle}\n`;
            markdown += `${courseDesc}\n\n`;
        });
        
        // إضافة الخبرات العملية
        markdown += '## الخبرات العملية\n\n';
        const expItems = mainContent.querySelectorAll('#experiences-timeline .timeline-item');
        expItems.forEach(item => {
            const expTitle = item.querySelector('h4')?.textContent || '';
            const expDesc = item.querySelector('p')?.textContent || '';
            markdown += `### ${expTitle}\n`;
            markdown += `${expDesc}\n\n`;
        });
        
        // إضافة الإنجازات
        markdown += '## الإنجازات والمشاريع\n\n';
        const achievementItems = mainContent.querySelectorAll('#achievements-timeline .timeline-item');
        achievementItems.forEach(item => {
            const achievementTitle = item.querySelector('h4')?.textContent || '';
            const achievementDesc = item.querySelector('p')?.textContent || '';
            markdown += `### ${achievementTitle}\n`;
            markdown += `${achievementDesc}\n\n`;
        });
        
        // إضافة المهارات
        markdown += '## المهارات\n\n';
        const skillItems = mainContent.querySelectorAll('#skills-timeline-grid .timeline-item');
        skillItems.forEach(item => {
            const skillTitle = item.querySelector('h4')?.textContent || '';
            const skillLevel = item.querySelector('.skill-level-text')?.textContent || '';
            const skillPercent = item.querySelector('.skill-percentage-text')?.textContent || '';
            markdown += `- ${skillTitle}: ${skillLevel} (${skillPercent})\n`;
        });
        
        return markdown;
    } catch (error) {
        console.error("خطأ في تحويل السيرة الذاتية إلى Markdown:", error);
        return '# خطأ في تحويل السيرة الذاتية\n\nحدث خطأ أثناء تحويل السيرة الذاتية إلى تنسيق Markdown.';
    }
} 