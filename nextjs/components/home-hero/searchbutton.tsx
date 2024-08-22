

export default function SearchButton() {
  return (
    <div className="flex justify-center items-center absolute right-2 bottom-2">
      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-gradient-primary-light px-2 py-2 shadow-sm hover:bg-gradient-primary-medium focus-visible:outline active:bg-gradient-primary-active"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  );
}