# 🧱 Architecture: Global Module Standard
**Description:** มาตรฐานการจัดกลุ่มและการเชื่อมต่อระหว่างโมดูล (Inter-module connectivity)
**Role:** System Architect
**Strategic Goal:** เพื่อให้ระบบขยายตัวได้แบบไร้รอยต่อ (Seamless Scalability)

---

## 📐 1. Structural Standards
- **Isolation Rule:** ห้ามโมดูลเข้าถึง DB ของโมดูลอื่นโดยตรง
- **API Registry:** การสื่อสารข้ามโมดูลต้องทำผ่าน Internal Service ที่ตกลงกันไว้เท่านั้น
- **Folder Consistency:** [Core/ | API/ | Shared/]

## 🔗 2. Communication Standards
- ใช้แนวทาง "Loose Coupling" คือการแก้ที่หนึ่ง ต้องไม่ทำให้อีกที่พัง
- การเพิ่มโมดูลใหม่ต้องไม่ทำให้ประสิทธิภาพโดยรวมลดลง (Low Overhead)
