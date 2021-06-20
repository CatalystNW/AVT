window.onload = function () {
  var pathname = window.location.pathname;

  // Highlights the specific navigation link on navbar depending on current page
  var navId = void 0;
  if (pathname.includes("carenetwork")) {
    navId = "care-nav-link";
  } else if (pathname.includes("/app_project/site_assessments/")) {
    navId = "assessments-nav-link";
  } else if (pathname.includes("/app_project/view_projects")) {
    navId = "projects-nav-link";
  } else {
    switch (pathname) {
      case "/view":
        navId = "vetting-nav-link";
        break;
      case "/tasks":
        navId = "tasks-nav-link";
        break;
      case "/user/userList":
        navId = "userse-nav-link";
        break;
      case "/app_project/view_projects":
        navId = "projects-nav-link";
        break;
      case "/app_project/report/view":
        navId = "report-nav-link";
        break;
      case "/site":
      case "/projectsummary":
      case "/projectreport":
        navId = "previous-nav-link";
        break;
    }
  }
  if (navId) {
    var link = document.getElementById(navId);
    if (link) {
      link.classList.add("active");
    }
  }
};