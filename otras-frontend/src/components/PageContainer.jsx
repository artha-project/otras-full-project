export default function PageContainer({ children, collapsed }) {
  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{ background: '#f1f5f9', marginLeft: collapsed ? 64 : 224, marginTop: 56 }}
    >
      <div className="p-6 max-w-7xl">{children}</div>
    </div>
  );
}
