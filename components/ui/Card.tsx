export default function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold mt-2">{value}</h2>
    </div>
  );
}