        // ==============================
        // FIXED JAVASCRIPT CODE
        // ==============================
        const DB_NAME = 'SyntryxDashboardDB';
        const DB_VERSION = 1;
        let db = null;

        const STORES = {
            PRODUCTS: 'products',
            ACTIVITIES: 'activities',
            ORDERS: 'orders',
            SETTINGS: 'settings'
        };

        const SHIPPING_STATUS = {
            PENDING: 'pending',
            PROCESSING: 'processing',
            SHIPPED: 'shipped',
            DELIVERED: 'delivered',
            CANCELLED: 'cancelled'
        };

        function initDatabase() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = (event) => {
                    console.error('Database error:', event.target.error);
                    reject(event.target.error);
                };

                request.onupgradeneeded = (event) => {
                    db = event.target.result;
                    
                    if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
                        const productsStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id', autoIncrement: true });
                        productsStore.createIndex('category', 'category', { unique: false });
                        productsStore.createIndex('quantity', 'quantity', { unique: false });
                        
                        const sampleProducts = [
                            { name: "Laptop", model: "LAP-5423", category: "Laptops", quantity: 0, price: 45000 },
                            { name: "Smartphone", model: "PHN-3452", category: "Phones", quantity: 50, price: 25000 },
                            { name: "Headphones", model: "PKE-345", category: "Headphones", quantity: 42, price: 1500 },
                            { name: "Earbuds", model: "OKZ-AKG", category: "Accessories", quantity: 0, price: 1200 },
                            { name: "Mouse", model: "VXE-R1", category: "Accessories", quantity: 34, price: 800 },
                            { name: "Keyboard", model: "AULA-ASFD", category: "Accessories", quantity: 28, price: 2500 },
                            { name: "Tablet", model: "TPC-ASFA", category: "Laptops", quantity: 0, price: 32000 },
                            { name: "GPU", model: "AMD-RADEON", category: "GPU", quantity: 32, price: 35000 }
                        ];
                        
                        sampleProducts.forEach(product => {
                            productsStore.add(product);
                        });
                    }

                    // Create activities store
                    if (!db.objectStoreNames.contains(STORES.ACTIVITIES)) {
                        const activitiesStore = db.createObjectStore(STORES.ACTIVITIES, { keyPath: 'id', autoIncrement: true });
                        activitiesStore.createIndex('timestamp', 'timestamp', { unique: false });
                        activitiesStore.createIndex('type', 'type', { unique: false });
                        
                        // Add initial activities
                        const initialActivities = [
                            { 
                                icon: 'ri-dashboard-line', 
                                title: 'Dashboard loaded', 
                                timestamp: new Date(),
                                type: 'info'
                            },
                            { 
                                icon: 'ri-archive-line', 
                                title: 'Sample data initialized', 
                                timestamp: new Date(),
                                type: 'info'
                            }
                        ];
                        
                        initialActivities.forEach(activity => {
                            activitiesStore.add(activity);
                        });
                    }

                    // Create orders store
                    if (!db.objectStoreNames.contains(STORES.ORDERS)) {
                        const ordersStore = db.createObjectStore(STORES.ORDERS, { keyPath: 'id', autoIncrement: true });
                        ordersStore.createIndex('status', 'status', { unique: false });
                        ordersStore.createIndex('date', 'date', { unique: false });
                        ordersStore.createIndex('shippingStatus', 'shippingStatus', { unique: false });
                        
                        // Add sample orders
                        const sampleOrders = [
                            { orderId: 'ORD-234', date: 'Jan 15, 2024', customer: 'Arvin', status: 'pending', shippingStatus: SHIPPING_STATUS.PENDING, total: 15000, items: [{productId: 1, quantity: 1}], shippingAddress: '123 Main St, City', trackingNumber: '' },
                            { orderId: 'ORD-235', date: 'Jan 16, 2024', customer: 'Gian', status: 'shipped', shippingStatus: SHIPPING_STATUS.SHIPPED, total: 25000, items: [{productId: 2, quantity: 2}], shippingAddress: '456 Oak Ave, Town', trackingNumber: 'TRK-789456' },
                            { orderId: 'ORD-236', date: 'Jan 17, 2024', customer: 'Liam', status: 'completed', shippingStatus: SHIPPING_STATUS.DELIVERED, total: 18000, items: [{productId: 3, quantity: 1}], shippingAddress: '789 Pine Rd, Village', trackingNumber: 'TRK-123456' },
                            { orderId: 'ORD-245', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), customer: 'Alex Johnson', status: 'pending', shippingStatus: SHIPPING_STATUS.PROCESSING, total: 32000, items: [{productId: 4, quantity: 3}], shippingAddress: '321 Elm St, City', trackingNumber: '' },
                            { orderId: 'ORD-244', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), customer: 'Maria Garcia', status: 'shipped', shippingStatus: SHIPPING_STATUS.SHIPPED, total: 28000, items: [{productId: 5, quantity: 2}], shippingAddress: '654 Maple Dr, Town', trackingNumber: 'TRK-456789' },
                            { orderId: 'ORD-243', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), customer: 'Robert Chen', status: 'completed', shippingStatus: SHIPPING_STATUS.DELIVERED, total: 45000, items: [{productId: 6, quantity: 1}], shippingAddress: '987 Cedar Ln, Village', trackingNumber: 'TRK-789123' }
                        ];
                        
                        sampleOrders.forEach(order => {
                            ordersStore.add(order);
                        });
                    }

                    // Create settings store
                    if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                        const settingsStore = db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
                        
                        // Add default settings
                        settingsStore.add({ key: 'currentPage', value: 'dashboard' });
                        settingsStore.add({ key: 'sidebarCompact', value: false });
                        settingsStore.add({ key: 'theme', value: 'light' });
                    }
                };

                request.onsuccess = (event) => {
                    db = event.target.result;
                    resolve(db);
                };
            });
        }

        // Database operations
        const dbOperations = {
            // Generic get all items
            getAll: (storeName) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.getAll();
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            },

            // Get item by ID
            getById: (storeName, id) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.get(id);
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            },

            // Add item
            add: (storeName, item) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.add(item);
                    
                    request.onsuccess = () => resolve(request.result); // Returns the new ID
                    request.onerror = () => reject(request.error);
                });
            },

            // Update item
            update: (storeName, item) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.put(item);
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            },

            // Delete item
            delete: (storeName, id) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.delete(id);
                    
                    request.onsuccess = () => resolve(true);
                    request.onerror = () => reject(request.error);
                });
            },

            // Get items with filter
            getByIndex: (storeName, indexName, value) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);
                    const index = store.index(indexName);
                    const request = index.getAll(value);
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            },

            // Get count
            getCount: (storeName) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.count();
                    
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            },

            // Get setting
            getSetting: (key) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([STORES.SETTINGS], 'readonly');
                    const store = transaction.objectStore(STORES.SETTINGS);
                    const request = store.get(key);
                    
                    request.onsuccess = () => resolve(request.result ? request.result.value : null);
                    request.onerror = () => reject(request.error);
                });
            },

            // Update setting
            updateSetting: (key, value) => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([STORES.SETTINGS], 'readwrite');
                    const store = transaction.objectStore(STORES.SETTINGS);
                    const request = store.put({ key, value });
                    
                    request.onsuccess = () => resolve(true);
                    request.onerror = () => reject(request.error);
                });
            }
        };

        // Data variables
        let products = [];
        let activities = [];
        let orders = [];
        let currentAction = 'create';
        let currentProductId = null;
        let currentOrderId = null;
        let isMobileView = false;
        let isCompactMode = false;
        let resizeTimeout;
        let lastScrollTop = 0;
        let scrollTimeout;

        // Initialize app
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                // Initialize database
                await initDatabase();
                console.log('Database initialized successfully');
                
                // Load initial data
                await loadInitialData();
                
                // Initialize app
                initializeApp();
                loadDashboardData();
                setupEventListeners();
                checkViewport();
                await restoreSidebarState();
                
                // Add initial activity
                await addActivity('Dashboard session started', 'ri-rocket-line', 'success');
                
                // Listen for scroll to hide/show mobile button
                window.addEventListener('scroll', handleScroll);
                
                // Listen for window resize with debouncing
                window.addEventListener('resize', function() {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(function() {
                        handleResize();
                    }, 100);
                });
                
            } catch (error) {
                console.error('Failed to initialize app:', error);
                showNotification('Failed to load data. Please refresh the page.', 'ri-error-warning-line', 'danger');
            }
        });

        // Load initial data from database
        async function loadInitialData() {
            try {
                products = await dbOperations.getAll(STORES.PRODUCTS);
                activities = await dbOperations.getAll(STORES.ACTIVITIES);
                orders = await dbOperations.getAll(STORES.ORDERS);
                
                // Sort activities by timestamp (newest first)
                activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                console.log('Data loaded:', { 
                    products: products.length, 
                    activities: activities.length, 
                    orders: orders.length 
                });
            } catch (error) {
                console.error('Error loading initial data:', error);
                throw error;
            }
        }

        function initializeApp() {
            const menuItems = document.querySelectorAll('.menu li');
            const pageContents = document.querySelectorAll('.page-content');
            
            async function switchPage(pageId) {
                menuItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-page') === pageId) {
                        item.classList.add('active');
                    }
                });
                
                pageContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === pageId) {
                        content.classList.add('active');
                    }
                });
                
                const pageTitles = {
                    'dashboard': 'Dashboard',
                    'orders': 'Orders',
                    'inventory': 'Inventory',
                    'crud': 'Manage Products',
                    'shipping': 'Shipping'
                };
                
                document.querySelector('.title').textContent = pageTitles[pageId] || 'Dashboard';
                
                // Save current page to database
                await dbOperations.updateSetting('currentPage', pageId);
                
                // Close sidebar on mobile after selecting a page
                if (isMobileView) {
                    closeSidebar();
                }
                
                // Load page-specific data
                if (pageId === 'dashboard') {
                    loadDashboardData();
                } else if (pageId === 'orders') {
                    loadOrdersData();
                } else if (pageId === 'inventory') {
                    loadInventoryData();
                } else if (pageId === 'crud') {
                    loadProductsTable();
                } else if (pageId === 'shipping') {
                    loadShippingData();
                }
            }
            
            menuItems.forEach(item => {
                item.addEventListener('click', async function() {
                    const pageId = this.getAttribute('data-page');
                    await switchPage(pageId);
                });
            });
            
            // Load saved page from database
            dbOperations.getSetting('currentPage').then(savedPage => {
                switchPage(savedPage || 'dashboard');
            }).catch(() => {
                switchPage('dashboard');
            });
            
            // Add clear activity button listener
            document.getElementById('clearActivityBtn').addEventListener('click', clearAllActivities);
        }

        async function restoreSidebarState() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            try {
                const isCompact = await dbOperations.getSetting('sidebarCompact');
                
                if (window.innerWidth > 768) {
                    // Desktop mode
                    isMobileView = false;
                    
                    if (isCompact) {
                        sidebar.classList.add('compact');
                        mainContent.style.marginLeft = '80px';
                        mainContent.style.width = 'calc(100% - 80px)';
                        document.getElementById('collapseBtn').innerHTML = '<i class="ri-arrow-right-s-line"></i>';
                        document.getElementById('collapseBtn').title = 'Expand sidebar';
                        isCompactMode = true;
                    } else {
                        sidebar.classList.remove('compact');
                        mainContent.style.marginLeft = '250px';
                        mainContent.style.width = 'calc(100% - 250px)';
                        document.getElementById('collapseBtn').innerHTML = '<i class="ri-arrow-left-s-line"></i>';
                        document.getElementById('collapseBtn').title = 'Collapse sidebar';
                        isCompactMode = false;
                    }
                    
                    // Remove mobile-specific classes
                    sidebar.classList.remove('active');
                    document.getElementById('sidebarOverlay').classList.remove('active');
                } else {
                    // Mobile mode
                    isMobileView = true;
                    sidebar.classList.remove('compact');
                    mainContent.style.marginLeft = '0';
                    mainContent.style.width = '100%';
                    sidebar.classList.remove('active');
                    document.getElementById('sidebarOverlay').classList.remove('active');
                }
                
                updateMobileButtonVisibility();
            } catch (error) {
                console.error('Error restoring sidebar state:', error);
            }
        }

        function handleResize() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (window.innerWidth <= 768) {
                // Switching to mobile mode
                if (!isMobileView) {
                    isMobileView = true;
                    mobileMenuBtn.style.display = 'flex';
                    sidebar.classList.remove('compact');
                    mainContent.style.marginLeft = '0';
                    mainContent.style.width = '100%';
                    
                    // If sidebar was open in desktop mode, close it for mobile
                    if (sidebar.classList.contains('active')) {
                        sidebar.classList.remove('active');
                        document.getElementById('sidebarOverlay').classList.remove('active');
                    }
                }
            } else {
                // Switching to desktop mode
                if (isMobileView) {
                    isMobileView = false;
                    mobileMenuBtn.style.display = 'none';
                    
                    // Remove mobile-specific classes
                    sidebar.classList.remove('active');
                    document.getElementById('sidebarOverlay').classList.remove('active');
                    
                    // Restore desktop sidebar state
                    dbOperations.getSetting('sidebarCompact').then(isCompact => {
                        if (isCompact) {
                            sidebar.classList.add('compact');
                            mainContent.style.marginLeft = '80px';
                            mainContent.style.width = 'calc(100% - 80px)';
                            isCompactMode = true;
                        } else {
                            sidebar.classList.remove('compact');
                            mainContent.style.marginLeft = '250px';
                            mainContent.style.width = 'calc(100% - 250px)';
                            isCompactMode = false;
                        }
                    });
                }
            }
            
            updateMobileButtonVisibility();
        }

        function checkViewport() {
            handleResize();
        }

        function updateMobileButtonVisibility() {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const sidebar = document.getElementById('sidebar');
            
            if (isMobileView) {
                // On mobile, hide button when sidebar is open
                if (sidebar.classList.contains('active')) {
                    mobileMenuBtn.style.opacity = '0';
                    mobileMenuBtn.style.visibility = 'hidden';
                } else {
                    mobileMenuBtn.style.opacity = '1';
                    mobileMenuBtn.style.visibility = 'visible';
                }
            } else {
                // On desktop, ensure button is hidden
                mobileMenuBtn.style.opacity = '0';
                mobileMenuBtn.style.visibility = 'hidden';
            }
        }

        function setupEventListeners() {
            // Sidebar controls
            document.getElementById('mobileMenuBtn').addEventListener('click', toggleSidebar);
            document.getElementById('collapseBtn').addEventListener('click', toggleSidebarState);
            document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
            
            // Modal controls
            document.getElementById('addProductBtn').addEventListener('click', () => openModal('create'));
            document.getElementById('createProductBtn').addEventListener('click', () => openModal('create'));
            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('cancelBtn').addEventListener('click', closeModal);
            
            // Form submission
            document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
            
            // Close modal on outside click
            document.getElementById('crudModal').addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });
            
            // Refresh buttons
            document.getElementById('refreshInventoryBtn').addEventListener('click', async function() {
                await loadInitialData();
                loadInventoryData();
                addActivity('Inventory refreshed', 'ri-refresh-line', 'info');
            });
            
            document.getElementById('refreshProductsBtn').addEventListener('click', async function() {
                await loadInitialData();
                loadProductsTable();
                addActivity('Products list refreshed', 'ri-refresh-line', 'info');
            });
            
            // Orders page event listeners
            document.getElementById('refreshOrdersBtn').addEventListener('click', async function() {
                await loadInitialData();
                loadOrdersData();
                addActivity('Orders refreshed', 'ri-refresh-line', 'info');
            });
            
            document.getElementById('exportDropdownBtn').addEventListener('click', function(e) {
                e.stopPropagation();
                document.getElementById('exportDropdownMenu').classList.toggle('active');
            });
            
            document.getElementById('exportPdfBtn').addEventListener('click', function(e) {
                e.preventDefault();
                exportOrdersToPDF();
                document.getElementById('exportDropdownMenu').classList.remove('active');
            });
            
            document.getElementById('exportExcelBtn').addEventListener('click', function(e) {
                e.preventDefault();
                exportOrdersToExcel();
                document.getElementById('exportDropdownMenu').classList.remove('active');
            });
            
            document.getElementById('exportCsvBtn').addEventListener('click', function(e) {
                e.preventDefault();
                exportOrdersToCSV();
                document.getElementById('exportDropdownMenu').classList.remove('active');
            });
            
            document.getElementById('printOrdersBtn').addEventListener('click', printOrders);
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.export-dropdown')) {
                    document.getElementById('exportDropdownMenu').classList.remove('active');
                }
            });
            
            // Shipping modal event listeners
            document.getElementById('updateShippingBtn').addEventListener('click', function() {
                openShippingModal();
            });
            
            document.getElementById('closeShippingModal').addEventListener('click', closeShippingModal);
            document.getElementById('cancelShippingBtn').addEventListener('click', closeShippingModal);
            
            document.getElementById('shippingForm').addEventListener('submit', handleShippingSubmit);
            
            // Close shipping modal on outside click
            document.getElementById('shippingModal').addEventListener('click', function(e) {
                if (e.target === this) closeShippingModal();
            });
        }

        // Sidebar functions
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            if (isMobileView) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
                updateMobileButtonVisibility();
            } else {
                toggleCompactMode();
            }
        }

        function closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            updateMobileButtonVisibility();
        }

        async function toggleCompactMode(forceState = null) {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const collapseBtn = document.getElementById('collapseBtn');
            
            // Only allow compact mode on desktop
            if (isMobileView) return;
            
            if (forceState !== null) {
                isCompactMode = forceState;
            } else {
                isCompactMode = !sidebar.classList.contains('compact');
            }
            
            if (isCompactMode) {
                sidebar.classList.add('compact');
                collapseBtn.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
                collapseBtn.title = 'Expand sidebar';
                mainContent.style.marginLeft = '80px';
                mainContent.style.width = 'calc(100% - 80px)';
            } else {
                sidebar.classList.remove('compact');
                collapseBtn.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
                collapseBtn.title = 'Collapse sidebar';
                mainContent.style.marginLeft = '250px';
                mainContent.style.width = 'calc(100% - 250px)';
            }
            
            // Save to database
            await dbOperations.updateSetting('sidebarCompact', isCompactMode);
        }

        function toggleSidebarState() {
            if (isMobileView) {
                closeSidebar();
            } else {
                toggleCompactMode();
            }
        }

        // Activity Functions
        async function addActivity(title, icon = 'ri-edit-line', type = 'info') {
            try {
                const newActivity = {
                    icon: icon,
                    title: title,
                    timestamp: new Date(),
                    type: type
                };
                
                // Add to database
                const newId = await dbOperations.add(STORES.ACTIVITIES, newActivity);
                newActivity.id = newId;
                
                // Update local array
                activities.unshift(newActivity);
                
                // Keep only last 50 activities in memory
                if (activities.length > 50) {
                    activities = activities.slice(0, 50);
                }
                
                // Update UI
                updateRecentActivity();
                
            } catch (error) {
                console.error('Error adding activity:', error);
            }
        }

        function getTimeAgo(timestamp) {
            const now = new Date();
            const timestampDate = new Date(timestamp);
            const diffMs = now - timestampDate;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);
            
            if (diffSec < 60) return 'Just now';
            if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
            if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
            if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
            
            return timestampDate.toLocaleDateString();
        }

        function updateRecentActivity() {
            const container = document.getElementById('recentActivity');
            
            // Keep only last 10 activities for display
            const recentActivities = activities.slice(0, 10);
            
            if (recentActivities.length === 0) {
                container.innerHTML = `
                    <div class="no-activities">
                        <p>No recent activity</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            recentActivities.forEach(activity => {
                const timeAgo = getTimeAgo(activity.timestamp);
                
                html += `
                    <div class="activity-item">
                        <div class="activity-icon activity-${activity.type}">
                            <i class="${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">${activity.title}</div>
                            <div class="activity-time">${timeAgo}</div>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        async function clearAllActivities() {
            if (activities.length > 0 && confirm('Are you sure you want to clear all activities?')) {
                try {
                    // Get all activity IDs
                    const allActivities = await dbOperations.getAll(STORES.ACTIVITIES);
                    
                    // Delete all activities from database
                    for (const activity of allActivities) {
                        await dbOperations.delete(STORES.ACTIVITIES, activity.id);
                    }
                    
                    // Clear local array
                    activities = [];
                    
                    // Update UI
                    updateRecentActivity();
                    
                    // Add activity about clearing
                    await addActivity('All activities cleared', 'ri-delete-bin-line', 'danger');
                    
                } catch (error) {
                    console.error('Error clearing activities:', error);
                    showNotification('Failed to clear activities', 'ri-error-warning-line', 'danger');
                }
            }
        }

        // CRUD Operations
        function openModal(action, productId = null) {
            const modal = document.getElementById('crudModal');
            const modalTitle = document.getElementById('modalTitle');
            const submitBtn = document.getElementById('submitBtn');
            const productIdField = document.getElementById('productIdField');
            
            currentAction = action;
            currentProductId = productId;
            
            // Reset form
            document.getElementById('productForm').reset();
            
            if (action === 'create') {
                modalTitle.textContent = 'Add New Product';
                submitBtn.innerHTML = '<i class="ri-add-line"></i> Add Product';
                submitBtn.className = 'btn btn-primary';
                productIdField.style.display = 'none';
            } else if (action === 'edit') {
                modalTitle.textContent = 'Edit Product';
                submitBtn.innerHTML = '<i class="ri-edit-line"></i> Update Product';
                submitBtn.className = 'btn btn-success';
                productIdField.style.display = 'block';
                
                // Populate form with product data
                const product = products.find(p => p.id === productId);
                if (product) {
                    document.getElementById('productId').value = product.id;
                    document.getElementById('productName').value = product.name;
                    document.getElementById('productModel').value = product.model;
                    document.getElementById('productCategory').value = product.category;
                    document.getElementById('productQuantity').value = product.quantity;
                    document.getElementById('productPrice').value = product.price;
                }
            }
            
            modal.classList.add('active');
        }

        function closeModal() {
            document.getElementById('crudModal').classList.remove('active');
        }

        async function handleFormSubmit(e) {
            e.preventDefault();
            
            const productData = {
                name: document.getElementById('productName').value,
                model: document.getElementById('productModel').value,
                category: document.getElementById('productCategory').value,
                quantity: parseInt(document.getElementById('productQuantity').value),
                price: parseFloat(document.getElementById('productPrice').value)
            };
            
            if (currentAction === 'create') {
                await createProduct(productData);
            } else if (currentAction === 'edit') {
                await updateProduct(currentProductId, productData);
            }
            
            closeModal();
        }

        async function createProduct(productData) {
            try {
                // Add to database
                const newId = await dbOperations.add(STORES.PRODUCTS, productData);
                productData.id = newId;
                
                // Update local array
                products.push(productData);
                
                showNotification('Product added successfully!');
                await addActivity(`New product added: ${productData.name}`, 'ri-archive-line', 'success');
                
                // Refresh data
                await loadDashboardData();
                await loadInventoryData();
                await loadProductsTable();
                
            } catch (error) {
                console.error('Error creating product:', error);
                showNotification('Failed to add product', 'ri-error-warning-line', 'danger');
            }
        }

        async function updateProduct(productId, productData) {
            try {
                const index = products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    const oldProduct = products[index];
                    productData.id = productId;
                    
                    // Update in database
                    await dbOperations.update(STORES.PRODUCTS, productData);
                    
                    // Update local array
                    products[index] = productData;
                    
                    showNotification('Product updated successfully!');
                    await addActivity(`Product updated: ${oldProduct.name} → ${productData.name}`, 'ri-edit-line', 'warning');
                    
                    // Refresh data
                    await loadDashboardData();
                    await loadInventoryData();
                    await loadProductsTable();
                }
            } catch (error) {
                console.error('Error updating product:', error);
                showNotification('Failed to update product', 'ri-error-warning-line', 'danger');
            }
        }

        async function deleteProduct(productId) {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    const product = products.find(p => p.id === productId);
                    
                    // Delete from database
                    await dbOperations.delete(STORES.PRODUCTS, productId);
                    
                    // Update local array
                    products = products.filter(p => p.id !== productId);
                    
                    showNotification('Product deleted successfully!');
                    
                    if (product) {
                        await addActivity(`Product deleted: ${product.name}`, 'ri-delete-bin-line', 'danger');
                    }
                    
                    // Refresh data
                    await loadDashboardData();
                    await loadInventoryData();
                    await loadProductsTable();
                    
                } catch (error) {
                    console.error('Error deleting product:', error);
                    showNotification('Failed to delete product', 'ri-error-warning-line', 'danger');
                }
            }
        }

        // Data loading functions
        async function loadDashboardData() {
            try {
                // Update total products
                document.getElementById('totalProducts').textContent = products.length;
                
                // Update low stock count
                const lowStockCount = products.filter(p => p.quantity <= 10).length;
                document.getElementById('lowStockCount').textContent = lowStockCount;
                
                // Calculate sales this month
                await calculateMonthlySales();
                
                // Update shipping status count
                await updateShippingStatus();
                
                // Update pie chart and legend
                updateCategoryChart();
                
                // Update recent activity
                updateRecentActivity();
                
                // Update recent orders
                await updateRecentOrders();
                
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }

        // Sales calculation functions
        async function calculateMonthlySales() {
            try {
                const allOrders = await dbOperations.getAll(STORES.ORDERS);
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                // Filter orders for current month AND status completed/delivered
                const monthlyOrders = allOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    const isCurrentMonth = orderDate.getMonth() === currentMonth && 
                                           orderDate.getFullYear() === currentYear;
                    
                    // Only count delivered/completed orders as actual revenue
                    return isCurrentMonth && 
                           (order.shippingStatus === SHIPPING_STATUS.DELIVERED || 
                            order.status === 'completed');
                });
                
                // Calculate total sales
                const monthlySales = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);
                
                // Calculate percentage change from last month
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                
                const lastMonthOrders = allOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    const isLastMonth = orderDate.getMonth() === lastMonth && 
                                       orderDate.getFullYear() === lastMonthYear;
                    
                    return isLastMonth && 
                           (order.shippingStatus === SHIPPING_STATUS.DELIVERED || 
                            order.status === 'completed');
                });
                
                const lastMonthSales = lastMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
                
                let percentageChange = 0;
                if (lastMonthSales > 0) {
                    percentageChange = ((monthlySales - lastMonthSales) / lastMonthSales) * 100;
                } else if (monthlySales > 0) {
                    percentageChange = 100; // First month with sales
                }
                
                // Update dashboard
                const salesElement = document.querySelector('.card.pie1 .value');
                const trendElement = document.querySelector('.card.pie1 .trend');
                
                if (salesElement) {
                    salesElement.textContent = `₱${monthlySales.toLocaleString()}`;
                }
                
                if (trendElement) {
                    const icon = percentageChange >= 0 ? 'ri-line-chart-line' : 'ri-arrow-down-line';
                    const color = percentageChange >= 0 ? '#48bb78' : '#f56565';
                    const changeText = percentageChange >= 0 ? 
                        `+${percentageChange.toFixed(1)}% from last month` : 
                        `${percentageChange.toFixed(1)}% from last month`;
                    
                    trendElement.innerHTML = `<i class="${icon}"></i> ${changeText}`;
                    trendElement.style.color = color;
                }
                
            } catch (error) {
                console.error('Error calculating monthly sales:', error);
            }
        }

        async function updateShippingStatus() {
            try {
                const allOrders = await dbOperations.getAll(STORES.ORDERS);
                
                // Count orders by shipping status
                const statusCounts = {
                    pending: allOrders.filter(o => o.shippingStatus === SHIPPING_STATUS.PENDING).length,
                    processing: allOrders.filter(o => o.shippingStatus === SHIPPING_STATUS.PROCESSING).length,
                    shipped: allOrders.filter(o => o.shippingStatus === SHIPPING_STATUS.SHIPPED).length,
                    delivered: allOrders.filter(o => o.shippingStatus === SHIPPING_STATUS.DELIVERED).length
                };
                
                // Update dashboard with shipping summary
                const shippingCard = document.querySelector('.card.pie2');
                if (shippingCard) {
                    const shippingInfo = shippingCard.querySelector('.legend');
                    if (shippingInfo) {
                        shippingInfo.innerHTML = `
                            <div class="legend-item">
                                <div style="display: flex; align-items: center;">
                                    <div class="legend-color" style="background: #47a8e8"></div>
                                    <div class="legend-label">Pending</div>
                                </div>
                                <div class="legend-value">${statusCounts.pending}</div>
                            </div>
                            <div class="legend-item">
                                <div style="display: flex; align-items: center;">
                                    <div class="legend-color" style="background: #ffc107"></div>
                                    <div class="legend-label">Processing</div>
                                </div>
                                <div class="legend-value">${statusCounts.processing}</div>
                            </div>
                            <div class="legend-item">
                                <div style="display: flex; align-items: center;">
                                    <div class="legend-color" style="background: #ff6e4a"></div>
                                    <div class="legend-label">Shipped</div>
                                </div>
                                <div class="legend-value">${statusCounts.shipped}</div>
                            </div>
                            <div class="legend-item">
                                <div style="display: flex; align-items: center;">
                                    <div class="legend-color" style="background: #6bd46e"></div>
                                    <div class="legend-label">Delivered</div>
                                </div>
                                <div class="legend-value">${statusCounts.delivered}</div>
                            </div>
                        `;
                    }
                }
                
            } catch (error) {
                console.error('Error updating shipping status:', error);
            }
        }

        // Orders Statistics Functions
        async function updateOrdersStatistics() {
            try {
                // Get all orders
                const allOrders = await dbOperations.getAll(STORES.ORDERS);
                
                // Total Orders
                const totalOrders = allOrders.length;
                document.getElementById('totalOrdersCount').textContent = totalOrders;
                
                // Pending Orders
                const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
                document.getElementById('pendingOrdersCount').textContent = pendingOrders;
                
                // Current month revenue
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                const currentMonthOrders = allOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    const isCurrentMonth = orderDate.getMonth() === currentMonth && 
                                           orderDate.getFullYear() === currentYear;
                    
                    return isCurrentMonth && 
                           (order.shippingStatus === SHIPPING_STATUS.DELIVERED || 
                            order.status === 'completed');
                });
                
                const monthlyRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
                document.getElementById('monthlyRevenue').textContent = `₱${monthlyRevenue.toLocaleString()}`;
                
                // Total Revenue (only completed/delivered orders)
                const completedOrders = allOrders.filter(order => 
                    order.shippingStatus === SHIPPING_STATUS.DELIVERED || 
                    order.status === 'completed'
                );
                const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
                document.getElementById('totalRevenue').textContent = `₱${totalRevenue.toLocaleString()}`;
                
                // Update orders table total
                document.getElementById('ordersTotal').textContent = `₱${totalRevenue.toLocaleString()}`;
                
            } catch (error) {
                console.error('Error updating orders statistics:', error);
            }
        }

        async function loadOrdersData() {
            try {
                // Load orders from database if not already loaded
                if (orders.length === 0) {
                    orders = await dbOperations.getAll(STORES.ORDERS);
                }
                
                // Update statistics
                await updateOrdersStatistics();
                
                // Display orders in the orders page
                const container = document.getElementById('ordersBody');
                if (container) {
                    let html = '';
                    orders.forEach(order => {
                        const shippingBadge = getShippingBadge(order.shippingStatus);
                        
                        html += `
                            <tr>
                                <td>${order.orderId}</td>
                                <td>${order.date}</td>
                                <td>${order.customer}</td>
                                <td><span class="badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                                <td>${shippingBadge}</td>
                                <td>₱${(order.total || 0).toLocaleString()}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="window.currentOrderId = ${order.id}; window.openShippingModal();" style="height:40px; width:100px; font-size: 12px;">
                                        <i class="ri-truck-line"></i> Shipping
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                    container.innerHTML = html;
                }
                
                // Display recent orders in dashboard
                await updateRecentOrders();
                
            } catch (error) {
                console.error('Error loading orders data:', error);
            }
        }

        function getShippingBadge(status) {
            const badgeClasses = {
                'pending': 'badge pending',
                'processing': 'badge warning',
                'shipped': 'badge shipped',
                'delivered': 'badge completed',
                'cancelled': 'badge danger'
            };
            
            const badgeTexts = {
                'pending': 'Pending',
                'processing': 'Processing',
                'shipped': 'Shipped',
                'delivered': 'Delivered',
                'cancelled': 'Cancelled'
            };
            
            const className = badgeClasses[status] || 'badge pending';
            const text = badgeTexts[status] || 'Pending';
            
            return `<span class="${className}">${text}</span>`;
        }

        async function loadInventoryData() {
            try {
                const tbody = document.getElementById('inventoryBody');
                if (!tbody) return;
                
                tbody.innerHTML = '';
                
                products.forEach(product => {
                    const status = product.quantity > 10 ? 'success' : 'danger';
                    const statusText = product.quantity > 10 ? 'In Stock' : 'Low Stock';
                    const stockClass = product.quantity > 10 ? 'stock-ok' : 'stock-low';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.name}</td>
                        <td>${product.model}</td>
                        <td>${product.category}</td>
                        <td class="${stockClass}">${product.quantity}</td>
                        <td>₱${product.price.toLocaleString()}</td>
                        <td><span class="badge ${status}">${statusText}</span></td>
                        <td>
                            <button class="btn btn-primary" onclick="window.openModal('edit', ${product.id})" style=" height:40px; width:80px; font-size: 12px;">
                                <i class="ri-edit-line"></i> Edit
                            </button>
                            <br>
                            <button class="btn btn-danger" onclick="window.deleteProduct(${product.id})" style=" height:40px; width:80px;  font-size: 12px;">
                                <i class="ri-delete-bin-line"></i> Delete
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading inventory data:', error);
            }
        }

        async function loadProductsTable() {
            try {
                const tbody = document.getElementById('productsTable');
                if (!tbody) return;
                
                tbody.innerHTML = '';
                
                products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.quantity}</td>
                        <td>₱${product.price.toLocaleString()}</td>
                        <td>
                            <button class="btn btn-primary" onclick="window.openModal('edit', ${product.id})" style="height:40px; width:80px; font-size: 12px; margin-right: 5px;">
                                <i class="ri-edit-line"></i> Edit
                            </button>
                            <br>
                            <button class="btn btn-danger" onclick="window.deleteProduct(${product.id})" style=" height:40px; width:80px; font-size: 12px;">
                                <i class="ri-delete-bin-line"></i> Delete
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading products table:', error);
            }
        }

        // Shipping Functions
        async function loadShippingData() {
            try {
                const allOrders = await dbOperations.getAll(STORES.ORDERS);
                const container = document.getElementById('shippingBody');
                
                if (container) {
                    let html = '';
                    
                    // Filter orders that need shipping attention
                    const shippingOrders = allOrders.filter(order => 
                        order.shippingStatus === SHIPPING_STATUS.PENDING || 
                        order.shippingStatus === SHIPPING_STATUS.PROCESSING
                    );
                    
                    if (shippingOrders.length === 0) {
                        html = `
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 40px; color: #718096;">
                                    <i class="ri-checkbox-circle-line" style="font-size: 48px; margin-bottom: 10px; display: block; color: #48bb78;"></i>
                                    <p>All orders have been processed!</p>
                                </td>
                            </tr>
                        `;
                    } else {
                        shippingOrders.forEach(order => {
                            const statusClass = getShippingStatusClass(order.shippingStatus);
                            const statusText = getShippingStatusText(order.shippingStatus);
                            
                            html += `
                                <tr>
                                    <td>${order.orderId}</td>
                                    <td>${order.date}</td>
                                    <td>${order.customer}</td>
                                    <td>${order.shippingAddress || 'Not provided'}</td>
                                    <td>${order.trackingNumber || 'Not assigned'}</td>
                                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                                    <td>
                                        <button class="btn btn-primary" onclick="window.currentOrderId = ${order.id}; window.openShippingModal();" style="height:40px; width:100px; font-size: 12px;">
                                            <i class="ri-edit-line"></i> Update
                                        </button>
                                    </td>
                                </tr>
                            `;
                        });
                    }
                    
                    container.innerHTML = html;
                }
            } catch (error) {
                console.error('Error loading shipping data:', error);
            }
        }

        function getShippingStatusClass(status) {
            switch(status) {
                case SHIPPING_STATUS.PENDING: return 'pending';
                case SHIPPING_STATUS.PROCESSING: return 'warning';
                case SHIPPING_STATUS.SHIPPED: return 'shipped';
                case SHIPPING_STATUS.DELIVERED: return 'completed';
                case SHIPPING_STATUS.CANCELLED: return 'danger';
                default: return 'pending';
            }
        }

        function getShippingStatusText(status) {
            switch(status) {
                case SHIPPING_STATUS.PENDING: return 'Pending';
                case SHIPPING_STATUS.PROCESSING: return 'Processing';
                case SHIPPING_STATUS.SHIPPED: return 'Shipped';
                case SHIPPING_STATUS.DELIVERED: return 'Delivered';
                case SHIPPING_STATUS.CANCELLED: return 'Cancelled';
                default: return 'Pending';
            }
        }

        function openShippingModal() {
            const modal = document.getElementById('shippingModal');
            const order = orders.find(o => o.id === currentOrderId);
            
            if (order) {
                document.getElementById('shippingOrderId').value = order.orderId;
                document.getElementById('shippingCustomer').value = order.customer;
                document.getElementById('shippingAddress').value = order.shippingAddress || '';
                document.getElementById('shippingStatus').value = order.shippingStatus || SHIPPING_STATUS.PENDING;
                document.getElementById('trackingNumber').value = order.trackingNumber || '';
            }
            
            modal.classList.add('active');
        }

        function closeShippingModal() {
            document.getElementById('shippingModal').classList.remove('active');
            currentOrderId = null;
        }

        async function handleShippingSubmit(e) {
            e.preventDefault();
            
            const orderId = currentOrderId;
            const shippingStatus = document.getElementById('shippingStatus').value;
            const trackingNumber = document.getElementById('trackingNumber').value;
            const shippingAddress = document.getElementById('shippingAddress').value;
            
            try {
                const order = orders.find(o => o.id === orderId);
                if (order) {
                    const updatedOrder = {
                        ...order,
                        shippingStatus: shippingStatus,
                        trackingNumber: trackingNumber,
                        shippingAddress: shippingAddress
                    };
                    
                    // Update order status based on shipping status
                    if (shippingStatus === SHIPPING_STATUS.DELIVERED) {
                        updatedOrder.status = 'completed';
                        
                        // Add revenue to monthly calculation
                        await calculateMonthlySales(); // Recalculate immediately
                    } else if (shippingStatus === SHIPPING_STATUS.SHIPPED) {
                        updatedOrder.status = 'shipped';
                    }
                    
                    // Update in database
                    await dbOperations.update(STORES.ORDERS, updatedOrder);
                    
                    // Update local array
                    const index = orders.findIndex(o => o.id === orderId);
                    if (index !== -1) {
                        orders[index] = updatedOrder;
                    }
                    
                    // Add activity
                    await addActivity(`Shipping updated for ${order.orderId}: ${getShippingStatusText(order.shippingStatus)} → ${getShippingStatusText(shippingStatus)}`, 'ri-truck-line', 'info');
                    
                    showNotification('Shipping status updated successfully!');
                    
                    // Refresh all data - IMPORTANT: await these
                    await loadDashboardData(); // This will update recent orders
                    await loadOrdersData(); // This will update orders page
                    await loadShippingData(); // This will update shipping page
                    
                    // Specifically recalculate revenue
                    await calculateMonthlySales();
                    
                    closeShippingModal();
                }
            } catch (error) {
                console.error('Error updating shipping status:', error);
                showNotification('Failed to update shipping status', 'ri-error-warning-line', 'danger');
            }
        }

        function updateCategoryChart() {
            const categories = {};
            products.forEach(product => {
                categories[product.category] = (categories[product.category] || 0) + 1;
            });
            
            const total = products.length;
            const legendContainer = document.getElementById('categoryLegend');
            if (!legendContainer) return;
            
            legendContainer.innerHTML = '';
            
            let legendHTML = '';
            const colors = ['#47a8e8', '#ff6e4a', '#6bd46e', '#ffc107', '#9c27b0'];
            let colorIndex = 0;
            
            for (const [category, count] of Object.entries(categories)) {
                const percentage = ((count / total) * 100).toFixed(1);
                legendHTML += `
                    <div class="legend-item">
                        <div style="display: flex; align-items: center;">
                            <div class="legend-color" style="background: ${colors[colorIndex % colors.length]}"></div>
                            <div class="legend-label">${category}</div>
                        </div>
                        <div class="legend-value">${percentage}%</div>
                    </div>
                `;
                colorIndex++;
            }
            
            legendContainer.innerHTML = legendHTML;
            const pieTotal = document.getElementById('pieTotal');
            if (pieTotal) {
                pieTotal.textContent = `${total}`;
            }
        }

        async function updateRecentOrders() {
            try {
                const tbody = document.getElementById('recentOrders');
                if (!tbody) return;
                
                // Get recent orders (last 3)
                const recentOrders = orders.slice(0, 3);
                
                let html = '';
                recentOrders.forEach(order => {
                    html += `
                        <tr>
                            <td>${order.orderId}</td>
                            <td>${order.date}</td>
                            <td>${order.customer}</td>
                            <td><span class="badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                        </tr>
                    `;
                });
                
                tbody.innerHTML = html;
            } catch (error) {
                console.error('Error updating recent orders:', error);
            }
        }

        function showNotification(message, icon = 'ri-checkbox-circle-line', type = 'success') {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#48bb78' : type === 'danger' ? '#f56565' : '#4299e1'};
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 1001;
                animation: slideIn 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            notification.innerHTML = `
                <i class="${icon}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Export and Print Functions
        async function exportOrdersToPDF() {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Add title
                doc.setFontSize(20);
                doc.setTextColor(40, 40, 40);
                doc.text('Syntryx - Orders Report', 105, 15, { align: 'center' });
                
                // Add date
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
                
                // Add statistics
                doc.setFontSize(12);
                doc.setTextColor(40, 40, 40);
                const allOrders = await dbOperations.getAll(STORES.ORDERS);
                
                // Calculate statistics
                const totalOrders = allOrders.length;
                const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
                const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
                
                doc.text(`Total Orders: ${totalOrders}`, 20, 35);
                doc.text(`Pending Orders: ${pendingOrders}`, 20, 42);
                doc.text(`Total Revenue: ₱${totalRevenue.toLocaleString()}`, 20, 49);
                
                // Prepare table data
                const tableData = allOrders.map(order => [
                    order.orderId,
                    order.date,
                    order.customer,
                    order.status.charAt(0).toUpperCase() + order.status.slice(1),
                    getShippingStatusText(order.shippingStatus),
                    `₱${(order.total || 0).toLocaleString()}`
                ]);
                
                // Add table
                doc.autoTable({
                    head: [['Order ID', 'Date', 'Customer', 'Status', 'Shipping Status', 'Total (₱)']],
                    body: tableData,
                    startY: 60,
                    theme: 'striped',
                    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                    alternateRowStyles: { fillColor: [245, 245, 245] }
                });
                
                // Save the PDF
                doc.save(`syntryx-orders-${new Date().toISOString().split('T')[0]}.pdf`);
                
                showNotification('Orders exported to PDF successfully', 'ri-file-pdf-line', 'info');
                
            } catch (error) {
                console.error('Error exporting to PDF:', error);
                showNotification('Failed to export PDF', 'ri-error-warning-line', 'danger');
            }
        }

        function exportOrdersToExcel() {
            try {
                const allOrders = orders;
                
                // Create CSV content
                let csv = 'Order ID,Date,Customer,Status,Shipping Status,Total (₱)\n';
                
                allOrders.forEach(order => {
                    csv += `"${order.orderId}","${order.date}","${order.customer}","${order.status}","${getShippingStatusText(order.shippingStatus)}","₱${(order.total || 0).toLocaleString()}"\n`;
                });
                
                // Create blob and download
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                
                link.setAttribute('href', url);
                link.setAttribute('download', `syntryx-orders-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification('Orders exported to Excel/CSV successfully', 'ri-file-excel-line', 'info');
                
            } catch (error) {
                console.error('Error exporting to Excel:', error);
                showNotification('Failed to export Excel', 'ri-error-warning-line', 'danger');
            }
        }

        function exportOrdersToCSV() {
            exportOrdersToExcel(); // Same function for CSV
        }

        function printOrders() {
            try {
                // Create a print-friendly version
                const printContent = document.createElement('div');
                printContent.style.cssText = `
                    font-family: 'Inter', sans-serif;
                    padding: 20px;
                    max-width: 1000px;
                    margin: 0 auto;
                `;
                
                // Add title
                printContent.innerHTML = `
                    <h1 style="text-align: center; color: #2d3748; margin-bottom: 5px;">Syntryx - Orders Report</h1>
                    <p style="text-align: center; color: #718096; margin-bottom: 20px;">
                        Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
                    </p>
                `;
                
                // Add statistics
                const totalOrders = orders.length;
                const pendingOrders = orders.filter(order => order.status === 'pending').length;
                const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
                
                const statsHTML = `
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #718096;">Total Orders</h3>
                            <div style="font-size: 24px; font-weight: bold; color: #2d3748;">${totalOrders}</div>
                        </div>
                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #718096;">Pending Orders</h3>
                            <div style="font-size: 24px; font-weight: bold; color: #ed8936;">${pendingOrders}</div>
                        </div>
                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #718096;">Total Revenue</h3>
                            <div style="font-size: 24px; font-weight: bold; color: #48bb78;">₱${totalRevenue.toLocaleString()}</div>
                        </div>
                    </div>
                `;
                
                printContent.innerHTML += statsHTML;
                
                // Create table
                let tableHTML = `
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background: #f7fafc;">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Order ID</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Date</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Customer</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Status</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Shipping Status</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Total (₱)</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                orders.forEach(order => {
                    const statusColor = order.status === 'completed' ? '#065f46' : 
                                      order.status === 'pending' ? '#92400e' : 
                                      order.status === 'shipped' ? '#1e40af' : '#718096';
                    
                    const shippingStatusColor = order.shippingStatus === 'delivered' ? '#065f46' :
                                              order.shippingStatus === 'shipped' ? '#1e40af' :
                                              order.shippingStatus === 'processing' ? '#ed8936' :
                                              order.shippingStatus === 'pending' ? '#92400e' : '#718096';
                    
                    tableHTML += `
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 12px;">${order.orderId}</td>
                            <td style="padding: 12px;">${order.date}</td>
                            <td style="padding: 12px;">${order.customer}</td>
                            <td style="padding: 12px;">
                                <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${statusColor}15; color: ${statusColor};">
                                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </td>
                            <td style="padding: 12px;">
                                <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${shippingStatusColor}15; color: ${shippingStatusColor};">
                                    ${getShippingStatusText(order.shippingStatus)}
                                </span>
                            </td>
                            <td style="padding: 12px; font-weight: bold;">₱${(order.total || 0).toLocaleString()}</td>
                        </tr>
                    `;
                });
                
                tableHTML += `
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="5" style="padding: 12px; text-align: right; font-weight: bold;">Total Revenue:</td>
                                <td style="padding: 12px; font-weight: bold;">₱${totalRevenue.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                `;
                
                printContent.innerHTML += tableHTML;
                
                // Open print window
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Syntryx - Orders Report</title>
                            <style>
                                @media print {
                                    @page { margin: 0.5in; }
                                    body { -webkit-print-color-adjust: exact; }
                                }
                            </style>
                        </head>
                        <body>
                            ${printContent.innerHTML}
                            <script>
                                window.onload = function() {
                                    window.print();
                                    window.onafterprint = function() {
                                        window.close();
                                    };
                                };
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                
            } catch (error) {
                console.error('Error printing orders:', error);
                showNotification('Failed to print', 'ri-error-warning-line', 'danger');
            }
        }

        // Database management functions
        async function exportDatabase() {
            try {
                const data = {
                    products: await dbOperations.getAll(STORES.PRODUCTS),
                    activities: await dbOperations.getAll(STORES.ACTIVITIES),
                    orders: await dbOperations.getAll(STORES.ORDERS),
                    settings: await dbOperations.getAll(STORES.SETTINGS),
                    exportDate: new Date().toISOString()
                };
                
                const dataStr = JSON.stringify(data, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                
                const exportFileDefaultName = `syntryx-backup-${new Date().toISOString().split('T')[0]}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
                
                showNotification('Database exported successfully', 'ri-download-line', 'info');
                
            } catch (error) {
                console.error('Error exporting database:', error);
                showNotification('Failed to export database', 'ri-error-warning-line', 'danger');
            }
        }

        async function importDatabase(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = async function(event) {
                    try {
                        const data = JSON.parse(event.target.result);
                        
                        // Clear existing data
                        await clearAllData();
                        
                        // Import products
                        for (const product of data.products || []) {
                            await dbOperations.add(STORES.PRODUCTS, product);
                        }
                        
                        // Import activities
                        for (const activity of data.activities || []) {
                            await dbOperations.add(STORES.ACTIVITIES, activity);
                        }
                        
                        // Import orders
                        for (const order of data.orders || []) {
                            await dbOperations.add(STORES.ORDERS, order);
                        }
                        
                        // Import settings
                        for (const setting of data.settings || []) {
                            await dbOperations.update(STORES.SETTINGS, setting);
                        }
                        
                        // Reload data
                        await loadInitialData();
                        
                        showNotification('Database imported successfully', 'ri-upload-line', 'info');
                        resolve();
                        
                    } catch (error) {
                        console.error('Error importing database:', error);
                        showNotification('Failed to import database', 'ri-error-warning-line', 'danger');
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    showNotification('Failed to read file', 'ri-error-warning-line', 'danger');
                    reject(reader.error);
                };
                
                reader.readAsText(file);
            });
        }

        async function clearAllData() {
            try {
                // Clear all stores
                const stores = [STORES.PRODUCTS, STORES.ACTIVITIES, STORES.ORDERS];
                
                for (const storeName of stores) {
                    const items = await dbOperations.getAll(storeName);
                    for (const item of items) {
                        await dbOperations.delete(storeName, item.id);
                    }
                }
                
                // Reset local arrays
                products = [];
                activities = [];
                orders = [];
                
            } catch (error) {
                console.error('Error clearing data:', error);
                throw error;
            }
        }

        // Scroll handler for mobile button visibility
        function handleScroll() {
            if (!isMobileView) return;
            
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollThreshold = 100; // pixels to scroll before hiding
            
            // Clear any existing timeout
            clearTimeout(scrollTimeout);
            
            // Show button if near top of page
            if (scrollTop < scrollThreshold) {
                mobileMenuBtn.classList.remove('hidden');
                mobileMenuBtn.classList.add('visible');
                return;
            }
            
            // Determine scroll direction
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide button
                mobileMenuBtn.classList.remove('visible');
                mobileMenuBtn.classList.add('hidden');
            } else {
                // Scrolling up - show button
                mobileMenuBtn.classList.remove('hidden');
                mobileMenuBtn.classList.add('visible');
                
                // Auto-hide after 3 seconds if not at top
                scrollTimeout = setTimeout(() => {
                    if (scrollTop > scrollThreshold) {
                        mobileMenuBtn.classList.remove('visible');
                        mobileMenuBtn.classList.add('hidden');
                    }
                }, 3000);
            }
            
            lastScrollTop = scrollTop;
        }

        // ==============================
        // MAKE FUNCTIONS GLOBALLY ACCESSIBLE
        // ==============================
        window.updateShippingStatusOrder = function(orderId) {
            currentOrderId = orderId;
            openShippingModal();
        };

        window.deleteProduct = deleteProduct;
        window.openModal = openModal;
        window.openShippingModal = openShippingModal;
        window.updateShippingStatusOrder = function(orderId) {
            currentOrderId = orderId;
            openShippingModal();
        };