import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter as Router} from "react-router-dom";
import App from "./App";
import AuthProvider from "./useAuth";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.status === 404) return false;
        else if (failureCount < 2) return true;
        else return false;
      },
    },
  },
});

export default function AppProvider({children}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App></App>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}
