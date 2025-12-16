"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

interface Subject {
  id: string
  name: string
  grade: string
  remarks: string
}

interface ReportCardData {
  studentName: string
  rollNumber: string
  className: string
  semester: string
  academicYear: string
  subjects: Subject[]
  teacherName: string
  principalName: string
}

export default function ReportCardPage() {
  const [reportData, setReportData] = useState<ReportCardData>({
    studentName: "John Doe",
    rollNumber: "12345",
    className: "Grade 10-A",
    semester: "First Semester",
    academicYear: "2024-2025",
    subjects: [
      { id: "1", name: "Mathematics", grade: "A+", remarks: "Excellent" },
      { id: "2", name: "Science", grade: "A", remarks: "Very Good" },
      { id: "3", name: "English", grade: "B+", remarks: "Good" },
      { id: "4", name: "History", grade: "A", remarks: "Very Good" },
      { id: "5", name: "Physical Education", grade: "A+", remarks: "Outstanding" },
    ],
    teacherName: "Mrs. Smith",
    principalName: "Dr. Johnson",
  })

  const handleInputChange = (field: keyof ReportCardData, value: string) => {
    setReportData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubjectChange = (id: string, field: keyof Subject, value: string) => {
    setReportData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject) => (subject.id === id ? { ...subject, [field]: value } : subject)),
    }))
  }

  const addSubject = () => {
    setReportData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { id: Date.now().toString(), name: "", grade: "", remarks: "" }],
    }))
  }

  const removeSubject = (id: string) => {
    setReportData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((subject) => subject.id !== id),
    }))
  }

//   const downloadPDF = async () => {
//     const element = document.getElementById("report-card-print")
//     if (!element) return

//     const html2pdf = (await import("html2pdf.js")).default
//     const opt = {
//       margin: 0.5,
//       filename: `report-card-${reportData.studentName.replace(/\s+/g, "-")}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     }

//     html2pdf().from(element).set(opt).save()
//   }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-foreground">School Report Card Generator</h1>
                <p className="text-muted-foreground">Customize and download your report card</p>
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
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                    id="studentName"
                    value={reportData.studentName}
                    onChange={(e) => handleInputChange("studentName", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                    id="rollNumber"
                    value={reportData.rollNumber}
                    onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="className">Class</Label>
                    <Input
                    id="className"
                    value={reportData.className}
                    onChange={(e) => handleInputChange("className", e.target.value)}
                    />
                </div>
                {/* <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                    id="semester"
                    value={reportData.semester}
                    onChange={(e) => handleInputChange("semester", e.target.value)}
                    />
                </div> */}
                <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                    id="academicYear"
                    value={reportData.academicYear}
                    onChange={(e) => handleInputChange("academicYear", e.target.value)}
                    />
                </div>
                </div>

                {/* Subjects */}
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base">Subjects & Grades</Label>
                    <Button onClick={addSubject} size="sm"  className="cursor-pointer">
                        Add Subject
                    </Button>
                </div>
                <div className="space-y-3">
                    {reportData.subjects.map((subject) => (
                    <div key={subject.id} className="flex gap-3 items-end">
                        <div className="flex-1 space-y-2">
                        <Label>Subject Name</Label>
                        <Input
                            value={subject.name}
                            onChange={(e) => handleSubjectChange(subject.id, "name", e.target.value)}
                            placeholder="Subject"
                        />
                        </div>
                        <div className="w-24 space-y-2">
                        <Label>Grade</Label>
                        <Input
                            value={subject.grade}
                            onChange={(e) => handleSubjectChange(subject.id, "grade", e.target.value)}
                            placeholder="A+"
                        />
                        </div>
                        <div className="flex-1 space-y-2">
                        <Label>Remarks</Label>
                        <Input
                            value={subject.remarks}
                            onChange={(e) => handleSubjectChange(subject.id, "remarks", e.target.value)}
                            placeholder="Remarks"
                        />
                        </div>
                        <Button onClick={() => removeSubject(subject.id)} className="cursor-pointer" variant="destructive" size="sm">
                        Remove
                        </Button>
                    </div>
                    ))}
                </div>
                </div>

                {/* Teacher & Principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="teacherName">Class Teacher Name</Label>
                    <Input
                    id="teacherName"
                    value={reportData.teacherName}
                    onChange={(e) => handleInputChange("teacherName", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="principalName">Principal Name</Label>
                    <Input
                    id="principalName"
                    value={reportData.principalName}
                    onChange={(e) => handleInputChange("principalName", e.target.value)}
                    />
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Preview Section */}
            <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Preview</h2>
                {/* <Button onClick={downloadPDF} className="gap-2"> */}
                <Button className="gap-2 cursor-pointer" >
                <Download className="h-4 w-4" />
                    Download PDF
                </Button>
            </div>

            {/* Report Card Preview */}
            <div id="report-card-print" className="bg-white p-12 rounded-lg shadow-lg">
                {/* Header */}
                <div className="text-center border-b-4 border-primary pb-6 mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">ACADEMIC REPORT CARD</h1>
                <p className="text-lg text-gray-700">Excellence in Education</p>
                </div>

                {/* Student Information */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 bg-gray-50 p-6 rounded-lg">
                <div>
                    <p className="text-sm text-gray-600 font-medium">Student Name</p>
                    <p className="text-lg font-semibold text-gray-900">{reportData.studentName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-medium">Roll Number</p>
                    <p className="text-lg font-semibold text-gray-900">{reportData.rollNumber}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-medium">Class</p>
                    <p className="text-lg font-semibold text-gray-900">{reportData.className}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-medium">Semester</p>
                    <p className="text-lg font-semibold text-gray-900">{reportData.semester}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-gray-600 font-medium">Academic Year</p>
                    <p className="text-lg font-semibold text-gray-900">{reportData.academicYear}</p>
                </div>
                </div>

                {/* Grades Table */}
                <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Performance</h2>
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-primary text-white">
                        <th className="border border-gray-300 px-4 py-3 text-left">Subject</th>
                        <th className="border border-gray-300 px-4 py-3 text-center w-24">Grade</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Remarks</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportData.subjects.map((subject, index) => (
                        <tr key={subject.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="border border-gray-300 px-4 py-3 text-gray-900 font-medium">{subject.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-gray-900 font-bold">
                            {subject.grade}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{subject.remarks}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-gray-300">
                <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-2 inline-block min-w-[200px]">
                    <p className="font-semibold text-gray-900">{reportData.teacherName}</p>
                    <p className="text-sm text-gray-600">Class Teacher</p>
                    </div>
                </div>
                <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-2 inline-block min-w-[200px]">
                    <p className="font-semibold text-gray-900">{reportData.principalName}</p>
                    <p className="text-sm text-gray-600">Principal</p>
                    </div>
                </div>
                </div>

                {/* Footer */}
                {/* <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">This is an official document. Keep it safe for future reference.</p>
                </div> */}
            </div>
            </div>
        </div>
    </div>
  )
}
