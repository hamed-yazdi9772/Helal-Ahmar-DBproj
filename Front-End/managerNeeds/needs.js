
/* =========================================
   CRISIS RED - NEEDS MANAGEMENT
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();
    initializeSidebar();
    initializeNeedsPage();
});

/* =========================================
   DATA
========================================= */

const regions = [
    "منطقه شمالی",
    "منطقه مرکزی",
    "منطقه شرقی",
    "منطقه جنوبی",
    "منطقه غربی"
];

const needTypes = [
    "آب و آشامیدنی",
    "تجهیزات پزشکی",
    "اسکان",
    "مواد غذایی",
    "امداد و نجات"
];

let needs = [
    {
        id: 1,
        code: "NE-1405-001",
        title: "تأمین آب آشامیدنی",
        region: "منطقه شمالی",
        type: "آب و آشامیدنی",
        quantity: 500,
        unit: "بسته",
        priority: "urgent",
        reporter: "علی رضایی",
        date: "2026-11-15",
        description: "نیاز فوری به آب آشامیدنی برای خانوارهای آسیب‌دیده منطقه شمالی."
    },
    {
        id: 2,
        code: "NE-1405-002",
        title: "تجهیزات پزشکی و کمک‌های اولیه",
        region: "منطقه مرکزی",
        type: "تجهیزات پزشکی",
        quantity: 100,
        unit: "بسته",
        priority: "high",
        reporter: "مریم احمدی",
        date: "2026-11-15",
        description: "تأمین تجهیزات پزشکی برای مرکز امدادرسانی منطقه مرکزی."
    },
    {
        id: 3,
        code: "NE-1405-003",
        title: "تأمین چادر اسکان",
        region: "منطقه شرقی",
        type: "اسکان",
        quantity: 80,
        unit: "عدد",
        priority: "urgent",
        reporter: "رضا محمدی",
        date: "2026-11-14",
        description: "تأمین چادر برای اسکان موقت خانواده‌های آسیب‌دیده."
    },
    {
        id: 4,
        code: "NE-1405-004",
        title: "بسته‌های مواد غذایی",
        region: "منطقه جنوبی",
        type: "مواد غذایی",
        quantity: 200,
        unit: "بسته",
        priority: "medium",
        reporter: "زهرا کریمی",
        date: "2026-11-13",
        description: "توزیع بسته‌های غذایی بین خانوارهای نیازمند."
    },
    {
        id: 5,
        code: "NE-1405-005",
        title: "تجهیزات امداد و نجات",
        region: "منطقه غربی",
        type: "امداد و نجات",
        quantity: 40,
        unit: "دستگاه",
        priority: "high",
        reporter: "حسین موسوی",
        date: "2026-11-12",
        description: "تأمین تجهیزات موردنیاز گروه‌های عملیاتی."
    }
];

/*
    اطلاعات تخصیص در اینجا صرفاً داده نمونه است.
    در نسخه متصل به دیتابیس، این اطلاعات از صفحه تخصیص دریافت می‌شود.
*/

let allocations = [
    {
        id: 1,
        code: "AL-1405-001",
        needId: 1,
        amount: 200,
        team: "تیم امداد شمال",
        resource: "بسته آب آشامیدنی",
        status: "active"
    },
    {
        id: 2,
        code: "AL-1405-002",
        needId: 2,
        amount: 100,
        team: "تیم پزشکی مرکزی",
        resource: "تجهیزات پزشکی",
        status: "completed"
    },
    {
        id: 3,
        code: "AL-1405-003",
        needId: 3,
        amount: 30,
        team: "تیم اسکان شرق",
        resource: "چادر امدادی",
        status: "pending"
    },
    {
        id: 4,
        code: "AL-1405-004",
        needId: 4,
        amount: 100,
        team: "تیم پشتیبانی جنوب",
        resource: "بسته غذایی",
        status: "active"
    }
];

