export interface OnlineRecordInfo {
    RECORD_ID: number;
    PERSONAL_ID: number;
    RECORD_USER_CODE: string;
    RECORD_TITLE_ID: string;
    RECORD_FIRSTNAME: string;
    RECORD_LASTNAME: string;
    RECORD_USER_BOD: string;
    RECORD_ADDRESS_NO: string;
    RECORD_ADDRESS_MOO: Date;
    RECORD_ADDRESS_BUILDING: string;
    RECORD_ADDRESS_SOI: string;
    RECORD_ADDRESS_STREET: string;
    RECORD_SUB_DISTRICT_ID: number;
    RECORD_DISTRICT_ID: number;
    RECORD_PROVINCE_ID: number;
    RECORD_POSTCODE_ID: number;
    RECORD_TEL: string;
    RECORD_EMAIL: string;
    RECORD_SUBJECT: string;
    RECORD_ACTION_DATE: Date;
    RECORD_DETAIL: string;
    RECORD_FOOTER: string;
    RECORD_ID_STATUS: string;
    RECORD_STATUS: string;
    DEL_FLAG: string;
    CREATE_DATE: Date;
    RECORD_REF_NO: string;
    RECORD_NO: string;
    DOCUMENT_ID: string;
}

export interface OnlineRecordParam extends OnlineRecordInfo {
    RECORD_DOC: any[];
    RECORD_SOCIAL: any[];
}
