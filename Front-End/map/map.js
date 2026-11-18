
/* =========================================
   CrisisRed - Crisis Map
   Main JavaScript
========================================= */


/* =========================================
   1. Sample Database
   توجه: داده‌ها آزمایشی هستند.
========================================= */

const regions = [
    {
        id: 1,
        code: "R-001",
        name: "منطقه شمالی",
        population: 125000,
        lat: 35.804,
        lng: 51.420,
        severity: "critical",

        needs: [
            {
                id: "N-101",
                type: "آب آشامیدنی",
                quantity: 500,
                priority: "critical"
            },
            {
                id: "N-102",
                type: "مواد غذایی",
                quantity: 300,
                priority: "high"
            }
        ],

        incidents: [
            {
                type: "زلزله",
                severity: "زیاد",
                time: "امروز"
            }
        ]
    },

    {
        id: 2,
        code: "R-002",
        name: "منطقه مرکزی",
        population: 210000,
        lat: 35.699,
        lng: 51.405,
        severity: "high",

        needs: [
            {
                id: "N-201",
                type: "دارو",
                quantity: 200,
                priority: "high"
            },
            {
                id: "N-202",
                type: "پتو",
                quantity: 150,
                priority: "medium"
            }
        ],

        incidents: [
            {
                type: "آتش‌سوزی",
                severity: "متوسط",
                time: "امروز"
            }
        ]
    },

    {
        id: 3,
        code: "R-003",
        name: "منطقه جنوبی",
        population: 180000,
        lat: 35.625,
        lng: 51.410,
        severity: "medium",

        needs: [
            {
                id: "N-301",
                type: "آب آشامیدنی",
                quantity: 250,
                priority: "medium"
            },
            {
                id: "N-302",
                type: "مواد غذایی",
                quantity: 100,
                priority: "low"
            }
        ],

        incidents: [
            {
                type: "سیل",
                severity: "متوسط",
                time: "دیروز"
            }
        ]
    },

    {
        id: 4,
        code: "R-004",
        name: "منطقه غربی",
        population: 95000,
        lat: 35.720,
        lng: 51.300,
        severity: "low",

        needs: [
            {
                id: "N-401",
                type: "پتو",
                quantity: 100,
                priority: "low"
            }
        ],

        incidents: [
            {
                type: "حادثه شهری",
                severity: "کم",
                time: "دیروز"
            }
        ]
    },

    {
        id: 5,
        code: "R-005",
        name: "منطقه شرقی",
        population: 140000,
        lat: 35.730,
        lng: 51.520,
        severity: "high",

        needs: [
            {
                id: "N-501",
                type: "دارو",
                quantity: 180,
                priority: "critical"
            },
            {
                id: "N-502",
                type: "مواد غذایی",
                quantity: 220,
                priority: "high"
            }
        ],

        incidents: [
            {
                type: "زلزله",
                severity: "زیاد",
                time: "امروز"
            }
        ]
    }
];


/* =========================================
   2. Sample Allocations
   وضعیت تأمین نیازها از تخصیص‌ها محاسبه می‌شود.
========================================= */

const allocations = [
    {
        id: 1,
        needId: "N-101",
        quantity: 200,
        status: "completed"
    },
    {
        id: 2,
        needId: "N-102",
        quantity: 300,
        status: "completed"
    },
    {
        id: 3,
        needId: "N-201",
        quantity: 200,
        status: "completed"
    },
    {
        id: 4,
        needId: "N-202",
        quantity: 150,
        status: "completed"
    },
    {
        id: 5,
        needId: "N-301",
        quantity: 250,
        status: "completed"
    },
    {
        id: 6,
        needId: "N-302",
        quantity: 50,
        status: "approved"
    },
    {
        id: 7,
        needId: "N-401",
        quantity: 100,
        status: "completed"
    },
    {
        id: 8,
        needId: "N-501",
        quantity: 0,
        status: "pending"
    },
    {
        id: 9,
        needId: "N-502",
        quantity: 100,
        status: "approved"
    }
];


/* =========================================
   3. Global Variables
========================================= */

let map = null;
let markers = [];
let selectedRegion = null;

const severityLabels = {
    critical: "بحرانی",
    high: "زیاد",
    medium: "متوسط",
    low: "کم"
};

