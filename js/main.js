// 主JavaScript文件 - SEO小平博客
(function() {
    'use strict';
    
    // DOM加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollEffects();
        initSmoothScroll();
        initContactForm();
        initSearchFunctionality();
        initAnalytics();
    });
    
    // 导航菜单功能
    function initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // 点击菜单项后关闭移动端菜单
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
        
        // 滚动时改变导航栏样式
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            // 导航栏显示/隐藏
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    // 滚动效果
    function initScrollEffects() {
        // 观察元素进入视口
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        const animateElements = document.querySelectorAll('.service-card, .article-card, .case-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // 平滑滚动
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // 考虑固定导航栏高度
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 联系表单处理
    function initContactForm() {
        const contactForms = document.querySelectorAll('.contact-form');
        
        contactForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // 基本表单验证
                if (validateForm(data)) {
                    // 显示成功消息
                    showMessage('感谢您的留言！我们会尽快回复您。', 'success');
                    form.reset();
                } else {
                    showMessage('请填写所有必填字段。', 'error');
                }
            });
        });
    }
    
    // 表单验证
    function validateForm(data) {
        const requiredFields = ['name', 'email', 'message'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return false;
            }
        }
        
        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }
        
        return true;
    }
    
    // 显示消息
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // 显示动画
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动移除
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 5000);
    }
    
    // 搜索功能
    function initSearchFunctionality() {
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(this.value);
                }, 300);
            });
        });
    }
    
    // 执行搜索
    function performSearch(query) {
        if (query.length < 2) return;
        
        // 这里可以添加实际的搜索逻辑
        console.log('搜索查询:', query);
        
        // 简单的客户端搜索示例
        const articles = document.querySelectorAll('.article-card');
        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const content = article.querySelector('.article-excerpt').textContent.toLowerCase();
            
            if (title.includes(query.toLowerCase()) || content.includes(query.toLowerCase())) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }
    
    // 统计和分析
    function initAnalytics() {
        // 页面访问统计
        trackPageView();
        
        // 点击事件统计
        trackClicks();
        
        // 滚动深度统计
        trackScrollDepth();
    }
    
    function trackPageView() {
        // 发送页面浏览统计
        const pageData = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        console.log('页面访问:', pageData);
        // 这里可以发送到分析服务器
    }
    
    function trackClicks() {
        // 统计重要按钮点击
        const trackButtons = document.querySelectorAll('.btn, .service-link, .article-card a');
        
        trackButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const eventData = {
                    element: this.tagName,
                    text: this.textContent.trim(),
                    href: this.href || null,
                    timestamp: new Date().toISOString()
                };
                
                console.log('点击事件:', eventData);
                // 发送点击统计
            });
        });
    }
    
    function trackScrollDepth() {
        let maxScroll = 0;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / docHeight) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = Math.floor(scrollPercent);
                
                // 每25%发送一次统计
                if (maxScroll % 25 === 0 && maxScroll > 0) {
                    console.log(`滚动深度: ${maxScroll}%`);
                }
            }
        });
    }
    
    // 性能优化
    function initPerformanceOptimizations() {
        // 图片懒加载
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        // 预加载关键资源
        const criticalLinks = [
            '/css/style.css',
            '/js/main.js'
        ];
        
        criticalLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = href.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('JavaScript错误:', e.error);
        
        // 发送错误报告
        const errorData = {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error ? e.error.stack : null,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        // 这里可以发送错误报告到服务器
    });
    
    // 初始化性能优化
    initPerformanceOptimizations();
    
    // 导出全局函数供其他脚本使用
    window.SEOBlog = {
        showMessage: showMessage,
        trackEvent: function(eventName, data) {
            console.log(`自定义事件: ${eventName}`, data);
        }
    };
    
})();