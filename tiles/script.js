let tiles = [];

function renderTiles(filter = '') {
    const container = document.getElementById('tilesContainer');
    container.innerHTML = ''; // Clear existing tiles

    tiles.filter(tile => tile.name.toLowerCase().includes(filter.toLowerCase())).forEach(tile => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        tileElement.textContent = tile.name;
        tileElement.onclick = function() {
            window.location.href = '?id=' + tile.id; // Redirect to a link with the tile id
        };
        container.appendChild(tileElement);
    });

    // Only append add button when not filtering
    if (!filter) {
        const addTileElement = document.createElement('div');
        addTileElement.classList.add('tile');
        addTileElement.textContent = '+ Add New Tile';
        addTileElement.onclick = addNewTile;
        container.appendChild(addTileElement);
    }
}

function addNewTile() {
    const tileName = prompt("Enter name for the new tile:");
    if (tileName === null || tileName.trim() === "") {
        return;
    }

    const newId = tiles.length + 1; // Generate a new ID for the tile
    tiles.push({ id: newId, name: tileName }); // Add the new tile to the array
    renderTiles(); // Re-render the tiles to display the new one
}

document.addEventListener('DOMContentLoaded', () => {
    renderTiles();
    document.getElementById('filterInput').addEventListener('input', (e) => {
        const filterValue = e.target.value;
        renderTiles(filterValue);
    });
});
