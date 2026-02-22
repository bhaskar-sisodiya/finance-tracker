import {
    createRootRouteWithContext,
    createRoute,
    createRouter,
    Outlet,
    redirect
} from '@tanstack/react-router';
import React from 'react';
import HomeRedirector from './components/common/HomeRedirector.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Registration from './components/auth/Registration.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import Stats from './components/dashboard/Stats.jsx';
import About from './pages/About.jsx';
import ManageExpenses from './pages/ManageExpenses.jsx';

// 2. Creating the Root Route
export const rootRoute = createRootRouteWithContext()({
    component: () => (
        <>
            <Outlet />
            {/* TanStack Router Devtools would go here if needed */}
        </>
    ),
});

// 3. Defining Individual Routes

// Index Route (Home / Redirector)
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomeRedirector,
});

// Login Route
const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

// Register Route
const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: Registration,
});

// Protected Route Guard Helper
const protectedBeforeLoad = ({ context }) => {
    if (context.auth.loading) return; // Wait for auth to load
    if (!context.auth.isLoggedIn) {
        throw redirect({
            to: '/',
        });
    }
};

// Dashboard Route (Protected)
const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    beforeLoad: protectedBeforeLoad,
    component: Dashboard,
});

// Edit Profile Route (Protected)
const editProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/edit-profile',
    beforeLoad: protectedBeforeLoad,
    component: EditProfilePage,
});

// Stats Route
const statsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/stats',
    component: Stats,
});

// About Route
const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: About,
});

// Manage Expenses Route (Protected)
const manageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/manage',
    beforeLoad: protectedBeforeLoad,
    component: ManageExpenses,
});

// 4. Building the Route Tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    dashboardRoute,
    editProfileRoute,
    statsRoute,
    aboutRoute,
    manageRoute,
]);

// 5. Creating and Exporting the Router
export const router = createRouter({
    routeTree,
    context: {
        auth: undefined, // Will be provided at runtime
    }
});
