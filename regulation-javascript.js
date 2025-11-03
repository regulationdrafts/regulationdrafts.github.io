document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.regulation-container');
    const toggleButton = document.getElementById('toggleGrid');
    const nameContainer = document.getElementById('nameContainer');
    const randomizeButton = document.querySelector('.regulation-randomize');
    const clickCounter = document.getElementById('clickCounter');
    const addButton = document.getElementById('addButton');
    const subtractButton = document.getElementById('subtractButton');

    let isSixByFour = false;
    let extraItems = [];
    let extraNameBox = null;
    let repeatCount = 0;

    function handlePaste(event) {
        event.preventDefault();
        const pastedData = (event.clipboardData || window.clipboardData).getData('text');
        if (pastedData.startsWith('http://') || pastedData.startsWith('https://')) {
            this.style.backgroundImage = `url(${pastedData})`;
            this.style.backgroundSize = 'cover';
            this.style.backgroundPosition = 'center';
            this.style.backgroundRepeat = 'no-repeat';
            this.textContent = '';
        } else {
            document.execCommand('insertText', false, pastedData);
        }
    }

    function applyPasteListener() {
        document.querySelectorAll('.regulation-item').forEach(item => {
            item.removeEventListener('paste', handlePaste); // Remove existing listener
            item.addEventListener('paste', handlePaste); // Add new listener
        });
    }

    applyPasteListener(); // Initial application for existing items

    function randomizeNames() {
        const nameBoxes = Array.from(nameContainer.querySelectorAll('.regulation-name-box'));
        const names = nameBoxes.map(box => box.querySelector('textarea').value.trim());
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }
        nameBoxes.forEach((box, index) => {
            box.querySelector('textarea').value = names[index];
        });

        let currentCount;
        if (clickCounter.textContent === "nice") {
            currentCount = 69;
        } else if (clickCounter.textContent === "summer of 98") {
            currentCount = 98;
        } else if (clickCounter.textContent === "blaze it") {
            currentCount = 420;
        } else if (clickCounter.textContent === "16") {
            currentCount = 16;
        } else {
            currentCount = parseInt(clickCounter.textContent);
        }

        if (currentCount === 68) {
            clickCounter.textContent = "nice";
        } else if (currentCount === 97) {
            clickCounter.textContent = "summer of 98";
        } else if (currentCount === 419) {
            clickCounter.textContent = "blaze it";
        } else if (currentCount === 16 && repeatCount < 4) {
            repeatCount++;
            clickCounter.innerHTML = `16 <span style="opacity: 0.7;">(${16 + repeatCount})</span>`;
        } else {
            if (currentCount === 16) {
                repeatCount = 0;
                clickCounter.textContent = "21";
            } else {
                clickCounter.textContent = currentCount + 1;
            }
        }
    }

    function toggleGrid() {
        if (isSixByFour) {
            container.classList.remove('grid-6x4');
            container.classList.add('grid-5x4');
            nameContainer.classList.remove('grid-6x1');
            nameContainer.classList.add('grid-5x1');

            // Remove extra items if the grid is reduced
            if (extraItems.length > 0) {
                extraItems.forEach(item => item.remove());
                extraItems = [];
            }
            if (extraNameBox) {
                extraNameBox.remove();
                extraNameBox = null;
            }
        } else {
            container.classList.remove('grid-5x4');
            container.classList.add('grid-6x4');
            nameContainer.classList.remove('grid-5x1');
            nameContainer.classList.add('grid-6x1');

            // Add new grid items
            if (container.children.length < 24) {
                for (let i = 0; i < 4; i++) {
                    const newItem = document.createElement('div');
                    newItem.className = 'regulation-item';
                    newItem.contentEditable = 'true';
                    container.appendChild(newItem);
                    extraItems.push(newItem);
                }
                // Call applyPasteListener after adding new items
                applyPasteListener(); // Ensure the new items can also paste images
            }

            // Add extra name box
            if (!extraNameBox) {
                extraNameBox = document.createElement('div');
                extraNameBox.className = 'regulation-name-box';
                extraNameBox.innerHTML = '<textarea placeholder="">graysie</textarea>';
                nameContainer.appendChild(extraNameBox);
            }
        }
        isSixByFour = !isSixByFour;

        const maxWidth = isSixByFour ? '125px' : '150px';
        document.querySelectorAll('.regulation-item').forEach(item => {
            item.style.maxWidth = maxWidth;
        });
    }

    function addRow() {
        const gridContainer = document.querySelector('.regulation-container');
        const itemsToAdd = isSixByFour ? 6 : 5;
        for (let i = 0; i < itemsToAdd; i++) {
            const newItem = document.createElement('div');
            newItem.className = 'regulation-item';
            newItem.contentEditable = 'true';
            gridContainer.appendChild(newItem);
        }

        const currentRows = getComputedStyle(gridContainer).gridTemplateRows.split(' ').length;
        gridContainer.style.gridTemplateRows = `repeat(${currentRows + 1}, auto)`;
        applyPasteListener(); // Ensure new rows can also paste images
    }

    function subtractRow() {
        const gridContainer = document.querySelector('.regulation-container');
        const itemsToRemove = isSixByFour ? 6 : 5;
        const currentItems = gridContainer.querySelectorAll('.regulation-item');
        
        if (currentItems.length >= itemsToRemove) {
            for (let i = 0; i < itemsToRemove; i++) {
                currentItems[currentItems.length - 1 - i].remove();
            }

            const currentRows = getComputedStyle(gridContainer).gridTemplateRows.split(' ').length;
            if (currentRows > 1) {
                gridContainer.style.gridTemplateRows = `repeat(${currentRows - 1}, auto)`;
            }
        }
    }

    toggleButton.addEventListener('click', toggleGrid);
    randomizeButton.addEventListener('click', randomizeNames);
    addButton.addEventListener('click', addRow);
    subtractButton.addEventListener('click', subtractRow);
});
