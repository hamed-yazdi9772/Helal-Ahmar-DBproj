/* =========================================
   CRISISRED - ALLOCATION PAGE
========================================= */


/* -----------------------------------------
   SAMPLE DATA
----------------------------------------- */

const needs = [
    {
        id: 1,
        title: "تأمین آب آشامیدنی",
        region: "منطقه شمالی",
        priority: "فوری",
        amount: 100,
        unit: "بسته"
    },
    {
        id: 2,
        title: "تجهیزات پزشکی",
        region: "منطقه مرکزی",
        priority: "زیاد",
        amount: 40,
        unit: "عدد"
    },
    {
        id: 3,
        title: "تأمین چادر اسکان",
        region: "منطقه شرقی",
        priority: "متوسط",
        amount: 30,
        unit: "عدد"
    },
    {
        id: 4,
        title: "توزیع مواد غذایی",
        region: "منطقه جنوبی",
        priority: "زیاد",
        amount: 80,
        unit: "بسته"
    },
    {
        id: 5,
        title: "تجهیزات امداد و نجات",
        region: "منطقه غربی",
        priority: "فوری",
        amount: 25,
        unit: "عدد"
    }
];


const teams = [
    {
        id: 101,
        name: "تیم امداد شمال",
        code: "T-101",
        status: "active"
    },
    {
        id: 102,
        name: "تیم پشتیبانی مرکزی",
        code: "T-102",
        status: "active"
    },
    {
        id: 103,
        name: "تیم درمان",
        code: "T-103",
        status: "active"
    },
    {
        id: 104,
        name: "تیم لجستیک",
        code: "T-104",
        status: "active"
    },
    {
        id: 105,
        name: "تیم امداد شرق",
        code: "T-105",
        status: "standby"
    }
];


const resources = [
    {
        id: 201,
        name: "بسته آب آشامیدنی",
        stock: 120,
        unit: "بسته",
        icon: "droplets"
    },
    {
        id: 202,
        name: "تجهیزات پزشکی",
        stock: 80,
        unit: "عدد",
        icon: "heart-pulse"
    },
    {
        id: 203,
        name: "چادر اسکان",
        stock: 50,
        unit: "عدد",
        icon: "tent"
    },
    {
        id: 204,
        name: "بسته مواد غذایی",
        stock: 200,
        unit: "بسته",
        icon: "package"
    },
    {
        id: 205,
        name: "تجهیزات امداد",
        stock: 60,
        unit: "عدد",
        icon: "life-buoy"
    }
];


let allocations = [
    {
        id: 1,
        code: "AL-1001",
        needId: 1,
        teamId: 101,
        resourceId: 201,
        amount: 30,
        start: "2026-11-17T08:00",
        end: "2026-11-17T14:00",
        status: "active"
    },
    {
        id: 2,
        code: "AL-1002",
        needId: 2,
        teamId: 103,
        resourceId: 202,
        amount: 15,
        start: "2026-11-17T10:00",
        end: "2026-11-17T18:00",
        status: "pending"
    },
    {
        id: 3,
        code: "AL-1003",
        needId: 3,
        teamId: 105,
        resourceId: 203,
        amount: 10,
        start: "2026-11-18T08:00",
        end: "2026-11-18T16:00",
        status: "pending"
    },
    {
        id: 4,
        code: "AL-1004",
        needId: 4,
        teamId: 104,
        resourceId: 204,
        amount: 40,
        start: "2026-11-16T08:00",
        end: "2026-11-16T14:00",
        status: "completed"
    }
];


let activities = [
    {
        title: "ثبت تخصیص جدید",
        description: "تخصیص AL-1001 برای تأمین آب ثبت شد.",
        icon: "check-circle-2"
    },
    {
        title: "برنامه‌ریزی تخصیص",
        description: "تیم درمان برای دریافت تجهیزات پزشکی انتخاب شد.",
        icon: "calendar-check"
    },
    {
        title: "تکمیل تخصیص",
        description: "تخصیص مواد غذایی به پایان رسید.",
        icon: "package-check"
    }
];


let nextAllocationId = 5;


/* -----------------------------------------
   DOM ELEMENTS
----------------------------------------- */

const allocationForm =
    document.getElementById("allocationForm");

const allocationModal =
    document.getElementById("allocationModal");

const detailsModal =
    document.getElementById("detailsModal");

