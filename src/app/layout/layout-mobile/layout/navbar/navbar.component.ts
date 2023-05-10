import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserSettingService } from "src/app/services/user-setting.service";
import Swal from "sweetalert2";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
    constructor(private _router: Router, private userSetting: UserSettingService) { }

    ngOnInit(): void {


        // $('.grid .item').on("click", function() {
        //     $('.website .alert-element').toggleClass('is-active');
        // });



        // $('.section-modal .profile').click(function () {
        //     $('.overlay').addClass('is-active');
        //     setTimeout(function () {
        //         $('.overlay').removeClass('is-active');
        //     }, 5000);
        // });

    }

    onHome() {
        if (this.userSetting.userSetting.issue_status === false) {
            this._router.navigate(['/']);
            this.userSetting.userSetting.location_name = undefined;
            // this.userSetting.Save();
        } else {
            Swal.fire({
                title: 'คุณยังไม่ได้บันทึกข้อมูล',
                text: 'ต้องการออกจากหน้านี้ หรือไม่?',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonText: 'ตกลง'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.userSetting.userSetting.issue_status = false;
                    this._router.navigate(['/']);
                    this.userSetting.userSetting.location_name = undefined;
                }
            });
        }

    }
}
