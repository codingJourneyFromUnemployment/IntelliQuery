
const files = [
  {
    title: "IMG_4985.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4986.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4987.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4988.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4989.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4990.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4991.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4992.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4993.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  },
  {
    title: "IMG_4994.HEIC",
    size: "3.9 MB",
    source:
      "https://picsum.photos/200/300",
  }
  // More files...
];

export default function HomeInsights() {
  return (
    <ul
      role="list"
      className="px-2 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {files.map((file) => (
        <li key={file.source} className="relative">
          <div className="group aspect-h-7 aspect-w-20 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img
              alt=""
              src={file.source}
              className="pointer-events-none object-cover group-hover:opacity-75"
            />
            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            >
              <span className="sr-only">View details for {file.title}</span>
            </button>
          </div>
          <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
            {file.title}
          </p>
          <p className="pointer-events-none block text-sm font-medium text-gray-500">
            {file.size}
          </p>
        </li>
      ))}
    </ul>
  );
}
