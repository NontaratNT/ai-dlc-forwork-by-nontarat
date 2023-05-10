import { Component, Input, OnInit } from "@angular/core";
import { PersonalService } from "src/app/services/personal.service";
import { User } from "src/app/services/user";
@Component({
    selector: "app-task-appointment",
    templateUrl: "./task-appointment.component.html",
    styleUrls: ["./task-appointment.component.scss"],
})
export class TaskAppointmentComponent implements OnInit {
    @Input() dataForm: any;
    personalInfo: any = {};
    formData: any = {};
    constructor(
        private servicePersonal: PersonalService,
    ) {}

    ngOnInit(): void {
        this.personalInfo = User.Current;
        this.servicePersonal
            .GetPersonalById(this.personalInfo.userId)
            .subscribe(() => {
                // console.log('test->>>>',this.dataForm);

            });
    }
}
