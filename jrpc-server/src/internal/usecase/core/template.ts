interface TemplateUsecaseInter {
    sum(a: number, b: number): number;
}

export class TemplateUsecase implements TemplateUsecaseInter {
    sum(a: number, b: number): number {
        return a + b
    }
}