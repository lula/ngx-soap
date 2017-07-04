declare module CalculatorWS {
	export interface Input {
		intA?: string;
		intB?: string;
	}

	export interface Output {
		AddResult?: string;
	}

	export interface Add {
		input?: Input;
		output?: Output;
	}

	export interface Input {
		intA?: string;
		intB?: string;
	}

	export interface Output {
		SubtractResult?: string;
	}

	export interface Subtract {
		input?: Input;
		output?: Output;
	}

	export interface Input {
		intA?: string;
		intB?: string;
	}

	export interface Output {
		MultiplyResult?: string;
	}

	export interface Multiply {
		input?: Input;
		output?: Output;
	}

	export interface Input {
		intA?: string;
		intB?: string;
	}

	export interface Output {
		DivideResult?: string;
	}

	export interface Divide {
		input?: Input;
		output?: Output;
	}

	export interface CalculatorSoap {
		Add?: Add;
		Subtract?: Subtract;
		Multiply?: Multiply;
		Divide?: Divide;
	}

	export interface Calculator {
		CalculatorSoap?: CalculatorSoap;
		Add: {
			input: {
				intA: number
				intB: number
			}
			output: {
				AddResult: number
			}
		}
		Subtract: {
			input: {
				intA: number
				intB: number
			}
			output: {
				SubtractResult: number
			}
		}
		Multiply: {
			input: {
				intA: number
				intB: number
			}
			output: {
				MultiplyResult: number
			}
		}
		Divide: {
			input: {
				intA: number
				intB: number
			}
			output: {
				DivideResult: number
			}
		}
	}

	export interface Calculatorwsdl {
		Calculator?: Calculator;
	}
}
