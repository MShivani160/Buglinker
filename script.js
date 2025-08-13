document.addEventListener('DOMContentLoaded', () => {
    const baseUrlInput = document.createElement('input');
    baseUrlInput.type = 'text';
    baseUrlInput.placeholder = 'Enter base URL (e.g., https://tracker.example.com/)';
    baseUrlInput.style.width = '100%';

    // Load base URL from localStorage
    baseUrlInput.value = localStorage.getItem('buglinker_base_url') || '';

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Enter bug IDs separated by comma or newline';
    textarea.style.width = '100%';
    textarea.style.height = '100px';

    const button = document.createElement('button');
    button.textContent = 'Generate Links';

    const output = document.createElement('div');
    output.style.marginTop = '1em';

    document.body.appendChild(baseUrlInput);
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(textarea);
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(button);
    document.body.appendChild(output);

    function parseBugIds(text) {
        // Split by comma or newline, trim, and filter out empty
        return text
            .split(/[\n,]+/)
            .map(s => s.trim())
            .filter(Boolean);
    }

    function groupAndSort(ids) {
        const groups = {};
        ids.forEach(id => {
            // Match prefix and number (e.g., BUG-1234)
            const match = id.match(/^([A-Za-z]+)[-_]?(\d+)$/);
            if (match) {
                const prefix = match[1].toUpperCase();
                const num = parseInt(match[2], 10);
                if (!groups[prefix]) groups[prefix] = [];
                groups[prefix].push({ raw: id, num });
            }
        });
        // Sort each group numerically
        Object.keys(groups).forEach(prefix => {
            groups[prefix].sort((a, b) => a.num - b.num);
        });
        return groups;
    }

    function renderLinks(groups, baseUrl) {
        output.innerHTML = '';
        Object.keys(groups).sort().forEach(prefix => {
            const groupDiv = document.createElement('div');
            groupDiv.innerHTML = `<strong>${prefix}</strong>: `;
            groups[prefix].forEach(({ raw }) => {
                const link = document.createElement('a');
                link.href = baseUrl.replace(/\/?$/, '/') + raw;
                link.textContent = raw;
                link.target = '_blank';
                link.style.marginRight = '8px';
                groupDiv.appendChild(link);
            });
            output.appendChild(groupDiv);
        });
    }

    button.addEventListener('click', () => {
        const baseUrl = baseUrlInput.value.trim();
        if (!baseUrl) {
            alert('Please enter a base URL.');
            return;
        }
        localStorage.setItem('buglinker_base_url', baseUrl);
        const ids = parseBugIds(textarea.value);
        const groups = groupAndSort(ids);
        renderLinks(groups, baseUrl);
    });
});
