const FilterButtons = ({ setProjectType, setCurrentPage }) => {
  const filterTypes = [
    { type: null, label: "All" },
    { type: "Blog", label: "Blog" },
    { type: "Dynamic Site", label: "Dynamic" },
    { type: "E-Shop", label: "E-Shop" },
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
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons
