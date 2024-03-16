document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('graph-container');
    const canvas = document.getElementById('connectionsCanvas');
    const ctx = canvas.getContext('2d');
    let nodes = document.querySelectorAll('.node');
    let activeNode = null;
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    let backgroundPosX = 0, backgroundPosY = 0;

    nodes.forEach(node => {
        node.addEventListener('mousedown', function (e) {
            // Prevents the drag action if clicking on something that is not the node itself (like the container).
            if (!e.target.classList.contains('node') && !e.target.closest('.node')) return;

            isDragging = true;
            activeNode = node;
            dragOffsetX = e.clientX - node.offsetLeft;
            dragOffsetY = e.clientY - node.offsetTop;
            document.body.classList.add('no-select');
            e.stopPropagation(); // Stop propagation to prevent container drag logic from firing
        });
    });

    resizeCanvas();
    drawConnections();

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    // Call this function whenever you need to redraw connections
    function drawConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        const nodes = document.querySelectorAll('.node');
        nodes.forEach(node => {
            const targetId = node.getAttribute('data-connected-to');
            if (targetId) {
                const targetNode = document.getElementById(targetId);
                if (targetNode) {
                    drawLine(node, targetNode);
                }
            }
        });
    }

    function drawLine(fromNode, toNode) {
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const fromX = fromRect.left + fromRect.width / 2 - container.offsetLeft;
        const fromY = fromRect.top + fromRect.height / 2 - container.offsetTop;
        const toX = toRect.left + toRect.width / 2 - container.offsetLeft;
        const toY = toRect.top + toRect.height / 2 - container.offsetTop;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Make sure to call `drawConnections` after any operation that moves nodes or resizes the container
    // Also, consider adding an event listener to resize the canvas when the window size changes
    window.addEventListener('resize', function() {
        resizeCanvas();
        drawConnections();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging || !activeNode) return;

        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;

        // Snap to grid (20x20)
        const snappedX = Math.round(x / 20) * 20;
        const snappedY = Math.round(y / 20) * 20;

        activeNode.style.left = `${snappedX}px`;
        activeNode.style.top = `${snappedY}px`;
        

        drawConnections();
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            activeNode = null;
            document.body.classList.remove('no-select');
        }
    });

    // Handling background dragging for moving all nodes
    let startX, startY, isDraggingContainer = false;

    container.addEventListener('mousedown', function (e) {
        // Only initiate container dragging if not clicking on a node
        if (e.target === container) {
            isDraggingContainer = true;
            startX = e.clientX;
            startY = e.clientY;
            container.style.cursor = 'grabbing';
            document.body.classList.add('no-select');
        }
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDraggingContainer) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        backgroundPosX += deltaX;
        backgroundPosY += deltaY;
        container.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;

        nodes.forEach(node => {
            const currentLeft = node.offsetLeft + deltaX;
            const currentTop = node.offsetTop + deltaY;
            node.style.left = `${currentLeft}px`;
            node.style.top = `${currentTop}px`;
        });
        
        drawConnections();
    });

    document.addEventListener('mouseup', function () {
        if (isDraggingContainer) {
            isDraggingContainer = false;
            container.style.cursor = 'grab';
            document.body.classList.remove('no-select');
        }
    });
});

