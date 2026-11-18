/* =========================================
   CRISIS RED - TEAMS PAGE
========================================= */

"use strict";


/* =========================================
   Sample Data
========================================= */

let teams = [

    {
        code: "T-101",
        name: "تیم امداد شمال",
        status: "active",
        description: "تیم عملیاتی امداد و نجات در مناطق شمالی",
        members: [
            { id: 1, name: "علی رضایی", role: "leader", date: "2026-10-12" },
            { id: 2, name: "محمد احمدی", role: "member", date: "2026-10-13" },
            { id: 3, name: "حسین کریمی", role: "member", date: "2026-10-15" }
        ]
    },

    {
        code: "T-102",
        name: "تیم پشتیبانی مرکزی",
        status: "active",
        description: "مسئولیت پشتیبانی و هماهنگی عملیات امدادی",
        members: [
            { id: 4, name: "رضا محمدی", role: "leader", date: "2026-10-10" },
            { id: 5, name: "امیر حسینی", role: "member", date: "2026-10-11" }
        ]
    },

    {
        code: "T-103",
        name: "تیم درمان",
        status: "active",
        description: "ارائه خدمات درمانی و کمک‌های اولیه",
        members: [
            { id: 6, name: "مهدی موسوی", role: "leader", date: "2026-10-08" },
            { id: 7, name: "سارا احمدی", role: "member", date: "2026-10-09" }
        ]
    },

    {
        code: "T-104",
        name: "تیم لجستیک",
        status: "standby",
        description: "پشتیبانی و هماهنگی انتقال تجهیزات و منابع",
        members: [
            { id: 8, name: "علی مرادی", role: "leader", date: "2026-10-07" }
        ]
    },

    {
        code: "T-105",
        name: "تیم امداد شرق",
        status: "inactive",
        description: "تیم امدادی مستقر در مناطق شرقی",
        members: [
            { id: 9, name: "آرمان نوری", role: "leader", date: "2026-10-05" }
        ]
    }

];


const volunteers = [

    { id: 10, name: "پارسا رحیمی" },
    { id: 11, name: "نیما جعفری" },
    { id: 12, name: "آرین کاظمی" },
    { id: 13, name: "مبین شریفی" },
    { id: 14, name: "کیان رضایی" },
    { id: 15, name: "سینا اکبری" },
    { id: 16, name: "یاسین احمدی" }

];


let selectedTeamCode = null;


const activities = [

    {
        icon: "users-round",
        tone: "blue",
        title: "ایجاد تیم امداد شمال",
        detail: "تیم جدید در سامانه ثبت شده است."
    },

    {
        icon: "user-plus",
        tone: "green",
        title: "افزودن عضو جدید",
        detail: "یک داوطلب به تیم پشتیبانی مرکزی اضافه شد."
    },

    {
        icon: "shield-check",
        tone: "red",
        title: "تعیین سرپرست تیم",
        detail: "نقش سرپرست برای یکی از داوطلبان ثبت شد."
    }

];


/* =========================================
   Helpers
========================================= */

const fa = value =>
    Number(value).toLocaleString("fa-IR");


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];

    });

}


function refreshIcons() {

    if (
        window.lucide &&
        typeof window.lucide.createIcons === "function"
    ) {
        window.lucide.createIcons();
    }

}


function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


function showToast(message) {

    const toast = document.getElementById("toastMessage");
    const toastText = document.getElementById("toastText");

    if (!toast || !toastText) return;

    toastText.textContent = message;

    toast.classList.add("show");

    window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);

}


function getSearchValue() {

    return document.getElementById("teamSearch")?.value || "";

}


/* =========================================
   Status Helpers
========================================= */

function getStatusText(status) {

    const labels = {
        active: "فعال",
        standby: "آماده‌باش",
        inactive: "غیرفعال"
    };

    return labels[status] || "نامشخص";

}


function getStatusClass(status) {

    const classes = {
        active: "active",
        standby: "standby",
        inactive: "inactive"
    };

    return classes[status] || "inactive";

}


/* =========================================
   Statistics
========================================= */

