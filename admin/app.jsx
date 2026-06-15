// ORBITZ Admin — app root + routing
const PAGE_META = {
  overview:  { title: "Overview",  sub: "Mission control · live operations" },
  orders:    { title: "Orders",    sub: "Every order across the pipeline", search: true },
  order:     { title: "Order detail", sub: null },
  products:  { title: "Products",  sub: "Catalog & inventory" },
  customers: { title: "Customers", sub: "Explorers on the ORBITZ network" },
  customer:  { title: "Customer", sub: null },
  drivers:   { title: "Drivers",   sub: "Fleet & dispatch" },
  rewards:   { title: "Rewards",   sub: "Loyalty points & rules" },
  settings:  { title: "Settings",  sub: "Store configuration" },
};

function App() {
  const [authed, setAuthed] = useState(false);
  const [route, setRoute] = useState({ screen: "overview", params: {} });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const navigate = (screen, params = {}) => {
    if (screen === "login") { setAuthed(false); return; }
    setRoute({ screen, params });
    setSearch("");
    window.scrollTo(0, 0);
    const main = document.querySelector(".oz-main"); if (main) main.scrollTop = 0;
  };

  if (!authed) return <Login navigate={(s) => { setAuthed(true); navigate(s); }} />;

  const meta = PAGE_META[route.screen] || PAGE_META.overview;

  let body = null;
  switch (route.screen) {
    case "overview":  body = <Overview navigate={navigate} />; break;
    case "orders":    body = <OrdersList navigate={navigate} search={search} />; break;
    case "order":     body = <OrderDetail params={route.params} navigate={navigate} refresh={refresh} />; break;
    case "products":  body = <Products refresh={refresh} />; break;
    case "customers": body = <Customers navigate={navigate} />; break;
    case "customer":  body = <CustomerDetail params={route.params} navigate={navigate} refresh={refresh} />; break;
    case "drivers":   body = <Drivers refresh={refresh} />; break;
    case "rewards":   body = <Rewards refresh={refresh} />; break;
    case "settings":  body = <Settings refresh={refresh} />; break;
    default:          body = <Overview navigate={navigate} />;
  }

  return (
    <div className="oz-app">
      <Sidebar route={route} navigate={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="oz-main">
        <Topbar title={meta.title} subtitle={meta.sub} setOpen={setSidebarOpen}
          onSearch={meta.search ? setSearch : null} searchValue={search} />
        <div className="oz-content">{body}</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
