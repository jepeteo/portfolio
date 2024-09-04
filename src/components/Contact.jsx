import React from "react"
import emailjs from "@emailjs/browser"

emailjs.init(import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY)
export default function Contact() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    emailjs
      .sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text)
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
          })
          setIsSubmitted(true)
        },
        (error) => {
          console.log("Failed to send email:", error.text)
          // Handle error (e.g., show an error message)
        }
      )
  }

  if (isSubmitted) {
    return (
      <section className="container flex flex-wrap" id="contact">
        <h2 className="w-full text-5xl font-bold">Contact</h2>
        <span className="py-8">
          Thanks for contacting me! I'll be in touch soon.
        </span>
      </section>
    )
  }

  return (
    <section className="container flex flex-wrap" id="contact">
      <h2 className="w-full text-5xl font-bold">Contact</h2>
      <span className="py-8">
        Thank you for visiting my portfolio! As a senior full stack developer
        with a passion for creating seamless web experiences, I&apos;m always
        excited to connect with like-minded professionals, potential
        collaborators, or anyone interested in discussing tech. Whether you have
        a project in mind, need some advice, or just want to chat about the
        latest in development trends, feel free to drop me a message. I look
        forward to hearing from you!
      </span>

      <div className="w-full py-4 m-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-row flex-wrap gap-4">
            <input
              type="text"
              placeholder="Name"
              className="basis-auto grow p-4 my-4 bg-transparent border-b"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="basis-auto grow p-4 my-4 bg-transparent border-b"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-row flex-wrap gap-4">
            <input
              type="phone"
              placeholder="Phone"
              className="basis-auto grow p-4 my-4 bg-transparent border-b"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="company"
              placeholder="Company / Agency"
              className="basis-auto grow p-4 my-4 bg-transparent border-b"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
          <textarea
            placeholder="Message"
            className="w-full p-4 bg-transparent border-b"
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button
            className="btn-contact w-full self-end p-4 mt-8 md:w-56"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  )
}
