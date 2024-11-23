import React, { useMemo, useState } from "react"
import myCertificates from "../assets/myCertificates.json"
import { isURL } from "validator"

interface Certificate {
  certName: string
  certUrl: string
  certImg: string
  certVisible: boolean
  certCat: string
}

const Certificates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const { categories, certsByCategory } = useMemo(() => {
    const grouped = myCertificates
      .filter((cert: Certificate) => cert.certVisible)
      .reduce((acc: { [key: string]: Certificate[] }, cert: Certificate) => {
        const category = cert.certCat || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(cert)
        return acc
      }, {})

    return {
      categories: ["All", ...Object.keys(grouped).sort()],
      certsByCategory: grouped
    }
  }, [])

  const displayedCertificates = useMemo(() => {
    if (selectedCategory === "All") {
      return myCertificates.filter(cert => cert.certVisible)
    }
    return certsByCategory[selectedCategory] || []
  }, [selectedCategory, certsByCategory])

  return (
    <section className="container" id="certificates">
      <h2 className="text-5xl font-bold">Certificates</h2>
      
      <div className="flex flex-wrap gap-2 my-6 justify-center">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`border rounded-xl w-32 h-12 text-center text-sm  ${
              selectedCategory === category 
              ? 'bg-slate-700 text-white' 
              : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-200 dark:hover:text-black transition-colors'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <ul className="grid my-8 gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        {displayedCertificates.map((cert: Certificate) => (
          <li
            className="w-auto col-span-1 flex flex-col justify-center border border-color-1 hover:border-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:border-neutral-200 transition-all"
            key={cert.certName}
          >
            <a
              href={isURL(cert.certUrl) ? cert.certUrl : "#"}
              className="flex items-center gap-2 p-2 md:p-4"
              target="_blank"
            >
              <img
                className="w-8"
                src={`images/${cert.certImg}`}
                alt={cert.certName}
              />
              {cert.certName}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Certificates