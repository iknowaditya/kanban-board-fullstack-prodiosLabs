export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
}