const allocationTableBody =
    document.getElementById("allocationTableBody");

const allocationSearch =
    document.getElementById("allocationSearch");

const statusFilter =
    document.getElementById("statusFilter");

const needSelect =
    document.getElementById("needSelect");

const teamSelect =
    document.getElementById("teamSelect");

const resourceSelect =
    document.getElementById("resourceSelect");

const amountInput =
    document.getElementById("allocationAmount");

const startInput =
    document.getElementById("startDate");

const endInput =
    document.getElementById("endDate");

const statusInput =
    document.getElementById("allocationStatus");

const needSummary =
    document.getElementById("needSummary");

const resourceStockHint =
    document.getElementById("resourceStockHint");


/* -----------------------------------------
   HELPERS
----------------------------------------- */

function getNeed(id) {
    return needs.find(item => item.id === Number(id));
}


function getTeam(id) {
    return teams.find(item => item.id === Number(id));
}


function getResource(id) {
    return resources.find(item => item.id === Number(id));
}


function toPersianNumber(value) {
    return Number(value).toLocaleString("fa-IR");
}


function formatDate(value) {

    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}


function getStatusText(status) {

    const statuses = {
        pending: "در انتظار اجرا",
        active: "در حال اجرا",
        completed: "تکمیل‌شده",
        cancelled: "لغوشده"
    };

    return statuses[status] || "نامشخص";
}


function getStatusClass(status) {
    return status || "pending";
}


function getPriorityColor(priority) {

    if (priority === "فوری") {
        return "priority-critical";
    }

    if (priority === "زیاد") {
        return "priority-high";
    }

    return "priority-medium";
}


function isReservedStatus(status) {

    return (
        status === "pending" ||
        status === "active"
    );
}


function getOverlappingAllocations(
    start,
    end,
    excludedId = null
) {

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    return allocations.filter(item => {

        if (item.id === excludedId) {
            return false;
        }

        if (!isReservedStatus(item.status)) {
            return false;
        }

        const oldStart =
            new Date(item.start).getTime();

        const oldEnd =
            new Date(item.end).getTime();

        return (
            startTime < oldEnd &&
            endTime > oldStart
        );
    });
}


/* -----------------------------------------
   TOAST
----------------------------------------- */

function showToast(message, type = "success") {

    const toast =
        document.getElementById("toastMessage");

    const text =
        document.getElementById("toastText");

    if (!toast || !text) return;

    text.textContent = message;

    toast.classList.remove("show", "error");

    if (type === "error") {
        toast.classList.add("error");
    }

    toast.classList.add("show");

    clearTimeout(window.allocationToastTimer);

    window.allocationToastTimer = setTimeout(() => {

        toast.classList.remove("show", "error");

    }, 3000);
}


/* -----------------------------------------
   SELECT OPTIONS
----------------------------------------- */

function populateSelects() {

    needSelect.innerHTML = `
        <option value="">انتخاب نیاز</option>

        ${needs.map(item => `
            <option value="${item.id}">
                ${item.title} - ${item.region}
            </option>
        `).join("")}
    `;


    teamSelect.innerHTML = `
        <option value="">انتخاب تیم</option>

        ${teams.map(item => `
            <option value="${item.id}">
                ${item.name} (${item.code})
            </option>
        `).join("")}
    `;


    resourceSelect.innerHTML = `
        <option value="">انتخاب منبع</option>

        ${resources.map(item => `
            <option value="${item.id}">
                ${item.name}
            </option>
        `).join("")}
    `;
}


/* -----------------------------------------
   INVENTORY CALCULATION
----------------------------------------- */

function getReservedAmount(
    resourceId,
    start,
    end,
    excludedId = null
) {

    if (!start || !end) {
        return 0;
    }

    const overlaps = getOverlappingAllocations(
        start,
        end,
        excludedId
    );

    return overlaps
        .filter(item =>
            item.resourceId === Number(resourceId)
        )
        .reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );
}


function getAvailableStock(
    resourceId,
    start,
    end,
    excludedId = null
) {

    const resource = getResource(resourceId);

    if (!resource) {
        return 0;
    }

    const reserved = getReservedAmount(
        resourceId,
        start,
        end,
        excludedId
    );

    return Math.max(
        0,
        resource.stock - reserved
    );
}


/* -----------------------------------------
   INVENTORY RENDER
----------------------------------------- */

