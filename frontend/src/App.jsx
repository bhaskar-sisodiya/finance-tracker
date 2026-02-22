import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const App = () => {
  const { isLoggedIn, loading } = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{
        auth: { isLoggedIn, loading }
      }}
    />
  );
};

export default App;

