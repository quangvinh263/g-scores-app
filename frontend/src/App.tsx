import { ConfigProvider, Button, Card, Input } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0f2573', // Màu xanh navy đồng bộ với Header G-Scores
          borderRadius: 6,
        },
      }}
    >
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-[#0f2573] text-white py-4 text-center text-2xl font-bold shadow">
          G-Scores
        </header>

        {/* Body */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-60 bg-gradient-to-b from-yellow-400 via-lime-500 to-teal-700 p-6 text-gray-900">
            <h2 className="font-bold text-lg mb-4 text-center">Menu</h2>
            <ul className="space-y-3">
              <li className="cursor-pointer hover:underline">Dashboard</li>
              <li className="font-bold cursor-pointer">Search Scores</li>
              <li className="cursor-pointer hover:underline">Reports</li>
              <li className="cursor-pointer hover:underline">Settings</li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 space-y-6">
            <Card title={<span className="text-xl font-bold">User Registration</span>}>
              <div className="flex gap-2 max-w-md">
                <Input placeholder="Enter registration number" />
                <Button type="primary" className="bg-black hover:bg-gray-800">
                  Submit
                </Button>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;