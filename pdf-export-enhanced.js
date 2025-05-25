/**
 * نظام تصدير PDF محسن للسيرة الذاتية
 * يحل مشاكل الصور والتنسيق واللغات
 */

// تحميل مكتبات PDF المطلوبة
function loadPDFLibraries() {
    return new Promise((resolve, reject) => {
        // تحقق من وجود jsPDF
        if (typeof window.jspdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                // تحميل html2canvas
                const canvasScript = document.createElement('script');
                canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                canvasScript.onload = () => resolve();
                canvasScript.onerror = () => reject('فشل في تحميل html2canvas');
                document.head.appendChild(canvasScript);
            };
            script.onerror = () => reject('فشل في تحميل jsPDF');
            document.head.appendChild(script);
        } else {
            resolve();
        }
    });
}

// معالجة الصورة وتحويلها لتنسيق مناسب للـ PDF
async function processImageForPDF(imgElement) {
    return new Promise((resolve) => {
        if (!imgElement || !imgElement.src) {
            resolve(null);
            return;
        }

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 150;
            canvas.height = 150;

            // إنشاء صورة جديدة
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = function() {
                try {
                    // رسم دائرة للقطع
                    ctx.beginPath();
                    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    
                    // رسم الصورة
                    ctx.drawImage(img, 0, 0, 150, 150);
                    
                    // تحويل إلى base64
                    const imageData = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(imageData);
                } catch (e) {
                    console.warn('خطأ في معالجة الصورة:', e);
                    resolve(null);
                }
            };
            
            img.onerror = function() {
                console.warn('خطأ في تحميل الصورة');
                resolve(null);
            };
            
            // تعيين مصدر الصورة
            if (imgElement.src.startsWith('data:')) {
                img.src = imgElement.src;
            } else {
                img.src = imgElement.src;
            }
        } catch (error) {
            console.warn('خطأ في إعداد معالجة الصورة:', error);
            resolve(null);
        }
    });
}

// إنشاء PDF بصفحة واحدة محسن
async function createEnhancedSinglePagePDF(language = 'ar') {
    try {
        // إظهار رسالة التحميل
        const loadingMessage = showLoadingMessage('جاري إنشاء PDF بصفحة واحدة...');
        
        // تحميل المكتبات المطلوبة
        await loadPDFLibraries();
        
        // إخفاء شريط التنقل مؤقتاً
        const navbar = document.querySelector('.navbar');
        const originalNavDisplay = navbar.style.display;
        navbar.style.display = 'none';
        document.body.style.paddingTop = '0';
        
        // الحصول على البيانات
        const cvData = extractCVData();
        const profileImage = await processImageForPDF(document.querySelector('.sidebar .profile-image img'));
        
        // إنشاء PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });
        
        // إضافة الخطوط العربية
        await addArabicFontSupport(pdf);
        
        if (language === 'ar') {
            await createArabicSinglePage(pdf, cvData, profileImage);
        } else {
            await createEnglishSinglePage(pdf, cvData, profileImage);
        }
        
        // حفظ الملف
        const fileName = language === 'ar' ? 'السيرة_الذاتية_أحمد_الإبراهيم.pdf' : 'Ahmed_Ibrahim_CV.pdf';
        pdf.save(fileName);
        
        // إعادة شريط التنقل
        navbar.style.display = originalNavDisplay;
        document.body.style.paddingTop = '60px';
        
        // إخفاء رسالة التحميل
        hideLoadingMessage(loadingMessage);
        showSuccessMessage('تم إنشاء PDF بنجاح!');
        
    } catch (error) {
        console.error('خطأ في إنشاء PDF:', error);
        showErrorMessage('حدث خطأ في إنشاء PDF');
    }
}

