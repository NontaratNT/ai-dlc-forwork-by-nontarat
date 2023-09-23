export const environment = {
    production: true,
    baseUrl: 'https://thaipoliceonline.com/',
    config: {
        baseConfig: {
            apiUrl: "https://thaipoliceapimgmt.azure-api.net/ccibazure/api",
            reportUrl: "https://officer.thaipoliceonline.com/web-report/",
            resourceUrl: "https://thaipoliceapimgmt.azure-api.net/eformazure/api/resource/",
            hubUrl: "https://police-online-noti-azure.azurewebsites.net/hub"
        },
        eFormHost: "https://thaipoliceapimgmt.azure-api.net/eformazure/api",
        recaptcha: {
            siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
            secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
        }
    }
};
