let cardId = 0; // Global card ID counter

document.getElementById('addLaneBtn').addEventListener('click', addLane);

function addLane() {
    const lane = document.createElement('div');
    lane.classList.add('lane');
    lane.addEventListener('dragover', dragOver);
    lane.addEventListener('drop', dropLane);

    const laneHeader = document.createElement('div');
    laneHeader.classList.add('lane-header');

    // Make lane name editable
    const laneName = document.createElement('span');
    laneName.textContent = "Lane " + (document.querySelectorAll('.lane').length + 1);
    laneName.setAttribute('contenteditable', true);
    laneName.classList.add('editable-lane-name');
    laneHeader.appendChild(laneName);

    const addCardBtn = document.createElement('button');
    addCardBtn.textContent = '+ Add Card';
    addCardBtn.classList.add('addCardBtn');
    addCardBtn.addEventListener('click', () => addCard(lane, addCardBtn));

    lane.appendChild(laneHeader);
    lane.appendChild(addCardBtn);

    const board = document.getElementById('board');
    board.insertBefore(lane, board.lastChild);
}

function addCard(lane, addCardBtn) {
    const title = prompt('Card Title:');
    const description = prompt('Card Description:');
    if (title && description) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('draggable', true);
        card.id = `card-${cardId++}`;

        const cardTitle = document.createElement('div');
        cardTitle.classList.add('card-title');
        const titleContent = document.createElement('span');
        titleContent.textContent = title;
        titleContent.setAttribute('contenteditable', true);
        cardTitle.appendChild(titleContent);

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('card-description');
        cardDescription.textContent = description;

        card.addEventListener('dragstart', dragStart);

        card.appendChild(cardTitle);
        card.appendChild(cardDescription);
        
        lane.insertBefore(card, addCardBtn);
    }
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dropLane(e) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text');
    const card = document.getElementById(cardId);
    if (e.target.className.includes('lane')) {
        e.target.insertBefore(card, e.target.querySelector('.addCardBtn'));
    } else if (e.target.closest('.card')) {
        e.target.closest('.lane').insertBefore(card, e.target.closest('.card').nextSibling);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addLane(); // Automatically add an initial lane for demonstration
});

