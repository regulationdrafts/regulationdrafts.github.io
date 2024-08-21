document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.regulation-container');
    const toggleButton = document.getElementById('toggleGrid');
    const nameContainer = document.getElementById('nameContainer');
    const randomizeButton = document.querySelector('.regulation-randomize');
    const clickCounter = document.getElementById('clickCounter');

    let isSixByFour = false; // Track current grid state
    let extraItems = []; // Track additional items added
    let extraNameBox = null; // Track additional name box
    let repeatCount = 0; // Track how many times 16 has been repeated

    // Function to handle the paste event for .regulation-item
    function handlePaste(event) {
        // Prevent the default paste behavior
        event.preventDefault();

        // Get the pasted data as plain text
        const pastedData = (event.clipboardData || window.clipboardData).getData('text');

        // If the pasted data is a valid URL, set it as the background image
        if (pastedData.startsWith('http://') || pastedData.startsWith('https://')) {
            this.style.backgroundImage = `url(${pastedData})`;
            this.style.backgroundSize = 'cover'; // optional: adjusts how the image fits
            this.style.backgroundPosition = 'center'; // optional: positions the image in the center
            this.style.backgroundRepeat = 'no-repeat'; // optional: ensures the image does not repeat
            this.textContent = ''; // clear the content
        } else {
            // If not a valid URL, insert the pasted text
            document.execCommand('insertText', false, pastedData);
        }
    }

    // Function to apply paste event listener to all .regulation-item elements
    function applyPasteListener() {
        document.querySelectorAll('.regulation-item').forEach(item => {
            item.removeEventListener('paste', handlePaste); // Remove existing listeners to avoid duplication
            item.addEventListener('paste', handlePaste);
        });
    }

    // Initial application of paste listener
    applyPasteListener();

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

        // Update counter logic
        let currentCount;

        if (clickCounter.textContent === "nice") {
            currentCount = 69;
        } else if (clickCounter.textContent === "summer of 98") {
            currentCount = 98;
        } else if (clickCounter.textContent === "blaze it") {
            currentCount = 420;
        } else if (clickCounter.textContent.startsWith("16")) {
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
                repeatCount = 0; // Reset the repeat count after 16 (20)
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
            if (container.children.length < 24) {
                for (let i = 0; i < 4; i++) {
                    const newItem = document.createElement('div');
                    newItem.className = 'regulation-item';
                    newItem.contentEditable = 'true';
                    container.appendChild(newItem);
                    extraItems.push(newItem);
                }

                // Re-apply the paste event listener to the newly added items
                applyPasteListener();
            }
            if (!extraNameBox) {
                extraNameBox = document.createElement('div');
                extraNameBox.className = 'regulation-name-box';
                extraNameBox.innerHTML = '<textarea placeholder="">graysie</textarea>';
                nameContainer.appendChild(extraNameBox);
            }
        }
        isSixByFour = !isSixByFour;

        // Set max-width of .regulation-item based on the grid state
        const maxWidth = isSixByFour ? '125px' : '150px';
        document.querySelectorAll('.regulation-item').forEach(item => {
            item.style.maxWidth = maxWidth;
        });
    }

    toggleButton.addEventListener('click', toggleGrid);
    randomizeButton.addEventListener('click', randomizeNames);
});