// إنشاء PDF متعدد الصفحات محسن
async function createEnhancedMultiPagePDF(language = 'ar') {
    try {
        // إظهار رسالة التحميل
        const loadingMessage = showLoadingMessage('جاري إنشاء PDF متعدد الصفحات...');
        
        // تحميل المكتبات المطلوبة
        await loadPDFLibraries();
        
        // إخفاء شريط التنقل مؤقتاً
        const navbar = document.querySelector('.navbar');
        const originalNavDisplay = navbar.style.display;
        navbar.style.display = 'none';
        document.body.style.paddingTop = '0';
        
        // الحصول على البيانات
        const cvData = extractCVData();
        const profileImage = await processImageForPDF(document.querySelector('.sidebar .profile-image img'));
        
        // إنشاء PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });
        
        // إضافة الخطوط العربية
        await addArabicFontSupport(pdf);
        
        if (language === 'ar') {
            await createArabicMultiPage(pdf, cvData, profileImage);
        } else {
            await createEnglishMultiPage(pdf, cvData, profileImage);
        }
        
        // حفظ الملف
        const fileName = language === 'ar' ? 'السيرة_الذاتية_أحمد_الإبراهيم_متعددة_الصفحات.pdf' : 'Ahmed_Ibrahim_CV_MultiPage.pdf';
        pdf.save(fileName);
        
        // إعادة شريط التنقل
        navbar.style.display = originalNavDisplay;
        document.body.style.paddingTop = '60px';
        
        // إخفاء رسالة التحميل
        hideLoadingMessage(loadingMessage);
        showSuccessMessage('تم إنشاء PDF متعدد الصفحات بنجاح!');
        
    } catch (error) {
        console.error('خطأ في إنشاء PDF متعدد الصفحات:', error);
        showErrorMessage('حدث خطأ في إنشاء PDF متعدد الصفحات');
    }
}

// تصدير السيرة كصورة
async function exportAsImage() {
    try {
        const loadingMessage = showLoadingMessage('جاري إنشاء صورة السيرة الذاتية...');
        
        // تحميل html2canvas إذا لم تكن محملة
        if (typeof html2canvas === 'undefined') {
            await loadPDFLibraries();
        }
        
        // إخفاء شريط التنقل
        const navbar = document.querySelector('.navbar');
        const originalNavDisplay = navbar.style.display;
        navbar.style.display = 'none';
        document.body.style.paddingTop = '0';
        
        // الحصول على المحتوى الكامل
        const cvContent = document.querySelector('.main-layout');
        
        // إنشاء الصورة
        const canvas = await html2canvas(cvContent, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f0f9f4',
            width: cvContent.scrollWidth,
            height: cvContent.scrollHeight
        });
        
        // تحويل إلى صورة وتحميلها
        const link = document.createElement('a');
        link.download = 'السيرة_الذاتية_أحمد_الإبراهيم.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // إعادة شريط التنقل
        navbar.style.display = originalNavDisplay;
        document.body.style.paddingTop = '60px';
        
        hideLoadingMessage(loadingMessage);
        showSuccessMessage('تم إنشاء صورة السيرة الذاتية بنجاح!');
        
    } catch (error) {
        console.error('خطأ في إنشاء الصورة:', error);
        showErrorMessage('حدث خطأ في إنشاء صورة السيرة الذاتية');
    }
}
// استخراج بيانات السيرة الذاتية
function extractCVData() {
    const data = {
        name: document.querySelector('.sidebar-name')?.textContent?.trim() || 'أحمد الإبراهيم',
        title: document.querySelector('.sidebar-title')?.textContent?.trim() || 'محاسب ومحلل مالي',
        summary: document.querySelector('.sidebar-summary')?.textContent?.trim() || '',
        contact: [],
        qualifications: [],
        courses: [],
        experiences: [],
        achievements: [],
        skills: [],
        languages: [],
        hobbies: []
    };
    
    // معلومات الاتصال
    document.querySelectorAll('.sidebar-contact p span').forEach(span => {
        if (span.textContent.trim()) {
            data.contact.push(span.textContent.trim());
        }
    });
    
    // المؤهلات
    document.querySelectorAll('#qualifications-timeline .timeline-item').forEach(item => {
        const title = item.querySelector('h4')?.textContent?.trim();
        const desc = item.querySelector('p')?.textContent?.trim();
        if (title) {
            data.qualifications.push({ title, description: desc || '' });
        }
    });
    
    // الدورات
    document.querySelectorAll('#courses-timeline .timeline-item').forEach(item => {
        const title = item.querySelector('h4')?.textContent?.trim();
        const desc = item.querySelector('p')?.textContent?.trim();
        if (title) {
            data.courses.push({ title, description: desc || '' });
        }
    });
    
    // الخبرات
    document.querySelectorAll('#experiences-timeline .timeline-item').forEach(item => {
        const title = item.querySelector('h4')?.textContent?.trim();
        const desc = item.querySelector('p')?.textContent?.trim();
        if (title) {
            data.experiences.push({ title, description: desc || '' });
        }
    });
    
    // الإنجازات
    document.querySelectorAll('#achievements-timeline .timeline-item').forEach(item => {
        const title = item.querySelector('h4')?.textContent?.trim();
        const desc = item.querySelector('p')?.textContent?.trim();
        if (title) {
            data.achievements.push({ title, description: desc || '' });
        }
    });
    
    // المهارات
    document.querySelectorAll('#skills-timeline-grid .timeline-item').forEach(item => {
        const title = item.querySelector('h4')?.textContent?.trim();
        const percentage = item.querySelector('.skill-percentage-text')?.textContent?.trim();
        const level = item.querySelector('.skill-level-text')?.textContent?.trim();
        if (title) {
            data.skills.push({ title, percentage: percentage || '0%', level: level || '' });
        }
    });
    
    // اللغات
    document.querySelectorAll('#languages-timeline-list .timeline-item').forEach(item => {
        const title = item.querySelector('h4')?.textContent?.trim();
        const percentage = item.querySelector('.skill-percentage-text')?.textContent?.trim();
        const level = item.querySelector('.skill-level-text')?.textContent?.trim();
        if (title) {
            data.languages.push({ title, percentage: percentage || '0%', level: level || '' });
        }
    });
    
    // الهوايات
    document.querySelectorAll('#hobbies-timeline-list .timeline-item').forEach(item => {
        const title = item.querySelector('h4')?.textContent?.trim();
        if (title) {
            data.hobbies.push(title);
        }
    });
    
    return data;
}

