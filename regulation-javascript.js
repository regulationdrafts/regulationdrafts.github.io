        let clickCount = 0;

        function randomizeNames() {
            const container = document.getElementById('nameContainer');
            const names = Array.from(container.children);
            const shuffledNames = names.sort(() => Math.random() - 0.5);

            container.innerHTML = ''; // Clear current names
            shuffledNames.forEach(nameBox => container.appendChild(nameBox)); // Append names in new order

            // Increment the click counter and update the displayed value
            clickCount++;
            document.getElementById('clickCounter').innerText = clickCount;
        }