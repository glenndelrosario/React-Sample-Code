import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { unmounting } from '../../core/globalActions';
import { getAllCustomers } from '../../core/actions/customerActions';
import { getCustomerFilters } from '../../core/actions/dropdownActions';
import { BASE_URL, UsersIcon } from '../../core/constants';

import Loading from '../../components/modules/Loading';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import Pagination from 'react-js-pagination';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';


class CustomerListings extends Component {

 constructor(props){
	super(props);
	 this.state = {      
      activePage: 0,
      filterValue:[],
    };
	this.onSearch = this.onSearch.bind(this);
	this.handlePageChange = this.handlePageChange.bind(this);
	this.handleSelectChange = this.handleSelectChange.bind(this);
 }

 componentWillMount(){
 	sessionStorage.clear();
	this.props.dispatch(getAllCustomers());
	this.props.dispatch(getCustomerFilters());
 }

 componentWillUnmount(){
 	sessionStorage.clear();
	this.props.dispatch(unmounting());
 }
 
 handlePageChange(pageNumber){ 	
 	const { users } = this.props;
 	const perPage = users.data.perPage;
	this.setState({activePage: pageNumber});
	const searchInput = this.refs.search.value;
 	const filterInput = this.state.filterValue;
 	const multiplier = pageNumber - 1;
 	const activepage = perPage * multiplier;

 	//console.log(pageNumber,perPage,activepage);
	this.props.dispatch(getAllCustomers(searchInput,filterInput,activepage));
 }

 handleSelectChange (value) {
 	console.log(value);
	this.setState({ filterValue: value });
	const searchInput = this.refs.search.value;
 	const filterInput = value;
 	//console.log(v);
	this.props.dispatch(getAllCustomers(searchInput,filterInput));
 }
 
 onSearch(){
	const searchInput = this.refs.search.value;
	const filterInput = this.state.filterValue;
	this.props.dispatch(getAllCustomers(searchInput,filterInput));
	sessionStorage.setItem("userSearch",searchInput); 
 }

 renderTable(){
	const { users } = this.props;		
	if(!users.isLoading && users.data.data.length > 0){
	return(
		users.data.data.map((user,index) => (			    			
		<tr key={index}>
		<td><Link to={BASE_URL+'customers/'+user.User_ID}>
			<strong>{user.firstName}</strong></Link><br />
			<small>{user.mobile}</small>
    </td>
		<td>{user.email}</td>
		<td>{user.address}</td>		
		<td>{user.payment_method}</td>		
		<td><span className={'status '+user.status_color}>{user.user_status}</span></td>
		<td>{(user.password_set===true) ? <i className="fa fa-check-circle fa-lg green"></i> : <i className="fa fa-times-circle fa-lg red"></i>}</td>
		<td>{user.join_date}</td>
		<td className="actions">
			<Link to={BASE_URL+'customers/'+user.User_ID}>
			<span data-tip data-for="edit"><i className="fa fa-external-link fa-lg"></i></span>
			<ReactTooltip id="edit" place="top" effect="solid">
			<span>View Customer Details</span>
			</ReactTooltip>
			</Link>
			&nbsp;
			&nbsp;
			<a data-tip data-for="delete"><i className="fa fa-trash-o fa-lg"></i></a>
				<ReactTooltip id="delete" place="top" type="error" effect="solid">
			<span>Delete Customer</span>
			</ReactTooltip>

		</td>
		</tr>
	))
	);
	}
	return(<tr><td colSpan="9">No Customer found.</td></tr>)
 }

 renderStatuses(){
 	const { common } = this.props;
 	if(common.fulfilled){
 		return(
			common.data.do_status_options.map((item,index) => (	
 			<MenuItem key={index} value={item.Value} primaryText={item.Label} />
 			))
 		)
 	} 	
 }

 renderPagination(){
 	const { users } = this.props;
 	const perPage = users.data.perPage;
 	const TotalRecords = (users.data.recordsTotal) ? users.data.recordsTotal : 0;
 	
 	return(
 		<section>
 		<div className="mui--pull-left">Total: {TotalRecords} records found</div>
 		<div className="mui--pull-right">
 		<Pagination 
          activePage={this.state.activePage} 
          itemsCountPerPage={perPage} 
          totalItemsCount={TotalRecords} 
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
          firstPageText="First"
          lastPageText="Last"
        />
 		</div>
		</section>
	)
 }

render() {	
const { users, common } = this.props;
const doSearch = _.debounce(()=>{this.onSearch()},500);
let searchValue = (sessionStorage.getItem("userSearch")) ? sessionStorage.getItem("userSearch") : '';
let autoFocus = (sessionStorage.getItem("userSearch")) ? true : false;
if(users.fulfilled && !users.isLoading && common.fulfilled && !common.isLoading){
return (
<div>
	<ol className="breadcrumb-arrow">		
		<li className="active"><span><i className={'fa '+UsersIcon+' fa-lg'}></i> Customers</span></li>
	</ol>
	<Card initiallyExpanded={true}>
	<CardHeader
	title="Filters"
	actAsExpander={true}
	showExpandableButton={true}
	style={{backgroundColor:'#00BCD4'}}
	titleStyle={{color:'#fff'}}
	/>
  <CardText expandable={true}>
  	<div className="mui--pull-left">
  	<br />
		<Link to={BASE_URL+'customers/add'}>	
			<RaisedButton      
			secondary={true}
			icon={<FontIcon className="fa fa-plus" />}
			label={'Add New Customer'}
			/>
		</Link>
		</div>

	  <div className="mui-col-sm-5">
			<label style={{fontSize:'12px'}}>Filter</label>
			<Select multi
			 value={this.state.filterValue} 
			 placeholder="Filter by Payment Method, User Status, Account Manager, Source" 
			 options={common.data} 
			 onChange={this.handleSelectChange} 
			 labelKey="Label"
			 valueKey="Label"
			 />
		</div>

	  <div className="mui--pull-right mui-textfield mui-col-sm-4">
		<label style={{fontSize:'12px'}}>Search</label>
		<input type="text" id="searchbox"
		name="search" placeholder="Enter Customer Name / Email / Mobile" 
		ref="search" autoFocus={autoFocus} onChange={doSearch} 
		defaultValue={searchValue} 
		/>    	
	  </div>

	  <div className="mui--clearfix"></div>	 
	  
    </CardText>
  </Card>
  <br />
  <Card initiallyExpanded={true}>
	<CardHeader
	title="List of All Customers"	
	style={{backgroundColor:'#00BCD4'}}
	titleStyle={{color:'#fff'}}
	/>
	<CardText>	
	<table className="mui-table mui-table--bordered" id="dataTable">
	<thead>
		<tr>
			<th>Name</th>
			<th>Email</th>
			<th>Billing Address</th>			
			<th>Payment Method</th>
			<th>User Status</th>
			<th>Password Set</th>
			<th>Join Date</th>
			<th>Actions</th>						
		</tr>
	</thead>
	<tbody>
		{this.renderTable()}
	</tbody>
	</table>
		<div className="module-title">
			{this.renderPagination()}
		</div>
	</CardText>
	</Card>
	</div>
);
}
return <Loading size={1} position="text-center" />	
}


} // END OF OrderListings CLASS	

 function mapStateToProps(state) {	
	return {
	users: state.users,
	common: state.common,
	};
 }

 CustomerListings.propTypes = {
	errors: PropTypes.object,
	dispatch: PropTypes.func,
	params: PropTypes.object,    
	users: PropTypes.object,
	common: PropTypes.object,
 };

export default connect(mapStateToProps)(CustomerListings); // state = null