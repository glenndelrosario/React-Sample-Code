import _ from 'lodash';
import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import { Link } from 'react-router';

import * as constants from '../../../core/constants';
import AddressForm from '../AddressForm';


export default (props) => {
	
	let UserTypes = '';
	let AccountManagers = '';
	let UserSource = '';
	const disabledCss = props.disableSubmit ? 'mui--show' : 'mui--hide';

	if(props.common.length != 0){
		UserTypes = props.common.data.User_Type.map((item,index) =>{
			return (
				<Checkbox
				label={item.Label}
				name="user_types"
				value={item.Value}
				key={'types_'+item.Value}
				style={{ display: 'inline-block', maxWidth: '130px' }}				
				/>
				)
		});

		AccountManagers = props.common.data.Account_Managers.map((item,index) => {          	
    	return <MenuItem value={index} primaryText={item.Label} key={index} />}
    )

    UserSource = props.common.data.User_Source.map((item,index) => {          	
    	return <MenuItem value={index} primaryText={item.Label} key={index} />}
    )		
	}
		
	const message = (props.emailExists) == 'exists' ? <div className="alert alert-error margin">Email exists already!</div>: '';
	let contents = '';				
		contents = 		
		<section>									
			<Card initiallyExpanded={true}>
			<CardHeader
			title="Customer Profile"							
			style={{backgroundColor:'#00BCD4'}}
			titleStyle={{color:'#fff'}}
			/>
	    <CardText>
	    <div className="flex">
			<div className="mui-col-sm-12 no-padding-lr">

			<div className="mui-col-sm-6">
			<br />
			<div className="form-title">Account Information</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="email" name="email" required onChange={props.onUpdateEmail.bind(this)} onBlur={props.onCheckEmail} />
					<label>Email *</label>	
					{message}				
				</div>

				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="username" value={props.username} readOnly />
					<label>Username *</label>					
				</div>
				
				<Toggle
				label="Send confirmation email and a link to change/add password"
				onToggle={props.onToggle.bind(this)}
				defaultToggled={true}     	
				/>
				<input type="hidden" name="send_email" value={props.send_email} />
				<div className="margin">
				<label>Customer Type</label>
					<div>				
						{UserTypes}
					</div>
				</div>

				<SelectField
          floatingLabelText="Account Manager"       		
       		value={props.AMValue}
       		onChange={props.onChangeAM.bind(this)}
       		style={{width:'100%'}}       		
        >
        	{AccountManagers}          
        </SelectField>
				<input type="hidden" name="account_manager" value={props.AMValue} />

				<SelectField
          floatingLabelText="User Source"       		
       		value={props.SourceValue}
       		onChange={props.onChangeSource.bind(this)}
       		style={{width:'100%'}}       		
        >
        	{UserSource}          
        </SelectField>
				<input type="hidden" name="user_source" value={props.SourceValue} />
				
			</div>
			
			<div className="mui-col-sm-6">
			<br />
			<div className="form-title">Billing Address</div>
				<AddressForm pure_form={true} show_form={false} billing_address={true} />
			</div>
			
			<div className="mui--clearfix"></div>

			<div className="mui-col-sm-6">
			<br />
			<div className="form-title">Customer Information</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="first_name" required />
					<label>First Name</label>
				</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="last_name" />
					<label>Last Name</label>
				</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="contact_number" />
					<label>Contact Number</label>
				</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="companyname" />
					<label>Company Name</label>
				</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="nric" />
					<label>NRIC/Business Reg. No</label>
				</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="designation" />
					<label>Designation</label>
				</div>

				<Toggle
      	label={<span><i className="fa fa-user fa-2x"></i> Add Secondary Contact</span>}
      	onToggle={props.onToggleSecondary.bind(this)}      	
    		/>
    		<input type="hidden" name="secondary" value={props.secondary} />    		

			</div>

			<div className={props.secondary==true ? 'mui--show mui-col-sm-6' : 'mui--hide mui-col-sm-6'}>
				<br />
				<div className="form-title">Secondary Contact</div>
				
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="sec_email" required={props.secondary} />
					<label>Email Address*</label>
				</div>

				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="sec_first_name" required={props.secondary} />
					<label>First Name*</label>
				</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="sec_last_name" />
					<label>Last Name</label>
				</div>
				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="sec_contact_number" required={props.secondary}/>
					<label>Contact Number*</label>
				</div>

				<div className="mui-textfield mui-textfield--float-label">
					<input type="text" name="sec_designation" />
					<label>Designation</label>
				</div>

			</div>
			
			</div>
			</div>
	    </CardText>
	    </Card>
	    
	    <div className="margin mui--pull-left">

	     	<div className="alert alert-info">
	     		<i className="mui--pull-left margin-lr fa fa-info-circle fa-3x"></i>
					<div>
					<p><i>Take note:</i> It may take a while to redirect to the next page after a successful submission.
					Because we're passing data to Pipedrive.
					</p>
					</div>
	     	</div>
	    
	    </div>
	    
	    <div className='margin mui--pull-right'>
	    	<Link to={constants.BASE_URL+'customers'}>
				<FlatButton
				label="Cancel"
				primary={true}
				style={{marginRight:'10px'}}				
				/>
				</Link>
				<span><i className={'fa fa-refresh fa-spin fa-fw '+disabledCss}></i></span>
				<RaisedButton
				label="Add New Customer"
				secondary={true}
				disabled={props.disableSubmit}
				type="submit"
				/>
			</div>
		</section>;

	return contents;
}