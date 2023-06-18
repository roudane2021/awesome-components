import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { ComplexFormService } from '../../services/complex-form.service';
import { validValidator } from '../../validators/valid.validator';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit{

  loading = false;
  mainForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  phoneCtrl!: FormControl;

  personalInfoForm!: FormGroup;
  firstCtrl!: FormControl;
  lastCtrl!: FormControl;

  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;

  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!:Observable<Boolean>;
  showPhoneCtrl$!:Observable<Boolean>;

  showEmailError$!:Observable<Boolean>;
  showPasswordError$!:Observable<Boolean>;


  constructor(private formBuild: FormBuilder, private complexFormService : ComplexFormService) {

  }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
  }

  private initMainForm() {
    this.mainForm = this.formBuild.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
  });
  }
  private initFormControls(): void {
    this.firstCtrl = this.formBuild.control('',[Validators.required]);
    this.lastCtrl = this.formBuild.control('',[Validators.required]);
    this.personalInfoForm = this.formBuild.group({
      firstName: this.firstCtrl,
      lastName: this.lastCtrl,
    });
    this.contactPreferenceCtrl = this.formBuild.control('email');
    this.phoneCtrl = this.formBuild.control('',[Validators.required,Validators.maxLength(10)]);
    this.emailCtrl = this.formBuild.control('',[Validators.required,Validators.email]);
    this.confirmEmailCtrl = this.formBuild.control('',[Validators.required,Validators.email]);
    this.emailForm = this.formBuild.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl
  }, {
      validators: [confirmEqualValidator('email', 'confirm')],
      updateOn: 'blur'
  });
    this.passwordCtrl = this.formBuild.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuild.control('', Validators.required);
    this.loginInfoForm = this.formBuild.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
  }, {
      validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
  });
  }

  initFormObservables() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'email'),
      tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'phone'),
      tap(showPhoneCtrl => this.setPhoneValidators(showPhoneCtrl)),
    );

    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID' && this.emailCtrl.value && this.confirmEmailCtrl.value)
    );
    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(status => status === 'INVALID' && this.passwordCtrl.value && this.confirmPasswordCtrl.value)
    );

  }

  private setPhoneValidators(showPhoneCtrl: boolean) {
    if (showPhoneCtrl) {
      this.phoneCtrl.addValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)])
     }else {
      this.phoneCtrl.clearValidators();
     }
     this.phoneCtrl.updateValueAndValidity();

  }

  private setEmailValidators(showEmailCtrl: boolean) {
    if (showEmailCtrl) {
      this.emailCtrl.addValidators([Validators.required, Validators.email])
      this.confirmEmailCtrl.addValidators([Validators.required, Validators.email])
     }else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
     }
     this.emailCtrl.updateValueAndValidity();
     this.confirmEmailCtrl.updateValueAndValidity();

  }

  onSubmitForm() {
    this.loading = true;
    this.complexFormService.saveUserInfo(this.mainForm.value).pipe(
      tap(saved => {
          this.loading = false;
          if (saved) {
            this.resetForm();
            } else {
            console.error('Echec de l\'enregistrement');
        }
        
      })
  ).subscribe();
  }

  private resetForm() {
    this.mainForm.reset();
    this.contactPreferenceCtrl.patchValue('email');
}

  getFormControlErrorText(ctrl : AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
  } else if (ctrl.hasError('email')) {
      return 'Merci d\'entrer une adresse mail valide';
  } else if (ctrl.hasError('minlength')) {
      return 'Ce numéro de téléphone ne contient pas assez de chiffres';
  } else if (ctrl.hasError('maxlength')) {
      return 'Ce numéro de téléphone contient trop de chiffres';
  }else if (ctrl.hasError('validValidator')) {
    return 'Ce texte ne contient pas le mot VALID';
} else {
      return 'Ce champ contient une erreur';
  }
  }

}
