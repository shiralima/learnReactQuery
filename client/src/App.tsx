import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Todos } from "./components/Todos";

function App() {

  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <h1>TODOs</h1>
        <Todos />
      </QueryClientProvider>
    </>
  );
}

export default App;
