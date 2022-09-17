import { Stack, Typography } from '@mui/material';
import React, { Fragment } from 'react';
import { ItemPropertiesTab } from './styled';

export interface IAppProps {}

export default function PropertiesTab(props: IAppProps) {
	return (
		<Fragment>
			<Stack direction="row" mt={1}>
				<ItemPropertiesTab>
					<Typography sx={{ opacity: '0.6' }}>Background</Typography>
					<Typography fontSize="1.25rem" fontWeight="600">
						Purple
					</Typography>
				</ItemPropertiesTab>
				<ItemPropertiesTab>
					<Typography sx={{ opacity: '0.6' }}>Background</Typography>
					<Typography fontSize="1.25rem" fontWeight="600">
						Purple
					</Typography>
				</ItemPropertiesTab>
				<ItemPropertiesTab>
					<Typography sx={{ opacity: '0.6' }}>Background</Typography>
					<Typography fontSize="1.25rem" fontWeight="600">
						Purple
					</Typography>
				</ItemPropertiesTab>
			</Stack>
		</Fragment>
	);
}