function renderStatistics() {

    const totalTeams = teams.length;

    const activeTeams = teams.filter(team =>
        team.status === "active"
    ).length;

    const totalMembers = teams.reduce((total, team) => {
        return total + team.members.length;
    }, 0);

    const totalLeaders = teams.reduce((total, team) => {

        return total + team.members.filter(member =>
            member.role === "leader"
        ).length;

    }, 0);


    setText("totalTeams", fa(totalTeams));
    setText("activeTeams", fa(activeTeams));
    setText("totalMembers", fa(totalMembers));
    setText("totalLeaders", fa(totalLeaders));

    setText("teamCountLabel", `${fa(totalTeams)} تیم`);

}


/* =========================================
   Render Team Cards
========================================= */

function renderTeams(searchValue = "") {

    const grid = document.getElementById("teamsGrid");
    const emptyState = document.getElementById("emptyState");

    if (!grid || !emptyState) return;


    const query = searchValue.trim().toLowerCase();


    const filteredTeams = teams.filter(team => {

        return (
            team.name.toLowerCase().includes(query) ||
            team.code.toLowerCase().includes(query)
        );

    });


    grid.innerHTML = filteredTeams.map(team => {

        const leaders = team.members.filter(member =>
            member.role === "leader"
        );

        const previewMembers = team.members.slice(0, 3);

        const extraMembers = Math.max(
            0,
            team.members.length - previewMembers.length
        );


        const avatars = previewMembers.map(member => {

            const firstLetter = member.name.trim().charAt(0);

            return `
                <div
                    class="member-avatar"
                    title="${escapeHTML(member.name)}">

                    ${escapeHTML(firstLetter)}

                </div>
            `;

        }).join("");


        const moreAvatar = extraMembers > 0
            ? `<div class="member-avatar more">+${fa(extraMembers)}</div>`
            : "";


        return `

            <article class="team-card">

                <div class="team-card-top">

                    <div class="team-identity">

                        <div class="team-icon">
                            <i data-lucide="users-round"></i>
                        </div>

                        <div class="team-name">

                            <h4>${escapeHTML(team.name)}</h4>

                            <span>${escapeHTML(team.code)}</span>

                        </div>

                    </div>


                    <span class="team-status ${getStatusClass(team.status)}">
                        ${getStatusText(team.status)}
                    </span>

                </div>


                <p class="team-description">
                    ${escapeHTML(team.description)}
                </p>


                <div class="team-card-info">

                    <div class="team-info-item">

                        <i data-lucide="users"></i>

                        <div>
                            <span>تعداد اعضا</span>
                            <strong>${fa(team.members.length)} نفر</strong>
                        </div>

                    </div>


                    <div class="team-info-item">

                        <i data-lucide="shield-check"></i>

                        <div>
                            <span>سرپرستان</span>
                            <strong>${fa(leaders.length)} نفر</strong>
                        </div>

                    </div>

                </div>


                <div class="team-card-footer">

                    <div class="team-members-preview">
                        ${avatars}
                        ${moreAvatar}
                    </div>


                    <div class="team-card-actions">

                        <button
                            type="button"
                            class="team-delete-btn"
                            data-delete-team="${escapeHTML(team.code)}"
                            aria-label="حذف تیم ${escapeHTML(team.name)}"
                            title="حذف تیم">

                            <i data-lucide="trash-2"></i>

                        </button>


                        <button
                            type="button"
                            class="team-details-btn"
                            data-team="${escapeHTML(team.code)}">

                            مشاهده جزئیات
                            <i data-lucide="arrow-left"></i>

                        </button>

                    </div>

                </div>

            </article>

        `;

    }).join("");


    emptyState.hidden = filteredTeams.length !== 0;

    renderStatistics();

    refreshIcons();

}


/* =========================================
   Activities
========================================= */

function renderActivities() {

    const container = document.getElementById("teamActivities");

    if (!container) return;


    container.innerHTML = activities.map(item => `

        <div class="activity-item">

            <div class="activity-icon ${item.tone}">
                <i data-lucide="${item.icon}"></i>
            </div>

            <div>
                <strong>${escapeHTML(item.title)}</strong>
                <span>${escapeHTML(item.detail)}</span>
            </div>

        </div>

    `).join("");


    refreshIcons();

}


