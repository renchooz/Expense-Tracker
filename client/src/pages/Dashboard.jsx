import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-slate-800">
          Welcome Back 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Track your income, expenses and spending habits.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;