function renderInventory() {

    const container =
        document.getElementById("inventoryGrid");

    if (!container) return;

    container.innerHTML = resources.map(resource => {

        const reserved = allocations
            .filter(item =>
                item.resourceId === resource.id &&
                isReservedStatus(item.status)
            )
            .reduce(
                (sum, item) => sum + Number(item.amount),
                0
            );

        const available = Math.max(
            0,
            resource.stock - reserved
        );

        const percent = resource.stock
            ? Math.min(
                100,
                (available / resource.stock) * 100
            )
            : 0;

        let progressClass = "";

        if (percent <= 20) {
            progressClass = "critical";
        } else if (percent <= 50) {
            progressClass = "low";
        }

        return `
            <article class="inventory-card">

                <div class="inventory-card-top">

                    <div class="inventory-card-icon">
                        <i data-lucide="${resource.icon}"></i>
                    </div>

                    <span class="inventory-card-name">
                        ${resource.name}
                    </span>

                </div>

                <div class="inventory-card-count">
                    ${toPersianNumber(available)}
                </div>

                <div class="inventory-card-unit">
                    موجودی قابل تخصیص (${resource.unit})
                </div>

                <div class="inventory-progress">
                    <span
                        class="${progressClass}"
                        style="width:${percent}%">
                    </span>
                </div>

                <div class="inventory-card-footer">

                    <span>
                        کل: ${toPersianNumber(resource.stock)}
                    </span>

                    <span>
                        رزرو: ${toPersianNumber(reserved)}
                    </span>

                </div>

            </article>
        `;

    }).join("");

    refreshIcons();
}


/* -----------------------------------------
   STATISTICS
----------------------------------------- */

function renderStatistics() {

    const total = allocations.length;

    const active = allocations.filter(
        item => item.status === "active"
    ).length;

    const pending = allocations.filter(
        item => item.status === "pending"
    ).length;

    const totalAmount = allocations
        .filter(item => isReservedStatus(item.status))
        .reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );


    document.getElementById(
        "totalAllocations"
    ).textContent = toPersianNumber(total);


    document.getElementById(
        "activeAllocations"
    ).textContent = toPersianNumber(active);


    document.getElementById(
        "pendingAllocations"
    ).textContent = toPersianNumber(pending);


    document.getElementById(
        "totalAllocatedAmount"
    ).textContent = toPersianNumber(totalAmount);


    document.getElementById(
        "allocationCountLabel"
    ).textContent = `${toPersianNumber(total)} تخصیص`;
}


/* -----------------------------------------
   ALLOCATION TABLE
----------------------------------------- */