let activities = [
    {
        text: "نیاز جدید آب آشامیدنی در منطقه شمالی ثبت شد.",
        time: "امروز",
        icon: "plus-circle"
    },
    {
        text: "تخصیص تجهیزات پزشکی برای منطقه مرکزی تکمیل شد.",
        time: "امروز",
        icon: "check-circle-2"
    },
    {
        text: "درخواست چادر اسکان در منطقه شرقی ثبت شد.",
        time: "دیروز",
        icon: "clipboard-list"
    }
];

let nextNeedId = 6;
let toastTimer = null;

/* =========================================
   HELPERS
========================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[char];
    });
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("fa-IR");
}

function formatDate(value) {
    if (!value) return "—";

    const parts = value.split("-");

    if (parts.length !== 3) return value;

    return `${formatNumber(parts[2])}/${formatNumber(parts[1])}/${formatNumber(parts[0])}`;
}

function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function setText(selector, value) {
    const element = $(selector);

    if (element) {
        element.textContent = value;
    }
}

function setValue(selector, value) {
    const element = $(selector);

    if (element) {
        element.value = value ?? "";
    }
}

function getValue(selector) {
    return $(selector)?.value?.trim() || "";
}

function refreshIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

/* =========================================
   THEME
========================================= */

function initializeTheme() {
    const themeButton = $("#themeToggle");

    const savedTheme = localStorage.getItem("crisisred-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");

            const theme = document.body.classList.contains("dark-theme")
                ? "dark"
                : "light";

            localStorage.setItem("crisisred-theme", theme);
        });
    }
}

/* =========================================
   SIDEBAR
========================================= */

function initializeSidebar() {
    const sidebar = $("#sidebar");
    const toggle = $("#sidebarToggle");
    const close = $("#sidebarClose");
    const backdrop = $("#sidebarBackdrop");

    if (!sidebar || !toggle) return;

    toggle.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
            openMobileSidebar();
        } else {
            document.body.classList.toggle("sidebar-collapsed");
        }
    });

    close?.addEventListener("click", closeMobileSidebar);

    backdrop?.addEventListener("click", closeMobileSidebar);

    $$(".sidebar .nav-item").forEach(link => {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
}

function openMobileSidebar() {
    $("#sidebar")?.classList.add("open");
    $("#sidebarBackdrop")?.classList.add("active");

    document.body.classList.add("sidebar-open");

    $("#sidebarToggle")?.setAttribute("aria-expanded", "true");
}

function closeMobileSidebar() {
    $("#sidebar")?.classList.remove("open");
    $("#sidebarBackdrop")?.classList.remove("active");

    document.body.classList.remove("sidebar-open");

    $("#sidebarToggle")?.setAttribute("aria-expanded", "false");
}

/* =========================================
   INITIALIZE PAGE
========================================= */

function initializeNeedsPage() {
    fillSelectOptions();
    setPageDates();
    setupEventListeners();

    renderAll();

    refreshIcons();
}

/* =========================================
   FILL SELECT OPTIONS
========================================= */

function fillSelectOptions() {
    const regionFilter = $("#regionFilter");
    const typeFilter = $("#typeFilter");

    const needRegion = $("#needRegion");
    const needType = $("#needType");

    if (regionFilter) {
        regionFilter.innerHTML =
            '<option value="all">تمام مناطق</option>';

        regions.forEach(region => {
            regionFilter.insertAdjacentHTML(
                "beforeend",
                `<option value="${escapeHTML(region)}">${escapeHTML(region)}</option>`
            );
        });
    }

    if (typeFilter) {
        typeFilter.innerHTML =
            '<option value="all">تمام انواع نیاز</option>';

        needTypes.forEach(type => {
            typeFilter.insertAdjacentHTML(
                "beforeend",
                `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`
            );
        });
    }

    if (needRegion) {
        needRegion.innerHTML =
            '<option value="">انتخاب منطقه</option>';

        regions.forEach(region => {
            needRegion.insertAdjacentHTML(
                "beforeend",
                `<option value="${escapeHTML(region)}">${escapeHTML(region)}</option>`
            );
        });
    }

    if (needType) {
        needType.innerHTML =
            '<option value="">انتخاب نوع نیاز</option>';

        needTypes.forEach(type => {
            needType.insertAdjacentHTML(
                "beforeend",
                `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`
            );
        });
    }
}

/* =========================================
   PAGE DATES
========================================= */

function setPageDates() {
    const now = new Date();

    setText(
        "#todayLabel",
        "امروز: " + now.toLocaleDateString("fa-IR")
    );

    setText(
        "#lastUpdated",
        "آخرین به‌روزرسانی: " +
        now.toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit"
        })
    );
}

