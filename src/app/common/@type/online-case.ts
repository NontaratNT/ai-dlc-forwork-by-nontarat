export interface OnlineCaseInfo {
    CASE_ID: number;
    CASE_TYPE_ID: number;
    LANGUAGE_ID: number;
    CASE_OTHER_DAMAGE: string;
    CASE_BEHAVIOR: string;
    CASE_INFORMER_FIRSTNAME: string;
    CASE_INFORMER_LASTNAME: string;
    CASE_INFORMER_DATE: any;
    CASE_INFORMER_ADDRESS_NO: string;
    CASE_INFORMER_ADDRESS_MOO: number;
    INFORMER_ADDRESS_BUILDING: string;
    INFORMER_ADDRESS_SOI: string;
    INFORMER_ADDRESS_STREET: string;
    INFORMER_SUB_DISTRICT_ID: number;
    INFORMER_DISTRICT_ID: number;
    INFORMER_PROVINCE: number;
    INFORMER_POSTCODE_ID: number;
    INFORMER_EMAIL: string;
    INFORMER_TEL: string;
    INSTANCE_ID: string;
    RECORD_STATUS: string;
    DOCUMENT_ID: string;
    CREATE_DATE: Date | string;
}

export interface OnlineCaseParam extends OnlineCaseInfo {
    CASE_CHANNEL: any[];
    CASE_MONEY: any[];
    CASE_INFORMER_SOCIAL: any[];
    FORM_CODE: string;
    FORM_DOCUMENT_ID: string;
}
