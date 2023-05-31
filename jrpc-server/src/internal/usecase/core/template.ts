interface TemplateUsecaseInter {
    Sum(a: number, b: number): number;
}
export class TemplateUsecase implements TemplateUsecaseInter {
    public Sum(a: number, b: number): number {
        return a + b
    }
}