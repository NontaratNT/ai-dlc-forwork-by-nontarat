import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class GlobalVariables {
    public static typeSearch: Array<TypeSearch> = [
        { type_name: "ทั้งหมด" },
        { type_name: "อื่นๆ" }
    ];

    public getLangMode() {
        const get_lang = localStorage.getItem('langMode');
        return get_lang;
    }
}

export interface TypeSearch {
    type_name: string;
}
