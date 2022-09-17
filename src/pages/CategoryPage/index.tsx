import { Container } from '@mui/material';
import CategoryDetail from 'components/pages/CategoryDetail';
import React from 'react';

export interface ICategoryPageProps {}

export default function CategoryPage(props: ICategoryPageProps) {
	return (
		<Container maxWidth="xl" sx={{ mt: 14 }}>
			<CategoryDetail />
		</Container>
	);
}
