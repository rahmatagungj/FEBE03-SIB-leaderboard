// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let allStudent = null
let allCourse = [
  "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
  "Pengenalan ke Logika Pemrograman (Programming Logic 101)",
  "Belajar Dasar Git dengan GitHub",
  "Belajar Dasar Pemrograman Web",
  "Belajar Membuat Front-End Web untuk Pemula",
  "Belajar Fundamental Front-End Web Development",
  // "Cloud Practitioner Essentials",
  // "Belajar Dasar Pemrograman JavaScript",
  // "Belajar Membuat Aplikasi Back-End untuk Pemula",
  // "Menjadi Front-End Web Developer Expert",
  // "Meniti Karier sebagai Software Developer",
]

export default async function handler(req, res) {
  try {
    await fetch(
      process.env.COHORT_API
    )
      .then((response) => response.json())
      .then((data) => {
        allStudent = data.values.map((student) => {
          return {
            id: student[0],
            nim: student[1],
            name: student[2],
            courses: allCourse.map((course) => {
              return {
                name: course,
                progress: 0,
              }
            }),
          }
        })
      })
      .catch((err) => {
        res.statusCode = 500
        res.end(err.toString())
      })

    await fetch(
      process.env.COHORT_API
    )
      .then((response) => response.json())
      .then((data) => {
        allStudent.forEach((student, index) => {
          student.courses.map((course, sIndex) => {
            course.progress = data.values[index][sIndex] || "Lulus"
          })
        })
      })
      .catch((err) => {
        res.statusCode = 500
        res.end(err.toString())
      })

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(allStudent))
  } catch (err) {
    res.statusCode = 500
    res.end(err.toString())
  }
}
