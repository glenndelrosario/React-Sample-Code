import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import SvgIconFace from 'material-ui/svg-icons/action/face';

export default (props) => {

	return( 
		<Chip>
          <Avatar color="#444" icon={<SvgIconFace />} />
          { props.UserID } | {props.firstName}
        </Chip>
	)
}