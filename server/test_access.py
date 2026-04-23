"""Quick test to verify all Access database connections and data."""
import sys
sys.path.insert(0, '.')
from access_db import (
    test_connections, get_all_faculty, get_all_subjects,
    get_full_timetable, get_attendance_summary, get_all_rooms,
    get_course_registrations
)

print("=" * 60)
print("ACCESS DATABASE CONNECTION TEST")
print("=" * 60)

# Test connections
results = test_connections()
for k, v in results.items():
    status = "OK" if v else "FAIL"
    print(f"  [{status}] {k}")

# Faculty
faculty = get_all_faculty()
print(f"\nFaculty_Master: {len(faculty)} rows")
for f in faculty[:5]:
    print(f"  #{f['FacultyID']}: {f['Name']} | {f['Department']} | {f['Designation']} | {f['Status']}")
if len(faculty) > 5:
    print(f"  ... and {len(faculty) - 5} more")

# Subjects
subjects = get_all_subjects()
print(f"\nSubject_Master: {len(subjects)} rows")
for s in subjects[:5]:
    lab = "LAB" if s.get("IsLab") else "Theory"
    print(f"  #{s['SubjectID']}: {s['SubjectName']} | {s['Department']} | {lab} | {s['HoursPerWeek']}h/wk")
if len(subjects) > 5:
    print(f"  ... and {len(subjects) - 5} more")

# Rooms
rooms = get_all_rooms()
print(f"\nRoom_Master: {len(rooms)} rows")
for r in rooms[:5]:
    lab = "Lab" if r.get("IsLab") else "Room"
    print(f"  #{r['RoomID']}: {r['RoomName']} | Cap: {r['Capacity']} | {lab}")

# Course Registrations
regs = get_course_registrations()
print(f"\nCourse_Registration: {len(regs)} rows")
for r in regs[:5]:
    print(f"  Reg#{r['RegID']}: Subject#{r['SubjectID']} | Sem#{r['SemesterID']} | {r['StudentCount']} students")

# Full Timetable (cross-DB join)
timetable = get_full_timetable()
print(f"\nTimetable (cross-DB join): {len(timetable)} entries")
for t in timetable[:8]:
    print(f"  {t['day']:10s} {t['time']:15s} | {t['course']:20s} | {t['faculty']:15s} | {t['venue']} | {t['entry_type']}")

# Attendance Summary
att = get_attendance_summary()
print(f"\nAttendance Summary: {len(att)} subjects")
for a in att:
    print(f"  {a['course_name']:20s} | {a['percentage']:5.1f}% | {a['classes_attended']}/{a['classes_held']} classes")

print("\n" + "=" * 60)
print("ALL TESTS PASSED" if all(results.values()) else "SOME CONNECTIONS FAILED")
print("=" * 60)