const severityColors = {
    critical: "#E31E24",
    high: "#E89A32",
    medium: "#397BC5",
    low: "#27845C"
};


/* =========================================
   4. Helper Functions
========================================= */

function formatNumber(number) {
    return Number(number).toLocaleString("fa-IR");
}


function getAllocatedQuantity(needId) {

    return allocations
        .filter(item =>
            item.needId === needId &&
            item.status !== "cancelled"
        )
        .reduce((total, item) => {
            return total + Number(item.quantity);
        }, 0);
}


function getNeedStatus(need) {

    const allocated = getAllocatedQuantity(need.id);

    return allocated >= need.quantity
        ? "covered"
        : "uncovered";
}


function getRegionUncoveredNeeds(region) {

    return region.needs.filter(need => {
        return getNeedStatus(need) === "uncovered";
    });
}


function getRegionCoverage(region) {

    const uncovered = getRegionUncoveredNeeds(region);

    return uncovered.length === 0
        ? "covered"
        : "uncovered";
}


function getRegionMarkerColor(region) {

    const uncovered = getRegionUncoveredNeeds(region);

    if (uncovered.length === 0) {
        return "#27845C";
    }

    const hasCritical = uncovered.some(
        need => need.priority === "critical"
    );

    if (hasCritical) {
        return "#E31E24";
    }

    const hasHigh = uncovered.some(
        need => need.priority === "high"
    );

    if (hasHigh) {
        return "#E89A32";
    }

    return "#397BC5";
}


function severityText(severity) {
    return severityLabels[severity] || "نامشخص";
}


function refreshIcons() {

    if (window.lucide) {
        lucide.createIcons();
    }
}


/* =========================================
   5. Initialize Map
========================================= */

function initializeMap() {

    const mapElement = document.getElementById("crisisMap");

    if (!mapElement) {
        console.error("Map element not found!");
        return;
    }

    if (typeof L === "undefined") {
        console.error("Leaflet library not loaded!");
        return;
    }

    map = L.map("crisisMap").setView(
        [35.6997, 51.3380],
        11
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        }
    ).addTo(map);

    renderMarkers(regions);

    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}


/* =========================================
   6. Create Map Markers
========================================= */

function createMarkerIcon(color) {

    return L.divIcon({

        className: "crisis-marker-container",

        html: `
            <div style="
                width: 19px;
                height: 19px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 9px rgba(0,0,0,0.35);
            "></div>
        `,

        iconSize: [25, 25],
        iconAnchor: [12, 12]

    });
}


function renderMarkers(data) {

    if (!map) return;

    markers.forEach(marker => {
        map.removeLayer(marker);
    });

    markers = [];

    data.forEach(region => {

        const color = getRegionMarkerColor(region);

        const marker = L.marker(
            [region.lat, region.lng],
            {
                icon: createMarkerIcon(color)
            }
        ).addTo(map);

        marker.bindPopup(`
            <div style="min-width:140px">
                <strong>${region.name}</strong>
                <hr>
                <div>کد منطقه: ${region.code}</div>
                <div>شدت بحران: ${severityText(region.severity)}</div>
                <div>تعداد نیازها: ${region.needs.length}</div>
            </div>
        `);

        marker.on("click", () => {
            showRegionDetails(region.id);
        });

        markers.push(marker);
    });

    updateVisibleCount(data.length);
}


/* =========================================
   7. Show Region Details
========================================= */

