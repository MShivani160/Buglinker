document.getElementById("sortBtn").addEventListener("click", () => {
    let baseUrl = document.getElementById("baseUrl").value.trim();
    let bugList = document.getElementById("bugList").value.trim();

    if (!baseUrl || !bugList) {
        alert("Please enter both Base URL and Bug IDs.");
        return;
    }

    localStorage.setItem("buglinkerBaseUrl", baseUrl);

    let bugs = bugList.split(/[\s,]+/).filter(b => b);

    bugs.sort((a, b) => {
        let [prefixA, numA] = a.split("-");
        let [prefixB, numB] = b.split("-");
        if (prefixA === prefixB) {
            return parseInt(numA) - parseInt(numB);
        }
        return prefixA.localeCompare(prefixB);
    });

    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    bugs.forEach(bug => {
        let severity = getSeverity(bug);

        let item = document.createElement("div");
        item.className = "bug-item";

        let link = document.createElement("a");
        link.href = baseUrl + bug;
        link.target = "_blank";
        link.textContent = bug;

        let tag = document.createElement("span");
        tag.className = `tag ${severity.toLowerCase()}`;
        tag.textContent = severity.charAt(0).toUpperCase() + severity.slice(1);

        item.appendChild(link);
        item.appendChild(tag);
        resultDiv.appendChild(item);
    });
});

function getSeverity(bugId) {
    // Simple rule: detect keywords or assign randomly
    let id = bugId.toLowerCase();
    if (id.includes("crit") || id.includes("p0")) return "critical";
    if (id.includes("major") || id.includes("p1")) return "major";
    if (id.includes("minor") || id.includes("p2")) return "minor";

    // Random fallback
    let types = ["critical", "major", "minor"];
    return types[Math.floor(Math.random() * types.length)];
}

document.addEventListener("DOMContentLoaded", () => {
    let savedUrl = localStorage.getItem("buglinkerBaseUrl");
    if (savedUrl) {
        document.getElementById("baseUrl").value = savedUrl;
    }
});