function addActivity(title, detail, icon = "users-round") {

    activities.unshift({
        icon,
        tone: "green",
        title,
        detail
    });

    activities.splice(5);

    renderActivities();

}


/* =========================================
   Modal Functions
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

    const anotherOpen = document.querySelector(
        ".modal-overlay:not([hidden])"
    );

    if (!anotherOpen) {
        document.body.style.overflow = "";
    }

}


function initializeModals() {

    document.querySelectorAll("[data-close]").forEach(button => {

        button.addEventListener("click", () => {

            closeModal(button.dataset.close);

        });

    });


    document.querySelectorAll(".modal-overlay").forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeModal(modal.id);
            }

        });

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            document.querySelectorAll(".modal-overlay").forEach(modal => {

                if (!modal.hidden) {
                    closeModal(modal.id);
                }

            });

        }

    });

}


/* =========================================
   Create New Team
========================================= */

function initializeCreateTeam() {

    const addButton = document.getElementById("addTeamBtn");
    const form = document.getElementById("teamForm");

    if (!addButton || !form) return;


    addButton.addEventListener("click", () => {

        form.reset();

        openModal("teamModal");

    });


    form.addEventListener("submit", event => {

        event.preventDefault();


        const code = document.getElementById("teamCode").value.trim();

        const name = document.getElementById("teamName").value.trim();

        const status = document.getElementById("teamStatus").value;


        if (!code || !name) {

            showToast("لطفاً اطلاعات تیم را کامل کنید.");

            return;

        }


        const duplicate = teams.some(team =>
            team.code.toLowerCase() === code.toLowerCase()
        );


        if (duplicate) {

            showToast("این کد تیم قبلاً ثبت شده است.");

            return;

        }


        const newTeam = {

            code,
            name,
            status,

            description: "تیم امدادی ثبت‌شده در سامانه",

            members: []

        };


        teams.unshift(newTeam);


        addActivity(
            "ایجاد تیم جدید",
            `تیم ${name} در سامانه ثبت شد.`,
            "users-round"
        );


        renderTeams(getSearchValue());

        closeModal("teamModal");

        showToast("تیم جدید با موفقیت ایجاد شد.");

    });

}


/* =========================================
   Volunteer Select
========================================= */

function renderVolunteerOptions() {

    const select = document.getElementById("volunteerSelect");

    if (!select) return;


    const usedIds = teams.flatMap(team =>
        team.members.map(member => member.id)
    );


    const availableVolunteers = volunteers.filter(volunteer =>
        !usedIds.includes(volunteer.id)
    );


    select.innerHTML = `

        <option value="">انتخاب داوطلب</option>

        ${availableVolunteers.map(volunteer => `

            <option value="${volunteer.id}">
                ${escapeHTML(volunteer.name)}
            </option>

        `).join("")}

    `;

}


/* =========================================
   Team Details
========================================= */

function openTeamDetails(teamCode) {

    const team = teams.find(item =>
        item.code === teamCode
    );

    if (!team) return;


    selectedTeamCode = teamCode;


    setText("detailsTeamName", team.name);

    setText("detailsTeamCode", `کد تیم: ${team.code}`);


    renderTeamSummary(team);

    renderMembers(team);

    renderVolunteerOptions();


    const dateInput = document.getElementById("membershipDate");

    if (dateInput) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }


    openModal("detailsModal");

}


function renderTeamSummary(team) {

    const summary = document.getElementById("teamDetailsSummary");

    if (!summary) return;


    const leaders = team.members.filter(member =>
        member.role === "leader"
    );


    summary.innerHTML = `

        <div class="detail-summary-item">

            <span>وضعیت تیم</span>

            <strong>${getStatusText(team.status)}</strong>

        </div>


        <div class="detail-summary-item">

            <span>تعداد اعضا</span>

            <strong>${fa(team.members.length)} نفر</strong>

        </div>


        <div class="detail-summary-item">

            <span>سرپرستان</span>

            <strong>${fa(leaders.length)} نفر</strong>

        </div>

    `;

}


/* =========================================
   Render Members
========================================= */

