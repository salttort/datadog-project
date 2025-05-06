document.addEventListener('DOMContentLoaded', () => {
  // Embedded JSON data due to CORs issues
  // In a real-world scenario, this data would be fetched from an API or server
  // Example: fetch('https://api.example.com/data/featured-resources').then(response => response.json())
  const resourceData = [
    {
      "title": "4 Quick Steps for Better Incident Resolution in DevOps",
      "description": "Accelerate your time to resolution and build resilience into your systems and <scripts> with this simple 4-step approach.",
      "category": "E-Book",
      "url": "https://www.datadoghq.com/resources/devops-incident-resolution-ebook/"
    },
    {
      "title": "State of DevSecOps",
      "description": "Learn about the security posture of tens of thousands of applications and adoption of DevSecOps practices.",
      "category": "Research",
      "url": "https://www.datadoghq.com/state-of-devsecops/"
    },
    {
      "title": "Azure Virtual Machine (VM) Cheatsheet",
      "description": "Learn how to monitor Azure Virtual Machines (VMs) with Datadog.",
      "category": "Cheatsheet",
      "url": "https://www.datadoghq.com/resources/azure-vm-cheatsheet/",
      "active": false
    },
    {
      "title": "Optimize & troubleshoot cloud storage at scale with Storage Monitoring",
      "description": "Learn how you can gain actionable visibility into your Amazon S3 and Google Cloud Storage usage, performance, and costs.",
      "category": "Blog",
      "url": "https://www.datadoghq.com/blog/datadog-storage-monitoring/"
    }
  ];

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
      noResults.textContent = 'No resources found for this category.';
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

  // Initialize on load
  populateFilterOptions(resourceData);
  renderResources(resourceData);

  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    renderResources(resourceData, e.target.value);
  });
});
