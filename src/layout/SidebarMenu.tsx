const SidebarMenu = () => {
  const menuHeader = [
    {
      name: "Báo cáo nhanh",
      path: "/reporting",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      name: "Báo cáo tài chính",
      path: "/reporting",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      name: "Hóa đơn điện tử",
      path: "/reporting",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    {
      name: "Kết nối ngân hàng",
      path: "/reporting",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
    {
      name: "Nộp thuế điện tử",
      path: "/reporting",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  ];
  return (
    <div className="flex items-center gap-6 px-6  dark:bg-slate-800  ">
      <div className="flex flex-wrap gap-2">
        {menuHeader.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 hover:shadow-md ${item.color}`}
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SidebarMenu;
