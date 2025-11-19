import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-netflix-bg">
return (
    <Provider store={store}>
      <div className="min-h-screen bg-netflix-bg">
        <Header />
        <Outlet />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#1A1A1A",
          color: "#F5F5F1",
          borderRadius: "8px",
        }}
      />
    </Provider>
  )
      <main className="pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout