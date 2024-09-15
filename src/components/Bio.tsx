import React from "react"

const Bio: React.FC = () => {
  return (
    <section className="container" id="bio">
      <div className="flex flex-col md:flex-row justify-between py-4">
        <div className="flex flex-col p-8 border shadow-2xl scroll-appear text-justify">
          <h3 className="text-xl font-bold mb-2">A small intro</h3>
          <div>
            Hi, I’m Theodoros Mentis, a passionate Full Stack Developer from
            Greece. I love spending time with friends, exploring new places, and
            swimming in the sea, which has always been a significant part of my
            life. You’ll also often find me engrossed in music, binge-watching
            movies, TV series, and anime, or diving into my favorite games. From
            a young age, I was the kid who loved to disassemble all kinds of
            gadgets to understand how they worked and then put them back
            together. This curiosity naturally led me to a career in technology
            and programming, fields that continue to fascinate and challenge me
            every day.
          </div>
          <div className="pt-4">
            One of the things I love most about my programming is the freedom it
            provides to travel, allowing me to explore new places and meet
            fascinating people while working remotely. My core values include
            collaboration, continuous learning, honesty, perseverance, and hard
            work. I believe in delivering the best results for my clients
            through efficient and high-quality code. My work philosophy revolves
            around continuous improvement and embracing new challenges as
            opportunities to grow and learn. I’m always open to discussing
            open-source projects and the latest tech trends. If you share these
            interests or just want to chat about tech, travel, or gaming, feel
            free to reach out!
          </div>
        </div>
      </div>
    </section>
  )
}

export default Bio
