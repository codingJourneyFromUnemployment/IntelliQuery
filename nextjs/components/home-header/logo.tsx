

export default function Logo() {
  return (
  <div className="flex items-center">
    <a href="#" className="-m-1.5 p-1.5">
      <span className="sr-only">IntelliQuery</span>
      <img alt="IntelliQuery" src="/logo.svg" className="h-14 md:h-16 w-auto" />
    </a>
    <div className="text-gradient-primary">IntelliQuery</div>
  </div>
  )
}