/* =========================================
   EVENT LISTENERS
========================================= */

function setupEventListeners() {
    $("#newNeedBtn")?.addEventListener("click", openCreateModal);

    $("#needForm")?.addEventListener("submit", handleNeedSubmit);

    $("#needsSearch")?.addEventListener("input", renderNeedsTable);

    $("#regionFilter")?.addEventListener("change", renderNeedsTable);
    $("#typeFilter")?.addEventListener("change", renderNeedsTable);
    $("#priorityFilter")?.addEventListener("change", renderNeedsTable);

    $("#resetNeedsFilters")?.addEventListener("click", resetFilters);
    $("#emptyResetBtn")?.addEventListener("click", resetFilters);

    $("#needsTableBody")?.addEventListener("click", handleTableAction);

    $("#goToAllocationBtn")?.addEventListener("click", function () {
        window.location.href = "../allocation/allocation.html";
    });

    $$("[data-close]").forEach(button => {
        button.addEventListener("click", function () {
            closeModal(button.dataset.close);
        });
    });

    $$(".modal-overlay").forEach(modal => {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            $$(".modal-overlay").forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    $(".notification")?.addEventListener("click", function () {
        showToast("در حال حاضر اعلان جدیدی وجود ندارد.");
    });
}

/* =========================================
   RENDER ALL
========================================= */

function renderAll() {
    renderStatistics();
    renderCoverage();
    renderNeedsTable();
    renderActivities();

    refreshIcons();
}

/* =========================================
   ALLOCATION CALCULATIONS
========================================= */

function getNeedAllocations(needId) {
    return allocations.filter(item =>
        item.needId === needId &&
        item.status !== "cancelled"
    );
}

function getCoverage(need) {
    const related = getNeedAllocations(need.id);

    const completed = related
        .filter(item => item.status === "completed")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const active = related
        .filter(item => item.status === "active")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const pending = related
        .filter(item => item.status === "pending")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    let status = "none";
    let label = "بدون تخصیص";

    if (completed >= need.quantity) {
        status = "complete";
        label = "تأمین‌شده";
    } else if (completed > 0 || active > 0) {
        status = "progress";
        label = "در حال تأمین";
    } else if (pending > 0) {
        status = "pending";
        label = "در انتظار تخصیص";
    }

    return {
        related,
        completed,
        active,
        pending,
        status,
        label
    };
}

/* =========================================
   STATISTICS
========================================= */

function renderStatistics() {
    const total = needs.length;

    const urgent = needs.filter(item =>
        item.priority === "urgent"
    ).length;

    const uncovered = needs.filter(item =>
        getCoverage(item).related.length === 0
    ).length;

    const covered = needs.filter(item =>
        getCoverage(item).status === "complete"
    ).length;

    setText("#totalNeeds", formatNumber(total));
    setText("#urgentNeeds", formatNumber(urgent));
    setText("#uncoveredNeeds", formatNumber(uncovered));
    setText("#coveredNeeds", formatNumber(covered));
}

function renderCoverage() {
    const total = needs.length;

    const covered = needs.filter(item =>
        getCoverage(item).status === "complete"
    ).length;

    const percentage = total
        ? Math.round((covered / total) * 100)
        : 0;

    setText("#coveragePercent", `${formatNumber(percentage)}٪`);

    setText(
        "#coverageCount",
        `${formatNumber(covered)} از ${formatNumber(total)} نیاز`
    );

    const progress = $("#coverageProgressBar");

    if (progress) {
        progress.style.width = `${percentage}%`;
    }
}

/* =========================================
   FILTERS
========================================= */

function getFilteredNeeds() {
    const search = getValue("#needsSearch").toLowerCase();

    const regionValue = $("#regionFilter")?.value || "all";
    const typeValue = $("#typeFilter")?.value || "all";
    const priorityValue = $("#priorityFilter")?.value || "all";

    return needs.filter(need => {
        const matchesSearch =
            !search ||
            need.title.toLowerCase().includes(search) ||
            need.code.toLowerCase().includes(search);

        const matchesRegion =
            regionValue === "all" ||
            need.region === regionValue;

        const matchesType =
            typeValue === "all" ||
            need.type === typeValue;

        const matchesPriority =
            priorityValue === "all" ||
            need.priority === priorityValue;

        return (
            matchesSearch &&
            matchesRegion &&
            matchesType &&
            matchesPriority
        );
    });
}

function resetFilters() {
    setValue("#needsSearch", "");
    setValue("#regionFilter", "all");
    setValue("#typeFilter", "all");
    setValue("#priorityFilter", "all");

    renderNeedsTable();
}

/* =========================================
   NEEDS TABLE
========================================= */

function renderNeedsTable() {
    const tbody = $("#needsTableBody");
    const emptyState = $("#needsEmptyState");

    if (!tbody) return;

    const filtered = getFilteredNeeds();

    tbody.innerHTML = "";

    setText(
        "#needsCountLabel",
        `${formatNumber(filtered.length)} نیاز`
    );

    if (filtered.length === 0) {
        if (emptyState) emptyState.hidden = false;

        refreshIcons();
        return;
    }

    if (emptyState) emptyState.hidden = true;

    filtered.forEach(need => {
        const coverage = getCoverage(need);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <span class="need-code">
                    ${escapeHTML(need.code)}
                </span>
            </td>

            <td>
                <div class="need-title-cell">
                    ${escapeHTML(need.title)}
                    <span class="need-subtitle">
                        ${escapeHTML(need.reporter || "ثبت‌کننده نامشخص")}
                    </span>
                </div>
            </td>

            <td>${escapeHTML(need.region)}</td>

            <td>${escapeHTML(need.type)}</td>

            <td>
                ${formatNumber(need.quantity)}
                ${escapeHTML(need.unit)}
            </td>

            <td>
                <span class="priority-badge ${need.priority}">
                    ${getPriorityLabel(need.priority)}
                </span>
            </td>

            <td>${formatDate(need.date)}</td>

            <td>
                <span class="coverage-badge ${coverage.status}">
                    ${coverage.label}
                </span>
            </td>

            <td>
                <div class="table-actions">

                    <button type="button"
                        class="table-action view"
                        data-action="view"
                        data-id="${need.id}"
                        title="مشاهده جزئیات">
                        <i data-lucide="eye"></i>
                    </button>

                    <button type="button"
                        class="table-action edit"
                        data-action="edit"
                        data-id="${need.id}"
                        title="ویرایش">
                        <i data-lucide="pencil"></i>
                    </button>

                    <button type="button"
                        class="table-action delete"
                        data-action="delete"
                        data-id="${need.id}"
                        title="حذف">
                        <i data-lucide="trash-2"></i>
                    </button>

                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    refreshIcons();
}

function getPriorityLabel(priority) {
    const labels = {
        urgent: "فوری",
        high: "زیاد",
        medium: "متوسط",
        low: "کم"
    };

    return labels[priority] || "نامشخص";
}

/* =========================================
   TABLE ACTIONS
========================================= */

function handleTableAction(event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "view") {
        openDetailsModal(id);
    }

    if (action === "edit") {
        openEditModal(id);
    }

    if (action === "delete") {
        deleteNeed(id);
    }
}

/* =========================================
   CREATE NEED
========================================= */

function openCreateModal() {
    const form = $("#needForm");

    if (!form) return;

    form.reset();

    setValue("#editingNeedId", "");
    setValue("#needDate", getToday());

    setText("#needModalTitle", "ثبت نیاز جدید");
    setText("#needSubmitText", "ثبت نیاز");

    openModal("needModal");
}

/* =========================================
   SUBMIT FORM
========================================= */

function handleNeedSubmit(event) {
    event.preventDefault();

    const title = getValue("#needTitle");
    const region = getValue("#needRegion");
    const type = getValue("#needType");
    const quantity = Number(getValue("#needQuantity"));
    const unit = getValue("#needUnit");
    const priority = getValue("#needPriority");
    const reporter = getValue("#needReporter");
    const date = getValue("#needDate");
    const description = getValue("#needDescription");

    const editingId = getValue("#editingNeedId");

    if (
        !title ||
        !region ||
        !type ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        !unit ||
        !priority ||
        !date
    ) {
        showToast("لطفاً فیلدهای ضروری را به‌درستی تکمیل کنید.");
        return;
    }

    if (editingId) {
        const id = Number(editingId);

        const index = needs.findIndex(item => item.id === id);

        if (index === -1) return;

        needs[index] = {
            ...needs[index],
            title,
            region,
            type,
            quantity,
            unit,
            priority,
            reporter,
            date,
            description
        };

        addActivity(`اطلاعات نیاز «${title}» ویرایش شد.`, "pencil");

        showToast("اطلاعات نیاز ویرایش شد.");
    } else {
        const newNeed = {
            id: nextNeedId,
            code: generateNeedCode(),
            title,
            region,
            type,
            quantity,
            unit,
            priority,
            reporter,
            date,
            description
        };

        nextNeedId++;

        needs.unshift(newNeed);

        addActivity(`نیاز جدید «${title}» ثبت شد.`, "plus-circle");

        showToast("نیاز جدید با موفقیت ثبت شد.");
    }

    closeModal("needModal");

    renderAll();
}

/* =========================================
   GENERATE CODE
========================================= */

function generateNeedCode() {
    return `NE-1405-${String(nextNeedId).padStart(3, "0")}`;
}

/* =========================================
   EDIT NEED
========================================= */

function openEditModal(id) {
    const need = needs.find(item => item.id === id);

    if (!need) return;

    setValue("#editingNeedId", need.id);
    setValue("#needTitle", need.title);
    setValue("#needRegion", need.region);
    setValue("#needType", need.type);
    setValue("#needQuantity", need.quantity);
    setValue("#needUnit", need.unit);
    setValue("#needPriority", need.priority);
    setValue("#needReporter", need.reporter);
    setValue("#needDate", need.date);
    setValue("#needDescription", need.description);

    setText("#needModalTitle", "ویرایش اطلاعات نیاز");
    setText("#needSubmitText", "ذخیره تغییرات");

    openModal("needModal");
}

/* =========================================
   DELETE NEED
========================================= */

function deleteNeed(id) {
    const need = needs.find(item => item.id === id);

    if (!need) return;

    const hasAllocation = allocations.some(item =>
        item.needId === id &&
        item.status !== "cancelled"
    );

    if (hasAllocation) {
        showToast(
            "این نیاز تخصیص مرتبط دارد. ابتدا تخصیص‌های آن را بررسی کنید."
        );

        return;
    }

    const confirmed = confirm(
        `آیا از حذف نیاز «${need.title}» اطمینان دارید؟`
    );

    if (!confirmed) return;

    needs = needs.filter(item => item.id !== id);

    addActivity(`نیاز «${need.title}» حذف شد.`, "trash-2");

    showToast("نیاز حذف شد.");

    renderAll();
}

/* =========================================
   DETAILS MODAL
========================================= */

function openDetailsModal(id) {
    const need = needs.find(item => item.id === id);

    if (!need) return;

    const coverage = getCoverage(need);

    setText("#detailsNeedCode", need.code);

    const content = $("#needDetailsContent");

    if (content) {
        content.innerHTML = `
            <div class="details-grid">

                <div class="detail-item">
                    <span>عنوان نیاز</span>
                    <strong>${escapeHTML(need.title)}</strong>
                </div>

                <div class="detail-item">
                    <span>منطقه آسیب‌دیده</span>
                    <strong>${escapeHTML(need.region)}</strong>
                </div>

                <div class="detail-item">
                    <span>نوع نیاز</span>
                    <strong>${escapeHTML(need.type)}</strong>
                </div>

                <div class="detail-item">
                    <span>مقدار موردنیاز</span>
                    <strong>
                        ${formatNumber(need.quantity)}
                        ${escapeHTML(need.unit)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>اولویت</span>
                    <strong>${getPriorityLabel(need.priority)}</strong>
                </div>

                <div class="detail-item">
                    <span>گزارش‌دهنده</span>
                    <strong>${escapeHTML(need.reporter || "ثبت نشده")}</strong>
                </div>

                <div class="detail-item">
                    <span>تاریخ ثبت</span>
                    <strong>${formatDate(need.date)}</strong>
                </div>

                <div class="detail-item">
                    <span>وضعیت پوشش</span>
                    <strong>${coverage.label}</strong>
                </div>

            </div>

            <div class="detail-description">
                <strong>توضیحات تکمیلی</strong>
                <p>${escapeHTML(need.description || "توضیحی ثبت نشده است.")}</p>
            </div>
        `;
    }

    renderRelatedAllocations(need);

    openModal("needDetailsModal");

    refreshIcons();
}

/* =========================================
   RELATED ALLOCATIONS
========================================= */

function renderRelatedAllocations(need) {
    const list = $("#relatedAllocationsList");

    if (!list) return;

    const related = getNeedAllocations(need.id);

    setText(
        "#relatedAllocationCount",
        `${formatNumber(related.length)} تخصیص`
    );

    if (related.length === 0) {
        list.innerHTML = `
            <div class="related-empty">
                هنوز تخصیصی برای این نیاز ثبت نشده است.
            </div>
        `;

        return;
    }

    list.innerHTML = related.map(item => `
        <div class="related-allocation">

            <div>
                <strong>${escapeHTML(item.code)}</strong>

                <span>
                    ${escapeHTML(item.team)}
                    -
                    ${escapeHTML(item.resource)}
                </span>
            </div>

            <div>
                <strong>
                    ${formatNumber(item.amount)}
                    ${escapeHTML(need.unit)}
                </strong>

                <span>
                    ${getAllocationStatusLabel(item.status)}
                </span>
            </div>

        </div>
    `).join("");
}

function getAllocationStatusLabel(status) {
    const labels = {
        pending: "در انتظار اجرا",
        active: "در حال اجرا",
        completed: "تکمیل‌شده",
        cancelled: "لغوشده"
    };

    return labels[status] || "نامشخص";
}

/* =========================================
   MODALS
========================================= */

function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.hidden = false;

    document.body.style.overflow = "hidden";

    refreshIcons();
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.hidden = true;

    const anotherModalIsOpen = [...$$(".modal-overlay")].some(item =>
        !item.hidden
    );

    if (!anotherModalIsOpen) {
        document.body.style.overflow = "";
    }
}

/* =========================================
   ACTIVITY
========================================= */

function addActivity(message, icon = "activity") {
    activities.unshift({
        text: message,
        time: "هم‌اکنون",
        icon
    });

    activities = activities.slice(0, 8);

    renderActivities();
}

function renderActivities() {
    const container = $("#needsActivityList");

    if (!container) return;

    if (activities.length === 0) {
        container.innerHTML = `
            <div class="related-empty">
                هنوز فعالیتی ثبت نشده است.
            </div>
        `;

        return;
    }

    container.innerHTML = activities.map(item => `
        <div class="activity-item">

            <div class="activity-icon">
                <i data-lucide="${escapeHTML(item.icon)}"></i>
            </div>

            <div class="activity-content">
                <p>${escapeHTML(item.text)}</p>
                <span>${escapeHTML(item.time)}</span>
            </div>

        </div>
    `).join("");

    refreshIcons();
}

/* =========================================
   TOAST
========================================= */

function showToast(message) {
    const toast = $("#toastMessage");
    const text = $("#toastText");

    if (!toast || !text) {
        console.log(message);
        return;
    }

    text.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

/* =========================================
   END
========================================= */
