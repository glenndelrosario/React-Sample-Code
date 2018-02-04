import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as types from '../../core/constants';
import CustomerInfos from './TabContents/CustomerInfos';
import UserDetails from '../../components/details/customers/UserDetails';
import AccountDetails from '../../components/details/customers/AccountDetails';
import BillingInfo from '../../components/details/customers/BillingInfo';

import AddressForm from '../../components/forms/AddressForm';
import InventoryForm from '../../components/forms/InventoryForm';

import Loading from '../../components/modules/Loading';
import ModalDialog from '../../components/modules/ModalDialog';

//{ fetchCustomerDetails, saveAddress, uploadCSV, unmounting, fetchInventoryDropDownItems }
import * as actions from '../../core/globalActions';
import { getCustomerDetails, addAddress, deleteAddress, addStorageInventory } from '../../core/actions/customerActions';
import { terminateOrder } from '../../core/actions/orderActions';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoForm from 'react-auto-form';

class ViewCustomerProfile extends Component {
	constructor(props){
		super(props);
		this.state = {
     		errors: false,
     		error_title: '',
     		error_text: '',
     		submit_btn: '',
     		values: {},
     		showAddressForm: false,
     		showDeleteAddressForm: false,
     		showInventoryForm: false,
     		showTerminateOrder: false,
     		notif: false,  
     		tabActive: 0,
     		edit_id: null,
     		address_id: null,	
     		successUpload: false,     	
     		hide: false,
     		inventory_filter: null,
     		inventory_status: null,
     		inventory_uom: null,
     		dropdowns: null,
    	};
    	this.addAddress = this.addAddress.bind(this);	
    	this.onHandleClose = this.onHandleClose.bind(this);
    	this.onSubmitAddress = this.onSubmitAddress.bind(this);
    	this.onSubmitDeleteAddress = this.onSubmitDeleteAddress.bind(this);    	
     	this.onUploadCSV = this.onUploadCSV.bind(this);
     	this.onAddInventory = this.onAddInventory.bind(this);
     	this.onSubmitInventory = this.onSubmitInventory.bind(this);
     	this.onDropdownSelect = this.onDropdownSelect.bind(this);
     	this.terminateOrder = this.terminateOrder.bind(this);
     	this.filterInventory = this.filterInventory.bind(this);
     	this.updateInventoryFilter = this.updateInventoryFilter.bind(this);
	}

	componentWillMount(){		
		this.props.dispatch(getCustomerDetails(this.props.params.user_id));	
		this.props.dispatch(actions.fetchCustomerDetailsDropDownItems());
	}

	componentWillUnmount(){ 	
		this.props.dispatch(actions.unmounting());
 	}

 	renderDialog(){  
		let actions = '';
	    if(this.state.errors){
	    	let closeBtn =
		        <FlatButton
		        key="closeBtn"
		        label="OK"
		        secondary={true}       
		        onTouchTap={this.onHandleClose}
		        />;

		    let submitBtn =
		        <RaisedButton
		        key="submitBtn"
		        label={this.state.submit_btn}
		        secondary={true}
		        style={{marginLeft: '10px'}}
		        onTouchTap={this.doDispatchHandle.bind(this)}
		        />;
		    actions = (this.state.notif) ? [closeBtn,submitBtn] : closeBtn;
	      	return (<ModalDialog title={this.state.error_title} message={this.state.error_text} actions={actions} />);
	    }
  	}

	renderBreadcrumbs(){
		return(
			<ol className="breadcrumb-arrow">
			<li><Link to={types.BASE_URL+'customers'}><i className="fa fa-users fa-lg"></i> Customers</Link></li>
			<li className="active"><span> Profile</span></li>
			</ol>
		)
	}
	
	onHandleClose(){
		this.setState({
		 	showAddressForm: false,
		 	showInventoryForm: false,
		 	showTerminateOrder: false,
		 	showDeleteAddressForm: false,
		 	order_id: null,
		 	edit_id: null,
		 	address_id: null,
		});
	}

	/* INVENTORY HANDLERS */
	filterInventory(status){
		//console.log(status.Value);
		//const label = status.Label == 'Clear' ? null : status.Label;
		this.setState({
			inventory_filter: status.Label,
			inventory_status: status.Value,
		});
	}

	onAddInventory(){		
		this.setState({
			showInventoryForm: true,
		});
	}

	onUploadCSV(event){
		const file = event.target.files;			
		this.props.dispatch(actions.uploadCSV(file,this.props.params.user_id));
		this.setState({
			successUpload:true,
			tabActive: 3
		});
	}

	onDropdownSelect(type,data){
		//console.log(data.Value);
		if(type=='status'){
			this.setState({
				inventory_status:data.Value
			});	
		}else if(type=='uom'){
			this.setState({
				inventory_uom:data.Value
			});	
		}
		
	}

	updateInventoryFilter(){
		const { common } = this.props;
		this.setState({ dropdowns: common });
	}