// إضافة دعم الخطوط العربية
async function addArabicFontSupport(pdf) {
    try {
        pdf.setLanguage('ar');
    } catch (error) {
        console.warn('تعذر إضافة دعم الخطوط العربية:', error);
    }
}

// وظائف الرسائل
function showLoadingMessage(text) {
    const message = document.createElement('div');
    message.className = 'pdf-loading-message';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 168, 107, 0.9);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-family: 'Cairo', sans-serif;
        font-size: 16px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    message.textContent = text;
    document.body.appendChild(message);
    return message;
}

function hideLoadingMessage(message) {
    if (message && document.body.contains(message)) {
        document.body.removeChild(message);
    }
}

function showSuccessMessage(text) {
    const message = document.createElement('div');
    message.className = 'pdf-success-message';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00cc66;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 204, 102, 0.3);
    `;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 3000);
}

function showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'pdf-error-message';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
    `;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 5000);
}

// وظائف الترجمة
function translateContactToEnglish(contactArray) {
    return contactArray.map(contact => {
        if (contact.includes('@')) return `Email: ${contact}`;
        if (contact.includes('+')) return `Phone: ${contact}`;
        if (contact.includes('حلب') || contact.includes('سوريا')) return 'Address: Syria, Aleppo';
        if (contact.includes('يناير')) return 'Birth Date: January 18, 1982';
        if (contact.includes('متزوج')) return 'Status: Married';
        return contact;
    });
}

function translateSkillsToEnglish(skillsArray) {
    const translations = {
        'هندسة الذكاء الاصطناعي': 'AI Prompt Engineering',
        'أتمتة البيانات وإدارتها': 'Data Automation & Management',
        'التحليل التقني والمالي': 'Technical & Financial Analysis',
        'برامج المحاسبة': 'Accounting Software',
        'التسويق الرقمي': 'Digital Marketing',
        'صيانة الحاسوب': 'Computer Maintenance',
        'مايكروسوفت أوفيس': 'Microsoft Office Suite',
        'التحليل التقني للأسهم': 'Technical Stock Analysis'
    };
    
    return skillsArray.map(skill => {
        return translations[skill.title] || skill.title;
    });
}

function translateSummaryToEnglish(arabicSummary) {
    if (!arabicSummary) return '';
    
    return 'Professional accountant with over 20 years of experience in various fields including accounting, computer maintenance, and project management. Always seeking to develop skills and apply the latest technologies in my field.';
}

function translateQualificationsToEnglish(qualifications) {
    const translations = {
        'الثانوية التجارية': 'Commercial High School Diploma',
        'شهادة محاسبة': 'Accounting Certificate',
        'شهادة اندماج اجتماعي': 'Social Integration Certificate',
        'شهادة اللغة التركية': 'Turkish Language Certificate (A1)'
    };
    
    return qualifications.map(qual => ({
        title: translations[qual.title] || qual.title,
        description: qual.description
    }));
}

