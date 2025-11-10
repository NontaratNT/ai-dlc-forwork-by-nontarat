import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternalCache } from 'share-ui';
import { CookieStorage } from 'src/app/common/cookie';
import { createSessionCookie, getSessionCookie, removeSessionCookie } from 'src/app/common/helper';
import { LoginService } from 'src/app/services/login.service';
import { SuspensionService } from 'src/app/services/suspention.service';
import { User } from 'src/app/services/user';
import Swal from 'sweetalert2';
import { log } from 'console';

@Component({
  selector: 'app-page-suspention',
  templateUrl: './page-suspention.component.html',
  styleUrls: ['./page-suspention.component.scss']
})
export class PageSuspentionComponent implements OnInit {

  // ข้อมูลตัวอย่างสำหรับตาราง
  accountData = [];

  totalMuleAccounts = this.accountData.length;

  showDisplay = true;
  pageSize = 10;
  allowedPageSizes = [5, 10, 20, 50];

  constructor(private suspensionService: SuspensionService, private _loginServ: LoginService, private router: Router,) { }

  ngOnInit(): void {
    this.applyResponsiveGrid();
    if(User?.Current && getSessionCookie()) {
      this.onButtonClick();
    }else{
      this.showDisplay = false;
      // const res = {
      //   MULE_ACCOUNT : [
      //     {
      //       level: 'ม้าเทาเข้ม',
      //       identity_card: '7681109999',
      //       bank_case_id: 'XX-XXXX-XXXX-3333',
      //       bank_account_no: '7681109999',
      //       account_name: 'นาย XXXX XXXX',
      //       tracking_code: '098XXXXXXX',
      //       organize_abbr_tha: 'ข้อมูลเพิ่มเติม',
      //       officer_name: 'ข้อมูลเพิ่มเติม',
      //       officer_tel: 'ข้อมูลเพิ่มเติม'
      //     },
      //   ],
      //   HR_ACCOUNT : [
      //     {
      //       tpo_case_id: 'ม้าเทาเข้ม',
      //       accountno: '7681109999',
      //       card_id: 'XX-XXXX-XXXX-3333',
      //       ref_code: 'นาย XXXX XXXX',
      //       name: '098XXXXXXX',
      //       officer_name: 'ข้อมูลเพิ่มเติม',
      //       pol_tel: 'ข้อมูลเพิ่มเติม',
      //       organize_abbr_tha: 'ข้อมูลเพิ่มเติม'
      //     },
      //   ],
      //   CFR_ACCOUNT : [
      //     {
      //       bankcaseid: 'Baba',
      //       to_id: '7681109999',
      //       account_type: 'ม้าเทาเข้ม',
      //       account_no: 'นาย XXXX XXXX',
      //       to_account_name: '098XXXXXXX',
      //       officer_name: 'ข้อมูลเพิ่มเติม',
      //       officer_tel: 'ข้อมูลเพิ่มเติม',
      //       organize_abbr_tha: 'ข้อมูลเพิ่มเติม',
      //       tracking_code: 'T11111'
      //     },
      //   ]
      // }
    }
  }

  onButtonClick() {
    const key = getSessionCookie();
    if (!key) {
      this.router.navigate(["/"]);
      return;
    }

    const date = new Date(key.dateTimePart);
    if (date) {
      const dateNow = new Date();
      const diffInMs = dateNow.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000); // แปลงเป็นนาที
      if (diffInMinutes >= 30) {
        Swal.fire({
          title: 'หมดเวลา!',
          text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
          icon: 'warning',
          confirmButtonText: 'ตกลง'
        }).then(() => {

        });
      } else {
        this.showDisplay = true;
        this.loadData();
      }
    }

  }

  createTableRows(data) {
    if (!data) {
      return;
    }

    if (data?.MULE_ACCOUNT) {
      this.accountData.push(...data.MULE_ACCOUNT.map(account => ({
          accountNumber: account.bank_account_no,
          referenceNumber: account.bank_case_id,
          caseNo: account.tracking_code,
          investigator: account.officer_name,
          contact: account.officer_tel,
          level: account.level,
          orgName: account.organize_abbr_tha
      })));
    }
    if (data?.HR_ACCOUNT) {
      this.accountData.push(...data.HR_ACCOUNT.map(account => ({
          accountNumber: account.accountno,
          referenceNumber: account.ref_code,
          caseNo: account.tpo_case_id,
          investigator: account.officer_name,
          contact: account.pol_tel,
          level: "ม้าดำ",
          orgName: account.organize_abbr_tha
      })));
    }
    if (data?.CFR_ACCOUNT) {
      this.accountData.push(...data.CFR_ACCOUNT.map(account => ({
          accountNumber: account.account_no,
          referenceNumber: account.bankcaseid,
          caseNo: account.tracking_code,
          investigator: account.officer_name,
          contact: account.officer_tel,
          level: account.account_type,
          orgName: account.organize_abbr_tha
      })));
    }
    

    this.totalMuleAccounts = this.accountData.length;
  }

  loadData() {
    // โหลดข้อมูลใหม่และอัปเดตตาราง
    this.suspensionService.GetMule().subscribe(response => {
      const data = response.data; // สมมติว่า response มีโครงสร้างแบบนี้
      this.createTableRows(data);
    });
  }

  /** ปุ่ม Logout ในระบบ (กดเอง) */
  async clearSessionAndLeave() {
    removeSessionCookie();
    this._loginServ.logout("/");
    this.showDisplay = false;
  }
  loginThaiID() {
    createSessionCookie();
    this.router.navigate(['/login/thaiD']);
  }

  /** ถูกเรียกโดย CanDeactivate guard */
  async canLeave(): Promise<boolean> {
    // ถ้ามีข้อมูลค้าง ให้ถามผู้ใช้ก่อน
    if (!this.showDisplay) {
      return true; // ไม่มีข้อมูลค้าง อนุญาตให้ออกได้เลย
    }
    const res = await Swal.fire({
      title: 'คุณต้องการออกจากหน้านี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ออกจากหน้า',
      cancelButtonText: 'อยู่ต่อ',
      reverseButtons: true,
      allowOutsideClick: false,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    if (res.isConfirmed) {
      // ผู้ใช้ยืนยันจะออก: เคลียร์ session แล้วปล่อยให้ออก
      this.clearSessionAndLeave();
      return true;
    }
    return false; // อยู่หน้าเดิม
  }

  /** กันกรณีปิดแท็บ/รีเฟรชเบราว์เซอร์ */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    removeSessionCookie();
    User.Clear();
    InternalCache.DeleteAll();
    CookieStorage.removeAccessToken();
  }

  @HostListener('window:resize')
  onResize() {
    this.applyResponsiveGrid();
  }

  private applyResponsiveGrid() {
    const w = window.innerWidth;
    // XS/SM: ใช้ pageSize เล็กลงเพื่อลด scroll แนวขวาง
    if (w < 576) {
      this.pageSize = 5;
      this.allowedPageSizes = [5, 10, 20];
    } else if (w < 992) { // MD
      this.pageSize = 10;
      this.allowedPageSizes = [5, 10, 20, 50];
    } else { // LG+
      this.pageSize = 10;
      this.allowedPageSizes = [10, 20, 50, 100];
    }
  }

}
