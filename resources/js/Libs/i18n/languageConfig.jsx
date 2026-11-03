export class LanguageService {
    static getLanguages() {
        return [
            { code: 'tr', label: 'Türkçe', flag: '/media/flags/tr.svg' },
            { code: 'en', label: 'English', flag: '/media/flags/us.svg' }
        ];
    }

    static getLanguageByCode(code) {
        return this.getLanguages().find(lang => lang.code === code);
    }

    static getDefaultLanguage() {
        return this.getLanguages()[0];
    }

    static isValidLanguage(code) {
        return this.getLanguages().some(lang => lang.code === code);
    }
}
