import React from 'react';

import { Switch } from './styled';

export interface SwitchButtonProps {
	onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
	ariaChecked?: 'true' | 'false' | 'mixed';
}

// this switch learn from w3school
function SwitchButton({ onChange, ariaChecked = 'false' }: SwitchButtonProps) {
	const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event);
	};

	return (
		<Switch>
			<input type="checkbox" aria-checked={ariaChecked} onChange={handleSwitch} />
			<span className="slider round"></span>
		</Switch>
	);
}

export default SwitchButton;
