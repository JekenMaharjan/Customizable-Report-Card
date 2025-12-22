"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

interface Subject {
  name: string
  grade: string
  remarks: string
}

export default function ReportCardPage() {
    const [studentName, setStudentName] = useState("John Doe")
    const [rollNumber, setRollNumber] = useState("12345")
    const [className, setClassName] = useState("Grade 10-A")
    const [semester, setSemester] = useState("First Semester")
    const [academicYear, setAcademicYear] = useState("2024-2025")
    const [subjects, setSubjects] = useState<Subject[]>([
        { name: "Mathematics", grade: "A+", remarks: "Excellent" },
        { name: "Science", grade: "A", remarks: "Very Good" },
        { name: "English", grade: "B+", remarks: "Good" },
        { name: "History", grade: "A", remarks: "Very Good" },
        { name: "Physical Education", grade: "A+", remarks: "Outstanding" },
    ])
    const [teacherName, setTeacherName] = useState("Mrs. Smith")
    const [principalName, setPrincipalName] = useState("Dr. Johnson")

    const updateSubject = (index: number, field: keyof Subject, value: string) => {
        const newSubjects = [...subjects]
        newSubjects[index][field] = value
        setSubjects(newSubjects)
    }

    const addSubject = () => {
        setSubjects([...subjects, { name: "", grade: "", remarks: "" }])
    }

    const removeSubject = (index: number) => {
        setSubjects(subjects.filter((_, i) => i !== index))
    }

    const downloadPDF = async () => {
        const original = document.getElementById("report-card-print")
        if (!original) return

        // ✅ Clone node
        const clone = original.cloneNode(true) as HTMLElement

        // ✅ Remove ALL class-based styling (Tailwind / shadcn)
        const all = clone.querySelectorAll("*")
        all.forEach((el) => {
            el.removeAttribute("class")
        })

        // ✅ Force safe root styles
        clone.style.backgroundColor = "#ffffff"
        clone.style.color = "#000000"
        clone.style.padding = "3rem"

        // ✅ Render off-screen
        const container = document.createElement("div")
        container.style.position = "fixed"
        container.style.left = "-9999px"
        container.appendChild(clone)
        document.body.appendChild(container)

        const html2pdf = (await import("html2pdf.js")).default

        await html2pdf()
            .set({
            margin: 0.5,
            filename: `report-card-${studentName.replace(/\s+/g, "-")}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                backgroundColor: "#ffffff",
            },
            jsPDF: {
                unit: "in",
                format: "letter",
                orientation: "portrait",
            },
            })
            .from(clone)
            .save()

        // 🧹 Cleanup
        document.body.removeChild(container)
    }


    return (
        <div
        className="min-h-screen py-8 px-4"
        style={{ backgroundColor: "#ffffff" }}
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">School Report Card Generator</h1>
                    <p style={{ color: "#4b5563" }}>Customize and download your report card</p>
                </div>

                {/* Editor Section */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Edit Report Card Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Student Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="studentName">
                                Student Name
                                </label>
                                <Input id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="rollNumber">
                                Roll Number
                                </label>
                                <Input id="rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="className">
                                Class
                                </label>
                                <Input id="className" value={className} onChange={(e) => setClassName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="semester">
                                Semester
                                </label>
                                <Input id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="academicYear">
                                Academic Year
                                </label>
                                <Input id="academicYear" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-base">Subjects & Grades</label>
                                <Button onClick={addSubject} size="sm">
                                    Add Subject
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {subjects.map((subject, index) => (
                                <div key={index} className="flex gap-3 items-end">
                                    <div className="flex-1 space-y-2">
                                        <label>Subject Name</label>
                                        <Input
                                            value={subject.name}
                                            onChange={(e) => updateSubject(index, "name", e.target.value)}
                                            placeholder="Subject"
                                        />
                                    </div>
                                    <div className="w-24 space-y-2">
                                        <label>Grade</label>
                                        <Input
                                            value={subject.grade}
                                            onChange={(e) => updateSubject(index, "grade", e.target.value)}
                                            placeholder="A+"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label>Remarks</label>
                                        <Input
                                            value={subject.remarks}
                                            onChange={(e) => updateSubject(index, "remarks", e.target.value)}
                                            placeholder="Remarks"
                                        />
                                    </div>
                                    <Button onClick={() => removeSubject(index)} variant="destructive" size="sm">
                                        Remove
                                    </Button>
                                </div>
                                ))}
                            </div>
                        </div>

                        {/* Teacher & Principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="teacherName">
                                    Class Teacher Name
                                </label>
                                <Input id="teacherName" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="principalName">
                                    Principal Name
                                </label>
                                <Input id="principalName" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                    {/* Preview Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Preview</h2>
                            <Button onClick={downloadPDF} className="gap-2">
                            {/* <Button className="gap-2"> */}
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>

                    {/* Report Card Preview */}
                    <div
                        id="report-card-print"
                        style={{
                        backgroundColor: "#ffffff",
                        padding: "3rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        }}
                    >
                        {/* Header */}
                        <div
                        style={{
                            textAlign: "center",
                            paddingBottom: "1.5rem",
                            marginBottom: "2rem",
                            borderBottom: "4px solid #3b82f6",
                        }}
                        >
                            <h1
                                style={{
                                fontSize: "2.25rem",
                                fontWeight: "bold",
                                marginBottom: "0.5rem",
                                color: "#3b82f6",
                                }}
                            >
                                ACADEMIC REPORT CARD
                            </h1>
                            <p style={{ fontSize: "1.125rem", color: "#374151" }}>Excellence in Education</p>
                        </div>

                        {/* Student Information */}
                        <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            columnGap: "2rem",
                            rowGap: "1rem",
                            marginBottom: "2rem",
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#f9fafb",
                        }}
                        >
                            <div>
                                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Student Name</p>
                                <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{studentName}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Roll Number</p>
                                <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{rollNumber}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Class</p>
                                <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{className}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Semester</p>
                                <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{semester}</p>
                            </div>
                            <div style={{ gridColumn: "span 2" }}>
                                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Academic Year</p>
                                <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{academicYear}</p>
                            </div>
                        </div>

                        {/* Grades Table */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#111827" }}>
                                Academic Performance
                            </h2>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}>
                                        <th
                                        style={{
                                            border: "1px solid #d1d5db",
                                            padding: "0.75rem 1rem",
                                            textAlign: "left",
                                        }}
                                        >
                                            Subject
                                        </th>
                                        <th
                                        style={{
                                            border: "1px solid #d1d5db",
                                            padding: "0.75rem 1rem",
                                            textAlign: "center",
                                            width: "6rem",
                                        }}
                                        >
                                            Grade
                                        </th>
                                        <th
                                        style={{
                                            border: "1px solid #d1d5db",
                                            padding: "0.75rem 1rem",
                                            textAlign: "left",
                                        }}
                                        >
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject, index) => (
                                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff" }}>
                                            <td
                                                style={{
                                                border: "1px solid #d1d5db",
                                                padding: "0.75rem 1rem",
                                                fontWeight: "500",
                                                color: "#111827",
                                                }}
                                            >
                                                {subject.name}
                                            </td>
                                            <td
                                                style={{
                                                border: "1px solid #d1d5db",
                                                padding: "0.75rem 1rem",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                color: "#111827",
                                                }}
                                            >
                                                {subject.grade}
                                            </td>
                                            <td
                                                style={{
                                                border: "1px solid #d1d5db",
                                                padding: "0.75rem 1rem",
                                                color: "#374151",
                                                }}
                                            >
                                                {subject.remarks}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Signatures */}
                        <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "3rem",
                            marginTop: "4rem",
                            paddingTop: "2rem",
                            borderTop: "1px solid #d1d5db",
                        }}
                        >
                            <div style={{ textAlign: "center" }}>
                                    <div
                                    style={{
                                        paddingTop: "0.5rem",
                                        display: "inline-block",
                                        minWidth: "200px",
                                        borderTop: "2px solid #9ca3af",
                                    }}
                                    >
                                        <p style={{ fontWeight: "600", color: "#111827" }}>{teacherName}</p>
                                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Class Teacher</p>
                                    </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                    <div
                                    style={{
                                        paddingTop: "0.5rem",
                                        display: "inline-block",
                                        minWidth: "200px",
                                        borderTop: "2px solid #9ca3af",
                                    }}
                                    >
                                        <p style={{ fontWeight: "600", color: "#111827" }}>{principalName}</p>
                                        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Principal</p>
                                    </div>
                            </div>
                        </div>

                        {/*  Footer */}
                        <div
                        style={{
                            textAlign: "center",
                            marginTop: "2rem",
                            paddingTop: "1.5rem",
                            borderTop: "1px solid #e5e7eb",
                        }}
                        >
                            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                                This is an official document. Keep it safe for future reference.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
