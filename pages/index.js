import Head from "next/head"
import useApi from "@/hooks/useApi"
import Image from "next/image"
import { useState, useEffect } from "react"

let currentTopPoint = 0
let currentTarget = 0

function generateStudentPoint(data) {
  data.forEach((student) => {
    let winnerCount = 0
    student.courses.forEach((course) => {
      if (course.progress === "Lulus") {
        winnerCount++
      }
      student.point = winnerCount
    })
  })
  return data
}

function getAllStudentWithBiggerPoint(datas) {
  let biggerPointStudent = datas.reduce(
    (acc, curr) => {
      if (curr.point > acc.point) {
        return curr
      }
      return acc
    },
    { point: 0 }
  )

  let students = []
  datas.forEach((student) => {
    if (
      student.point > biggerPointStudent.point ||
      student.point === biggerPointStudent.point
    ) {
      students.push(student)
      biggerPointStudent = student
      currentTopPoint = biggerPointStudent.point
      currentTarget = biggerPointStudent.point - 1
    }
  })

  return students
}

export default function Home() {
  let { data, isLoading, isError } = useApi("/api/cohort")
  const [allStudents, setAllStudents] = useState([])
  const [topStudents, setTopStudents] = useState([])

  useEffect(() => {
    if (data) {
      setAllStudents(generateStudentPoint(data))
    }
  }, [data])

  useEffect(() => {
    setTopStudents(getAllStudentWithBiggerPoint(allStudents))
  }, [allStudents])

  if (isError) {
    return <div>Oops, Error harap muat ulang halaman ...</div>
  }

  if (isLoading) {
    return (
      <div className="center-screen">
        <div className="lds-ring centered">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>FEBE 03 - LEADERBOARDS</title>
      </Head>

      <main>
        <div className="container flex-center">
          <h1>FEBE 03 LEADERBOARDS</h1>

          <div className="top-students flex-center">
            <div>
              <Image
                src="/images/gold.png"
                alt="gold"
                width="200"
                height="200"
              />
            </div>
            {topStudents.map((student) => {
              return (
                <div key={student.id}>
                  <h3 className="top-student">{student.name}</h3>
                </div>
              )
            })}
          </div>
          <h2 className="cohort-progress">All Progress</h2>
          <div className="container cohort-data">
            {allStudents.map((student) => {
              return (
                <div className="card" key={student.id}>
                  <div className="card-content">
                    <p className="card-content-name">{student.name}</p>
                    {topStudents.map((topStudent) => {
                      if (topStudent.id === student.id) {
                        return (
                          <div key={topStudent.id}>
                            <p className="card-content-diff-progress">On Top</p>
                          </div>
                        )
                      }
                    })}
                    {student.point ===
                    currentTopPoint ? null : student.point ===
                      currentTopPoint - 1 ? (
                      <div>
                        <p className="card-content-diff-progress going">
                          On Progress
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="card-content-diff-progress lag">
                          Lag Behind
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="card-progress">
                    {student.courses.map((course) => {
                      return (
                        <div key={course.name} className="card-progress-item">
                          <p className="card-progress-course">{course.name}</p>
                          {course.name === course.name ? (
                            <div>
                              <div className="card-progress-progress">
                                {student.courses[currentTarget].name ===
                                  course.name && (
                                  <p className="target">Target</p>
                                )}
                                {student.courses[student.point]?.name ===
                                  course.name && (
                                  <p className="current">Current</p>
                                )}
                                {student.point === currentTopPoint &&
                                  course.name ===
                                    student.courses[currentTopPoint - 1]
                                      ?.name && (
                                    <p className="current">Current</p>
                                  )}
                                {course.progress}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="card-progress-progress">
                                {course.progress}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
