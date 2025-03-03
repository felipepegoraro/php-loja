export default class Utils {
    public static formatPrice = (price: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    public static convertData = (utcDate: string) => {
        const IDIOMA = navigator.language;
        const FUSOHORARIO = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return new Date(utcDate + "Z").toLocaleString(IDIOMA, {timeZone: FUSOHORARIO});
    }

    public static LOG = (output: string) => {
        const endpoint = process.env.REACT_APP_ENDPOINT as string;
        if (endpoint.includes("localhost")) console.log(output);
    }
}
