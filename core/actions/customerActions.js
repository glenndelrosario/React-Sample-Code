import axios from 'axios';
import * as types from '../constants';
import { push } from 'react-router-redux';

const ROOT_URL = types.ROOT_URL;
const instance = axios.create(axios.defaults);
instance.defaults.headers.common['RGF-API-KEY'] = types.API_KEY;

//Get Address Details
export function getAddressDetails(add_id){

	return function(dispatch) {
		dispatch({type: types.FETCH_USERS_START});
		instance.post(ROOT_URL,{		 			   	
			action : 'new_customers_getAddressDetails',
			add_id: add_id,			
		})
		.then((response) => {			
			if(response.data.meta.code==100){
				dispatch({type: types.FETCH_USERS_SUCCESS, payload: response.data.data});
			}else{	        	
				dispatch({type: types.FETCH_USERS_FAILURE, payload: response.data.meta.error_message});				
			}
		})
		.catch((err) => {	      	
			dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err})			
		})
	}
}

export function saveAddress(add_id=0,data,user_id){
	return function(dispatch) {
	dispatch({type: types.SAVING_CUSTOMER_DATA});
	instance.post(ROOT_URL,{		 			   	
		action : 'new_customers_saveAddress',
		data: data,
		add_id: add_id,
		user_id: user_id
	})
	.then((response) => {
		console.log('API: customers_saveAddress');
		if(response.data.meta.code==100){
			dispatch(push(types.BASE_URL+'customers/'+response.data.data));	
			//dispatch({type: types.SAVING_CUSTOMER_DATA_SUCCESS});
		}
	})
	.catch((err) => {
		dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err});
	})
	}	
}

export function cancel(uid){
	return function(dispatch) {
		dispatch({type: types.SAVING_CUSTOMER_DATA});
		dispatch(push(types.BASE_URL+'customers/'+uid));
	}
}

export function deleteAddress(add_id,user_id){
	return function(dispatch) {
	dispatch({type: types.SAVING_CUSTOMER_DATA});
	instance.post(ROOT_URL,{		 			   	
		action : 'new_customers_deleteAddress',		
		add_id: add_id,
		user_id: user_id
	})
	.then((response) => {
		console.log('API: customers_deleteAddress');
		if(response.data.meta.code==100){
			dispatch(getCustomerDetails(user_id));			
		}
	})
	.catch((err) => {
		dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err});
	})
	}	
}

// ADD NEW CUSTOMER IN SPACE X
export function addCustomer(data){

	return function(dispatch) {
		dispatch({type: types.SAVING_CUSTOMER_DATA});
		instance.post(ROOT_URL,{		 			   	
			action : 'new_customers_addCustomer',
			data: data,			
		})
		.then((response) => {
			console.log('API: new_customers_addCustomer');
			if(response.data.meta.code==100){
				//dispatch({type: types.SAVING_CUSTOMER_DATA_SUCCESS, payload: response.data.data});
				//dispatch(getCustomerDetails(response.data.data));
				dispatch(push(types.BASE_URL+'customers/'+response.data.data));												
			}else{	        	
				dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: response.data.meta.error_message});				
			}
		})
		.catch((err) => {	      	
			dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err})			
		})
	}
}

// Send Reset Email
export function sendResetEmail(user_id){
	return function(dispatch) {
			dispatch({type: types.ON_THE_SPOT_START});
			instance.post(ROOT_URL,{		 			   	
			action : 'new_customers_sendResetEmail',			
			user_id: user_id
		})
		.then((response) => {
			console.log('API: customers_checkEmailExists');
			if(response.data.meta.code==100){
				alert('Set /Reset Password Email Successfully sent!')
			}
		})
		.catch((err) => {	      	
			dispatch({type: types.ON_THE_SPOT_FAILURE, payload: err});
		})
	}	
}
export function editCustomer(data,user_id){

	return function(dispatch) {
		dispatch({type: types.SAVING_CUSTOMER_DATA});
		instance.post(ROOT_URL,{		 			   	
			action : 'new_customers_updateCustomerDetails',
			data: data,
			user_id: user_id
		})
		.then((response) => {
			console.log('API: customers_updateCustomerDetails');
			if(response.data.meta.code==100){
				//dispatch({type: types.SAVING_CUSTOMER_DATA_SUCCESS, payload: response.data.data});				
				dispatch(push(types.BASE_URL+'customers/'+response.data.data));												
			}else{	        	
				dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: response.data.meta.error_message});				
			}
		})
		.catch((err) => {	      	
			dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err})			
		})
	}
}

