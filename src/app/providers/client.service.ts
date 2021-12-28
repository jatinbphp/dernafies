import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'; 
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class ClientService 
{
	public site_url: string ="https://eazierapp.co.za/";
	public api_url: string = "https://eazierapp.co.za/newwebportal/api/";
	public token:string = '';
	private default_language_json = '../assets/language_default/language_default.json';
	public default_language_data: any = [];
	public language_selected = '';
	private SubjectDefaultLanguage = new Subject<any>();//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE

	constructor(public http: HttpClient, public router: Router, private alertCtrl: AlertController)
	{ 
		this.getObservableOnLanguageChange().subscribe((data) => {
			this.language_selected = data.language_selected;
			console.log('Data received', data);
		});//THIS OBSERVABLE IS USED TO SET DEFAULT OR SELECTED LANGUAGE
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

  	getHeaderOptions(): any 
	{	
		this.token=localStorage.getItem('token');
		var headers = new HttpHeaders().set('Authorization',`${this.token}`).set('Accept','application/json');
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
			localStorage.clear();
		    this.router.navigate(['/login']);
		}
		else
		{
			const alert = await this.alertCtrl.create(
			{
				header: 'The Haydari Project',
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