function translateExperiencesToEnglish(experiences) {
    const translations = {
        'محاسب - مسلخ الأوائل للدجاج': 'Accountant - Al-Awael Chicken Slaughterhouse',
        'فني حاسوب': 'Computer Technician',
        'محاسب - شركة الفرقان': 'Accountant - Al-Furqan Company',
        'محاسب - ألبسة عباد': 'Accountant - Abbad Clothing'
    };
    
    return experiences.map(exp => ({
        title: translations[exp.title] || exp.title,
        description: exp.description
    }));
}
// إنشاء صفحة واحدة عربية
async function createArabicSinglePage(pdf, data, profileImage) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('السيرة الذاتية', 105, 25, { align: 'center' });
    
    // إضافة الصورة إذا كانت متوفرة
    if (profileImage) {
        try {
            pdf.addImage(profileImage, 'JPEG', 80, 45, 50, 50);
        } catch (e) {
            console.warn('تعذر إضافة الصورة:', e);
        }
    }
    
    // المعلومات الشخصية
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(20);
    pdf.text(data.name, 105, 105, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(100, 100, 100);
    pdf.text(data.title, 105, 115, { align: 'center' });
    
    // الشريط الجانبي
    pdf.setFillColor(240, 240, 240);
    pdf.rect(10, 125, 60, 160, 'F');
    
    let sidebarY = 135;
    
    // معلومات الاتصال
    pdf.setTextColor(0, 168, 107);
    pdf.setFontSize(14);
    pdf.text('معلومات الاتصال', 40, sidebarY, { align: 'center' });
    
    sidebarY += 10;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    
    data.contact.forEach(contact => {
        if (sidebarY < 270) {
            const lines = pdf.splitTextToSize(contact, 50);
            lines.forEach(line => {
                pdf.text(line, 15, sidebarY);
                sidebarY += 6;
            });
        }
    });
    
    // المهارات
    sidebarY += 10;
    pdf.setTextColor(0, 168, 107);
    pdf.setFontSize(14);
    pdf.text('المهارات', 40, sidebarY, { align: 'center' });
    
    sidebarY += 10;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    
    data.skills.slice(0, 8).forEach(skill => {
        if (sidebarY < 270) {
            pdf.text(`• ${skill.title}`, 15, sidebarY);
            sidebarY += 6;
        }
    });
    
    // المحتوى الرئيسي
    let mainY = 135;
    
    // النبذة الشخصية
    if (data.summary) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('النبذة الشخصية', 80, mainY);
        
        mainY += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        
        const summaryLines = pdf.splitTextToSize(data.summary, 125);
        summaryLines.forEach(line => {
            if (mainY < 280) {
                pdf.text(line, 80, mainY);
                mainY += 6;
            }
        });
        mainY += 10;
    }
    
    // المؤهلات العلمية
    if (data.qualifications.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('المؤهلات العلمية', 80, mainY);
        
        mainY += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        
        data.qualifications.forEach(qual => {
            if (mainY < 275) {
                pdf.text(`• ${qual.title}`, 80, mainY);
                mainY += 6;
                if (qual.description) {
                    const descLines = pdf.splitTextToSize(qual.description, 120);
                    descLines.forEach(line => {
                        if (mainY < 275) {
                            pdf.text(`  ${line}`, 85, mainY);
                            mainY += 5;
                        }
                    });
                }
            }
        });
        mainY += 5;
    }
    
    // الخبرات العملية
    if (data.experiences.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('الخبرات العملية', 80, mainY);
        
        mainY += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        
        data.experiences.forEach(exp => {
            if (mainY < 275) {
                pdf.text(`• ${exp.title}`, 80, mainY);
                mainY += 6;
                if (exp.description) {
                    const descLines = pdf.splitTextToSize(exp.description, 120);
                    descLines.forEach(line => {
                        if (mainY < 275) {
                            pdf.text(`  ${line}`, 85, mainY);
                            mainY += 5;
                        }
                    });
                }
            }
        });
    }
}

