// Portfolio Analyzer Application
class PortfolioAnalyzer {
    constructor() {
        this.portfolioData = null;
        this.currentFile = null;
        this.charts = {};
        this.originalHoldingsData = [];
        this.currentHoldingsData = [];
        this.currentSortColumn = null;
        this.currentSortAscending = true;
        
        this.initializeEventListeners();
        this.setupDragAndDrop();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // File input
        document.getElementById('file-input').addEventListener('change', this.handleFileSelection.bind(this));
        
        // Buttons
        document.getElementById('analyze-btn').addEventListener('click', this.analyzeFile.bind(this));
        document.getElementById('clear-file-btn').addEventListener('click', this.clearFile.bind(this));
        document.getElementById('clear-analysis-btn').addEventListener('click', this.clearAnalysis.bind(this));
        document.getElementById('export-btn').addEventListener('click', this.exportToCSV.bind(this));
        document.getElementById('demo-btn').addEventListener('click', this.showDemoAnalysis.bind(this));
        
        // Search functionality
        document.getElementById('holdings-search').addEventListener('input', this.filterHoldings.bind(this));
        
        // Table sorting
        document.querySelectorAll('#holdings-table th[data-sort]').forEach(th => {
            th.addEventListener('click', () => this.sortTable(th.dataset.sort));
        });
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        const uploadArea = document.getElementById('upload-area');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!uploadArea.contains(e.relatedTarget)) {
                uploadArea.classList.remove('dragover');
            }
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelection({ target: { files } });
            }
        });
        
        uploadArea.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
    }

    // Handle file selection
    handleFileSelection(event) {
        const file = event.target.files[0];
        
        if (!file) return;
        
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
            this.showToast('Please select an Excel file (.xlsx or .xls)', 'error');
            return;
        }
        
        this.currentFile = file;
        this.showFileInfo(file);
    }

    // Show file information
    showFileInfo(file) {
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-size').textContent = this.formatFileSize(file.size);
        
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('file-info').classList.remove('hidden');
    }

    // Clear selected file
    clearFile() {
        this.currentFile = null;
        document.getElementById('file-input').value = '';
        document.getElementById('password-input').value = '';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('file-info').classList.add('hidden');
    }

    // Show demo analysis
    showDemoAnalysis() {
        this.portfolioData = this.getSampleData();
        this.renderAnalysis();
        this.showToast('Demo portfolio analysis loaded successfully!', 'success');
    }

    // Analyze the uploaded file
    async analyzeFile() {
        if (!this.currentFile) {
            this.showToast('Please select a file first', 'error');
            return;
        }

        const analyzeBtn = document.getElementById('analyze-btn');
        const analyzeText = document.getElementById('analyze-text');
        const analyzeSpinner = document.getElementById('analyze-spinner');

        try {
            // Show loading state
            analyzeBtn.disabled = true;
            analyzeText.textContent = 'Analyzing...';
            analyzeSpinner.classList.remove('hidden');

            const password = document.getElementById('password-input').value;
            
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // For demo purposes, use sample data
            const portfolioData = this.getSampleData();
            
            if (portfolioData) {
                this.portfolioData = portfolioData;
                this.renderAnalysis();
                this.showToast('Portfolio analyzed successfully!', 'success');
            }

        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast('Error analyzing file. Please check the file format.', 'error');
        } finally {
            // Reset button state
            analyzeBtn.disabled = false;
            analyzeText.textContent = 'Unlock & Analyze';
            analyzeSpinner.classList.add('hidden');
        }
    }

    // Get sample portfolio data
    getSampleData() {
        return {
            summary: {
                client_code: "N534952",
                total_scrips: 66,
                market_value: 1443049,
                invested_value: 1673400,
                overall_gain_loss: -230351.55,
                return_percentage: -13.77
            },
            holdings: [
                { symbol: "RELIANCE", company: "Reliance Industries", sector: "Oil Exploration/Refineries", quantity: 100, current_value: 71205.50, gain_loss: 6005.50, return_pct: 9.22 },
                { symbol: "TCS", company: "Tata Consultancy", sector: "Information Technology", quantity: 50, current_value: 180500, gain_loss: -5500, return_pct: -2.96 },
                { symbol: "INFY", company: "Infosys Ltd", sector: "Information Technology", quantity: 75, current_value: 112875, gain_loss: 8750, return_pct: 8.41 },
                { symbol: "HDFC", company: "HDFC Bank", sector: "Finance/NBFC", quantity: 80, current_value: 128000, gain_loss: -12000, return_pct: -8.57 },
                { symbol: "ICICIBANK", company: "ICICI Bank", sector: "Finance/NBFC", quantity: 60, current_value: 57600, gain_loss: 3600, return_pct: 6.67 },
                { symbol: "SUVEN", company: "Suven Life Sciences", sector: "Pharmaceuticals & Drugs", quantity: 200, current_value: 70672, gain_loss: 24972, return_pct: 54.69 },
                { symbol: "CUPID", company: "Cupid Ltd", sector: "Pharmaceuticals & Drugs", quantity: 150, current_value: 52180, gain_loss: 11305, return_pct: 27.66 },
                { symbol: "SADBHAV", company: "Sadbhav Engineering", sector: "Capital Goods", quantity: 300, current_value: 56900, gain_loss: -64240, return_pct: -53.08 },
                { symbol: "IDEA", company: "Vodafone Idea", sector: "Telecom", quantity: 500, current_value: 34750, gain_loss: -37500, return_pct: -51.87 },
                { symbol: "HCG", company: "HealthCare Global", sector: "Healthcare Services", quantity: 120, current_value: 53424, gain_loss: 8424, return_pct: 18.74 },
                { symbol: "BOMDYEING", company: "Bombay Dyeing", sector: "Textiles", quantity: 400, current_value: 151700, gain_loss: -50300, return_pct: -24.89 },
                { symbol: "WIPRO", company: "Wipro Ltd", sector: "Information Technology", quantity: 90, current_value: 43200, gain_loss: 2800, return_pct: 6.94 }
            ],
            sectors: [
                { sector: "Information Technology", value: 336575, percentage: 23.33 },
                { sector: "Pharmaceuticals & Drugs", value: 122852, percentage: 8.52 },
                { sector: "Finance/NBFC", value: 185600, percentage: 12.86 },
                { sector: "Oil Exploration/Refineries", value: 71206, percentage: 4.93 },
                { sector: "Capital Goods", value: 56900, percentage: 3.94 },
                { sector: "Textiles", value: 151700, percentage: 10.51 },
                { sector: "Telecom", value: 34750, percentage: 2.41 },
                { sector: "Healthcare Services", value: 53424, percentage: 3.70 },
                { sector: "Others", value: 430042, percentage: 29.80 }
            ],
            marketCap: [
                { category: "LargeCap", value: 578381, percentage: 40.08 },
                { category: "MidCap", value: 360317, percentage: 24.97 },
                { category: "SmallCap", value: 504351, percentage: 34.95 }
            ]
        };
    }

    // Render the complete analysis
    renderAnalysis() {
        this.renderSummaryCards();
        this.renderCharts();
        this.renderPerformanceLists();
        this.renderHoldingsTable();
        
        // Show analysis section
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('analysis-section').classList.remove('hidden');
        
        // Scroll to analysis
        document.getElementById('analysis-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Render summary cards
    renderSummaryCards() {
        const { summary } = this.portfolioData;
        
        document.getElementById('invested-value').textContent = this.formatCurrency(summary.invested_value);
        document.getElementById('current-value').textContent = this.formatCurrency(summary.market_value);
        document.getElementById('holdings-count').textContent = summary.total_scrips.toString();
        
        const gainLossElement = document.getElementById('gain-loss-value');
        const gainLossPercentElement = document.getElementById('gain-loss-percentage');
        
        const isGain = summary.overall_gain_loss >= 0;
        const gainLossClass = isGain ? 'gain' : 'loss';
        
        gainLossElement.textContent = this.formatCurrency(summary.overall_gain_loss);
        gainLossElement.className = `summary-value ${gainLossClass}`;
        
        gainLossPercentElement.textContent = `${summary.return_percentage.toFixed(2)}%`;
        gainLossPercentElement.className = `summary-percentage ${gainLossClass}`;
    }

    // Render charts
    renderCharts() {
        this.renderSectorChart();
        this.renderMarketCapChart();
    }

    // Render sector allocation chart
    renderSectorChart() {
        const ctx = document.getElementById('sector-chart').getContext('2d');
        
        if (this.charts.sector) {
            this.charts.sector.destroy();
        }
        
        const { sectors } = this.portfolioData;
        
        this.charts.sector = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: sectors.map(s => s.sector),
                datasets: [{
                    data: sectors.map(s => s.value),
                    backgroundColor: [
                        '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', 
                        '#5D878F', '#DB4545', '#D2BA4C', '#964325', 
                        '#944454', '#13343B'
                    ],
                    borderWidth: 2,
                    borderColor: 'var(--color-surface)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const sector = sectors[context.dataIndex];
                                return `${sector.sector}: ${this.formatCurrency(sector.value)} (${sector.percentage.toFixed(1)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Render market cap distribution chart
    renderMarketCapChart() {
        const ctx = document.getElementById('marketcap-chart').getContext('2d');
        
        if (this.charts.marketCap) {
            this.charts.marketCap.destroy();
        }
        
        const { marketCap } = this.portfolioData;
        const totalValue = marketCap.reduce((sum, item) => sum + item.value, 0);
        
        this.charts.marketCap = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: marketCap.map(m => m.category),
                datasets: [{
                    data: marketCap.map(m => m.value),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 2,
                    borderColor: 'var(--color-surface)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const cap = marketCap[context.dataIndex];
                                return `${cap.category}: ${this.formatCurrency(cap.value)} (${cap.percentage.toFixed(1)}%)`;
                            }
                        }
                    }
                },
                elements: {
                    center: {
                        text: this.formatCurrency(totalValue),
                        color: 'var(--color-text)',
                        fontStyle: 'var(--font-family-base)',
                        sidePadding: 20,
                        minFontSize: 16,
                        lineHeight: 25
                    }
                }
            }
        });
    }

    // Render performance lists
    renderPerformanceLists() {
        const { holdings } = this.portfolioData;
        
        // Sort for top gainers and losers
        const gainers = holdings.filter(h => h.gain_loss > 0)
            .sort((a, b) => b.gain_loss - a.gain_loss)
            .slice(0, 5);
            
        const losers = holdings.filter(h => h.gain_loss < 0)
            .sort((a, b) => a.gain_loss - b.gain_loss)
            .slice(0, 5);

        this.renderPerformanceList('top-gainers', gainers, true);
        this.renderPerformanceList('top-losers', losers, false);
    }

    // Render individual performance list
    renderPerformanceList(containerId, items, isGainers) {
        const container = document.getElementById(containerId);
        const typeClass = isGainers ? 'gain' : 'loss';
        
        container.innerHTML = items.map(item => `
            <div class="performance-item">
                <div class="performance-stock">
                    <div class="performance-symbol">${item.symbol}</div>
                    <div class="performance-company">${item.company}</div>
                </div>
                <div class="performance-value">
                    <div class="performance-amount ${typeClass}">
                        ${this.formatCurrency(Math.abs(item.gain_loss))}
                    </div>
                    <div class="performance-percentage ${typeClass}">
                        ${Math.abs(item.return_pct).toFixed(1)}%
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render holdings table
    renderHoldingsTable() {
        const { holdings } = this.portfolioData;
        this.originalHoldingsData = [...holdings];
        this.currentHoldingsData = [...holdings];
        this.updateTable();
    }

    // Update table display
    updateTable() {
        const tbody = document.querySelector('#holdings-table tbody');
        
        tbody.innerHTML = this.currentHoldingsData.map(holding => {
            const gainLossClass = holding.gain_loss >= 0 ? 'gain' : 'loss';
            const returnClass = holding.return_pct >= 0 ? 'gain' : 'loss';
            
            return `
                <tr>
                    <td>${holding.symbol}</td>
                    <td>${holding.company}</td>
                    <td>${holding.sector}</td>
                    <td>${holding.quantity.toLocaleString()}</td>
                    <td>${this.formatCurrency(holding.current_value)}</td>
                    <td class="${gainLossClass}">${this.formatCurrency(holding.gain_loss)}</td>
                    <td class="${returnClass}">${holding.return_pct.toFixed(2)}%</td>
                </tr>
            `;
        }).join('');
    }

    // Filter holdings based on search
    filterHoldings(event) {
        const searchTerm = event.target.value.toLowerCase();
        
        this.currentHoldingsData = this.originalHoldingsData.filter(holding =>
            holding.symbol.toLowerCase().includes(searchTerm) ||
            holding.company.toLowerCase().includes(searchTerm) ||
            holding.sector.toLowerCase().includes(searchTerm)
        );
        
        this.updateTable();
    }

    // Sort table by column
    sortTable(column) {
        const isAscending = this.currentSortColumn === column ? !this.currentSortAscending : true;
        this.currentSortColumn = column;
        this.currentSortAscending = isAscending;
        
        this.currentHoldingsData.sort((a, b) => {
            let aValue = a[column];
            let bValue = b[column];
            
            // Handle numeric values
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return isAscending ? aValue - bValue : bValue - aValue;
            }
            
            // Handle string values
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
            
            if (isAscending) {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        
        this.updateTable();
        this.updateSortIndicators(column, isAscending);
    }

    // Update sort indicators in table headers
    updateSortIndicators(activeColumn, isAscending) {
        document.querySelectorAll('#holdings-table th[data-sort]').forEach(th => {
            const column = th.dataset.sort;
            if (column === activeColumn) {
                th.textContent = th.textContent.split(' ')[0] + (isAscending ? ' ↑' : ' ↓');
            } else {
                th.textContent = th.textContent.split(' ')[0] + ' ↕';
            }
        });
    }

    // Export to CSV
    exportToCSV() {
        const headers = ['Symbol', 'Company', 'Sector', 'Quantity', 'Current Value', 'Gain/Loss', 'Return %'];
        const csvContent = [
            headers.join(','),
            ...this.currentHoldingsData.map(holding => [
                holding.symbol,
                `"${holding.company}"`,
                `"${holding.sector}"`,
                holding.quantity,
                holding.current_value,
                holding.gain_loss,
                holding.return_pct
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio_analysis.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Portfolio data exported successfully!', 'success');
    }

    // Clear analysis and return to upload
    clearAnalysis() {
        this.portfolioData = null;
        this.originalHoldingsData = [];
        this.currentHoldingsData = [];
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
        
        // Reset UI
        document.getElementById('analysis-section').classList.add('hidden');
        document.getElementById('upload-section').style.display = 'block';
        this.clearFile();
        
        // Clear search
        document.getElementById('holdings-search').value = '';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Utility functions
    formatCurrency(amount) {
        const absAmount = Math.abs(amount);
        const isNegative = amount < 0;
        const prefix = isNegative ? '-₹' : '₹';
        
        if (absAmount >= 10000000) { // 1 crore
            return `${prefix}${(absAmount / 10000000).toFixed(2)}Cr`;
        } else if (absAmount >= 100000) { // 1 lakh
            return `${prefix}${(absAmount / 100000).toFixed(2)}L`;
        } else {
            return `${prefix}${absAmount.toLocaleString('en-IN')}`;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `<div>${message}</div>`;
        
        document.getElementById('toast-container').appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
        
        // Remove on click
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioAnalyzer();
});