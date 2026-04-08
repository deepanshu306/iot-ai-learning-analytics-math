from pathlib import Path
from shutil import copy2

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt


OUTPUT_PATH = Path("output/doc/Deepanshu-Jain-Combined-Project-Report-and-Synopsis.docx")
DOWNLOADS_PATH = Path.home() / "Downloads" / OUTPUT_PATH.name
SCREENSHOT_DIR = Path("output/doc/screenshots")
ASSET_DIR = Path("output/doc/assets")
UNIVERSITY_LOGO = ASSET_DIR / "krmu-crest.png"

STUDENT_NAME = "Deepanshu Jain"
ROLL_NUMBER = "2201730107"
SECTION = "B"
UNIVERSITY_NAME = "KR MANGALAM UNIVERSITY"
CITY = "Gurgaon"
MENTOR_NAME = "Gaurav"
PROGRAM = "BACHELOR OF TECHNOLOGY (CSE / AI & ML)"
SEMESTER = "Semester VIII"
SUBMISSION_MONTH = "April 2026"
PROJECT_CATEGORY = "University Based Project"
PROJECT_TITLE = "Automated Learning Analytics and Personalized Feedback System for Mathematics Education"
PROJECT_CODE = "Math Analytics Studio"
PROJEXA_TEAM_ID = "26E4362"
REPO_URL = "https://github.com/deepanshu306/iot-ai-learning-analytics-math"
LIVE_URL = "https://deepanshu306.github.io/iot-ai-learning-analytics-math/"
DIRECT_APP_URL = "https://deepanshu306.github.io/iot-ai-learning-analytics-math/react-app/#/login"

STUDENT_COUNT = 3
TEACHER_COUNT = 1
ADMIN_COUNT = 1
CONNECTOR_COUNT = 3
EVENT_COUNT = 9
MAIN_TOPICS = "Algebra, Trigonometry, and Calculus"


def shade(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def add_page_number(paragraph):
    run = paragraph.add_run()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run._r.append(fld_begin)
    run._r.append(instr)
    run._r.append(fld_end)


def set_document_style(document):
    section = document.sections[0]
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

    normal = document.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(12)

    for style_name in ["Title", "Heading 1", "Heading 2", "Heading 3"]:
        document.styles[style_name].font.name = "Times New Roman"

    document.styles["Title"].font.size = Pt(20)
    document.styles["Heading 1"].font.size = Pt(16)
    document.styles["Heading 2"].font.size = Pt(14)
    document.styles["Heading 3"].font.size = Pt(12)

    props = document.core_properties
    props.title = PROJECT_TITLE
    props.author = STUDENT_NAME
    props.subject = "Combined synopsis and project report"
    props.keywords = "learning analytics, mathematics education, personalized feedback, github pages, react"


def center(document, text, *, bold=False, size=12, after=6, italic=False):
    para = document.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para.paragraph_format.space_after = Pt(after)
    run = para.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic


def body(document, text):
    para = document.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    para.paragraph_format.space_after = Pt(8)
    para.paragraph_format.line_spacing = 1.15
    run = para.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)


def bullet(document, text):
    para = document.add_paragraph(style="List Bullet")
    para.paragraph_format.space_after = Pt(4)
    para.paragraph_format.line_spacing = 1.1
    run = para.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)


def numbered(document, text):
    para = document.add_paragraph(style="List Number")
    para.paragraph_format.space_after = Pt(4)
    para.paragraph_format.line_spacing = 1.1
    run = para.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)


def remove_table_borders(table):
    tbl_pr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        elem = OxmlElement(f"w:{edge}")
        elem.set(qn("w:val"), "nil")
        borders.append(elem)
    tbl_pr.append(borders)


def set_cell_text(cell, text, *, bold=False, size=10.5, align=WD_ALIGN_PARAGRAPH.LEFT):
    cell.text = ""
    para = cell.paragraphs[0]
    para.alignment = align
    para.paragraph_format.space_after = Pt(0)
    para.paragraph_format.line_spacing = 1.0
    run = para.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(size)
    run.bold = bold


def set_table_widths(table, widths):
    table.autofit = False
    for row in table.rows:
        for index, width in enumerate(widths):
            if index < len(row.cells):
                row.cells[index].width = Inches(width)