function showRegionDetails(regionId) {

    const region = regions.find(
        item => item.id === regionId
    );

    if (!region) return;

    selectedRegion = region;

    const detailsPanel = document.getElementById("regionDetails");
    const detailsContent = detailsPanel.querySelector(".details-content");

    const uncoveredNeeds = getRegionUncoveredNeeds(region);

    const coverage = getRegionCoverage(region);

    const needsHTML = region.needs.map(need => {

        const allocated = getAllocatedQuantity(need.id);

        const status = getNeedStatus(need);

        const statusText = status === "covered"
            ? "تأمین‌شده"
            : "تأمین‌نشده";

        const statusColor = status === "covered"
            ? "#27845C"
            : "#E31E24";

        return `
            <div style="
                padding: 12px;
                border: 1px solid var(--border);
                border-radius: 10px;
                margin-bottom: 10px;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:8px;
                    margin-bottom:8px;
                ">

                    <strong>${need.type}</strong>

                    <span style="
                        color:${statusColor};
                        font-size:10px;
                        font-weight:700;
                    ">
                        ${statusText}
                    </span>

                </div>

                <div style="font-size:11px;color:var(--text-secondary)">
                    مقدار موردنیاز: ${formatNumber(need.quantity)}
                </div>

                <div style="font-size:11px;color:var(--text-secondary)">
                    مقدار تخصیص‌یافته: ${formatNumber(allocated)}
                </div>

                <div style="font-size:11px;color:var(--text-secondary)">
                    اولویت: ${severityText(need.priority)}
                </div>

            </div>
        `;

    }).join("");


    const incidentsHTML = region.incidents.map(incident => {

        return `
            <div style="
                padding: 10px;
                background: var(--surface-soft);
                border-radius: 9px;
                margin-bottom: 8px;
                font-size: 11px;
            ">
                <strong>${incident.type}</strong>
                <div style="color:var(--text-secondary)">
                    شدت: ${incident.severity}
                    | زمان: ${incident.time}
                </div>
            </div>
        `;

    }).join("");


    detailsContent.innerHTML = `

        <div style="margin-bottom:18px">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:15px;
            ">

                <strong style="font-size:16px">
                    ${region.name}
                </strong>

                <span style="
                    background:${coverage === "covered"
                        ? "rgba(39,132,92,0.12)"
                        : "rgba(227,30,36,0.11)"};

                    color:${coverage === "covered"
                        ? "#27845C"
                        : "#E31E24"};

                    padding:5px 9px;
                    border-radius:7px;
                    font-size:10px;
                ">
                    ${coverage === "covered"
                        ? "پوشش کامل"
                        : "نیازمند تأمین"}
                </span>

            </div>


            <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:10px;
            ">

                <div style="
                    background:var(--surface-soft);
                    padding:12px;
                    border-radius:10px;
                ">
                    <small style="color:var(--text-secondary)">
                        کد منطقه
                    </small>
                    <strong style="display:block">
                        ${region.code}
                    </strong>
                </div>

                <div style="
                    background:var(--surface-soft);
                    padding:12px;
                    border-radius:10px;
                ">
                    <small style="color:var(--text-secondary)">
                        جمعیت
                    </small>
                    <strong style="display:block">
                        ${formatNumber(region.population)}
                    </strong>
                </div>

            </div>

            <div style="
                margin-top:12px;
                font-size:11px;
                color:var(--text-secondary);
            ">
                مختصات: ${region.lat} , ${region.lng}
            </div>

            <div style="
                margin-top:8px;
                font-size:11px;
                color:var(--text-secondary);
            ">
                شدت بحران: ${severityText(region.severity)}
            </div>

        </div>


        <div style="margin-bottom:20px">

            <h4 style="margin-bottom:12px">
                نیازهای منطقه
            </h4>

            ${needsHTML}

            <div style="
                padding:10px;
                background:rgba(227,30,36,0.07);
                border-radius:9px;
                color:var(--primary);
                font-size:11px;
                font-weight:600;
            ">
                تعداد نیازهای تأمین‌نشده:
                ${formatNumber(uncoveredNeeds.length)}
            </div>

        </div>


        <div>

            <h4 style="margin-bottom:12px">
                حادثه‌های ثبت‌شده
            </h4>

            ${incidentsHTML || "حادثه‌ای ثبت نشده است."}

        </div>

    `;

    refreshIcons();
}


/* =========================================
   8. Reset Region Details
========================================= */

function resetRegionDetails() {

    selectedRegion = null;

    const detailsContent = document.querySelector(
        "#regionDetails .details-content"
    );

    if (!detailsContent) return;

    detailsContent.innerHTML = `

        <div class="empty-details">

            <div class="empty-icon">
                <i data-lucide="map-pinned"></i>
            </div>

            <strong>منطقه‌ای انتخاب نشده است</strong>

            <p>
                برای مشاهده اطلاعات، یکی از نشانگرهای
                روی نقشه را انتخاب کنید.
            </p>

        </div>

    `;

    refreshIcons();
}


/* =========================================
   9. Render Regions Table
========================================= */

