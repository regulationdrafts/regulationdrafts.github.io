document.addEventListener('DOMContentLoaded', () => {
    const itemGrids = document.querySelectorAll('.item-grid');
    const memberNames = ['andrew', 'eric', 'nick', 'geoff', 'gavin']; // Dropdown options

    // Store the original amounts for each member
    const originalAmounts = {};

    function initializeOriginalAmounts() {
        document.querySelectorAll('.money').forEach(moneyElement => {
            const memberName = moneyElement.closest('member-money').childNodes[0].textContent.trim();
            originalAmounts[memberName] = parseInt(moneyElement.textContent.trim()) || 0;
        });
    }

    function createDropdownOptions() {
        const options = ['<option>Select</option>'];
        memberNames.forEach(name => {
            options.push(`<option value="${name}">${name}</option>`);
        });
        return options.join('');
    }

    // Populate each item grid with 4 slots initially
    function populateInitialItemSlots() {
        itemGrids.forEach(grid => {
            // Clear existing slots
            grid.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const slot = document.createElement('item-slot');
                grid.appendChild(slot);
            }
        });
    }

    // Add new box to each grid when "Add" button is clicked
    document.getElementById('addBox').addEventListener('click', () => {
        itemGrids.forEach(grid => {
            const slot = document.createElement('item-slot');
            grid.appendChild(slot);
        });
    });

    // Remove the bottom box from each grid when "Subtract" button is clicked
    document.getElementById('removeBox').addEventListener('click', () => {
        itemGrids.forEach(grid => {
            if (grid.children.length > 0) {
                grid.removeChild(grid.lastElementChild);
            }
        });
    });

    function updateMoney(member, totalSpent) {
        const moneyElement = Array.from(document.querySelectorAll('member-money'))
                                  .find(m => m.textContent.trim().startsWith(member))
                                  .querySelector('.money');

        const originalAmount = originalAmounts[member];
        const newBalance = originalAmount - totalSpent;

        moneyElement.textContent = newBalance;

        if (newBalance <= 0) {
            moneyElement.style.backgroundColor = '#c11f1f';
            moneyElement.style.color = '#FFF';
        } else {
            moneyElement.style.backgroundColor = '';
            moneyElement.style.color = '';
        }
    }

    function calculateTotalSpent() {
        const itemBuys = document.querySelectorAll('item-buy');
        const memberTotals = {};

        itemBuys.forEach(itemBuy => {
            const price = parseInt(itemBuy.querySelector('price').textContent.trim()) || 0;
            const dropdown = itemBuy.querySelector('.buyer-dropdown');
            const selectedMember = dropdown.value;

            if (selectedMember && selectedMember !== "Select") {
                if (!memberTotals[selectedMember]) {
                    memberTotals[selectedMember] = 0;
                }
                memberTotals[selectedMember] += price;
            }
        });

        memberNames.forEach(member => {
            updateMoney(member, memberTotals[member] || 0);
        });
    }

    function handleSelectionChange(event) {
        const dropdown = event.target;
        const selectedMember = dropdown.value;
        const previousMember = dropdown.dataset.previousValue || '';
        const itemName = dropdown.closest('item-buy').querySelector('item').textContent.trim();

        if (previousMember && previousMember !== "Select") {
            const previousGrid = Array.from(document.querySelectorAll('.item-grid')).find(grid => 
                grid.previousElementSibling.textContent.trim().startsWith(previousMember)
            );
            const existingSlot = Array.from(previousGrid.children).find(slot => slot.textContent === itemName);
            if (existingSlot) {
                existingSlot.textContent = "";
            }
        }

        if (selectedMember !== "Select") {
            const currentGrid = Array.from(document.querySelectorAll('.item-grid')).find(grid => 
                grid.previousElementSibling.textContent.trim().startsWith(selectedMember)
            );
            const emptySlot = Array.from(currentGrid.children).find(slot => slot.textContent === "");
            if (emptySlot) {
                emptySlot.textContent = itemName;
            }
        }

        dropdown.dataset.previousValue = selectedMember;
        calculateTotalSpent();
    }

    // Listen for changes on buyer dropdowns
    document.querySelectorAll('.buyer-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', handleSelectionChange);
    });

    // Event listener for price inputs to update totals
    document.querySelectorAll('price').forEach(price => {
        price.addEventListener('input', () => {
            calculateTotalSpent();
        });
    });

    // Filter function for auction items
    document.getElementById('itemFilter').addEventListener('input', (e) => {
        const filterText = e.target.value.toLowerCase();
        document.querySelectorAll('item').forEach(item => {
            const itemText = item.textContent.toLowerCase();
            item.closest('item-buy').style.display = itemText.includes(filterText) ? 'flex' : 'none';
        });
    });

    function initializeExistingItemBuyFields() {
        document.querySelectorAll('item-buy').forEach(itemBuy => {
            const buyerDropdown = itemBuy.querySelector('.buyer-dropdown');
            buyerDropdown.innerHTML = createDropdownOptions();
            const priceField = itemBuy.querySelector('price');
            priceField.setAttribute('placeholder', '$');
        });
    }

    // Function to create a new item-buy field with identical dropdown list and dollar placeholder
    function createNewItemBuyField() {
        const newItemBuy = document.createElement('item-buy');
        newItemBuy.innerHTML = `
            <button class="deleteButton"><img src="https://github.com/regulationdrafts/regulationdrafts.github.io/blob/main/regulation-logo-white.png?raw=true" class="butthole"></button>
            <item contenteditable="true" placeholder="enter item"></item>
            <buyer-price>
                <buyer>
                    <select class="buyer-dropdown">${createDropdownOptions()}</select>
                </buyer>
                <price contenteditable="true" placeholder="$"></price>
            </buyer-price>
        `;
        
        // Add functionality to the delete button
        const deleteButton = newItemBuy.querySelector('.deleteButton');
        deleteButton.addEventListener('click', () => {
            // Toggle opacity
            const currentOpacity = getComputedStyle(newItemBuy).opacity;
            newItemBuy.style.opacity = currentOpacity == 1 ? '0.3' : '1';

            // Remove strikethrough effect if it exists
            const itemElement = newItemBuy.querySelector('item');
            if (itemElement) {
                itemElement.style.textDecoration = 'none'; // Ensure no strikethrough
            }
        });

        return newItemBuy;
    }

    // Add event listener to create new item-buy fields
    document.getElementById('createItemBuyFields').addEventListener('click', function() {
        const numFields = parseInt(document.getElementById('numItemBuyFields').value);
        const auctionItemsContainer = document.getElementById('auctionItems');

        // Get the current number of item-buy fields
        const currentItemBuyFields = auctionItemsContainer.querySelectorAll('item-buy').length;

        // Calculate the potential new total
        const newTotalFields = currentItemBuyFields + numFields;

        // Check if adding new fields exceeds the limit
        if (numFields > 0 && newTotalFields <= 100) {
            for (let i = 0; i < numFields; i++) {
                const newItemBuy = createNewItemBuyField();
                auctionItemsContainer.appendChild(newItemBuy);
                addItemBuyFieldListeners(newItemBuy);
            }
        } else if (newTotalFields > 100) {
            alert('100 items max!');
        }
    });

    function addItemBuyFieldListeners(itemBuy) {
        const buyerDropdown = itemBuy.querySelector('.buyer-dropdown');
        const priceField = itemBuy.querySelector('price');
        const itemField = itemBuy.querySelector('item');

        buyerDropdown.addEventListener('change', handleSelectionChange);
        priceField.addEventListener('input', calculateTotalSpent);
    }

    initializeOriginalAmounts();
    initializeExistingItemBuyFields();
    populateInitialItemSlots();
});