// إنشاء صفحة واحدة إنجليزية
async function createEnglishSinglePage(pdf, data, profileImage) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('Curriculum Vitae', 105, 25, { align: 'center' });
    
    // إضافة الصورة إذا كانت متوفرة
    if (profileImage) {
        try {
            pdf.addImage(profileImage, 'JPEG', 80, 45, 50, 50);
        } catch (e) {
            console.warn('Could not add image:', e);
        }
    }
    
    // المعلومات الشخصية
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(20);
    pdf.text('Ahmed Al-Ibrahim', 105, 105, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Accountant & Financial Analyst', 105, 115, { align: 'center' });
    
    // الشريط الجانبي
    pdf.setFillColor(240, 240, 240);
    pdf.rect(10, 125, 60, 160, 'F');
    
    let sidebarY = 135;
    
    // معلومات الاتصال
    pdf.setTextColor(0, 168, 107);
    pdf.setFontSize(14);
    pdf.text('Contact Info', 40, sidebarY, { align: 'center' });
    
    sidebarY += 10;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    
    // ترجمة معلومات الاتصال
    const translatedContact = translateContactToEnglish(data.contact);
    translatedContact.forEach(contact => {
        if (sidebarY < 270) {
            const lines = pdf.splitTextToSize(contact, 50);
            lines.forEach(line => {
                pdf.text(line, 15, sidebarY);
                sidebarY += 6;
            });
        }
    });
    
    // المهارات
    sidebarY += 10;
    pdf.setTextColor(0, 168, 107);
    pdf.setFontSize(14);
    pdf.text('Skills', 40, sidebarY, { align: 'center' });
    
    sidebarY += 10;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    
    const translatedSkills = translateSkillsToEnglish(data.skills);
    translatedSkills.slice(0, 8).forEach(skill => {
        if (sidebarY < 270) {
            pdf.text(`• ${skill}`, 15, sidebarY);
            sidebarY += 6;
        }
    });
    
    // المحتوى الرئيسي
    let mainY = 135;
    
    // النبذة الشخصية
    const englishSummary = translateSummaryToEnglish(data.summary);
    if (englishSummary) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Professional Summary', 80, mainY);
        
        mainY += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        
        const summaryLines = pdf.splitTextToSize(englishSummary, 125);
        summaryLines.forEach(line => {
            if (mainY < 280) {
                pdf.text(line, 80, mainY);
                mainY += 6;
            }
        });
        mainY += 10;
    }
    
    // المؤهلات العلمية
    if (data.qualifications.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Education', 80, mainY);
        
        mainY += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        
        const translatedQualifications = translateQualificationsToEnglish(data.qualifications);
        translatedQualifications.forEach(qual => {
            if (mainY < 275) {
                pdf.text(`• ${qual.title}`, 80, mainY);
                mainY += 6;
                if (qual.description) {
                    const descLines = pdf.splitTextToSize(qual.description, 120);
                    descLines.forEach(line => {
                        if (mainY < 275) {
                            pdf.text(`  ${line}`, 85, mainY);
                            mainY += 5;
                        }
                    });
                }
            }
        });
        mainY += 5;
    }
    
    // الخبرات العملية
    if (data.experiences.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Work Experience', 80, mainY);
        
        mainY += 10;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        
        const translatedExperiences = translateExperiencesToEnglish(data.experiences);
        translatedExperiences.forEach(exp => {
            if (mainY < 275) {
                pdf.text(`• ${exp.title}`, 80, mainY);
                mainY += 6;
                if (exp.description) {
                    const descLines = pdf.splitTextToSize(exp.description, 120);
                    descLines.forEach(line => {
                        if (mainY < 275) {
                            pdf.text(`  ${line}`, 85, mainY);
                            mainY += 5;
                        }
                    });
                }
            }
        });
    }
}

// إنشاء PDF متعدد الصفحات عربي
async function createArabicMultiPage(pdf, data, profileImage) {
    // الصفحة الأولى - المعلومات الشخصية
    await createArabicFirstPage(pdf, data, profileImage);
    
    // الصفحة الثانية - المؤهلات والخبرات
    pdf.addPage();
    await createArabicSecondPage(pdf, data);
    
    // الصفحة الثالثة - المهارات واللغات
    pdf.addPage();
    await createArabicThirdPage(pdf, data);
}

