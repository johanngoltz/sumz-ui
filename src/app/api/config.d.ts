export interface RemoteConfig {
    scenarioConfig: Map<number, ScenarioConfig>;
}

interface ScenarioConfig {
    showResult: {
        cvd: boolean,
        apv: boolean,
        fcf: boolean,
        fte: boolean
    }
}