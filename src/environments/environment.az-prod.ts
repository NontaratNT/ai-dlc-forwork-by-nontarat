export const environment = {
    production: true,
    baseUrl: 'https://calm-desert-0e0968700.3.azurestaticapps.net/',
    config: {
        baseConfig: {
            apiUrl: "https://thaipoliceapimgmt.azure-api.net/ccibazure/api",
            reportUrl: "http://192.168.10.70/web-report/",
            resourceUrl: "https://thaipoliceapimgmt.azure-api.net/ccibazure/api/resource",
            hubUrl: "http://192.168.10.73/hub"
        },
        eFormHost: "https://thaipoliceapimgmt.azure-api.net/eformazure/api",
        recaptcha: {
            siteKey: "6LeV1vQcAAAAAAUKdpLxVXjB9OLYR7ddI3sDmP0P",
            secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
        }
    }
};
