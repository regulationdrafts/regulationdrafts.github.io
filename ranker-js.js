<script>
  const updateNumbering = () => {
    const items = document.querySelectorAll('#target-list li');
    items.forEach((item, index) => {
      const originalText = item.getAttribute('data-text');
      item.textContent = `${index + 1}. ${originalText}`;
    });
  };

  new Sortable(document.getElementById('source-list'), {
    group: {
      name: 'shared',
      pull: true,
      put: false
    },
    sort: false,
    animation: 150,
    ghostClass: 'sortable-ghost'
  });

  new Sortable(document.getElementById('target-list'), {
    group: {
      name: 'shared',
      pull: false,
      put: true
    },
    sort: true,
    animation: 150,
    ghostClass: 'sortable-ghost',
    onAdd: function (evt) {
      const item = evt.item;
      // Set the original text value without the "X" button
      const originalText = item.querySelector('.item-text').textContent;
      item.setAttribute('data-text', originalText);

      // Remove the "X" button from the item when it's moved to the regulation rank
      const xButton = item.querySelector('.delete-button');
      if (xButton) {
        xButton.remove();
      }

      // Update numbering in the target list
      updateNumbering();
    },
    onUpdate: function () {
      updateNumbering();
    }
  });

  document.getElementById('add-item-button').addEventListener('click', () => {
    const input = document.getElementById('new-item-input');
    const value = input.value.trim();
    if (value) {
      const li = document.createElement('li');

      // Create a span for the item text
      const textNode = document.createElement('span');
      textNode.classList.add('item-text');
      textNode.textContent = value;

      // Create the "X" button
      const xButton = document.createElement('button');
      xButton.textContent = 'X';
      xButton.classList.add('delete-button');

      // Add an event listener to the "X" button to remove the item
      xButton.addEventListener('click', () => {
        li.remove(); // Remove the list item when clicked
      });

      // Append the text and "X" button to the list item
      li.appendChild(textNode);
      li.appendChild(xButton);

      // Append the list item to the source list
      document.getElementById('source-list').appendChild(li);

      // Clear the input field after adding the item
      input.value = '';
    }
  });

  document.getElementById('new-item-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('add-item-button').click();
    }
  });
</script>