import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { unmounting } from '../../core/globalActions';
import { addCustomer, checkEmailExists } from '../../core/actions/customerActions';
import { getCustomerDropdownItems } from '../../core/actions/dropdownActions';
import * as constants from '../../core/constants';

import Loading from '../../components/modules/Loading';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import UserForm from '../../components/forms/customers/UserForm';


import AutoForm from 'react-auto-form';

class AddCustomer extends Component {

 constructor(props){
	super(props);
	this.state = {
		AMValue: 0,
		SourceValue: 0,
		send_email: false,
		secondary: false,
		username: 'Enter Email Address',
		disableSubmit: false,
	}
	this.onToggle = this.onToggle.bind(this);
	this.onToggleSecondary = this.onToggleSecondary.bind(this);
	this.onChangeAM = this.onChangeAM.bind(this);
	this.onCheckEmail = this.onCheckEmail.bind(this);
	this.onUpdateEmail = this.onUpdateEmail.bind(this);
	this.onChangeSource = this.onChangeSource.bind(this);
 }

 componentWillMount(){
 	this.props.dispatch(getCustomerDropdownItems());
 }

 componentWillUnmount(){ 	
	this.props.dispatch(unmounting());
	this.props.dispatch({type: 'UNMOUNT_OTHERS'});
 }
 
 onToggle(){
	this.setState({
		send_email: !this.state.send_email,			
	});
 }

 onToggleSecondary(){
	this.setState({
		secondary: !this.state.secondary,			
	});
 }

 onCheckEmail(event){
 	console.log('Check if Email Exists: ',event.target.value);
 	this.props.dispatch(checkEmailExists(event.target.value));
 }

 onChangeAM(event,value){	
 	console.log(value);
 	this.setState({
		AMValue: value
	})
 }

 onChangeSource(event,value){
 	this.setState({
 		SourceValue: value
 	});
 }

 onUpdateEmail(event){ 	
 	this.setState({username: event.target.value});
 }

onSubmitUserForm(event,values){
	event.preventDefault();
	this.props.dispatch(addCustomer(values));
	this.setState({
		disableSubmit: true
	})
}
 
 renderBreadcrumbs(){
 		return(
 			<ol className="breadcrumb-arrow">
			<li><Link to={constants.BASE_URL+'customers'}><i className={'fa '+constants.UserIcon+' fa-lg'}></i> Customers</Link></li>
			<li className="active"><span> New Customer</span></li>
			</ol>
		)
 }
 
render(){
	const { common } = this.props;
	const emailExists = (this.props.ots.fulfilled && !this.props.ots.isLoading)?this.props.ots.data : '';
	const UserFormProps = {
		onToggle: this.onToggle,
		common: (common.data.length == 0) ? [] : common,
		onChangeAM: this.onChangeAM,
		onChangeSource: this.onChangeSource,
		AMValue: this.state.AMValue,
		SourceValue: this.state.SourceValue,
		secondary: this.state.secondary,
		send_email: this.state.send_email,
		onCheckEmail: this.onCheckEmail,
		emailExists: emailExists,
		onToggleSecondary: this.onToggleSecondary,
		username: this.state.username,
		onUpdateEmail: this.onUpdateEmail,
		disableSubmit: this.state.disableSubmit,	
	}

	return (
		<section>
		{this.renderBreadcrumbs()}
		<AutoForm onSubmit={this.onSubmitUserForm.bind(this)} trimOnSubmit>
			<UserForm {...UserFormProps} />
		</AutoForm>
		</section>
	)
}


}

 function mapStateToProps(state) {	
	return {
	users: state.users,
	common: state.common,
	ots: state.ots,
	};
 }

 AddCustomer.propTypes = {
	errors: PropTypes.object,
	dispatch: PropTypes.func,
	params: PropTypes.object,    
	users: PropTypes.object,
	common: PropTypes.object,
	ots: PropTypes.object
 };

export default connect(mapStateToProps)(AddCustomer); // state = null