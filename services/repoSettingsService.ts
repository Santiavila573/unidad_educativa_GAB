const STORAGE_KEY = 'ue_repo_settings';

export interface RepoSettings {
    categories: string[];
    levels: string[];
    areas: string[];
}

const DEFAULT_SETTINGS: RepoSettings = {
    categories: ['Planificación', 'Informe', 'Acta', 'Guía', 'Oficial'],
    levels: ['EGB', 'BGU', 'Inicial'],
    areas: ['Matemáticas', 'Lengua y Literatura', 'Ciencias Naturales', 'Ciencias Sociales', 'Inglés', 'Educación Física', 'ECA']
};

export const RepoSettingsService = {
    getSettings: (): RepoSettings => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    },

    saveSettings: (settings: RepoSettings) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    },

    updateCategories: (categories: string[]) => {
        const settings = RepoSettingsService.getSettings();
        RepoSettingsService.saveSettings({ ...settings, categories });
    },

    updateLevels: (levels: string[]) => {
        const settings = RepoSettingsService.getSettings();
        RepoSettingsService.saveSettings({ ...settings, levels });
    },

    updateAreas: (areas: string[]) => {
        const settings = RepoSettingsService.getSettings();
        RepoSettingsService.saveSettings({ ...settings, areas });
    }
};
