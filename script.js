document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const toolBtns = document.querySelectorAll('.option');
    const fillColor = document.querySelector('#fill-color');
    const sizeSlider = document.querySelector('#size-slider');
    const colorPicker = document.querySelector('#color-picker');
    const clearCanvas = document.querySelector('#btn_clear');
    const saveImg = document.querySelector('.save');

    let prevMouseX, prevMouseY, snapshot;
    let isDrawing = false;
    let selectedTool = 'Brush';
    let brushWidth = 5;
    let selectedColor = '#000000';

    const setCanvasBackground = () => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = selectedColor;
    }

    setCanvasBackground();

    const drawRect = (e) => {
        if(!fillColor.checked) {
            ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        } else {
            ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        }
    }

    const drawCircle = (e) => {
        ctx.beginPath();
        let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
        ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
        fillColor.checked ? ctx.fill() : ctx.stroke();
    }

    const drawTriangle = (e) => {
        ctx.beginPath();
        ctx.moveTo(prevMouseX, prevMouseY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
        ctx.closePath();
        fillColor.checked ? ctx.fill() : ctx.stroke();
    }

    const startDraw = (e) => {
        isDrawing = true;
        prevMouseX = e.offsetX;
        prevMouseY = e.offsetY;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    const drawing = (e) => {
        if(!isDrawing) return;
        ctx.putImageData(snapshot, 0, 0);

        if(selectedTool === 'Brush' || selectedTool === 'eraser') {
            ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        } else if(selectedTool === 'rectangle'){
            drawRect(e);
        } else if(selectedTool === 'circle'){
            drawCircle(e);
        } else if(selectedTool === 'triangle'){
            drawTriangle(e);
        }
    }

    toolBtns.forEach(btn => {
        if(btn.id) {
            btn.addEventListener('click', () => {
                document.querySelector('.option.active')?.classList.remove('active');
                btn.classList.add('active');
                selectedTool = btn.id;
            });
        }
    });

    sizeSlider.addEventListener('input', () => brushWidth = sizeSlider.value);

    colorPicker.addEventListener('change', () => {
        selectedColor = colorPicker.value;
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
    });

    clearCanvas.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBackground();
    });

    saveImg.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
    });

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', drawing);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    const toggleBtn = document.querySelector('#toggle-btn');
    const toolsBoard = document.querySelector('.tools-board');

    toggleBtn.addEventListener('click', () => {
        toolsBoard.classList.toggle('hidden');
        toggleBtn.classList.toggle('open');
    });
});