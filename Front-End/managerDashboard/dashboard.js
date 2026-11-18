
/* =========================================
   CrisisRed - Admin Dashboard
========================================= */

"use strict";

/* اطلاعات نمونه نیازها */

const needs = [
  { id: "N-101", region: "منطقه شمالی", quantity: 500, allocated: 200 },
  { id: "N-102", region: "منطقه شمالی", quantity: 300, allocated: 300 },
  { id: "N-201", region: "منطقه مرکزی", quantity: 200, allocated: 200 },
  { id: "N-202", region: "منطقه مرکزی", quantity: 150, allocated: 150 },
  { id: "N-301", region: "منطقه جنوبی", quantity: 250, allocated: 250 },
  { id: "N-302", region: "منطقه جنوبی", quantity: 100, allocated: 50 },
  { id: "N-401", region: "منطقه غربی", quantity: 100, allocated: 100 },
  { id: "N-501", region: "منطقه شرقی", quantity: 180, allocated: 0 },
  { id: "N-502", region: "منطقه شرقی", quantity: 220, allocated: 100 }
];

/* اطلاعات تیم‌ها */

const teams = [
  { name: "تیم امداد شمال", status: "active" },
  { name: "تیم پشتیبانی مرکزی", status: "active" },
  { name: "تیم درمان", status: "active" },
  { name: "تیم لجستیک", status: "active" },
  { name: "تیم امداد شرق", status: "active" }
];

/* اطلاعات منابع */

const resources = [
  { name: "آب آشامیدنی", current: 120, minimum: 200, unit: "بسته" },
  { name: "پتو", current: 35, minimum: 80, unit: "عدد" },
  { name: "جعبه کمک‌های اولیه", current: 8, minimum: 15, unit: "عدد" },
  { name: "مواد غذایی", current: 240, minimum: 100, unit: "بسته" }
];

/* اطلاعات حادثه‌ها */

const incidents = [
  { name: "زلزله", region: "منطقه شمالی", time: "امروز" },
  { name: "آتش‌سوزی", region: "منطقه مرکزی", time: "امروز" },
  { name: "سیل", region: "منطقه جنوبی", time: "دیروز" },
  { name: "زلزله", region: "منطقه شرقی", time: "امروز" }
];

/* فعالیت‌های اخیر */

const activities = [
  {
    icon: "alert-circle",
    tone: "red",
    title: "ثبت نیاز جدید",
    detail: "نیاز آب آشامیدنی در منطقه شمالی ثبت شد"
  },
  {
    icon: "check-circle-2",
    tone: "green",
    title: "ثبت تخصیص منابع",
    detail: "تخصیص مواد غذایی برای منطقه مرکزی تکمیل شد"
  },
  {
    icon: "users-round",
    tone: "blue",
    title: "به‌روزرسانی تیم امدادی",
    detail: "وضعیت تیم پشتیبانی مرکزی تغییر کرد"
  }
];

/* محاسبات اولیه */

const fa = value => Number(value).toLocaleString("fa-IR");

const uncovered = needs.filter(
  item => item.allocated < item.quantity
);

const covered = needs.length - uncovered.length;

const lowStock = resources.filter(
  item => item.current < item.minimum
);


/* =========================================
   ابزارهای عمومی
========================================= */

function setText(id, value) {

  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }

}


/* =========================================
   بروزرسانی آیکون‌ها
========================================= */

function refreshIcons() {

  if (
    window.lucide &&
    typeof window.lucide.createIcons === "function"
  ) {

    window.lucide.createIcons();

  }

}


/* =========================================
   نمایش اطلاعات داشبورد
========================================= */