function renderRegionsTable(data) {

    const tableBody = document.getElementById("regionsTable");

    if (!tableBody) return;

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;padding:25px">
                    منطقه‌ای پیدا نشد.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = data.map(region => {

        const coverage = getRegionCoverage(region);

        const uncovered = getRegionUncoveredNeeds(region);

        const coverageText = coverage === "covered"
            ? "تأمین‌شده"
            : "تأمین‌نشده";

        const coverageColor = coverage === "covered"
            ? "#27845C"
            : "#E31E24";

        return `

            <tr>

                <td>
                    <strong>${region.name}</strong>
                </td>

                <td>
                    ${severityText(region.severity)}
                </td>

                <td>
                    ${formatNumber(region.needs.length)}
                </td>

                <td>
                    <span style="
                        color:${coverageColor};
                        font-weight:700;
                    ">
                        ${coverageText}
                        (${formatNumber(uncovered.length)})
                    </span>
                </td>

            </tr>

        `;

    }).join("");
}


/* =========================================
   10. Update Statistics
========================================= */

function updateStatistics() {

    const totalRegions = regions.length;

    const criticalRegions = regions.filter(region => {
        return region.severity === "critical";
    }).length;

    const unmetNeeds = regions.reduce((total, region) => {

        return total + getRegionUncoveredNeeds(region).length;

    }, 0);

    document.getElementById("totalRegions").textContent =
        formatNumber(totalRegions);

    document.getElementById("criticalRegions").textContent =
        formatNumber(criticalRegions);

    document.getElementById("unmetNeeds").textContent =
        formatNumber(unmetNeeds);

    // مقدار آزمایشی تا زمان اتصال به اطلاعات تیم‌ها
    document.getElementById("activeTeams").textContent =
        formatNumber(12);
}


/* =========================================
   11. Update Visible Map Count
========================================= */

function updateVisibleCount(count) {

    const element = document.getElementById("visibleCount");

    if (element) {
        element.textContent = `${formatNumber(count)} منطقه`;
    }
}


/* =========================================
   12. Filter Regions
========================================= */

function filterRegions() {

    const searchValue = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    const severityValue = document.getElementById("severityFilter").value;

    const needValue = document.getElementById("needFilter").value;


    const filteredRegions = regions.filter(region => {

        const matchesSearch =
            region.name.toLowerCase().includes(searchValue) ||
            region.code.toLowerCase().includes(searchValue);

        const matchesSeverity =
            severityValue === "all" ||
            region.severity === severityValue;

        const coverage = getRegionCoverage(region);

        const matchesNeed =
            needValue === "all" ||
            coverage === needValue;

        return matchesSearch && matchesSeverity && matchesNeed;

    });


    renderMarkers(filteredRegions);

    renderRegionsTable(filteredRegions);

    if (
        selectedRegion &&
        !filteredRegions.some(region => region.id === selectedRegion.id)
    ) {
        resetRegionDetails();
    }
}


/* =========================================
   13. Reset Filters
========================================= */

function resetFilters() {

    document.getElementById("searchInput").value = "";

    document.getElementById("severityFilter").value = "all";

    document.getElementById("needFilter").value = "all";

    filterRegions();
}


/* =========================================
   14. Theme Toggle
========================================= */

function initializeTheme() {

    const themeToggle = document.getElementById("themeToggle");

    const savedTheme = localStorage.getItem("crisisred-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    updateThemeIcon();

    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");

        const isDark = document.body.classList.contains("dark-theme");

        localStorage.setItem(
            "crisisred-theme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon();

    });
}


function updateThemeIcon() {

    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    const isDark = document.body.classList.contains("dark-theme");

    themeToggle.innerHTML = isDark
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';

    refreshIcons();
}


/* =========================================
   15. Sidebar Toggle
========================================= */


/* =========================================
   15. Sidebar Toggle - Fixed Version
========================================= */