// إنشاء PDF متعدد الصفحات إنجليزي
async function createEnglishMultiPage(pdf, data, profileImage) {
    // الصفحة الأولى - المعلومات الشخصية
    await createEnglishFirstPage(pdf, data, profileImage);
    
    // الصفحة الثانية - المؤهلات والخبرات
    pdf.addPage();
    await createEnglishSecondPage(pdf, data);
    
    // الصفحة الثالثة - المهارات واللغات
    pdf.addPage();
    await createEnglishThirdPage(pdf, data);
}
// إنشاء الصفحة الأولى العربية متعددة الصفحات
async function createArabicFirstPage(pdf, data, profileImage) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(26);
    pdf.text('السيرة الذاتية', 105, 25, { align: 'center' });
    
    // إضافة الصورة
    if (profileImage) {
        try {
            pdf.addImage(profileImage, 'JPEG', 80, 50, 50, 50);
        } catch (e) {
            console.warn('تعذر إضافة الصورة:', e);
        }
    }
    
    // المعلومات الشخصية
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(22);
    pdf.text(data.name, 105, 115, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.setTextColor(100, 100, 100);
    pdf.text(data.title, 105, 130, { align: 'center' });
    
    // معلومات الاتصال
    let contactY = 150;
    pdf.setTextColor(0, 168, 107);
    pdf.setFontSize(16);
    pdf.text('معلومات الاتصال', 105, contactY, { align: 'center' });
    
    contactY += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    
    data.contact.forEach(contact => {
        pdf.text(contact, 105, contactY, { align: 'center' });
        contactY += 10;
    });
    
    // النبذة الشخصية
    if (data.summary) {
        contactY += 15;
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('النبذة الشخصية', 105, contactY, { align: 'center' });
        
        contactY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        const summaryLines = pdf.splitTextToSize(data.summary, 170);
        summaryLines.forEach(line => {
            pdf.text(line, 105, contactY, { align: 'center' });
            contactY += 8;
        });
    }
    
    // تذييل الصفحة
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('الصفحة 1 من 3', 105, 280, { align: 'center' });
}