function renderMembers(team) {

    const list = document.getElementById("membersList");

    if (!list) return;


    setText("memberCount", `${fa(team.members.length)} عضو`);


    if (team.members.length === 0) {

        list.innerHTML = `

            <div class="no-members">
                هنوز داوطلبی به این تیم اضافه نشده است.
            </div>

        `;

        refreshIcons();

        return;

    }


    list.innerHTML = team.members.map(member => {

        const isLeader = member.role === "leader";

        const roleText = isLeader ? "سرپرست" : "عضو";

        const roleClass = isLeader ? "leader" : "";


        return `

            <div class="member-row">

                <div class="member-row-avatar">
                    <i data-lucide="user-round"></i>
                </div>


                <div class="member-row-info">

                    <strong>${escapeHTML(member.name)}</strong>

                    <span>
                        تاریخ عضویت:
                        ${escapeHTML(member.date)}
                    </span>

                </div>


                <div class="member-row-actions">

                    ${!isLeader ? `

                        <button
                            type="button"
                            class="member-promote-btn"
                            data-promote-member="${member.id}"
                            title="تعیین به‌عنوان سرپرست"
                            aria-label="تعیین ${escapeHTML(member.name)} به‌عنوان سرپرست">

                            <i data-lucide="shield-check"></i>
                            <span>سرپرست‌کردن</span>

                        </button>

                    ` : ""}


                    <span class="role-badge ${roleClass}">
                        ${roleText}
                    </span>


                    <button
                        type="button"
                        class="member-remove-btn"
                        data-remove-member="${member.id}"
                        title="حذف عضو از تیم"
                        aria-label="حذف ${escapeHTML(member.name)} از تیم">

                        <i data-lucide="user-round-x"></i>

                    </button>

                </div>

            </div>

        `;

    }).join("");


    refreshIcons();

}


/* =========================================
   Add Volunteer To Team
========================================= */

function initializeAddMember() {

    const form = document.getElementById("memberForm");

    if (!form) return;


    form.addEventListener("submit", event => {

        event.preventDefault();


        const team = teams.find(item =>
            item.code === selectedTeamCode
        );

        if (!team) return;


        const volunteerId = Number(
            document.getElementById("volunteerSelect").value
        );

        const role = document.getElementById("memberRole").value;

        const date = document.getElementById("membershipDate").value;


        if (!volunteerId || !date) {

            showToast("لطفاً اطلاعات عضویت را کامل کنید.");

            return;

        }


        const volunteer = volunteers.find(item =>
            item.id === volunteerId
        );


        if (!volunteer) {

            showToast("داوطلب انتخاب‌شده معتبر نیست.");

            return;

        }


        const alreadyMember = teams.some(item =>
            item.members.some(member => member.id === volunteerId)
        );


        if (alreadyMember) {

            showToast("این داوطلب قبلاً عضو یک تیم شده است.");

            return;

        }


        if (role === "leader") {

            const hasLeader = team.members.some(member =>
                member.role === "leader"
            );


            if (hasLeader) {

                showToast("این تیم از قبل سرپرست دارد.");

                return;

            }

        }


        team.members.push({

            id: volunteer.id,

            name: volunteer.name,

            role,

            date

        });


        renderMembers(team);

        renderTeamSummary(team);

        renderVolunteerOptions();

        renderTeams(getSearchValue());


        addActivity(
            "افزودن داوطلب به تیم",
            `${volunteer.name} به تیم ${team.name} اضافه شد.`,
            "user-plus"
        );


        form.reset();

        document.getElementById("membershipDate").value =
            new Date().toISOString().slice(0, 10);


        showToast("داوطلب با موفقیت به تیم اضافه شد.");

    });

}


/* =========================================
   Delete Team
========================================= */

function deleteTeam(teamCode) {

    const team = teams.find(item =>
        item.code === teamCode
    );

    if (!team) return;


    const memberCount = team.members.length;


    const message = memberCount > 0

        ? `آیا از حذف تیم «${team.name}» مطمئن هستید؟

این تیم ${fa(memberCount)} عضو دارد.
اعضا از فهرست داوطلبان حذف نمی‌شوند، اما عضویت آن‌ها در این تیم پاک می‌شود.`

        : `آیا از حذف تیم «${team.name}» مطمئن هستید؟`;


    if (!window.confirm(message)) return;


    // حذف تیم از فهرست تیم‌ها
    teams = teams.filter(item =>
        item.code !== teamCode
    );


    // اگر جزئیات همین تیم باز است، پنجره بسته شود
    if (selectedTeamCode === teamCode) {

        closeModal("detailsModal");

        selectedTeamCode = null;

    }


    // ثبت فعالیت
    addActivity(
        "حذف تیم",
        `تیم ${team.name} از سامانه حذف شد.`,
        "trash-2"
    );


    // به‌روزرسانی اطلاعات
    renderTeams(getSearchValue());

    renderVolunteerOptions();


    showToast("تیم با موفقیت حذف شد.");

}


