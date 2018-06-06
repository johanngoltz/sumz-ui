interface Equatable {
    pkEquals(other: Equatable): boolean;
}

export class Project implements Equatable {
    id: number;
    name: string;
    description: string;
    iterations: number;
    baseYear: number;
    prognosisLength: number;
    deterministic: boolean;
    algorithm: string;
    timeSeries: FinancialData[];

    pkEquals(other: Equatable): boolean {
        const otherProject = other as Project;
        return otherProject !== null && otherProject.id === this.id;
    }
}

export class FinancialData {
    projectId: number;
    year: number;
    externalCapital: number;
    fcf: number;
}

export class Scenario {
    id: number;
    projectId: number;
    equityInterest: number;
    outsideCapitalInterest: number;
    businessTax: number;
    result: object;
    isActive: boolean;
}
