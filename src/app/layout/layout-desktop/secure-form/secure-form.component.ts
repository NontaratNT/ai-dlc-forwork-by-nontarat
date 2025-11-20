import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
    DataService,
    UserData,
} from "src/app/services/HybridCrypto/Data.service";
import { HybridCryptoService } from "src/app/services/HybridCrypto/hybridcrypto.service";
import Swal from "sweetalert2";

@Component({
    selector: "app-secure-form",
    templateUrl: "./secure-form.component.html",
    styleUrls: ["./secure-form.component.scss"],
})
export class SecureFormComponent implements OnInit {
    statusMessage: string = "Ready";
    selectedFile: File | null = null;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        //

        this.dataService.getKey("3211234567890").toPromise().then((res) => {
            console.log("res", res);
        });
        // const crypto = new HybridCryptoService();
        // const sample = crypto.encryptPayload({ test: "hello world" });

        // console.log("encrypted.data:", sample.data);
        // console.log("encrypted.iv:", sample.iv);

        // const decrypted = crypto.decryptAESPayload(sample.data, sample.iv);
        // console.log("decrypted:", decrypted);
    }

    onSubmit(): void {
        this.statusMessage = "Sending...";

        const payload: UserData = {
            username: "Alice_Wonder",
            email: "alice@security.com",
        };

        const formData = new FormData();
        formData.append("username", payload.username);
        formData.append("email", payload.email);

        if (this.selectedFile) {
            formData.append("Files", this.selectedFile, this.selectedFile.name);
        }

        this.dataService.sendEncryptedDataform(formData).subscribe({
            next: (response) => {
                console.log("response", response);
                if (response.Value && response.Value.length > 0) {
                    this.statusMessage = `Success: ${response.Message}`;
                    response.Value.forEach((item) => {
                        console.log(`- ${item.PROVINCE_NAME_THA}`);
                    });
                } else {
                    Swal.fire({
                        title: "ไม่ถูกต้อง!",
                        text: response.Message,
                        icon: "warning",
                        confirmButtonText: "ตกลง",
                    }).then(() => {});
                }
            },
            error: (err) => {
                this.statusMessage = `Error: ${
                    err.Message || "Check console."
                }`;
            },
        });

        // this.dataService.sendEncryptedData(payload).subscribe({
        //     next: (response) => {

        //         console.log('response',response);
        //         if (response.Value && response.Value.length > 0) {
        //             this.statusMessage = `Success: ${response.Message}`;
        //             response.Value.forEach((item) => {
        //                 console.log(`- ${item.PROVINCE_NAME_THA}`);
        //             });
        //         } else {
        //             Swal.fire({
        //                 title: "ไม่ถูกต้อง!",
        //                 text: response.Message,
        //                 icon: "warning",
        //                 confirmButtonText: "ตกลง",
        //             }).then(() => {});
        //         }
        //     },
        //     error: (err) => {
        //         this.statusMessage = `Error: ${
        //             err.Message || "Check console."
        //         }`;
        //     },
        // });
    }
    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            console.log("Selected file:", file.name);
        }
    }
}