// إنشاء الصفحة الثانية العربية
async function createArabicSecondPage(pdf, data) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('المؤهلات والخبرات', 105, 16, { align: 'center' });
    
    let currentY = 40;
    
    // المؤهلات العلمية
    if (data.qualifications.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('المؤهلات العلمية', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.qualifications.forEach(qual => {
            pdf.text(`• ${qual.title}`, 25, currentY);
            currentY += 8;
            if (qual.description) {
                const descLines = pdf.splitTextToSize(qual.description, 160);
                descLines.forEach(line => {
                    pdf.text(`  ${line}`, 30, currentY);
                    currentY += 6;
                });
            }
            currentY += 3;
        });
        currentY += 10;
    }
    
    // الدورات التدريبية
    if (data.courses.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('الدورات التدريبية', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.courses.forEach(course => {
            pdf.text(`• ${course.title}`, 25, currentY);
            currentY += 8;
            if (course.description) {
                const descLines = pdf.splitTextToSize(course.description, 160);
                descLines.forEach(line => {
                    pdf.text(`  ${line}`, 30, currentY);
                    currentY += 6;
                });
            }
            currentY += 3;
        });
        currentY += 10;
    }
    
    // الخبرات العملية
    if (data.experiences.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('الخبرات العملية', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.experiences.forEach(exp => {
            if (currentY < 270) {
                pdf.text(`• ${exp.title}`, 25, currentY);
                currentY += 8;
                if (exp.description) {
                    const descLines = pdf.splitTextToSize(exp.description, 160);
                    descLines.forEach(line => {
                        if (currentY < 270) {
                            pdf.text(`  ${line}`, 30, currentY);
                            currentY += 6;
                        }
                    });
                }
                currentY += 3;
            }
        });
    }
    
    // تذييل الصفحة
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('الصفحة 2 من 3', 105, 280, { align: 'center' });
}

// إنشاء الصفحة الثالثة العربية
async function createArabicThirdPage(pdf, data) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('المهارات واللغات', 105, 16, { align: 'center' });
    
    let currentY = 40;
    
    // المهارات
    if (data.skills.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('المهارات التقنية', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.skills.forEach(skill => {
            pdf.text(`• ${skill.title} - ${skill.level}`, 25, currentY);
            currentY += 10;
        });
        currentY += 15;
    }
    
    // اللغات
    if (data.languages.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('اللغات', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.languages.forEach(lang => {
            pdf.text(`• ${lang.title} - ${lang.level}`, 25, currentY);
            currentY += 10;
        });
        currentY += 15;
    }
    
    // الهوايات
    if (data.hobbies.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('الهوايات والاهتمامات', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.hobbies.forEach(hobby => {
            pdf.text(`• ${hobby}`, 25, currentY);
            currentY += 10;
        });
        currentY += 15;
    }
    
    // الإنجازات
    if (data.achievements.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('الإنجازات', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.achievements.forEach(achievement => {
            if (currentY < 270) {
                pdf.text(`• ${achievement.title}`, 25, currentY);
                currentY += 8;
                if (achievement.description) {
                    const descLines = pdf.splitTextToSize(achievement.description, 160);
                    descLines.forEach(line => {
                        if (currentY < 270) {
                            pdf.text(`  ${line}`, 30, currentY);
                            currentY += 6;
                        }
                    });
                }
                currentY += 3;
            }
        });
    }
    
    // تذييل الصفحة
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('الصفحة 3 من 3', 105, 280, { align: 'center' });
}

// إنشاء الصفحة الأولى الإنجليزية متعددة الصفحات
async function createEnglishFirstPage(pdf, data, profileImage) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(26);
    pdf.text('Curriculum Vitae', 105, 25, { align: 'center' });
    
    // إضافة الصورة
    if (profileImage) {
        try {
            pdf.addImage(profileImage, 'JPEG', 80, 50, 50, 50);
        } catch (e) {
            console.warn('Could not add image:', e);
        }
    }
    
    // المعلومات الشخصية
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(22);
    pdf.text('Ahmed Al-Ibrahim', 105, 115, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Accountant & Financial Analyst', 105, 130, { align: 'center' });
    
    // معلومات الاتصال
    let contactY = 150;
    pdf.setTextColor(0, 168, 107);
    pdf.setFontSize(16);
    pdf.text('Contact Information', 105, contactY, { align: 'center' });
    
    contactY += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    
    const translatedContact = translateContactToEnglish(data.contact);
    translatedContact.forEach(contact => {
        pdf.text(contact, 105, contactY, { align: 'center' });
        contactY += 10;
    });
    
    // النبذة الشخصية
    const englishSummary = translateSummaryToEnglish(data.summary);
    if (englishSummary) {
        contactY += 15;
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Professional Summary', 105, contactY, { align: 'center' });
        
        contactY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        const summaryLines = pdf.splitTextToSize(englishSummary, 170);
        summaryLines.forEach(line => {
            pdf.text(line, 105, contactY, { align: 'center' });
            contactY += 8;
        });
    }
    
    // تذييل الصفحة
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Page 1 of 3', 105, 280, { align: 'center' });
}

// إنشاء الصفحة الثانية الإنجليزية
async function createEnglishSecondPage(pdf, data) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('Education & Experience', 105, 16, { align: 'center' });
    
    let currentY = 40;
    
    // المؤهلات العلمية
    if (data.qualifications.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Education', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        const translatedQualifications = translateQualificationsToEnglish(data.qualifications);
        translatedQualifications.forEach(qual => {
            pdf.text(`• ${qual.title}`, 25, currentY);
            currentY += 8;
            if (qual.description) {
                const descLines = pdf.splitTextToSize(qual.description, 160);
                descLines.forEach(line => {
                    pdf.text(`  ${line}`, 30, currentY);
                    currentY += 6;
                });
            }
            currentY += 3;
        });
        currentY += 10;
    }
    
    // الدورات التدريبية
    if (data.courses.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Training Courses', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.courses.forEach(course => {
            pdf.text(`• ${course.title}`, 25, currentY);
            currentY += 8;
            if (course.description) {
                const descLines = pdf.splitTextToSize(course.description, 160);
                descLines.forEach(line => {
                    pdf.text(`  ${line}`, 30, currentY);
                    currentY += 6;
                });
            }
            currentY += 3;
        });
        currentY += 10;
    }
    
    // الخبرات العملية
    if (data.experiences.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Work Experience', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        const translatedExperiences = translateExperiencesToEnglish(data.experiences);
        translatedExperiences.forEach(exp => {
            if (currentY < 270) {
                pdf.text(`• ${exp.title}`, 25, currentY);
                currentY += 8;
                if (exp.description) {
                    const descLines = pdf.splitTextToSize(exp.description, 160);
                    descLines.forEach(line => {
                        if (currentY < 270) {
                            pdf.text(`  ${line}`, 30, currentY);
                            currentY += 6;
                        }
                    });
                }
                currentY += 3;
            }
        });
    }
    
    // تذييل الصفحة
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Page 2 of 3', 105, 280, { align: 'center' });
}

// إنشاء الصفحة الثالثة الإنجليزية
async function createEnglishThirdPage(pdf, data) {
    // رأس الصفحة
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('Skills & Languages', 105, 16, { align: 'center' });
    
    let currentY = 40;
    
    // المهارات
    if (data.skills.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Technical Skills', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        const translatedSkills = translateSkillsToEnglish(data.skills);
        data.skills.forEach((skill, index) => {
            const englishTitle = translatedSkills[index] || skill.title;
            let englishLevel = skill.level;
            if (skill.level === 'ممتاز') englishLevel = 'Excellent';
            else if (skill.level === 'جيد') englishLevel = 'Good';
            else if (skill.level === 'متوسط') englishLevel = 'Intermediate';
            else if (skill.level === 'مبتدئ') englishLevel = 'Basic';
            
            pdf.text(`• ${englishTitle} - ${englishLevel}`, 25, currentY);
            currentY += 10;
        });
        currentY += 15;
    }
    
    // اللغات
    if (data.languages.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Languages', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.languages.forEach(lang => {
            let englishName = lang.title;
            if (lang.title === 'العربية') englishName = 'Arabic';
            else if (lang.title === 'الإنجليزية') englishName = 'English';
            else if (lang.title === 'التركية') englishName = 'Turkish';
            
            let englishLevel = lang.level;
            if (lang.level === 'ممتاز') englishLevel = 'Excellent';
            else if (lang.level === 'جيد') englishLevel = 'Good';
            else if (lang.level === 'متوسط') englishLevel = 'Intermediate';
            else if (lang.level === 'مبتدئ') englishLevel = 'Basic';
            
            pdf.text(`• ${englishName} - ${englishLevel}`, 25, currentY);
            currentY += 10;
        });
        currentY += 15;
    }
    
    // الهوايات
    if (data.hobbies.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Hobbies & Interests', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.hobbies.forEach(hobby => {
            let englishHobby = hobby;
            if (hobby === 'القراءة') englishHobby = 'Reading';
            else if (hobby === 'التكنولوجيا') englishHobby = 'Technology';
            
            pdf.text(`• ${englishHobby}`, 25, currentY);
            currentY += 10;
        });
        currentY += 15;
    }
    
    // الإنجازات
    if (data.achievements.length > 0) {
        pdf.setTextColor(0, 168, 107);
        pdf.setFontSize(16);
        pdf.text('Achievements', 20, currentY);
        
        currentY += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        
        data.achievements.forEach(achievement => {
            if (currentY < 270) {
                pdf.text(`• ${achievement.title}`, 25, currentY);
                currentY += 8;
                if (achievement.description) {
                    const descLines = pdf.splitTextToSize(achievement.description, 160);
                    descLines.forEach(line => {
                        if (currentY < 270) {
                            pdf.text(`  ${line}`, 30, currentY);
                            currentY += 6;
                        }
                    });
                }
                currentY += 3;
            }
        });
    }
    
    // تذييل الصفحة
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Page 3 of 3', 105, 280, { align: 'center' });
}

