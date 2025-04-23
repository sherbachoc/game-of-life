class GameOfLife {
    constructor(size = 20) {
        this.size = size;
        this.grid = Array(size).fill().map(() => Array(size).fill(false));
        this.canvas = document.getElementById('game-grid');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.animationId = null;
        this.speed = 200;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.drawGrid();
    }
    
    setupCanvas() {
        const cellSize = 20;
        this.canvas.width = this.size * cellSize;
        this.canvas.height = this.size * cellSize;
        this.cellSize = cellSize;
    }
    
    setupEventListeners() {
        // Кнопки управления
        document.getElementById('start').addEventListener('click', () => this.start());
        document.getElementById('pause').addEventListener('click', () => this.pause());
        document.getElementById('step').addEventListener('click', () => this.step());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        
        // Изменение размера
        document.getElementById('apply-size').addEventListener('click', () => {
            const newSize = parseInt(document.getElementById('grid-size').value);
            if (newSize >= 5 && newSize <= 100) {
                this.size = newSize;
                this.reset();
            }
        });
        
        // Изменение скорости
        const speedSlider = document.getElementById('speed');
        const speedValue = document.getElementById('speed-value');
        speedSlider.addEventListener('input', () => {
            this.speed = parseInt(speedSlider.value);
            speedValue.textContent = this.speed;
            if (this.isRunning) {
                this.pause();
                this.start();
            }
        });
        
        // Клики по клеткам
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.cellSize);
            const y = Math.floor((e.clientY - rect.top) / this.cellSize);
            this.grid[y][x] = !this.grid[y][x];
            this.drawGrid();
        });
    }
    
    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newX = (x + i + this.size) % this.size;
                const newY = (y + j + this.size) % this.size;
                if (this.grid[newY][newX]) count++;
            }
        }
        return count;
    }
    
    updateGrid() {
        const newGrid = Array(this.size).fill().map(() => Array(this.size).fill(false));
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const neighbors = this.countNeighbors(x, y);
                const isAlive = this.grid[y][x];
                
                if (isAlive && (neighbors === 2 || neighbors === 3)) {
                    newGrid[y][x] = true;
                } else if (!isAlive && neighbors === 3) {
                    newGrid[y][x] = true;
                }
            }
        }
        
        this.grid = newGrid;
    }
    
    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем сетку
        this.ctx.strokeStyle = '#ddd';
        for (let i = 0; i <= this.size; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
        
        // Рисуем живые клетки
        this.ctx.fillStyle = '#4CAF50';
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x]) {
                    this.ctx.fillRect(
                        x * this.cellSize + 1,
                        y * this.cellSize + 1,
                        this.cellSize - 2,
                        this.cellSize - 2
                    );
                }
            }
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }
    
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    step() {
        this.updateGrid();
        this.drawGrid();
    }
    
    reset() {
        this.pause();
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(false));
        this.setupCanvas();
        this.drawGrid();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.updateGrid();
        this.drawGrid();
        
        this.animationId = setTimeout(() => {
            requestAnimationFrame(() => this.animate());
        }, this.speed);
    }
}

// Инициализация игры при загрузке страницы
window.addEventListener('load', () => {
    new GameOfLife();
}); 