/* =========================================
   Remove Member From Team
========================================= */

function removeMember(teamCode, memberId) {

    const team = teams.find(item =>
        item.code === teamCode
    );

    if (!team) return;


    const member = team.members.find(item =>
        item.id === memberId
    );

    if (!member) return;


    // بررسی اینکه عضو، آخرین سرپرست تیم نباشد
    const isLastLeader =

        member.role === "leader" &&

        !team.members.some(item =>
            item.id !== memberId &&
            item.role === "leader"
        );


    if (isLastLeader) {

        showToast(
            "ابتدا یکی از اعضای دیگر را سرپرست کنید؛ سپس می‌توانید سرپرست فعلی را حذف کنید."
        );

        return;

    }


    const confirmed = window.confirm(

        `آیا می‌خواهید «${member.name}» را از تیم «${team.name}» خارج کنید؟

اطلاعات او در فهرست داوطلبان باقی می‌ماند.`

    );


    if (!confirmed) return;


    // حذف فقط از اعضای همین تیم
    team.members = team.members.filter(item =>
        item.id !== memberId
    );


    // به‌روزرسانی پنجره جزئیات و آمار
    renderMembers(team);

    renderTeamSummary(team);

    renderVolunteerOptions();

    renderTeams(getSearchValue());


    // ثبت فعالیت
    addActivity(
        "حذف عضو از تیم",
        `${member.name} از تیم ${team.name} خارج شد.`,
        "user-round-x"
    );


    showToast("عضو با موفقیت از تیم خارج شد.");

}


/* =========================================
   Promote Member To Team Leader
========================================= */

function promoteMember(teamCode, memberId) {

    const team = teams.find(item =>
        item.code === teamCode
    );

    if (!team) return;


    const member = team.members.find(item =>
        item.id === memberId
    );

    if (!member || member.role === "leader") return;


    const currentLeader = team.members.find(item =>
        item.role === "leader"
    );


    const confirmationText = currentLeader

        ? `سرپرستی تیم «${team.name}» از ${currentLeader.name} به ${member.name} منتقل شود؟`

        : `${member.name} به‌عنوان سرپرست تیم «${team.name}» تعیین شود؟`;


    if (!window.confirm(confirmationText)) return;


    // فقط یک سرپرست برای تیم باقی می‌ماند
    team.members.forEach(item => {

        item.role = item.id === memberId
            ? "leader"
            : "member";

    });


    renderMembers(team);

    renderTeamSummary(team);

    renderTeams(getSearchValue());


    addActivity(
        "تغییر سرپرست تیم",
        `${member.name} به‌عنوان سرپرست تیم ${team.name} تعیین شد.`,
        "shield-check"
    );


    showToast("سرپرست تیم با موفقیت تغییر کرد.");

}


/* =========================================
   Search
========================================= */

function initializeSearch() {

    const searchInput = document.getElementById("teamSearch");

    const resetButton = document.getElementById("resetSearch");


    if (searchInput) {

        searchInput.addEventListener("input", () => {

            renderTeams(searchInput.value);

        });

    }


    if (resetButton) {

        resetButton.addEventListener("click", () => {

            if (searchInput) {
                searchInput.value = "";
            }

            renderTeams();

        });

    }

}


/* =========================================
   Team Card Events
========================================= */

function initializeTeamCards() {

    const grid = document.getElementById("teamsGrid");

    if (!grid) return;


    grid.addEventListener("click", event => {

        // حذف تیم
        const deleteButton = event.target.closest(
            "[data-delete-team]"
        );


        if (deleteButton) {

            event.stopPropagation();

            deleteTeam(deleteButton.dataset.deleteTeam);

            return;

        }


        // مشاهده جزئیات تیم
        const detailsButton = event.target.closest(
            "[data-team]"
        );


        if (detailsButton) {

            openTeamDetails(detailsButton.dataset.team);

        }

    });

}