	onSubmitInventory(event,data){
		event.preventDefault();
		data.status = this.state.inventory_status;
		data.uom = this.state.inventory_uom;
		//console.log(data);
		this.setState({
			showAddressForm: false,
			tabActive: 3
		});
		this.props.dispatch(addStorageInventory(this.props.params.user_id,data));
	}

	/* ADDRESS FORM HANDLERS */
	addAddress() {
		this.setState({
			showAddressForm: true,
		});
	}

	onDeleteAddress(id){
		this.setState({
			showDeleteAddressForm: true,
			address_id: id,
		});
	}

	onSubmitDeleteAddress(event){
		event.preventDefault();
		this.props.dispatch(deleteAddress(this.state.address_id,this.props.params.user_id));
		this.setState({
			showDeleteAddressForm: false,
			tabActive: 5,
			address_id: null,
		});
		
	}

	onSubmitAddress(event,data){	
		event.preventDefault();		
		this.setState({
			showAddressForm: false,
			tabActive: 5
		});
		this.props.dispatch(addAddress(this.props.params.user_id,data));
	}

	onTerminateOrder(id){
		this.setState({
			order_id: id,
			showTerminateOrder: true,
		});
	}

	terminateOrder(){		
		this.props.dispatch(terminateOrder(this.state.order_id,this.props.params.user_id));
		this.setState({
			showTerminateOrder: false
		});
	}