function addPrintStyles(container, pageType) {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body {
                margin: 0;
                padding: 0;
                background: white;
            }
            
            .cv-container {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 10mm !important;
                box-shadow: none !important;
            }
            
            .sidebar, .main-content {
                width: 100% !important;
                float: none !important;
                margin: 0 !important;
                padding: 5mm !important;
            }
            
            .section {
                break-inside: avoid;
                page-break-inside: avoid;
                margin-bottom: 5mm !important;
            }
            
            .timeline-item {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            /* Maintain template styles */
            .modern {
                --primary-color: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')};
                --primary-light: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-light')};
            }
            
            .classic {
                --primary-color: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')};
                --primary-light: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-light')};
            }
            
            .creative {
                --primary-color: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')};
                --primary-light: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-light')};
            }
            
            /* Hide non-printable elements */
            .no-print {
                display: none !important;
            }
            
            /* Optimize images */
            img {
                max-width: 100% !important;
                height: auto !important;
            }
            
            /* Ensure proper text color */
            * {
                color: black !important;
                text-shadow: none !important;
            }
            
            /* Maintain borders and backgrounds */
            .section {
                border: 1px solid #ddd !important;
                background: white !important;
            }
            
            /* Ensure proper font rendering */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    `;
    container.appendChild(style);
}