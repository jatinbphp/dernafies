import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage implements OnInit 
{
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
	public ConfirmPasswordType: string = 'password';
	public ConfirmPasswordIcon: string = 'eye-off';
  public accept_tems:boolean=false;
  public registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    cpassword: ['', Validators.required],    
    password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(8)
		])],
    specialized_in: ['', Validators.required],
    service_location: ['', Validators.required],
    pricing: ['', Validators.required],
    },{validator: this.checkIfMatchingPasswords('password', 'cpassword')
  });

  validation_messages = 
  {    
    'first_name': 
    [
      { type: 'required', message: 'First name is required.' }
    ],
    'last_name': 
    [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': 
    [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': 
    [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ],
    'cpassword': 
    [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ],
    'specialized_in': 
    [
      { type: 'required', message: 'Specialized In is required.' }
    ],
    'service_location': 
    [
      { type: 'required', message: 'Specialized In is required.' }
    ],
    'pricing': 
    [
      { type: 'required', message: 'Specialized In is required.' }
    ],
  };

  constructor(public fb: FormBuilder)
  { }

  ngOnInit()
  { }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string)
	{
		return (group: FormGroup) => 
		{
	    let passwordInput = group.controls[passwordKey],passwordConfirmationInput = group.controls[passwordConfirmationKey];
			if (passwordInput.value !== passwordConfirmationInput.value)
			{
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }      
			else
			{
	      return passwordConfirmationInput.setErrors(null);        
	    }
	  }
	}

  hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	hideShowConfirmPassword()
	{
		this.ConfirmPasswordType = this.ConfirmPasswordType === 'text' ? 'password' : 'text';
    this.ConfirmPasswordIcon = this.ConfirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}
}
