// ----------------------------------------------------------------------
declare module '@mui/material/styles' {
	interface BreakpointOverrides {
		xxl: true; // adds the `xxl` breakpoint
	}
}

const breakpoints = {
	values: {
		// xs: 0,
		// sm: 600,
		// md: 900,
		// lg: 1200,
		// xl: 1536,

		xs: 0,
		sm: 600,
		md: 768,
		lg: 992,
		xl: 1200,
		xxl: 1500,
	},
};

export default breakpoints;
