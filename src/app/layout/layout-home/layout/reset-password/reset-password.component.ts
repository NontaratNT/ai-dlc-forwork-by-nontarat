import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordNewComponent implements OnInit {

  _isLoading = false;
  myToken: string;

  showPw = false;
  showPw2 = false;

  // เงื่อนไขขั้นต่ำ: ตัวเล็ก + ตัวเลข + อักขระพิเศษ + ยาว ≥ 8
  private passwordPattern = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/;

  form: FormGroup = this.fb.group({
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.passwordPattern)
    ]],
    confirm: ['', Validators.required]
  }, { validators: this.matchValidator('password', 'confirm') });

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private user: UserService) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(Token => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.myToken = Token['token'];
    });
  }



  onSubmit() {
    if (!this.form.value.password || !this.form.value.confirm) {
      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'กรุณากรอกรหัสผ่านใหม่',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      }).then(() => { });
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const password = this.form.value.password;
    const confirm = this.form.value.confirm;

    if (password !== confirm) {
      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'รหัสผ่านไม่ตรงกัน',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      }).then(() => { });
      return;
    }

    this._isLoading = true;

    this.user.postResetPasswordForce(password)
      .pipe(finalize(() => this._isLoading = false))
      .subscribe(_ => {
        Swal.fire({
          title: 'สำเร็จ!',
          text: 'เปลี่ยนรหัสผ่านเรียบร้อย',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        }).then(() => {
          User.Current.LatestUpdatePassword = new Date().toISOString();
          this.router.navigate(["login"]);
        });
      });
  }

  btnBack() {
    this.router.navigate(["login"]);
  }

  // ตรวจรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน
  private matchValidator(pwKey: string, cfKey: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const pw = group.get(pwKey)?.value ?? '';
      const cf = group.get(cfKey)?.value ?? '';
      return pw && cf && pw !== cf ? { mismatch: true } : null;
    };
  }

  // ให้คำแนะนำว่า “ยังขาดอะไร”
  getHints(): string[] {
    const pw: string = this.form.get('password')?.value || '';
    const hints: string[] = [];
    if (!/[a-z]/.test(pw)) hints.push('เพิ่มตัวอักษรภาษาอังกฤษตัวเล็กอย่างน้อย 1 ตัว');
    if (!/\d/.test(pw)) hints.push('เพิ่มตัวเลขอย่างน้อย 1 ตัว');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw)) hints.push('เพิ่มอักขระพิเศษอย่างน้อย 1 ตัว');
    if (pw.length < 8) hints.push('ตั้งความยาวอย่างน้อย 8 ตัวอักษร (แนะนำ ≥ 12)');
    // เสริมความแกร่ง (ไม่บังคับ)
    if (!/[A-Z]/.test(pw)) hints.push('เพิ่มตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว (แนะนำ)');
    return hints;
  }

  // คำนวณคะแนนความแข็งแรง 0–4 และ label
  getStrength() {
    const pw: string = this.form.get('password')?.value || '';
    let score = 0;

    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw)) score++;
    if (pw.length >= 12 || (pw.length >= 10 && /[A-Z]/.test(pw))) score++;

    const labels = ['อ่อนมาก', 'พอใช้', 'ดี', 'แข็งแรง'];
    const safeScore = Math.min(score, 4);
    const label = labels[Math.min(score, 3)];

    // คืน class สีตามระดับ
    const colorClass = ['lvl-0', 'lvl-1', 'lvl-2', 'lvl-3', 'lvl-4'][safeScore];

    return { score: safeScore, label, colorClass };
  }

  blockInvalidChars(event: KeyboardEvent) {
    const allowed = /^[A-Za-z0-9!@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]$/;
    if (!allowed.test(event.key)) {
      event.preventDefault(); // ❌ ไม่ให้พิมพ์ตัวอักษรที่ไม่ตรง regex
    }
  }
}