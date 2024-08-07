// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import LoginComponent from './components/Login.vue';
import {supabase} from "./supabase";

const routes = [
    {
        path: '/',
        name: 'DashboardComponent',
        component: Dashboard,
        // meta: {
        //     requiresAuth: true,
        // },
    },
    {
        path: '/login',
        name: 'LoginComponent',
        component: LoginComponent
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const user = (await supabase.auth.getSession()).data?.session?.user;

    if (requiresAuth && !user) {
        next('/login');
    } else {
        next();
    }
});

export default router;
