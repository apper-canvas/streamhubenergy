import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <div className="min-h-screen bg-netflix-bg">
        {/* Content will be rendered through router */}
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
    </>
  )
}

export default App