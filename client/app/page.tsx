"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"


interface Subject {
  name: string
  creditHour: string
  grade: string
  remarks: string
}

export default function ReportCardPage() {
    const [studentName, setStudentName] = useState("Ram Kumar")
    const [rollNumber, setRollNumber] = useState("23")
    const [className, setClassName] = useState("Seven")
    const [section, setSection] = useState("A")
    const [academicYear, setAcademicYear] = useState("2082")
    const [subjects, setSubjects] = useState<Subject[]>([
        { name: "Mathematics", creditHour: "3", grade: "A+", remarks: "Excellent" },
        { name: "Science", creditHour: "3", grade: "A", remarks: "Very Good" },
        { name: "English", creditHour: "3", grade: "B+", remarks: "Good" },
        { name: "History", creditHour: "2", grade: "A", remarks: "Very Good" },
        { name: "Physical Education", creditHour: "1", grade: "A+", remarks: "Outstanding" },
    ])
    
    const [teacherName, setTeacherName] = useState("Mrs. Smith")
    const [principalName, setPrincipalName] = useState("Dr. Johnson")
    const [teacherSign, setTeacherSign] = useState<string | null>(null);
    const [principalSign, setPrincipalSign] = useState<string | null>(null);


    const updateSubject = (index: number, field: keyof Subject, value: string) => {
        const newSubjects = [...subjects]
        newSubjects[index][field] = value
        setSubjects(newSubjects)
    }

    const addSubject = () => {
        setSubjects([...subjects, { name: "", creditHour: "", grade: "", remarks: "" }])
    }

    const removeSubject = (index: number) => {
        setSubjects(subjects.filter((_, i) => i !== index))
    }

    const handleTeacherSign = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setTeacherSign(URL.createObjectURL(file));
    };

    const handlePrincipalSign = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPrincipalSign(URL.createObjectURL(file));
    };


    const downloadPDF = async () => {
        const source = document.getElementById("report-card-print")
        if (!source) return

        // Create iframe
        const iframe = document.createElement("iframe")
        iframe.style.position = "fixed"
        iframe.style.right = "0"
        iframe.style.bottom = "0"
        iframe.style.width = "0"
        iframe.style.height = "0"
        iframe.style.border = "0"
        document.body.appendChild(iframe)

        const doc = iframe.contentDocument
        if (!doc) return

        // Clean HTML wrapper (NO Tailwind, NO globals)
        doc.open()
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Report Card</title>
                <style>
                * {
                    box-sizing: border-box;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #000;
                    background: transparent;
                }
                body {
                    margin: 0;
                    padding: 24px;
                    background: #ffffff;
                }
                </style>
            </head>
            <body></body>
            </html>
        `)
        doc.close()

        // Clone content
        const clone = source.cloneNode(true) as HTMLElement

        // Remove class attributes
        clone.querySelectorAll("*").forEach(el => {
            el.removeAttribute("class")
        })

        clone.style.background = "#ffffff"
        clone.style.color = "#000000"

        doc.body.appendChild(clone)

        // Render canvas
        const canvas = await html2canvas(doc.body, {
            scale: 1.5,
            backgroundColor: "#ffffff",
        })

        const imgData = canvas.toDataURL("image/png")

        // Create PDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        })

        const pageWidth = 210
        const pageHeight = 297

        // const pageWidth = pdf.internal.pageSize.getWidth()
        // const pageHeight = pdf.internal.pageSize.getHeight()

        const imgWidth = pageWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // ✅ Center vertically if shorter than A4
        const y = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 0

        pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight)

        // let position = 0
        // let heightLeft = imgHeight

        // pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        // heightLeft -= pageHeight

        // while (heightLeft > 0) {
        //     position -= pageHeight
        //     pdf.addPage()
        //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        //     heightLeft -= pageHeight
        // }

        pdf.save(`report-card-${studentName.replace(/\s+/g, "-")}.pdf`)

        // Cleanup
        document.body.removeChild(iframe)
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
                                <label className="text-sm font-medium" htmlFor="section">
                                Section
                                </label>
                                <Input id="section" value={section} onChange={(e) => setSection(e.target.value)} />
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
                                <Button className="cursor-pointer" onClick={addSubject} size="sm">
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
                                        <label>Credit Hour</label>
                                        <Input
                                            value={subject.creditHour}
                                            onChange={(e) => updateSubject(index, "creditHour", e.target.value)}
                                            placeholder="3"
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
                                    <Button className="cursor-pointer" onClick={() => removeSubject(index)} variant="destructive" size="sm">
                                        Remove
                                    </Button>
                                </div>
                                ))}
                            </div>
                        </div>

                        {/* Teacher & Principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Teacher */}
                            <div className="flex flex-col">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="teacherName">
                                        Teacher Name
                                    </label>
                                    <Input id="teacherName" value={teacherName} onChange={(e) => setPrincipalName(e.target.value)} />
                                </div>
                                <div className="border-2 border-dashed rounded-md p-6 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleTeacherSign}
                                        className="hidden"
                                        id="teacher-sign"
                                    />
                                    <label
                                        htmlFor="teacher-sign"
                                        className="cursor-pointer text-sm text-muted-foreground"
                                    >
                                        Click to upload or drag & drop
                                    </label>
                                </div>
                            </div>
                            

                            {/* Principal */}
                            <div className="flex flex-col">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="principalName">
                                        Principal Name
                                    </label>
                                    <Input id="principalName" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} />
                                </div>
                                <div className="border-2 border-dashed rounded-md p-6 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePrincipalSign}
                                        className="hidden"
                                        id="principal-sign"
                                    />
                                    <label
                                        htmlFor="principal-sign"
                                        className="cursor-pointer text-sm text-muted-foreground"
                                    >
                                        Click to upload or drag & drop
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                    {/* Preview Section */}
                    <div className="space-y-4 border-2 rounded-lg p-4" style={{ borderColor: "#b4b4b4ff" }}>
                        <div className="flex justify-between items-center border-b-2 pb-2 mb-4" style={{ borderColor: "#b4b4b4ff" }}>
                            <h2 className="text-2xl font-bold">Preview</h2>
                            <Button onClick={downloadPDF} className="gap-2 cursor-pointer">
                            {/* <Button className="gap-2"> */}
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>

                    {/* Report Card Preview */}
                    <div
                        id="report-card-print"
                        style={{
                            width: "794px",          // ✅ A4 width
                            minHeight: "1123px",     // ✅ A4 height
                            margin: "0 auto",
                            backgroundColor: "#ffffff",
                            padding: "32px",
                            boxSizing: "border-box"
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
                            gridTemplateColumns: "repeat(3, 1fr)",
                            // columnGap: "2rem",
                            // rowGap: "1rem",
                            marginBottom: "1rem",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#8d8d8d38",
                        }}
                        >
                            <div>
                                <p style={{ fontSize: "1rem", color: "#111827" }}>Name : {studentName}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "1rem", color: "#111827" }}>Class : {className}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "1rem", color: "#111827" }}>Section : {section}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "1rem", color: "#111827" }}>Roll Number : {rollNumber}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: "1rem", color: "#111827" }}>Academic Year : {academicYear}</p>
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
                                            textAlign: "center",
                                            width: "2rem",
                                        }}
                                        >
                                            S.N.
                                        </th>
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
                                        }}
                                        >
                                            Credit Hour
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
                                        <tr key={index}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                                            pageBreakInside: "avoid", 
                                            }}>
                                            <td
                                                style={{
                                                border: "1px solid #d1d5db",
                                                padding: "0.75rem 1rem",
                                                fontWeight: "500",
                                                color: "#111827",
                                                }}
                                            >
                                                {index + 1}
                                            </td>
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
                                                {subject.creditHour}
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
                            // borderTop: "1px solid #d1d5db",
                            pageBreakInside: "avoid",
                        }}
                        >
                            

                            <div style={{ textAlign: "center"}}>
                                <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                                    {teacherSign && (
                                        <img
                                        src={teacherSign}
                                        alt="Teacher Signature"
                                        style={{
                                            display: "flex",
                                            margin: "0 auto",
                                            width: "10rem",
                                            height: "10rem",
                                            marginBottom: "0.5rem",
                                        }}
                                        />
                                    )}
                                </div>
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
                                <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                                    {principalSign && (
                                        <img
                                        src={principalSign}
                                        alt="Principal Signature"
                                        style={{
                                            display: "flex",
                                            margin: "0 auto",
                                            width: "10rem",
                                            height: "10rem",
                                            marginBottom: "0.5rem",
                                        }}
                                        />
                                    )}
                                </div>
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
                        {/* <div
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
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
  )
}