function initializeSidebar() {

    const toggle = document.getElementById("sidebarToggle");

    const sidebar = document.getElementById("sidebar");

    const closeButton = document.getElementById("sidebarClose");

    const backdrop = document.getElementById("sidebarBackdrop");

    if (!toggle || !sidebar) return;

    // تشخیص اندازه صفحه
    const isMobile = () => {
        return window.matchMedia("(max-width: 900px)").matches;
    };

    // باز کردن سایدبار
    function openMobileSidebar() {

        sidebar.classList.add("open");

        document.body.classList.add("sidebar-open");

        toggle.setAttribute("aria-expanded", "true");
    }

    // بستن سایدبار
    function closeMobileSidebar() {

        sidebar.classList.remove("open");

        document.body.classList.remove("sidebar-open");

        toggle.setAttribute("aria-expanded", "false");
    }

    // دکمه اصلی باز و بسته کردن منو
    toggle.addEventListener("click", () => {

        if (isMobile()) {

            if (sidebar.classList.contains("open")) {

                closeMobileSidebar();

            } else {

                openMobileSidebar();

            }

            return;
        }

        // رفتار دسکتاپ بدون تغییر
        document.body.classList.toggle("sidebar-collapsed");

        setTimeout(() => {

            if (map) {
                map.invalidateSize();
            }

        }, 300);

    });

    // دکمه ضربدر
    if (closeButton) {

        closeButton.addEventListener("click", () => {

            closeMobileSidebar();

        });

    }

    // کلیک روی فضای تاریک پشت سایدبار
    if (backdrop) {

        backdrop.addEventListener("click", () => {

            closeMobileSidebar();

        });

    }

    // بستن با کلید Escape
    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && isMobile()) {

            closeMobileSidebar();

        }

    });

    // بستن منو بعد از انتخاب یکی از گزینه‌ها
    sidebar.querySelectorAll(".nav-item").forEach(item => {

        item.addEventListener("click", () => {

            if (isMobile()) {

                closeMobileSidebar();

            }

        });

    });

    // هنگام تغییر اندازه صفحه
    window.addEventListener("resize", () => {

        if (!isMobile()) {

            closeMobileSidebar();

        }

    });

}


/* =========================================
   16. Close Details
========================================= */

function initializeDetailsButton() {

    const closeButton = document.getElementById("closeDetails");

    if (!closeButton) return;

    closeButton.addEventListener("click", () => {
        resetRegionDetails();
    });
}


/* =========================================
   17. Locate User
========================================= */

function initializeLocateButton() {

    const locateButton = document.getElementById("locateBtn");

    if (!locateButton) return;

    locateButton.addEventListener("click", () => {

        if (!navigator.geolocation) {
            alert("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
            return;
        }

        navigator.geolocation.getCurrentPosition(

            position => {

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                map.setView([lat, lng], 14);

                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("موقعیت فعلی شما")
                    .openPopup();

            },

            () => {
                alert("دسترسی به موقعیت مکانی امکان‌پذیر نیست.");
            }

        );

    });
}


/* =========================================
   18. Fullscreen Map
========================================= */

function initializeFullscreen() {

    const button = document.getElementById("fullscreenBtn");

    const mapWrap = document.getElementById("mapWrap");

    if (!button || !mapWrap) return;

    button.addEventListener("click", async () => {

        try {

            if (!document.fullscreenElement) {

                await mapWrap.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

            setTimeout(() => {

                if (map) {
                    map.invalidateSize();
                }

            }, 300);

        } catch (error) {

            console.error("Fullscreen error:", error);

        }

    });

    document.addEventListener("fullscreenchange", () => {

        setTimeout(() => {

            if (map) {
                map.invalidateSize();
            }

        }, 200);

    });
}


/* =========================================
   19. Initialize Filters
========================================= */

function initializeFilters() {

    document.getElementById("searchInput")
        .addEventListener("input", filterRegions);

    document.getElementById("severityFilter")
        .addEventListener("change", filterRegions);

    document.getElementById("needFilter")
        .addEventListener("change", filterRegions);

    document.getElementById("resetFilters")
        .addEventListener("click", resetFilters);
}


/* =========================================
   20. Initialize Application
========================================= */

function initializeApplication() {

    initializeTheme();

    initializeMap();

    updateStatistics();

    renderRegionsTable(regions);

    initializeFilters();

    initializeSidebar();

    initializeDetailsButton();

    initializeLocateButton();

    initializeFullscreen();

    refreshIcons();

    console.log("CrisisRed application initialized successfully.");

}


/* =========================================
   21. Start Application
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);