/* =========================================
   Member Row Actions
========================================= */

function initializeMemberActions() {

    const list = document.getElementById("membersList");

    if (!list) return;


    list.addEventListener("click", event => {

        // حذف عضو
        const removeButton = event.target.closest(
            "[data-remove-member]"
        );


        if (removeButton) {

            const memberId = Number(
                removeButton.dataset.removeMember
            );

            removeMember(selectedTeamCode, memberId);

            return;

        }


        // تغییر سرپرست
        const promoteButton = event.target.closest(
            "[data-promote-member]"
        );


        if (promoteButton) {

            const memberId = Number(
                promoteButton.dataset.promoteMember
            );

            promoteMember(selectedTeamCode, memberId);

        }

    });

}


/* =========================================
   Theme
========================================= */

function initializeTheme() {

    const themeButton = document.getElementById("themeToggle");

    if (!themeButton) return;


    try {

        if (localStorage.getItem("crisisred-theme") === "dark") {

            document.body.classList.add("dark-theme");

        }

    } catch (error) { }


    function updateThemeIcon() {

        themeButton.innerHTML =

            document.body.classList.contains("dark-theme")

                ? '<i data-lucide="sun"></i>'

                : '<i data-lucide="moon"></i>';


        refreshIcons();

    }


    updateThemeIcon();


    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");


        try {

            localStorage.setItem(
                "crisisred-theme",

                document.body.classList.contains("dark-theme")
                    ? "dark"
                    : "light"
            );

        } catch (error) { }


        updateThemeIcon();

    });

}


/* =========================================
   Sidebar
========================================= */

function initializeSidebar() {

    const sidebar = document.getElementById("sidebar");

    const toggle = document.getElementById("sidebarToggle");

    const closeButton = document.getElementById("sidebarClose");

    const backdrop = document.getElementById("sidebarBackdrop");


    if (!sidebar || !toggle) return;


    const isMobile = () =>
        window.matchMedia("(max-width: 900px)").matches;


    function closeMobileMenu() {

        sidebar.classList.remove("open");

        document.body.classList.remove("sidebar-open");

        toggle.setAttribute("aria-expanded", "false");

    }


    function openMobileMenu() {

        sidebar.classList.add("open");

        document.body.classList.add("sidebar-open");

        toggle.setAttribute("aria-expanded", "true");

    }


    toggle.addEventListener("click", () => {

        if (isMobile()) {

            sidebar.classList.contains("open")
                ? closeMobileMenu()
                : openMobileMenu();

        } else {

            document.body.classList.toggle("sidebar-collapsed");

        }

    });


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    sidebar.querySelectorAll(".nav-item").forEach(link => {

        link.addEventListener("click", () => {

            if (isMobile()) {
                closeMobileMenu();
            }

        });

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && isMobile()) {

            closeMobileMenu();

        }

    });


    window.addEventListener("resize", () => {

        if (!isMobile()) {
            closeMobileMenu();
        }

    });

}


/* =========================================
   Date and Last Updated
========================================= */

function initializeDate() {

    const now = new Date();

    const dateLabel = document.getElementById("todayLabel");


    if (dateLabel) {

        dateLabel.innerHTML = `

            <i data-lucide="calendar-days"></i>

            ${now.toLocaleDateString("fa-IR")}

        `;

    }


    setText(
        "lastUpdated",

        `آخرین به‌روزرسانی: ${
            now.toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit"
            })
        }`
    );


    refreshIcons();

}


/* =========================================
   Initialize Application
========================================= */

function initializeTeamsPage() {

    renderTeams();

    renderActivities();

    initializeTheme();

    initializeSidebar();

    initializeModals();

    initializeCreateTeam();

    initializeAddMember();

    initializeSearch();

    initializeTeamCards();

    initializeMemberActions();

    initializeDate();

    refreshIcons();

}


document.addEventListener(
    "DOMContentLoaded",
    initializeTeamsPage
);