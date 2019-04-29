const routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "profile/:account",
        component: () => import("pages/Profile.vue")
      },
      {
        path: "new",
        component: () => import("pages/New.vue")
      },
      {
        path: "editprofile",
        component: () => import("pages/EditProfile.vue")
      }
    ]
  },
  {
    path: "/organisation/:account",
    component: () => import("layouts/OrgLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Organisation.vue") },
      {
        path: "team",
        component: () => import("pages/Team.vue")
      },
      {
        path: "entries",
        component: () => import("pages/Entries.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
