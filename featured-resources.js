// Fetch JSON data from external file
fetch('./data/featured-resources.json')
  .then(response => response.json())
  .then(resourceData => {
    // Sanitize HTML to prevent XSS
    function sanitizeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Populate category filter dropdown
    function populateFilterOptions(data) {
      const select = document.getElementById('categoryFilter');
      const categories = [...new Set(data.map(item => item.category))];

      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
      });
    }

    // Render resource cards based on selected category
    function renderResources(data, filter = 'All') {
      const container = document.getElementById('resources');
      const template = document.getElementById('resourceCardTemplate');
      container.innerHTML = '';

      const filtered = data
        .filter(item => item.active !== false && (filter === 'All' || item.category === filter))
        .slice(0, 5);

      if (filtered.length === 0) {
        const noResults = document.createElement('p');
        noResults.className = 'text-center resource-noresults';
        noResults.textContent = 'Arf, no resources found for this category.';
        container.appendChild(noResults);
        return;
      }

      filtered.forEach(resource => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('#cardCategory').textContent = resource.category;
        clone.querySelector('#cardTitle').textContent = resource.title;
        clone.querySelector('#cardDescription').innerHTML = sanitizeHTML(resource.description);
        clone.querySelector('a').href = resource.url;

        container.appendChild(clone);
      });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      populateFilterOptions(resourceData);
      renderResources(resourceData);

      document.getElementById('categoryFilter').addEventListener('change', (e) => {
        renderResources(resourceData, e.target.value);
      });
    });
  })
  .catch(error => console.error('Error loading JSON data:', error));

