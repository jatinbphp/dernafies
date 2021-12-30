import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs'; 
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class ClientService 
{
	public site_url: string ="https://dernafies.ecnetsolutions.dev/";
	public api_url: string = "https://dernafies.ecnetsolutions.dev/api/";
	public serverResponse: any=[];
	public token:string = '';
	private default_language_json = '../assets/language_default/language_default.json';
	public default_language_data: any = [];
	public language_selected = '';
	public rtl_or_ltr = '';
	private SubjectDefaultLanguage = new Subject<any>();//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
	private SubjectOnSignIn = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN

	constructor(public http: HttpClient, public router: Router, private alertCtrl: AlertController)
	{ 
		this.language_selected = localStorage.getItem('default_language');
		this.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
		this.rtl_or_ltr = (this.language_selected == 'arabic') ? 'rtl' : 'ltr';

		if(this.language_selected == null || this.language_selected == undefined || this.language_selected == '')
		{
			this.language_selected = 'english';
		}
	}

	publishSomeDataOnLanguageChange(data: any) {
        this.SubjectDefaultLanguage.next(data);
    }//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE

    getObservableOnLanguageChange(): Subject<any> {
        return this.SubjectDefaultLanguage;
	}//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE

	publishSomeDataOnSignIn(data: any) {
        this.SubjectOnSignIn.next(data);
    }//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN

    getObservableOnSignIn(): Subject<any> {
        return this.SubjectOnSignIn;
	}//THIS OBSERVABLE IS USED TO KNOW IS ANY HAS SIGNIN

  	getHeaderOptions(): any 
	{	
		this.token=localStorage.getItem('token');
		var headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Accept','application/json');
		return { headers }	    
	}

	getHeaderOptionsWithToken(): any 
	{	
		this.token=localStorage.getItem('token');
		var headers = new HttpHeaders().set('Authorization',`${this.token}`).set('Content-Type','application/x-www-form-urlencoded').set('Accept','application/json');
		return { headers }	    
	}

  	getLanguageDefault()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.default_language_json,headers).subscribe((res: any) =>       
			{   
				this.default_language_data=res;
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	makeMeLoggedin(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("email",data.username).set("pwd", data.password);
			this.http.post(this.api_url + "login",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					this.serverResponse=res;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	makeMeRegistered(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("firstName",data.first_name).set("lastName", data.last_name).set("email",data.email).set("pwd", data.password);
			this.http.post(this.api_url + "register",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					resolve(res);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	resetMyPassword(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("email",data.username);
			this.http.post(this.api_url + "resetPassword",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					this.serverResponse=res;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getUserDetailById(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id);
			this.http.post(this.api_url + "getUserDetailById",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.serverResponse=res.data;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updateProfile(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id).set("firstName",data.first_name).set("lastName",data.last_name);
			this.http.post(this.api_url + "updateProfile",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage("Profile updated!!");
					this.serverResponse=res.data;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getCategories()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getCategories",headers).subscribe((res: any) =>       
			{   
				resolve(res.data);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

  	getErrorMessage(err)
	{	
		if(err.error == null)
		{
			return err.message;
		}
		else if(err.error.message)
		{
			return err.error.message;
		} 
		else 
		{
			return err.error.status;
		}
	}
	
	async showMessage(message)
	{
		if(message == 'Token not valid') 
		{
			//localStorage.clear();
			localStorage.removeItem('token');
			localStorage.removeItem('id');
			localStorage.removeItem('email');
			localStorage.removeItem('userTypeID');
			localStorage.removeItem('firstName');
			localStorage.removeItem('lastName');
			localStorage.removeItem('role');
		    this.router.navigate(['sign-in']);
		}
		else
		{
			const alert = await this.alertCtrl.create(
			{
				header: 'DERNAFIES',
				message: message,
				buttons: 
				[
					{
						text: 'Okay',
						handler: () => 
						{
							//console.log('Confirm Cancel: blah');
						}
					}
				]
			});
			await alert.present();		
		}
	}
}
