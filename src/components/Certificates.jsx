import myCertificates from "../assets/myCertificates.json"
import { isURL } from "validator"

const Certificates = () => {
  if (!myCertificates || myCertificates.length === 0) {
    return <div>No certificates available</div>
  }

  const certs = myCertificates.map((cert) => {
    return (
      <li key={cert.certName}>
        <a href={isURL(cert.certUrl) ? cert.certUrl : "#"}>{cert.certName}</a>
      </li>
    )
  })
  return (
    <>
      <div>Certificates</div>
      <ul>{certs}</ul>
    </>
  )
}

export default Certificates
