import React from "react"
import { useForm, ValidationError } from "@formspree/react"

export default function Contact() {
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

  const [state, handleSubmit] = useForm("xayrrwyj")
  if (state.succeeded) {
    return (
      <section className="container flex flex-wrap" id="contact">
        <h2 className="w-full text-5xl font-bold">Contact</h2>
        <span className="py-8">
          Thanks for contacting me! I&apos;ll be in touch soon.
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
            <ValidationError prefix="Name" field="name" errors={state.errors} />
            <input
              type="email"
              placeholder="Email"
              className="basis-auto grow p-4 my-4 bg-transparent border-b"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
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
            <ValidationError
              prefix="Phone"
              field="phone"
              errors={state.errors}
            />
            <input
              type="company"
              placeholder="Company / Agency"
              className="basis-auto grow p-4 my-4 bg-transparent border-b"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
            <ValidationError
              prefix="Company"
              field="company"
              errors={state.errors}
            />
          </div>
          <textarea
            placeholder="Message"
            className="w-full p-4 bg-transparent border-b"
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />
          <button
            className="btn-contact w-full self-end p-4 mt-8 md:w-56"
            disabled={state.submitting}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  )
}
