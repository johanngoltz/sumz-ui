export class Project {
    id: number;
    name: string;
    description: string;
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
    name: string;
    data: ParameterValue[];
    result: number
}

export class Parameter {
    id: number;
    name: string;
    description: string;
}

export class ParameterValue {
    parameterId: number;
    scenarioId: number;
    value: number;
}