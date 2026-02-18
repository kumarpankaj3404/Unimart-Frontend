# Project Description: Unimart-Frontend

##What We Do
**Unimart** is a fast and reliable on-demand grocery delivery platform designed to bring fresh produce, daily essentials, and bakery items directly to customers' doorsteps with "ASAP" delivery speed. The project serves two primary user bases via a unified frontend application:

1.  **Customers**:
    *   **Shopping Experience**: Browse and search a catalog of fresh vegetables, fruits, dairy, and snacks.
    *   **Order Management**: Seamlessly add items to a cart, place orders, and track them in real-time.
    *   **Personalization**: Manage profiles, save delivery addresses, and maintain a list of favorite items.
    *   **Live Tracking**: Track the status and location of orders live on a map.

2.  **Delivery Partners**:
    *   **Dedicated Dashboard**: A specialized interface for delivery drivers to manage their workflow.
    *   **Order Fulfillment**: View assigned orders, accept new deliveries, and update order status (e.g., from "processed" to "shipped" to "delivered").
    *   **Availability**: Toggle online/offline status to indicate readiness for new tasks.

---

##How We Do It (Tech Stack & Architecture)
The application is a modern **Single Page Application (SPA)** built with the latest web technologies to ensure performance, scalability, and a smooth user experience.

### **Core Framework & Build Tooling**
*   **React 19**: The latest version of the library for building interactive user interfaces.
*   **Vite**: A next-generation frontend tool providing lightning-fast development server start and hot module replacement (HMR).
*   **React Router v7**: For robust client-side routing, handling navigation between the Customer and Delivery Partner views seamlessly.

### **State Management & Data Flow**
*   **Redux Toolkit**: Manages complex global state, including:
    *   `authSlice`: handling user sessions (Customer & Delivery Partner).
    *   `orderSlice`: Managing the shopping cart and active orders.
    *   `themeSlice`: Toggling between light and dark modes.
*   **Axios**: Configured with interceptors to automatically attach JWT (JSON Web Tokens) for secure communication with the backend API.
*   **Socket.IO Client**: Establishes a WebSocket connection for **real-time bidirectional communication**, enabling live order updates and instant notifications without page reloads.

### **UI/UX & Design**
*   **Tailwind CSS v4**: A utility-first CSS framework for rapid, responsive, and maintainable styling.
*   **Framer Motion**: Adds fluid animations and gesture-based interactions to enhance the user feel.
*   **Headless UI**: Provides unstyled, fully accessible UI components (like modals and dropdowns) that integrate perfectly with Tailwind.
*   **React Three Fiber (@react-three/fiber)**: Renders 3D graphics (likely for an immersive 3D background on the landing page).

### **Maps & Location Services**
*   **React Leaflet & Google Maps API**: Integrated to provide interactive maps for:
    *   Visualizing delivery routes.
    *   Pinpointing user addresses.
    *   Live tracking of delivery partners.

### **Backend Integration**
*   **API Endpoint**: Connects to a versioned REST API hosted at `https://unimart-backend-1fo0.onrender.com/api/v1`.
*   **Security**: Uses `redux-persist` (implied pattern) or local storage to manage access tokens securely.

### **Key Directories**
*   **`src/Pages/`**: Houses distinct views like `Landing`, `Items`, `Cart`, `Profile`, and the `DeliveryPartnerDashboard`.
*   **`src/Components/`**: Reusable UI blocks, including 3D backgrounds (`Background3D.jsx`) and Error Boundaries.
*   **`src/context/`**: Contains `SocketContext.jsx` to provide the real-time socket connection instance throughout the component tree.
*   **`src/utils/`**: Helper functions, including the centralized `api.js` configuration.