function renderDashboard() {

  /* کارت‌های آماری */

  setText("uncoveredNeeds", fa(uncovered.length));

  setText(
    "activeTeams",
    fa(teams.filter(team => team.status === "active").length)
  );

  setText("lowResources", fa(lowStock.length));

  setText("totalIncidents", fa(incidents.length));

  setText("coveredCount", fa(covered));

  setText("uncoveredCount", fa(uncovered.length));

  setText("totalNeeds", fa(needs.length));


  /* درصد پوشش نیازها */

  const percent = Math.round(
    (covered / needs.length) * 100
  );

  setText("coveragePercent", `${fa(percent)}٪`);

  setText("operationCoverage", `${fa(percent)}٪`);


  /* نمودار دایره‌ای */

  const donut = document.getElementById("coverageDonut");

  if (donut) {

    donut.style.background =
      `conic-gradient(
        var(--success) 0 ${percent}%,
        #E9DADD ${percent}% 100%
      )`;

  }


  /* محاسبه نیازهای هر منطقه */

  const regionCounts = {};

  uncovered.forEach(item => {

    regionCounts[item.region] =
      (regionCounts[item.region] || 0) + 1;

  });


  /* نمودار میله‌ای */

  const chart = document.getElementById("regionChart");

  if (chart) {

    const entries = Object.entries(regionCounts);

    const maxCount = Math.max(
      1,
      ...entries.map(([, count]) => count)
    );

    chart.innerHTML = entries.map(([name, count]) => `

      <div class="bar-row">

        <span class="bar-label">
          ${name}
        </span>

        <div class="bar-track">

          <div
            class="bar-fill"
            style="width:${(count / maxCount) * 100}%">
          </div>

        </div>

        <b class="bar-value">
          ${fa(count)}
        </b>

      </div>

    `).join("");

  }


  /* جدول منابع با موجودی کم */

  const table = document.getElementById("resourcesTable");

  if (table) {

    table.innerHTML = lowStock.map(item => `

      <tr>

        <td>
          <strong>${item.name}</strong>
        </td>

        <td>
          ${fa(item.current)} ${item.unit}
        </td>

        <td>
          ${fa(item.minimum)} ${item.unit}
        </td>

        <td>
          <span class="stock-badge">
            موجودی کم
          </span>
        </td>

      </tr>

    `).join("");

  }


  /* فعالیت‌های اخیر */

  const activityList = document.getElementById("activityList");

  if (activityList) {

    activityList.innerHTML = activities.map(item => `

      <div class="activity-item">

        <div class="activity-icon ${item.tone}">

          <i data-lucide="${item.icon}"></i>

        </div>

        <div>

          <strong>${item.title}</strong>

          <span>${item.detail}</span>

        </div>

      </div>

    `).join("");

  }


  /* تاریخ و ساعت */

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
   تغییر پوسته روشن و تاریک
========================================= */

function initializeTheme() {

  const themeButton = document.getElementById("themeToggle");

  try {

    if (localStorage.getItem("crisisred-theme") === "dark") {

      document.body.classList.add("dark-theme");

    }

  } catch (error) {

    /* ممکن است localStorage در فایل محلی در دسترس نباشد */

  }


  const updateButton = () => {

    if (!themeButton) return;

    themeButton.innerHTML =
      document.body.classList.contains("dark-theme")

        ? '<i data-lucide="sun"></i>'

        : '<i data-lucide="moon"></i>';

    refreshIcons();

  };


  updateButton();


  if (themeButton) {

    themeButton.addEventListener("click", () => {

      document.body.classList.toggle("dark-theme");

      try {

        localStorage.setItem(
          "crisisred-theme",
          document.body.classList.contains("dark-theme")
            ? "dark"
            : "light"
        );

      } catch (error) {

        /* خطای ذخیره‌سازی نادیده گرفته می‌شود */

      }

      updateButton();

    });

  }

}


/* =========================================
   مدیریت سایدبار
========================================= */

function initializeSidebar() {

  const sidebar = document.getElementById("sidebar");

  const toggle = document.getElementById("sidebarToggle");

  const closeButton = document.getElementById("sidebarClose");

  const backdrop = document.getElementById("sidebarBackdrop");


  if (!sidebar || !toggle) return;


  const isMobile = () => {

    return window.matchMedia("(max-width: 900px)").matches;

  };


  /* باز کردن سایدبار موبایل */

  const openMobileMenu = () => {

    sidebar.classList.add("open");

    document.body.classList.add("sidebar-open");

    toggle.setAttribute("aria-expanded", "true");

  };


  /* بستن سایدبار موبایل */

  const closeMobileMenu = () => {

    sidebar.classList.remove("open");

    document.body.classList.remove("sidebar-open");

    toggle.setAttribute("aria-expanded", "false");

  };


  /* دکمه اصلی منو */

  toggle.addEventListener("click", () => {

    if (isMobile()) {

      if (sidebar.classList.contains("open")) {

        closeMobileMenu();

      } else {

        openMobileMenu();

      }

    } else {

      document.body.classList.toggle("sidebar-collapsed");

    }

  });


  /* دکمه ضربدر */

  if (closeButton) {

    closeButton.addEventListener("click", closeMobileMenu);

  }


  /* کلیک روی فضای بیرون */

  if (backdrop) {

    backdrop.addEventListener("click", closeMobileMenu);

  }


  /* بستن بعد از انتخاب گزینه */

  sidebar.querySelectorAll(".nav-item").forEach(link => {

    link.addEventListener("click", () => {

      if (isMobile()) {

        closeMobileMenu();

      }

    });

  });


  /* بستن با کلید Escape */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape" && isMobile()) {

      closeMobileMenu();

    }

  });


  /* مدیریت تغییر اندازه صفحه */

  window.addEventListener("resize", () => {

    if (!isMobile()) {

      closeMobileMenu();

    }

  });

}


/* =========================================
   دکمه به‌روزرسانی
========================================= */

function initializeRefresh() {

  const refreshButton = document.getElementById("refreshBtn");

  if (!refreshButton) return;


  refreshButton.addEventListener("click", () => {

    renderDashboard();

    refreshButton.innerHTML = `
      <i data-lucide="check"></i>
      به‌روزرسانی شد
    `;

    refreshIcons();


    window.setTimeout(() => {

      refreshButton.innerHTML = `
        <i data-lucide="refresh-cw"></i>
        به‌روزرسانی
      `;

      refreshIcons();

    }, 1200);

  });

}


/* =========================================
   راه‌اندازی اصلی داشبورد
========================================= */

function initializeDashboard() {

  renderDashboard();

  initializeTheme();

  initializeSidebar();

  initializeRefresh();

  refreshIcons();

}


/* اجرای برنامه پس از بارگذاری صفحه */

document.addEventListener(
  "DOMContentLoaded",
  initializeDashboard
);