	render() {		
		const { users, others, common } = this.props;
		if(users.fulfilled && !users.isLoading){
		//console.log(users);
		const UserDetailsProps = {
			first_name: users.data.User_Details.firstName,
			last_name: users.data.User_Details.lastName,
			contact: users.data.User_Details.Contact,
			designation: users.data.User_Details.Designation,
			email: users.data.User_Details.Email,
			company_name: users.data.User_Details.Company_Name,
			User_ID: users.data.User_Details.User_ID,
			created_where: users.data.User_Details.created_where
		} 
		const AccountDetailsProps = {
			status: users.data.Account_Details.Status,
			sign_up_date: users.data.Account_Details.Signup_Date,
			user_type: users.data.Account_Details.User_Type,
			account_manager: users.data.Account_Details.Account_Manager,
			view_type: users.data.Account_Details.view_type,
			password: users.data.Account_Details.Password,
		}
		const BillingInfoProps = {
			billing_cycle_start: users.data.Billing_Info.Billing_Cycle_Start,
			payment_mode: users.data.Billing_Info.Payment_Method,
			payment_id: users.data.Billing_Info.payment_id,
			outstanding_amount: users.data.Billing_Info.outstanding_amount,			
			auto_collect: users.data.Billing_Info.Auto_Collect,
			building_name: users.data.Billing_Info.Building_Name,
			street_name: users.data.Billing_Info.Street_Name,
			unit_no: users.data.Billing_Info.Unit_No,
			postal_code: users.data.Billing_Info.Postal_Code,
			billing_address: users.data.Billing_Info.billing_address,
		}
		const CustomerInfosProps = {
			subscriptions: users.data.subscriptions,
			onTerminateOrder: this.onTerminateOrder.bind(this),
			orders: users.data.orders,
			deliveries: users.data.deliveries,
			inventory: users.data.inventory,
			Invoices: users.data.Invoices,
			addresses: users.data.addresses,
			addAddress: this.addAddress,
			onDeleteAddress: this.onDeleteAddress.bind(this),	
			initialSelected: this.state.tabActive,			
			onUploadCSV: this.onUploadCSV,
			onAddInventory: this.onAddInventory,
			filterInventory: this.filterInventory,
			updateInventoryFilter: this.updateInventoryFilter,
			inventory_filter: this.state.inventory_filter,
			inventory_status: this.state.inventory_status,			
			dropdowns: (this.state.dropdowns) ? this.state.dropdowns : common
		}

		const successMsg = <div className="alert alert-success">
		<i className="fa fa-check-circle-o fa-2x" aria-hidden="true"></i> CSV Upload Successfully!</div>;
		const errorMsg = <div className="alert alert-danger">
		<i className="fa fa-times fa-2x" aria-hidden="true"></i> An error had occurred while uploading!</div>;

		let alert = '';
		if(others.error && others.fulfilled && this.state.successUpload){
			alert = errorMsg;
		}else if(others.fulfilled && others.data=='success' && this.state.successUpload){
			alert = successMsg;
		}

		const AddressIcon = <div className="dialogFormTitle">
		<i className={'fa fa-2x '+types.AddressIcon}></i> {(this.state.edit_id) ? 'Edit Address' : 'Add New Address'}
		</div>;

		const InventoryIcon = <div className="dialogFormTitle">
		<i className={'fa fa-2x '+types.InventoryIcon}></i> {(this.state.edit_id) ? 'Edit Inventory Item' : 'Add New Inventory Item'}
		</div>;
		
		const TerminateOrderIcon = <div className="dialogFormTitle error-dialog">
		<i className={'fa fa-2x '+types.OrdersIcon}></i> Terminate Order
		</div>;

		const DeleteAddressIcon = <div className="dialogFormTitle">
		<i className={'fa fa-2x '+types.AddressIcon}></i> Delete Address
		</div>;

		const addUserActions = [
		<FlatButton
		label="Cancel"
		primary={true}
		onTouchTap={this.onHandleClose}
		/>,
		<RaisedButton
		label="Save"
		secondary={true}        
		onTouchTap={this.onHandleClose}
		/>,
		];

		const terminateOrderActions = [
		<FlatButton
		label="Cancel"
		primary={true}
		onTouchTap={this.onHandleClose}
		/>,
		<RaisedButton
		label="Terminate Order"
		secondary={true}        
		onTouchTap={this.terminateOrder}
		/>,
		];

		const deleteAddressActions = [
		<FlatButton
		label="Cancel"
		primary={true}
		onTouchTap={this.onHandleClose}
		/>,
		<RaisedButton
		label="Delete Address"
		secondary={true}        
		onTouchTap={this.onSubmitDeleteAddress}
		/>,
		];

		
		return(
			<section>
			{this.renderBreadcrumbs()}
				<div className="mui-col-sm-4 no-padding-lr">
				<div className="module-title bg-purple">
						<div className="mui--pull-left">User Details</div>
						<div className="mui--pull-right">
						<Link to={types.BASE_URL+'customers/edit/user_details/'+users.data.User_Details.User_ID}><i className="fa fa-pencil"></i> edit &nbsp;</Link>
						</div>
					</div>				
					<UserDetails { ...UserDetailsProps } />
				</div>
								
				<div className="mui-col-sm-4">
					<div className="module-title bg-green">
						<div className="mui--pull-left">Account Details</div>
						<div className="mui--pull-right">
							<Link to={types.BASE_URL+'customers/edit/user_details/'+users.data.User_Details.User_ID}><i className="fa fa-pencil"></i> edit &nbsp;</Link>
						</div>
					</div>

					<AccountDetails { ...AccountDetailsProps } />
				</div>
				<div className="mui-col-sm-4 no-padding-lr">
				<div className="module-title bg-orange">Billing Info</div>
					<BillingInfo { ...BillingInfoProps } />
				</div>

				<div className="mui--clearfix"></div>
					{ alert }
					<CustomerInfos { ...CustomerInfosProps } />
					<Dialog
			          title={InventoryIcon}
			          modal={true}
			          open={this.state.showInventoryForm}
			          onRequestClose={this.onHandleClose}
			          autoScrollBodyContent={true}			          
			        >	
			        <AutoForm onSubmit={this.onSubmitInventory} trimOnSubmit>
			        	<InventoryForm 
			        	dropdowns={common} 
			        	onClose={this.onHandleClose} 
			        	onSelect={this.onDropdownSelect}  
			        	filter={this.filterInventory}
			        	/>
			        </AutoForm>
			        </Dialog>

					<Dialog
					title={AddressIcon}
					modal={true}
					open={this.state.showAddressForm}
					onRequestClose={this.onHandleClose}
					>	
					<AutoForm onSubmit={this.onSubmitAddress} trimOnSubmit>
					<AddressForm 
					show_form={true} 
					onClose={this.onHandleClose} 
					edit_id={this.state.edit_id}
					/>
					<input type="hidden" name="mode" value={'add'} />
					</AutoForm>
					</Dialog>

					<Dialog
					title={TerminateOrderIcon}
					modal={false}
					open={this.state.showTerminateOrder}
					onRequestClose={this.onHandleClose}
					actions={terminateOrderActions}
					>	
					<AutoForm onSubmit={this.onSubmitAddress} trimOnSubmit>
					<p>You're about to terminate this subscription. Do you wish to continue?</p>
						<input type="hidden" name="order_id" value={this.state.order_id} />
					</AutoForm>
					</Dialog>

					<Dialog
					title={DeleteAddressIcon}
					modal={false}
					open={this.state.showDeleteAddressForm}
					onRequestClose={this.onHandleClose}
					actions={deleteAddressActions}
					>
					<br />						
					<p>You're about to delete this address. Do you wish to continue?</p>
						<input type="hidden" name="add_id" value={this.state.address_id} />					
					</Dialog>

					{this.renderDialog()}
			</section>
		)
		}
		return <Loading size={1} position="mui--text-center" />
	}
}

function mapStateToProps(state) {	
	return {
		users: state.users,
		others: state.others,
		common: state.common
	};
}

ViewCustomerProfile.propTypes = {
	errors: PropTypes.object,
	dispatch: PropTypes.func,
	params: PropTypes.object,    
	users: PropTypes.object,
	others: PropTypes.object,
	common: PropTypes.object,
};

export default connect(mapStateToProps)(ViewCustomerProfile); // state = null