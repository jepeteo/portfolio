import React, { useMemo } from "react"
import myCertificates from "../assets/myCertificates.json"
import { isURL } from "validator"

const Certificates = () => {
  const memoCerts = useMemo(() => {
    if (!myCertificates || myCertificates.length === 0) {
      return <div>No certificates available</div>
    }

    return myCertificates
      .filter((cert) => cert.certVisible != false)
      .map((cert) => {
        return (
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
        )
      })
  }, [])

  if (!memoCerts) {
    return <div>No certificates available</div>
  }

  return (
    <section className="container" id="certificates">
      <h2 className="text-5xl font-bold">Certificates</h2>
      <ul className="grid my-8 gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        {memoCerts}
      </ul>
    </section>
  )
}

export default Certificates
