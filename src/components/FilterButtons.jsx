const FilterButtons = ({ setProjectType, setCurrentPage }) => {
  const filterTypes = [
    { type: null, label: "All" },
    { type: "App", label: "App" },
    // { type: "Blog", label: "Blog" },
    { type: "Dynamic Site", label: "Dynamic" },
    { type: "E-Shop", label: "E-Shop" },
    { type: "Static", label: "Static" },
  ]

  return (
    <div className="flex gap-4 justify-center">
      {filterTypes.map(({ type, label }) => (
        <button
          key={label}
          className="border rounded-xl w-20 py-1 text-center text-sm bg-slate-700"
          onClick={() => {
            setProjectType(type)
            setCurrentPage(1)
          }}
          aria-label={`Filter ${label} projects`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons