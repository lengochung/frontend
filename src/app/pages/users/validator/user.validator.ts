import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BaseValidatorComponent } from '../../../core/includes/base.validator.component';
import { UserRoleEntity } from '../../../core/entities';
export class UserValidator extends BaseValidatorComponent {
    public readonly NAME_ML = 60;
    public readonly EMPLOYEE_NO_ML = 30;
    public readonly AFFILIATION_ML = 96;
    public readonly POSITION_ML = 96;
    public readonly EMAIL_ML = 255;

    /**
     * @description Get the validation rules that apply to the request.
     * @return {FormGroup} update user form
     */
    public createRules(): FormGroup {
        return new FormGroup({
            user_last_name: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(this.NAME_ML)]),
            user_first_name: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(this.NAME_ML)]),
            employee_no: new FormControl<string | null>(null, [
                Validators.required,
                this.checkAlphanumeric,
                Validators.maxLength(this.EMPLOYEE_NO_ML),
            ]),
            affiliation: new FormControl<string | null>(null, [Validators.maxLength(this.AFFILIATION_ML)]),
            position: new FormControl<string | null>(null, [Validators.maxLength(this.POSITION_ML)]),
            mail: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(this.EMAIL_ML), this.checkEmail]),
            role_list: new FormArray([]),
        });
    }

    /**
     * @description Get the error message for the defined validation rules.
     * @return {object} error messages
     */
    public createErrorMessages(): { [key: string]: any } {
        const last_name = this.translate.instant('label.last_name') as string;
        const first_name = this.translate.instant('label.first_name') as string;
        const employee_no = this.translate.instant('label.employee_no') as string;
        const affiliation = this.translate.instant('label.affiliation') as string;
        const position = this.translate.instant('label.position') as string;
        const email = this.translate.instant('label.email') as string;
        const role = this.translate.instant('label.permission') as string;

        return {
            user_last_name: {
                required: this.translate.instant('validation.required', {
                    field: last_name,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: last_name,
                    number: this.NAME_ML,
                }) as string,
            },
            user_first_name: {
                required: this.translate.instant('validation.required', {
                    field: first_name,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: first_name,
                    number: this.NAME_ML,
                }) as string,
            },
            employee_no: {
                required: this.translate.instant('validation.required', {
                    field: employee_no,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: employee_no,
                    number: this.EMPLOYEE_NO_ML,
                }) as string,
                alphanumeric: this.translate.instant('validation.invalid_alphanumeric', {
                    field: employee_no,
                }) as string,
            },
            affiliation: {
                required: this.translate.instant('validation.required', {
                    field: affiliation,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: affiliation,
                    number: this.AFFILIATION_ML,
                }) as string,
            },
            position: {
                required: this.translate.instant('validation.required', {
                    field: position,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: position,
                    number: this.POSITION_ML,
                }) as string,
            },
            mail: {
                required: this.translate.instant('validation.required', {
                    field: email,
                }) as string,
                invalid_email: this.translate.instant('validation.email', {
                    field: email,
                }) as string,
                maxlength: this.translate.instant('validation.maxlength', {
                    field: email,
                    number: this.EMAIL_ML,
                }) as string,
            },
            role_id: {
                required: this.translate.instant('validation.required', {
                    field: role,
                }) as string,
            },
        };
    }

    /**
     * @param {UserRoleEntity} role UserRoleEntity
     * @return {FormGroup} form
     */
    public createRoleRules(role?: UserRoleEntity): FormGroup {
        return new FormGroup({
            office_subname: new FormControl<string | null>(role?.office_subname ?? null, []),
            role_id: new FormControl<number | null>(role?.role_id ?? null, []),
            office_id: new FormControl<number | null>(role?.office_id ?? null, []),
        });
    }
}