// Get all customer records
export function getAllCustomers(search='',filter=null,current_page='0'){
	return function(dispatch) {
		dispatch({type: types.FETCH_USERS_START})
		instance.post(ROOT_URL, {		 			   	
				action : 'new_customers_getAllCustomers',
				current_page: current_page,
				filter: filter,
				search: search,
				iSortCol_0: ''        
	})
	.then((response) => {
		console.log('API: customers_getAllCustomers');
		dispatch({type: types.FETCH_USERS_SUCCESS, payload: response.data})
	})
	.catch((err) => {
		dispatch({type: types.FETCH_USERS_FAILURE, payload: err})
	})
	}	
}

// Get details of a specific customer

export function getCustomerDetails(user_id){
	return function(dispatch) {
			dispatch({type: types.FETCH_USERS_START});
			instance.post(ROOT_URL,{		 			   	
			action : 'new_customers_getCustomerDetails',
			user_id: user_id			  
		})
		.then((response) => {
			console.log('API: customers_getCustomerDetails');
			if(response.data.meta.code==100){
				dispatch({type: types.FETCH_USERS_SUCCESS, payload: response.data.data});						
			}else{	        	
				dispatch({type: types.FETCH_USERS_FAILURE, payload: response.data.meta.error_message});
			}
		})
		.catch((err) => {	      	
			dispatch({type: types.FETCH_USERS_FAILURE, payload: err});
		})
	}	
}

// Check if email already exist in ss_user db table
export function checkEmailExists(email){
	return function(dispatch) {
			dispatch({type: types.ON_THE_SPOT_START});
			instance.post(ROOT_URL,{		 			   	
			action : 'new_customers_checkEmailExists',			
			email: email
		})
		.then((response) => {
			console.log('API: customers_checkEmailExists');
			if(response.data.meta.code==100){
				dispatch({type: types.ON_THE_SPOT_SUCCESS, payload: response.data.data});		
			}
		})
		.catch((err) => {	      	
			dispatch({type: types.ON_THE_SPOT_FAILURE, payload: err});
		})
	}	
}

// Adds a new address for the customer (Billing Address can only be 1 while Shipping can be multiple)
export function addAddress(user_id=0,data){
	return function(dispatch) {
	dispatch({type: types.SAVING_CUSTOMER_DATA});
	instance.post(ROOT_URL,{		 			   	
		action : 'new_customers_addAddress',
		data: data,
		user_id: user_id
	})
	.then((response) => {
		console.log('API: customers_addAddress');
		if(response.data.meta.code==100){
			dispatch(getCustomerDetails(user_id));
			//dispatch({type: types.SAVING_CUSTOMER_DATA_SUCCESS});
		}
	})
	.catch((err) => {
		dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err});
	})
	}	
}

// Add a new storgage item to user
export function addStorageInventory(user_id=0,data){
	return function(dispatch) {
	dispatch({type: types.SAVING_CUSTOMER_DATA});
	instance.post(ROOT_URL,{		 			   	
		action : 'new_customers_addStorageInventory',
		data: data,
		user_id: user_id
	})
	.then((response) => {
		console.log('API: customers_addStorageInventory');
		if(response.data.meta.code==100){
			//dispatch({type: types.UNMOUNTING, payload: '' });
			//dispatch(push(types.BASE_URL+'loading'));
			dispatch(fetchCustomerDetails(user_id));
			dispatch({type: types.SAVING_CUSTOMER_DATA_SUCCESS});
		}
	})
	.catch((err) => {
		dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err});
	})
	}	
}

export function quickAddCustomer(values){
	return function(dispatch) {
		dispatch({type: types.SAVING_CUSTOMER_DATA})
		instance.post(ROOT_URL, {		 			   	
		action : 'new_customers_quickAddCustomer',
		data: values            
	})
	.then((response) => {
		console.log('API: customers_quickAddCustomer');
		if(response.data.meta.code==100){
			dispatch({type: types.SAVING_CUSTOMER_DATA_SUCCESS, payload: response.data.data});
			//dispatch(fetchGetUserDetails(response.data));
			//dispatch(push(types.BASE_URL+'orders/collection/add/'+response.data.data));		
		}
	})
	.catch((err) => {
		dispatch({type: types.SAVING_CUSTOMER_DATA_FAIL, payload: err})
	})
	}	
}