def add_signature_block(document, left_lines, right_lines=None):
    cols = 2 if right_lines else 1
    rows = max(len(left_lines), len(right_lines or []))
    table = document.add_table(rows=rows, cols=cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    remove_table_borders(table)
    set_table_widths(table, [3.1, 3.1] if cols == 2 else [6.2])

    for row_index in range(rows):
        if row_index < len(left_lines):
            set_cell_text(table.rows[row_index].cells[0], left_lines[row_index], size=11)
        if right_lines and row_index < len(right_lines):
            set_cell_text(table.rows[row_index].cells[1], right_lines[row_index], size=11)

    document.add_paragraph()


def add_footer(section):
    para = section.footer.paragraphs[0]
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run(f"{PROJECT_TITLE} | Page ")
    run.font.name = "Times New Roman"
    run.font.size = Pt(9)
    add_page_number(para)


def add_heading_page_break(document, title, *, level=1):
    document.add_page_break()
    heading = document.add_heading(title, level=level)
    heading.paragraph_format.space_after = Pt(10)


def add_picture_with_caption(document, image_name, caption, *, width=4.8, page_break_before=False):
    image_path = SCREENSHOT_DIR / image_name
    if not image_path.exists():
        return
    if page_break_before:
        document.add_page_break()
    para = document.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para.paragraph_format.space_before = Pt(6)
    para.paragraph_format.space_after = Pt(4)
    run = para.add_run()
    run.add_picture(str(image_path), width=Inches(width))
    caption_para = document.add_paragraph()
    caption_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    caption_para.paragraph_format.space_after = Pt(8)
    caption_run = caption_para.add_run(caption)
    caption_run.font.name = "Times New Roman"
    caption_run.font.size = Pt(10)
    caption_run.italic = True


def index_page(document):
    document.add_heading("INDEX", level=1)
    table = document.add_table(rows=1, cols=3)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header = table.rows[0].cells
    header[0].text = "S. No."
    header[1].text = "Content"
    header[2].text = "Page No."
    for cell in header:
      shade(cell, "D9EAF7")

    entries = [
        "Abstract",
        "Synopsis Summary",
        "Introduction",
        "Problem Statement and Need",
        "Objectives",
        "Final Repository Structure",
        "System Architecture",
        "Module Description",
        "Data and Analytics Design",
        "Technology Stack and Hosting",
        "Methodology",
        "Testing and Verification",
        "Screens and Visual Representation",
        "Feasibility and Significance",
        "Conclusion",
        "Future Scope",
        "References",
        "List of Abbreviations",
        "Annexure",
    ]
    for index, entry in enumerate(entries, 1):
        row = table.add_row().cells
        row[0].text = str(index)
        row[1].text = entry
        row[2].text = ""
    document.add_page_break()


def module_table(document):
    table = document.add_table(rows=1, cols=3)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_widths(table, [1.8, 2.0, 2.4])
    header = table.rows[0].cells
    header[0].text = "Module"
    header[1].text = "Purpose"
    header[2].text = "Main Output"
    for cell in header:
        shade(cell, "D9EAF7")

    rows = [
        ("Student Page", "Shows learner-specific analytics and recommendations", "Topic mastery, trend chart, recent events"),
        ("Teacher Page", "Shows class performance and learner drill-down", "Heatmap, risk distribution, selected-student view"),
        ("Admin Page", "Supports runtime management in browser session", "User creation, LMS status changes, event ingestion"),
        ("Analytics Layer", "Computes scores, risk level, and summaries", "Averages, completion rate, mastery bands"),
        ("Feedback Layer", "Generates student and teacher guidance", "Personalized student suggestions and teacher notes"),
        ("Static Hosting Layer", "Publishes the final project through GitHub Pages", "Public live access without backend deployment"),
    ]
    for left, center_text, right in rows:
        row = table.add_row().cells
        row[0].text = left
        row[1].text = center_text
        row[2].text = right


def requirements_table(document):
    table = document.add_table(rows=1, cols=3)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_widths(table, [1.2, 1.8, 3.4])
    header = table.rows[0].cells
    header[0].text = "ID"
    header[1].text = "Requirement"
    header[2].text = "Description"
    for cell in header:
        shade(cell, "D9EAF7")

    rows = [
        ("FR-1", "Role-based login", "The system shall allow demo login for student, teacher, and admin roles."),
        ("FR-2", "Student analytics", "The student page shall show topic mastery, score trend, and personalized guidance."),
        ("FR-3", "Teacher analytics", "The teacher page shall show class average, risk distribution, and student drill-down."),
        ("FR-4", "Admin controls", "The admin page shall allow runtime user creation, connector updates, and event ingestion."),
        ("FR-5", "Static hosting", "The final project shall run directly on GitHub Pages without server dependency."),
        ("NFR-1", "Responsive layout", "The pages shall remain usable on laptop and mobile screen sizes."),
        ("NFR-2", "Simple structure", "The final repository shall focus on the frontend and report artifacts only."),
        ("NFR-3", "Demo readiness", "The system shall be presentation-ready immediately with seeded data."),
    ]
    for item_id, title, description in rows:
        row = table.add_row().cells
        row[0].text = item_id
        row[1].text = title
        row[2].text = description


def testing_table(document):
    table = document.add_table(rows=1, cols=4)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_widths(table, [0.8, 2.2, 2.6, 0.9])
    header = table.rows[0].cells
    header[0].text = "No."
    header[1].text = "Test Case"
    header[2].text = "Expected Result"
    header[3].text = "Status"
    for cell in header:
        shade(cell, "D9EAF7")

    rows = [
        ("1", "Student login", "Student account opens the student dashboard correctly", "Passed"),
        ("2", "Teacher login", "Teacher account opens the teacher analytics page correctly", "Passed"),
        ("3", "Admin login", "Admin account opens the admin management page correctly", "Passed"),
        ("4", "Runtime user creation", "Admin can create a new user during the active session", "Passed"),
        ("5", "Connector update", "Admin can change LMS connector status during the active session", "Passed"),
        ("6", "Event ingestion", "Admin can add a new learning event and counts update immediately", "Passed"),
        ("7", "GitHub Pages access", "The public deployed link opens without backend setup", "Passed"),
    ]
    for number, case, expected, status in rows:
        row = table.add_row().cells
        row[0].text = number
        row[1].text = case
        row[2].text = expected
        row[3].text = status


def abbreviation_table(document):
    table = document.add_table(rows=1, cols=2)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_widths(table, [1.5, 4.7])
    header = table.rows[0].cells
    header[0].text = "Abbreviation"
    header[1].text = "Meaning"
    for cell in header:
        shade(cell, "D9EAF7")

    rows = [
        ("LMS", "Learning Management System"),
        ("UI", "User Interface"),
        ("D3", "Data-Driven Documents"),
        ("SPA", "Single Page Application"),
        ("KPI", "Key Performance Indicator"),
        ("CSE", "Computer Science and Engineering"),
        ("AI/ML", "Artificial Intelligence / Machine Learning"),
    ]
    for left, right in rows:
        row = table.add_row().cells
        row[0].text = left
        row[1].text = right


def cover_page(document):
    for _ in range(2):
        document.add_paragraph()
    center(document, "Major Project Report", bold=True, size=18, after=14)
    center(document, "Combined Synopsis and Final Report", size=12, after=8)
    center(document, f"Project Code: {PROJECT_CODE}", size=11, after=8)
    center(document, PROJECT_TITLE, bold=True, size=19, after=16)
    center(document, f"Project Category: {PROJECT_CATEGORY}", size=12, after=8)
    center(document, f"Projexa Team Id- {PROJEXA_TEAM_ID}", size=12, italic=True, after=12)
    center(document, "Submitted in partial fulfilment of the requirement of the degree of", size=12, after=4)
    center(document, PROGRAM, bold=True, size=15, after=4)
    center(document, SEMESTER, bold=True, size=12, after=2)
    center(document, "to", size=12, italic=True, after=2)
    center(document, UNIVERSITY_NAME, bold=True, size=15, after=14)
    center(document, "by", size=12, italic=True, after=6)
    center(document, STUDENT_NAME, bold=True, size=14, after=3)
    center(document, f"{ROLL_NUMBER}    Section - {SECTION}", size=12, after=14)
    center(document, "Under the supervision of", size=12, after=8)
    center(document, MENTOR_NAME, bold=True, size=12, after=2)
    center(document, "Project Guide", size=11, after=12)

    if UNIVERSITY_LOGO.exists():
        para = document.add_paragraph()
        para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = para.add_run()
        run.add_picture(str(UNIVERSITY_LOGO), width=Inches(1.6))
        para.paragraph_format.space_after = Pt(8)

    center(document, "Department of Computer Science and Engineering", bold=True, size=12, after=2)
    center(document, "School of Engineering and Technology", bold=True, size=12, after=2)
    center(document, f"{UNIVERSITY_NAME}, {CITY}, India", size=12, after=2)
    center(document, SUBMISSION_MONTH, size=12, after=0)
    document.add_page_break()


def front_matter(document):
    document.add_heading("DECLARATION", level=1)
    body(
        document,
        f"I hereby declare that the work presented in this combined synopsis and final report entitled "
        f"\"{PROJECT_TITLE}\" has been prepared by me for academic submission in partial fulfilment of "
        "the Bachelor of Technology program. The implementation, documentation, deployment, and final "
        "presentation material described in this report are based on my project work and have not been "
        "submitted earlier in this form for any other degree."
    )
    body(document, f"Name: {STUDENT_NAME}")
    body(document, f"Roll Number: {ROLL_NUMBER}")
    body(document, f"Section: {SECTION}")
    add_signature_block(
        document,
        ["Student Signature: __________________________", "Date: __________________________"],
        ["Guide Signature: __________________________", "Department Approval: __________________________"],
    )

    document.add_page_break()
    document.add_heading("CERTIFICATE", level=1)
    body(
        document,
        f"This is to certify that the project report entitled \"{PROJECT_TITLE}\" submitted by "
        f"{STUDENT_NAME} ({ROLL_NUMBER}) is a bonafide work carried out under my guidance for the "
        "partial fulfilment of the degree of Bachelor of Technology in Computer Science and Engineering "
        "/ Artificial Intelligence and Machine Learning."
    )
    add_signature_block(
        document,
        [f"Guide: {MENTOR_NAME}", "Signature: __________________________"],
        [f"University: {UNIVERSITY_NAME}", "Date: __________________________"],
    )

    document.add_page_break()
    document.add_heading("ACKNOWLEDGEMENT", level=1)
    body(
        document,
        f"I express my sincere gratitude to {MENTOR_NAME} for guidance, supervision, and academic "
        "support throughout this project. I also thank the Department of Computer Science and "
        f"Engineering and {UNIVERSITY_NAME} for providing the environment and encouragement required "
        "to complete this work. I am grateful to my family and friends for their support during the "
        "development, testing, documentation, and final deployment phases of the project."
    )
    document.add_page_break()


def report_body(document):
    document.add_heading("ABSTRACT", level=1)
    body(
        document,
        f"This report presents the project titled \"{PROJECT_TITLE}\". The final implemented system is a "
        "GitHub Pages-hosted React application that analyzes seeded mathematics learning data and provides "
        "personalized feedback through separate Student, Teacher, and Admin pages. The project focuses on "
        "making assessment data more useful by converting learner records into topic mastery insights, class "
        "analytics, and guided intervention suggestions."
    )
    body(
        document,
        f"The submitted implementation uses {STUDENT_COUNT} student accounts, {TEACHER_COUNT} teacher "
        f"account, {ADMIN_COUNT} admin account, {CONNECTOR_COUNT} LMS connectors, and {EVENT_COUNT} seeded "
        "learning events. Runtime changes such as new user creation, connector updates, and event ingestion "
        "are stored in browser session storage, which keeps the project fully functional on GitHub Pages "
        "without server deployment."
    )

    add_heading_page_break(document, "SYNOPSIS SUMMARY")
    body(
        document,
        "The synopsis part of this document describes the problem, objectives, scope, and final design "
        "decision adopted for the submitted system. The project aims to improve mathematics education by "
        "providing more than final scores. It focuses on identifying weak topics, showing progress trends, "
        "and supporting timely academic intervention through role-based dashboards."
    )
    bullet(document, "Problem focus: converting learning records into useful diagnosis.")
    bullet(document, "Deployment model: GitHub Pages-hosted static React project.")
    bullet(document, "Roles implemented: Student, Teacher, and Admin.")
    bullet(document, "Final data design: seeded LMS-style records with session-based runtime updates.")
    bullet(document, "Submission scope: no parent-facing page in this version.")

    add_heading_page_break(document, "Chapter 1")
    document.add_heading("Introduction", level=2)
    body(
        document,
        "Digital mathematics education generates large amounts of learning data, but many academic systems "
        "still use that data only for score reporting. This limits the educational value of assessment "
        "because students do not clearly understand where they are weak, teachers do not immediately see "
        "patterns across the class, and administrators do not get a compact view of academic risk."
    )
    body(
        document,
        "The present project addresses that gap through a role-based analytics system. It transforms "
        "mathematics learning records into topic-wise summaries, trend charts, intervention guidance, and "
        "runtime monitoring views inside a single public web application."
    )

    add_heading_page_break(document, "Chapter 2")
    document.add_heading("Problem Statement and Need", level=2)
    body(
        document,
        "The problem addressed in this project is the lack of timely interpretation of mathematics learning "
        "data. Existing learning platforms often stop at marks or attempt history. They do not always expose "
        "a clear diagnosis of which topic caused the score drop, how the learner's performance is changing, "
        "and what action should be taken next."
    )
    bullet(document, "Students need understandable feedback instead of only final marks.")
    bullet(document, "Teachers need class-wide insight and student drill-down in one place.")
    bullet(document, "Administrators need a controlled view of users, LMS status, and event flow.")
    bullet(document, "A simple public deployment model is needed so the project can be demonstrated directly.")

    add_heading_page_break(document, "Chapter 3")
    document.add_heading("Objectives", level=2)
    numbered(document, "To build a role-based mathematics learning analytics interface.")
    numbered(document, "To provide personalized student feedback from measurable learning events.")
    numbered(document, "To provide teacher-side class analytics and learner drill-down.")
    numbered(document, "To provide admin-side runtime control over users, connectors, and event simulation.")
    numbered(document, "To host the final project publicly through GitHub Pages without backend dependency.")

    add_heading_page_break(document, "Chapter 4")
    document.add_heading("Final Repository Structure", level=2)
    body(
        document,
        "The final repository was simplified so that the codebase matches the actual deployed application. "
        "Unused backend scaffolding was removed. The main project now centers on the React source, the built "
        "static GitHub Pages output, and the supporting documentation and report generator files."
    )
    bullet(document, "frontend-react/ - main React source code")
    bullet(document, "react-app/ - built GitHub Pages output")
    bullet(document, "index.html - redirect page for hosted deployment")
    bullet(document, "project-motive.html - project explanation page")
    bullet(document, "iot-architecture.html - architecture explanation page")
    bullet(document, "scripts/generate_final_report.py - combined report generator")

    add_heading_page_break(document, "Chapter 5")
    document.add_heading("System Architecture", level=2)
    body(
        document,
        "The final architecture is static and browser-driven. Seeded LMS-style records act as the input layer. "
        "A client-side analytics layer computes averages, topic mastery, completion rate, and learner risk. "
        "A rule-based feedback layer converts those results into student guidance and teacher intervention notes. "
        "The React presentation layer then exposes those insights through Student, Teacher, and Admin pages."
    )
    document.add_heading("5.1 Architectural Flow", level=3)
    numbered(document, "Seeded student, connector, and event records are loaded into the application.")
    numbered(document, "Client-side analytics compute topic mastery, trend lines, and class summaries.")
    numbered(document, "Feedback rules convert the summaries into actionable recommendations.")
    numbered(document, "Role-based pages render the result for students, teachers, and administrators.")
    numbered(document, "Runtime updates are preserved in session storage during the active browser session.")

    add_heading_page_break(document, "Chapter 6")
    document.add_heading("Module Description", level=2)
    body(
        document,
        "The project is divided into clear frontend modules so that each role has a focused view while "
        "sharing the same analytics and data model underneath."
    )
    module_table(document)

    add_heading_page_break(document, "Chapter 7")
    document.add_heading("Data and Analytics Design", level=2)
    body(
        document,
        f"The final application uses {STUDENT_COUNT} student records, {TEACHER_COUNT} teacher record, "
        f"{ADMIN_COUNT} admin record, {CONNECTOR_COUNT} LMS connectors, and {EVENT_COUNT} seeded mathematics "
        f"learning events across {MAIN_TOPICS}. This seeded dataset makes the system immediately demonstrable."
    )
    body(
        document,
        "For each learner, the analytics layer computes average score, latest score, average time, completion "
        "rate, topic mastery, repeated weak areas, and a simple risk level. The teacher page aggregates these "
        "values to create class average, risk distribution, and topic heatmap outputs."
    )
    document.add_heading("7.1 Feedback Logic", level=3)
    bullet(document, "Scores below 55 percent are treated as high-risk.")
    bullet(document, "Scores from 55 to 69 percent are treated as moderate risk.")
    bullet(document, "Scores of 70 percent and above are treated as low risk.")
    bullet(document, "Weak topics receive remedial or revision-oriented recommendations.")
    bullet(document, "Strong topics receive advanced pathway recommendations.")

    add_heading_page_break(document, "Chapter 8")
    document.add_heading("Technology Stack and Hosting", level=2)
    body(
        document,
        "The final implementation uses React 18 for component structure, D3.js for chart rendering, and "
        "JavaScript for analytics, feedback logic, role routing, and session-backed runtime state. The "
        "application is built with Vite and deployed publicly through GitHub Pages."
    )
    bullet(document, "Frontend framework: React 18")
    bullet(document, "Charting library: D3.js")
    bullet(document, "Runtime persistence: sessionStorage")
    bullet(document, "Build tool: Vite")
    bullet(document, "Hosting: GitHub Pages")
    bullet(document, f"Repository URL: {REPO_URL}")
    bullet(document, f"Live project URL: {LIVE_URL}")
    bullet(document, f"Direct app URL: {DIRECT_APP_URL}")

    add_heading_page_break(document, "Chapter 9")
    document.add_heading("Methodology", level=2)
    body(
        document,
        "The development followed an iterative prototyping approach. The first stage defined the academic "
        "problem and the required roles. The second stage designed the seeded data structure and analytics "
        "rules. The third stage implemented role-based React pages. The fourth stage added session-backed "
        "runtime management for admin actions. The final stage focused on public hosting and documentation."
    )
    document.add_heading("9.1 Workflow Summary", level=3)
    numbered(document, "Problem identification and objective setting")
    numbered(document, "Role definition and data modeling")
    numbered(document, "Analytics and feedback rule implementation")
    numbered(document, "Student, Teacher, and Admin dashboard implementation")
    numbered(document, "GitHub Pages deployment and report preparation")

    add_heading_page_break(document, "Chapter 10")
    document.add_heading("Testing and Verification", level=2)
    body(
        document,
        "The project was tested as a static role-based application. Student login was tested for dashboard "
        "loading and personalized feedback output. Teacher login was tested for class average, topic heatmap, "
        "and selected-student drill-down. Admin login was tested for runtime user creation, LMS connector "
        "updates, and event ingestion."
    )
    body(
        document,
        "The final build was also verified for GitHub Pages deployment. The built static bundle was generated "
        "through the React project and pushed to the repository so the live deployed version matches the "
        "submitted codebase."
    )
    testing_table(document)
    document.add_heading("10.1 Functional and Non-Functional Requirements", level=3)
    requirements_table(document)

    add_heading_page_break(document, "Chapter 11")
    document.add_heading("Project Screens and Visual Representation", level=2)
    body(
        document,
        "The following screenshots represent the final submitted interface and supporting pages."
    )
    add_picture_with_caption(document, "landing-page.png", "Figure 1: Login page with seeded role-based access")
    add_picture_with_caption(document, "student-dashboard.png", "Figure 2: Student dashboard with topic mastery and trend analytics", page_break_before=True)
    add_picture_with_caption(document, "teacher-dashboard.png", "Figure 3: Teacher dashboard with class analytics and drill-down", page_break_before=True)
    add_picture_with_caption(document, "admin-dashboard.png", "Figure 4: Admin dashboard with runtime controls", page_break_before=True)
    add_picture_with_caption(document, "project-motive.png", "Figure 5: Project motive page", page_break_before=True)
    add_picture_with_caption(document, "iot-architecture.png", "Figure 6: System architecture page", page_break_before=True)

    add_heading_page_break(document, "Chapter 12")
    document.add_heading("Feasibility and Significance", level=2)
    body(
        document,
        "The technical feasibility of the project is high because it uses an accessible frontend stack and "
        "does not require any paid infrastructure or backend hosting to demonstrate. The economic feasibility "
        "is also strong because the entire deployed version can be maintained through GitHub and GitHub Pages."
    )
    body(
        document,
        "The academic significance lies in the combination of learning analytics, personalized feedback, "
        "role-based software design, and public deployment in a form that is easy to explain during project "
        "evaluation. The system is stronger than a simple marks portal because it focuses on diagnosis and "
        "next-step action."
    )

    add_heading_page_break(document, "Chapter 13")
    document.add_heading("Conclusion", level=2)
    body(
        document,
        f"The project titled \"{PROJECT_TITLE}\" successfully demonstrates a practical and publicly accessible "
        "mathematics learning analytics system. It combines role-based dashboards, seeded academic data, "
        "rule-based feedback, and GitHub Pages deployment in one coherent final-year project submission."
    )
    body(
        document,
        "The final implementation is complete enough for submission because it runs directly from the hosted "
        "repository, provides separate Student, Teacher, and Admin workflows, and presents meaningful "
        "analytics outputs without requiring any backend deployment during evaluation."
    )

    add_heading_page_break(document, "Chapter 14")
    document.add_heading("Future Scope", level=2)
    for item in [
        "Persistent database support for long-term academic history.",
        "Machine learning-based student performance prediction.",
        "Adaptive recommendation ranking instead of fixed rule ordering.",
        "Institution-wide multi-class analytics dashboards.",
        "Optional LMS API integration with live classroom systems.",
        "Optional parent-facing dashboard in a future version.",
    ]:
        bullet(document, item)

    add_heading_page_break(document, "References")
    for item in [
        "Siemens, G., and Long, P. Penetrating the fog: Analytics in learning and education. EDUCAUSE Review.",
        "Ferguson, R. Learning analytics: drivers, developments and challenges. International Journal of Technology Enhanced Learning.",
        "Hattie, J., and Timperley, H. The power of feedback. Review of Educational Research.",
        "React Documentation.",
        "D3.js Documentation.",
        "GitHub Pages Documentation.",
    ]:
        bullet(document, item)

    add_heading_page_break(document, "List of Abbreviations")
    abbreviation_table(document)

    add_heading_page_break(document, "Annexure")
    document.add_heading("Annexure I: Similarity and Plagiarism Certificate Attachment", level=2)
    body(
        document,
        "This section is reserved for the official plagiarism or similarity certificate issued by the "
        "university-approved checking platform. A valid certificate must come from the institutional "
        "checking process and should be attached here at the time of final printed submission."
    )
    bullet(document, f"Student Name: {STUDENT_NAME}")
    bullet(document, f"Roll Number: {ROLL_NUMBER}")
    bullet(document, f"Project Title: {PROJECT_TITLE}")
    bullet(document, f"Projexa Team Id: {PROJEXA_TEAM_ID}")

    document.add_heading("Annexure II: Project Links", level=2)
    bullet(document, f"GitHub Repository: {REPO_URL}")
    bullet(document, f"Live Hosted Project: {LIVE_URL}")
    bullet(document, f"Direct React App: {DIRECT_APP_URL}")

    document.add_heading("Annexure III: Core Project Files", level=2)
    bullet(document, "frontend-react/src/App.jsx - main routed React application")
    bullet(document, "frontend-react/src/api.js - seeded data, analytics, feedback, and runtime session logic")
    bullet(document, "frontend-react/src/styles.css - full UI styling")
    bullet(document, "frontend-react/package.json - React and D3 project dependencies")
    bullet(document, "index.html - GitHub Pages redirect page")
    bullet(document, "project-motive.html - motive and objective page")
    bullet(document, "iot-architecture.html - system architecture page")

    document.add_heading("Annexure IV: Screenshot Archive", level=2)
    add_picture_with_caption(document, "landing-page.png", "Annexure Figure A1: Login page", page_break_before=True)
    add_picture_with_caption(document, "student-dashboard.png", "Annexure Figure A2: Student dashboard", page_break_before=True)
    add_picture_with_caption(document, "teacher-dashboard.png", "Annexure Figure A3: Teacher dashboard", page_break_before=True)
    add_picture_with_caption(document, "admin-dashboard.png", "Annexure Figure A4: Admin dashboard", page_break_before=True)
    add_picture_with_caption(document, "project-motive.png", "Annexure Figure A5: Project motive page", page_break_before=True)
    add_picture_with_caption(document, "iot-architecture.png", "Annexure Figure A6: Architecture page", page_break_before=True)


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    document = Document()
    set_document_style(document)
    cover_page(document)
    front_matter(document)
    index_page(document)
    report_body(document)
    for section in document.sections:
        add_footer(section)
    document.save(OUTPUT_PATH)
    DOWNLOADS_PATH.parent.mkdir(parents=True, exist_ok=True)
    copy2(OUTPUT_PATH, DOWNLOADS_PATH)
    print(f"Generated {OUTPUT_PATH}")
    print(f"Copied to {DOWNLOADS_PATH}")


if __name__ == "__main__":
    main()
