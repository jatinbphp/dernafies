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
					//this.showMessage(res.message);
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
			let dataToPost = new HttpParams().set("userTypeID",data.user_type).set("firstName",data.first_name).set("lastName", data.last_name).set("email",data.email).set("pwd", data.password).set("provinceID", data.service_province).set("location", data.address).set("latitude", data.latitude).set("longitude", data.longitude).set("categoryID", data.specialized_in).set("districtID", data.service_district).set("cityID", data.service_city).set("rangeServing", data.service_in_km).set("price", data.price_per_hour).set("no_of_experience", data.experience_in_year).set("phoneNumber", data.phone_number);
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

	getHandymanDetailById(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.id);
			this.http.post(this.api_url + "getHandymanDetailById",  dataToPost , headers).subscribe((res: any) =>       
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
			//let dataToPost = new HttpParams().set("user_id",data.user_id).set("firstName",data.first_name).set("lastName",data.last_name);
			let dataToPost = new HttpParams().set("user_id",data.user_id).set("userTypeID",data.user_type).set("firstName",data.first_name).set("lastName", data.last_name).set("email",data.email).set("pwd", data.password).set("provinceID", data.service_province).set("location", data.address).set("latitude", data.latitude).set("longitude", data.longitude).set("categoryID", data.specialized_in).set("districtID", data.service_district).set("cityID", data.service_city).set("rangeServing", data.service_in_km).set("price", data.price_per_hour).set("no_of_experience", data.experience_in_year).set("phoneNumber", data.phone_number);
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

	updateLanguage(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			//let dataToPost = new HttpParams().set("user_id",data.user_id).set("firstName",data.first_name).set("lastName",data.last_name);
			let dataToPost = new HttpParams().set("user_id",data.user_id).set("defaultLanguage",data.language);
			this.http.post(this.api_url + "updateLanguage",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage("Default language updated!!");
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

	getDistricts()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getDistricts",headers).subscribe((res: any) =>       
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

	getProvinces()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getProvinces",headers).subscribe((res: any) =>       
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

	getSubscriptionPlan()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getSubscriptionPlan",headers).subscribe((res: any) =>       
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

	showCitiesBasedOnDistrict(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("districtID",data.districtID);
			this.http.post(this.api_url + "getCities",  dataToPost , headers).subscribe((res: any) =>       
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

	getActivehandyman(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("categoryID",data.categoryID).set("latitude",data.latitude).set("longitude",data.longitude);
			this.http.post(this.api_url + "getActivehandyman",  dataToPost , headers).subscribe((res: any) =>       
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
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getFeaturedHandyman(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("categoryID",data.categoryID).set("latitude",data.latitude).set("longitude",data.longitude);
			this.http.post(this.api_url + "getFeaturedHandyman",  dataToPost , headers).subscribe((res: any) =>       
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
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getJobRequestsForHandyMan(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("userID",data.user_id).set("userTypeID",data.user_type);
			this.http.post(this.api_url + "getRequestedJobs",  dataToPost , headers).subscribe((res: any) =>       
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
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	BookMyJob(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("userID",data.user_id).set("assignedTrademan",data.handyman_id).set("categoryID",data.handyman_category_id).set("description",data.job_description).set("latitude",data.latitude).set("longitude",data.longitude).set("jobAddress",data.address);
			this.http.post(this.api_url + "addJob",  dataToPost , headers).subscribe((res: any) =>       
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

	UpdateJobStatus(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("jobID",data.job_id).set("jobStatusID",data.status_to_update);
			this.http.post(this.api_url + "updateJobStatus",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updateFirebaseMessageId(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("jobID",data.job_id).set("firebase_id",data.firebase_id);
			this.http.post(this.api_url + "updateFirebaseMessageId",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	addReviewAndRating(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("jobID",data.job_id).set("review",data.handyman_rating).set("reviewText",data.handyman_review);
			this.http.post(this.api_url + "insertJobReview",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	reviewEmailNotification(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("jobID",data.job_id);
			this.http.post(this.api_url + "reviewEmailNotification",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getJobDetailById(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("jobID",data.job_id);
			this.http.post(this.api_url + "getJobDetailById",  dataToPost , headers).subscribe((res: any) =>       
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
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updateJobCompleted(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("jobID",data.job_id).set("paid",data.payment_status).set("paymentNote",data.payment_note).set("hours",data.job_time_taken_to_complete);
			this.http.post(this.api_url + "updateJobCompleted",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	scheduleJob(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("jobID",data.job_id).set("scheduledDate",data.schedule_to_date).set("scheduledBy",data.schedule_by);
			this.http.post(this.api_url + "scheduleJob",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	searchHandyman(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("latitude",data.latitude).set("longitude",data.longitude).set("categoryID",data.category_id).set("keyword",data.keyword).set("experience",data.experience).set("price_range",data.price_range).set("reviews",data.reviews);
			this.http.post(this.api_url + "searchHandyman",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
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