function renderAllocations() {

    const searchText = allocationSearch.value
        .trim()
        .toLowerCase();

    const selectedStatus = statusFilter.value;


    const filtered = allocations.filter(item => {

        const need = getNeed(item.needId);

        const team = getTeam(item.teamId);

        const resource = getResource(item.resourceId);

        const searchableText = [
            item.code,
            need?.title,
            need?.region,
            team?.name,
            resource?.name
        ].join(" ").toLowerCase();

        const matchesSearch =
            searchableText.includes(searchText);

        const matchesStatus =
            selectedStatus === "all" ||
            item.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });


    allocationTableBody.innerHTML = filtered.map(item => {

        const need = getNeed(item.needId);

        const team = getTeam(item.teamId);

        const resource = getResource(item.resourceId);

        return `
            <tr>

                <td>
                    <span class="allocation-code">
                        ${item.code}
                    </span>
                </td>

                <td>

                    <span class="allocation-main-text">
                        ${need?.title || "نیاز نامشخص"}
                    </span>

                    <span class="allocation-sub-text">
                        ${need?.region || ""}
                    </span>

                </td>

                <td>

                    <span class="allocation-main-text">
                        ${team?.name || "تیم نامشخص"}
                    </span>

                    <span class="allocation-sub-text">
                        ${team?.code || ""}
                    </span>

                </td>

                <td>
                    ${resource?.name || "منبع نامشخص"}
                </td>

                <td>
                    ${toPersianNumber(item.amount)}
                    ${resource?.unit || ""}
                </td>

                <td>
                    ${formatDate(item.start)}
                </td>

                <td>
                    ${formatDate(item.end)}
                </td>

                <td>

                    <span class="status-badge ${getStatusClass(item.status)}">
                        ${getStatusText(item.status)}
                    </span>

                </td>

                <td>

                    <div class="table-actions">

                        <button
                            class="table-action"
                            title="مشاهده جزئیات"
                            data-action="view"
                            data-id="${item.id}">

                            <i data-lucide="eye"></i>

                        </button>


                        <button
                            class="table-action"
                            title="ویرایش"
                            data-action="edit"
                            data-id="${item.id}">

                            <i data-lucide="pencil"></i>

                        </button>


                        <button
                            class="table-action delete"
                            title="حذف تخصیص"
                            data-action="delete"
                            data-id="${item.id}">

                            <i data-lucide="trash-2"></i>

                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");


    const emptyState =
        document.getElementById("allocationEmptyState");

    emptyState.hidden = filtered.length !== 0;


    const tableWrapper =
        document.querySelector(".table-wrapper");

    if (tableWrapper) {
        tableWrapper.style.display =
            filtered.length ? "block" : "none";
    }

    refreshIcons();
}


/* -----------------------------------------
   ACTIVITIES
----------------------------------------- */

function renderActivities() {

    const container =
        document.getElementById("allocationActivities");

    if (!container) return;

    container.innerHTML = activities.map(item => `

        <div class="activity-item">

            <div class="activity-icon">
                <i data-lucide="${item.icon}"></i>
            </div>

            <div>

                <strong>
                    ${item.title}
                </strong>

                <span>
                    ${item.description}
                </span>

            </div>

        </div>

    `).join("");

    refreshIcons();
}


function addActivity(
    title,
    description,
    icon = "activity"
) {

    activities.unshift({
        title,
        description,
        icon
    });

    activities = activities.slice(0, 8);

    renderActivities();
}


/* -----------------------------------------
   NEED SUMMARY
----------------------------------------- */

function renderNeedSummary() {

    const need = getNeed(needSelect.value);

    if (!need) {

        needSummary.className = "selection-summary";

        needSummary.innerHTML = `
            <i data-lucide="info"></i>

            <span>
                با انتخاب نیاز، اطلاعات آن نمایش داده می‌شود.
            </span>
        `;

        refreshIcons();

        return;
    }


    needSummary.className = "selection-summary";

    needSummary.innerHTML = `

        <i data-lucide="clipboard-list"></i>

        <span>

            <strong>
                ${need.title}
            </strong>

            <br>

            منطقه: ${need.region}

            <br>

            اولویت: ${need.priority}

            <br>

            مقدار موردنیاز:
            ${toPersianNumber(need.amount)}
            ${need.unit}

        </span>

    `;

    refreshIcons();
}


/* -----------------------------------------
   STOCK HINT
----------------------------------------- */

function updateStockHint() {

    const resourceId = resourceSelect.value;

    const start = startInput.value;

    const end = endInput.value;

    const editingId =
        Number(
            document.getElementById("editingAllocationId").value
        ) || null;

    const resource = getResource(resourceId);


    if (!resource) {

        resourceStockHint.textContent =
            "ابتدا یک منبع انتخاب کنید.";

        return;
    }


    if (!start || !end) {

        resourceStockHint.textContent =
            `موجودی کل: ${resource.stock} ${resource.unit}`;

        return;
    }


    const available = getAvailableStock(
        resourceId,
        start,
        end,
        editingId
    );


    resourceStockHint.textContent =
        `موجودی قابل تخصیص در این بازه: ${available} ${resource.unit}`;
}


/* -----------------------------------------
   MODAL CONTROLS
----------------------------------------- */

function openModal(modal) {

    if (!modal) return;

    modal.hidden = false;

    document.body.style.overflow = "hidden";
}


function closeModal(modal) {

    if (!modal) return;

    modal.hidden = true;

    document.body.style.overflow = "";
}


function resetAllocationForm() {

    allocationForm.reset();

    document.getElementById(
        "editingAllocationId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent = "ثبت تخصیص جدید";


    const submitButton =
        allocationForm.querySelector('button[type="submit"]');


    submitButton.innerHTML = `
        <i data-lucide="check"></i>
        ثبت تخصیص
    `;


    renderNeedSummary();

    updateStockHint();

    refreshIcons();
}


function openNewAllocationModal() {

    resetAllocationForm();

    const now = new Date();

    const later = new Date(
        now.getTime() + 6 * 60 * 60 * 1000
    );


    startInput.value = toLocalDateTime(now);

    endInput.value = toLocalDateTime(later);

    statusInput.value = "pending";


    openModal(allocationModal);

    updateStockHint();
}


function toLocalDateTime(date) {

    const offset =
        date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
}


/* -----------------------------------------
   CONFLICT VALIDATION
----------------------------------------- */

function validateAllocation(
    data,
    excludedId = null
) {

    const start = new Date(data.start).getTime();

    const end = new Date(data.end).getTime();


    if (
        !data.needId ||
        !data.teamId ||
        !data.resourceId
    ) {

        return "لطفاً نیاز، تیم و منبع را انتخاب کنید.";
    }


    if (
        !Number.isInteger(data.amount) ||
        data.amount <= 0
    ) {

        return "مقدار تخصیص باید یک عدد صحیح و بیشتر از صفر باشد.";
    }


    if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        start >= end
    ) {

        return "زمان پایان باید بعد از زمان شروع باشد.";
    }


    const overlapping = getOverlappingAllocations(
        data.start,
        data.end,
        excludedId
    );


    // Team scheduling conflict

    const teamConflict = overlapping.find(
        item => item.teamId === data.teamId
    );


    if (teamConflict) {

        return (
            `این تیم در بازه انتخاب‌شده مشغول تخصیص دیگری است. ` +
            `کد تخصیص تداخل‌دار: ${teamConflict.code}`
        );
    }


    // Resource stock conflict

    const resource = getResource(data.resourceId);

    const available = getAvailableStock(
        data.resourceId,
        data.start,
        data.end,
        excludedId
    );


    if (data.amount > available) {

        return (
            `موجودی کافی نیست. موجودی قابل تخصیص ` +
            `${available} ${resource.unit} است.`
        );
    }


    return null;
}


/* -----------------------------------------
   FORM SUBMIT
----------------------------------------- */

allocationForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const editingId =
            Number(
                document.getElementById("editingAllocationId").value
            ) || null;


        const data = {

            needId: Number(needSelect.value),

            teamId: Number(teamSelect.value),

            resourceId: Number(resourceSelect.value),

            amount: Number(amountInput.value),

            start: startInput.value,

            end: endInput.value,

            status: statusInput.value

        };


        const error = validateAllocation(
            data,
            editingId
        );


        if (error) {

            needSummary.className =
                "selection-summary error";

            needSummary.innerHTML = `
                <i data-lucide="alert-circle"></i>

                <span>
                    ${error}
                </span>
            `;

            refreshIcons();

            showToast(error, "error");

            return;
        }


        // EDIT EXISTING ALLOCATION

        if (editingId) {

            const index = allocations.findIndex(
                item => item.id === editingId
            );

            if (index === -1) return;


            allocations[index] = {
                ...allocations[index],
                ...data
            };


            addActivity(
                "ویرایش تخصیص",
                `اطلاعات تخصیص ${allocations[index].code} تغییر کرد.`,
                "pencil"
            );


            showToast(
                "تخصیص با موفقیت ویرایش شد."
            );

        }


        // CREATE NEW ALLOCATION

        else {

            const newAllocation = {

                id: nextAllocationId,

                code: `AL-${1000 + nextAllocationId}`,

                ...data

            };


            allocations.unshift(newAllocation);

            nextAllocationId++;


            addActivity(
                "ثبت تخصیص جدید",
                `تخصیص ${newAllocation.code} ثبت شد.`,
                "check-circle-2"
            );


            showToast(
                "تخصیص جدید با موفقیت ثبت شد."
            );

        }


        closeModal(allocationModal);

        resetAllocationForm();

        renderAll();

    }
);


/* -----------------------------------------
   EDIT ALLOCATION
----------------------------------------- */

function editAllocation(id) {

    const item = allocations.find(
        allocation => allocation.id === id
    );

    if (!item) return;


    resetAllocationForm();


    document.getElementById(
        "editingAllocationId"
    ).value = item.id;


    needSelect.value = item.needId;

    teamSelect.value = item.teamId;

    resourceSelect.value = item.resourceId;

    amountInput.value = item.amount;

    startInput.value = item.start;

    endInput.value = item.end;

    statusInput.value = item.status;


    document.getElementById(
        "modalTitle"
    ).textContent = "ویرایش تخصیص";


    const submitButton =
        allocationForm.querySelector('button[type="submit"]');


    submitButton.innerHTML = `
        <i data-lucide="save"></i>
        ذخیره تغییرات
    `;


    renderNeedSummary();

    updateStockHint();

    openModal(allocationModal);

    refreshIcons();
}


/* -----------------------------------------
   VIEW DETAILS
----------------------------------------- */

function viewAllocation(id) {

    const item = allocations.find(
        allocation => allocation.id === id
    );

    if (!item) return;


    const need = getNeed(item.needId);

    const team = getTeam(item.teamId);

    const resource = getResource(item.resourceId);


    document.getElementById(
        "detailsAllocationCode"
    ).textContent = item.code;


    document.getElementById(
        "allocationDetailsContent"
    ).innerHTML = `

        <div class="details-grid">

            <div class="detail-item">

                <span>نیاز</span>

                <strong>
                    ${need?.title || "-"}
                </strong>

            </div>


            <div class="detail-item">

                <span>منطقه</span>

                <strong>
                    ${need?.region || "-"}
                </strong>

            </div>


            <div class="detail-item">

                <span>تیم امدادی</span>

                <strong>
                    ${team?.name || "-"}
                </strong>

            </div>


            <div class="detail-item">

                <span>منبع</span>

                <strong>
                    ${resource?.name || "-"}
                </strong>

            </div>


            <div class="detail-item">

                <span>مقدار</span>

                <strong>
                    ${toPersianNumber(item.amount)}
                    ${resource?.unit || ""}
                </strong>

            </div>


            <div class="detail-item">

                <span>وضعیت</span>

                <strong>
                    ${getStatusText(item.status)}
                </strong>

            </div>


            <div class="detail-item">

                <span>زمان شروع</span>

                <strong>
                    ${formatDate(item.start)}
                </strong>

            </div>


            <div class="detail-item">

                <span>زمان پایان</span>

                <strong>
                    ${formatDate(item.end)}
                </strong>

            </div>

        </div>

    `;


    openModal(detailsModal);
}


/* -----------------------------------------
   DELETE ALLOCATION
----------------------------------------- */

function deleteAllocation(id) {

    const item = allocations.find(
        allocation => allocation.id === id
    );

    if (!item) return;


    const confirmed = confirm(
        `آیا از حذف تخصیص ${item.code} مطمئن هستید؟`
    );


    if (!confirmed) return;


    allocations = allocations.filter(
        allocation => allocation.id !== id
    );


    addActivity(
        "حذف تخصیص",
        `تخصیص ${item.code} حذف شد.`,
        "trash-2"
    );


    showToast("تخصیص حذف شد.");

    renderAll();
}


/* -----------------------------------------
   TABLE ACTIONS
----------------------------------------- */

allocationTableBody.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("[data-action]");

        if (!button) return;


        const action = button.dataset.action;

        const id = Number(button.dataset.id);


        if (action === "view") {
            viewAllocation(id);
        }


        if (action === "edit") {
            editAllocation(id);
        }


        if (action === "delete") {
            deleteAllocation(id);
        }

    }
);


/* -----------------------------------------
   FILTERS
----------------------------------------- */

allocationSearch.addEventListener(
    "input",
    renderAllocations
);


statusFilter.addEventListener(
    "change",
    renderAllocations
);


document.getElementById("resetFilters")
    .addEventListener("click", function() {

        allocationSearch.value = "";

        statusFilter.value = "all";

        renderAllocations();

        showToast("فیلترها پاک شدند.");

    });


/* -----------------------------------------
   FORM INPUT EVENTS
----------------------------------------- */

needSelect.addEventListener(
    "change",
    renderNeedSummary
);


resourceSelect.addEventListener(
    "change",
    updateStockHint
);


startInput.addEventListener(
    "change",
    updateStockHint
);


endInput.addEventListener(
    "change",
    updateStockHint
);


/* -----------------------------------------
   MODAL EVENTS
----------------------------------------- */

document.getElementById("newAllocationBtn")
    .addEventListener(
        "click",
        openNewAllocationModal
    );


document.querySelectorAll("[data-close]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const modal = document.getElementById(
                    button.dataset.close
                );

                if (modal) {
                    closeModal(modal);
                }

            }
        );

    });


[allocationModal, detailsModal].forEach(modal => {

    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {
                closeModal(modal);
            }

        }
    );

});


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            if (!allocationModal.hidden) {
                closeModal(allocationModal);
            }

            if (!detailsModal.hidden) {
                closeModal(detailsModal);
            }

        }

    }
);


/* -----------------------------------------
   SIDEBAR
----------------------------------------- */

function initializeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const toggle =
        document.getElementById("sidebarToggle");

    const close =
        document.getElementById("sidebarClose");

    const backdrop =
        document.getElementById("sidebarBackdrop");


    if (!sidebar || !toggle || !backdrop) {
        return;
    }


    function openSidebar() {

        sidebar.classList.add("open");

        backdrop.classList.add("active");

        document.body.classList.add("sidebar-open");

        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function closeSidebar() {

        sidebar.classList.remove("open");

        backdrop.classList.remove("active");

        document.body.classList.remove("sidebar-open");

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    toggle.addEventListener(
        "click",
        function() {

            if (window.innerWidth <= 992) {

                if (sidebar.classList.contains("open")) {
                    closeSidebar();
                } else {
                    openSidebar();
                }

            } else {

                document.body.classList.toggle(
                    "sidebar-collapsed"
                );

            }

        }
    );


    close?.addEventListener(
        "click",
        closeSidebar
    );


    backdrop.addEventListener(
        "click",
        closeSidebar
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Escape") {
                closeSidebar();
            }

        }
    );


    window.addEventListener(
        "resize",
        function() {

            if (window.innerWidth > 992) {
                closeSidebar();
            }

        }
    );

}


/* -----------------------------------------
   THEME
----------------------------------------- */

function initializeTheme() {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;


    let savedTheme = "light";


    try {

        savedTheme =
            localStorage.getItem("crisisred-theme") || "light";

    } catch (error) {

        console.warn(
            "امکان خواندن تنظیم پوسته وجود ندارد.",
            error
        );

    }


    document.body.classList.toggle(
        "dark-theme",
        savedTheme === "dark"
    );


    function updateThemeIcon() {

        const isDark =
            document.body.classList.contains("dark-theme");


        themeToggle.innerHTML = isDark
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';


        refreshIcons();

    }


    updateThemeIcon();


    themeToggle.addEventListener(
        "click",
        function() {

            document.body.classList.toggle("dark-theme");


            const isDark =
                document.body.classList.contains("dark-theme");


            try {

                localStorage.setItem(
                    "crisisred-theme",
                    isDark ? "dark" : "light"
                );

            } catch (error) {

                console.warn(
                    "امکان ذخیره تنظیم پوسته وجود ندارد.",
                    error
                );

            }


            updateThemeIcon();

        }
    );

}


/* -----------------------------------------
   NOTIFICATIONS
----------------------------------------- */

function initializeNotifications() {

    const notificationButton =
        document.querySelector(".notification");

    if (!notificationButton) return;


    notificationButton.addEventListener(
        "click",
        function() {

            showToast(
                "در حال حاضر اعلان جدیدی وجود ندارد."
            );

        }
    );

}


/* -----------------------------------------
   DATE AND FOOTER
----------------------------------------- */

function initializeDate() {

    const today = new Date();


    const todayLabel =
        document.getElementById("todayLabel");

    const lastUpdated =
        document.getElementById("lastUpdated");


    if (todayLabel) {

        todayLabel.innerHTML = `
            <i data-lucide="calendar-days"></i>
            ${today.toLocaleDateString("fa-IR")}
        `;

    }


    if (lastUpdated) {

        lastUpdated.textContent =
            `آخرین به‌روزرسانی: ${
                today.toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }`;

    }


    refreshIcons();
}


/* -----------------------------------------
   LUCIDE ICONS
----------------------------------------- */

function refreshIcons() {

    if (window.lucide) {
        lucide.createIcons();
    }

}


/* -----------------------------------------
   RENDER ALL
----------------------------------------- */

function renderAll() {

    renderStatistics();

    renderInventory();

    renderAllocations();

    renderActivities();

    initializeDate();

}


/* -----------------------------------------
   INITIALIZATION
----------------------------------------- */

function initializeAllocationPage() {

    populateSelects();

    initializeSidebar();

    initializeTheme();

    initializeNotifications();

    renderAll();

    renderNeedSummary();

    refreshIcons();

}


/* -----------------------------------------
   DOM READY
----------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    initializeAllocationPage
);