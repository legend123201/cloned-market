/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
// mui
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
// components
import FieldInput from 'components/CustomField/FieldInput';
// styled
import { CloseIconStyled, SearchIconStyled } from '../Common/styled';
import { DropDownContentBS, SearchGroup } from './styled';
// utils
import { sliceString } from 'utils';
// path
import { PATH_PAGE } from 'routes/path';
// hook
import { useNavigateSearch } from 'hooks/useNavigateSearch';

export interface IGlobalSearchBigScreenProps {
	inputValue: string;
	setInputValue: Function;
	handleOnChangeInputValue: (event: any) => void;
	RenderSearchResults: Function;
}

export default function GlobalSearchBigScreen({
	inputValue,
	setInputValue,
	handleOnChangeInputValue,
	RenderSearchResults,
}: IGlobalSearchBigScreenProps) {
	const ref: any = useRef(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const navigateSearchParams = useNavigateSearch();

	// useState
	const [activeDropDown, setActiveDropDown] = useState<boolean>(false);
	const [prevInputValue, setPrevInputValue] = useState<string>('');

	// useEffect
	useEffect(() => {
		const onBodyClick = (event: any) => {
			event.stopPropagation();
			if (ref.current && !ref.current.contains(event.target)) {
				setActiveDropDown(false);
			}
		};
		// Bind the event listener if dropdown is active
		if (activeDropDown) {
			document.body.addEventListener('click', onBodyClick, { passive: true });
			setInputValue(prevInputValue);
		} else {
			setPrevInputValue(inputValue);
			setInputValue(sliceString(inputValue, 8));
		}

		return () => {
			// Unbind the event listener on clean up
			document.body.removeEventListener('click', onBodyClick);

			// this useful for reset inputValue when resize to mobile
			setInputValue(prevInputValue);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeDropDown]);

	// handle esc
	useEffect(() => {
		const escFunction = (event: any) => {
			if (event.key === 'Escape') {
				//Do whatever when esc is pressed
				setActiveDropDown(false);
				if (inputRef.current) inputRef.current.blur();
			}
		};

		window.addEventListener('keydown', escFunction, { passive: true });

		return () => {
			window.removeEventListener('keydown', escFunction);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// handle enter
	useEffect(() => {
		const enterFunction = (event: any) => {
			if (event.key === 'Enter' && activeDropDown) {
				//Do whatever when enter is pressed
				setActiveDropDown(false);
				if (inputRef.current) inputRef.current.blur();
				navigateSearchParams(PATH_PAGE.viewAll, { query: inputValue });
			}
		};

		window.addEventListener('keydown', enterFunction, { passive: true });

		return () => {
			window.removeEventListener('keydown', enterFunction);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValue]);

	// functions
	const showDropDown = () => {
		if (!activeDropDown) {
			setActiveDropDown(true);
			if (inputRef.current) inputRef.current.focus();
		}
	};

	const deactivateDropdown = () => {
		setActiveDropDown(false);
	};

	const responsiveTrueBoxWidthExpand = (): number => {
		const screenWidth = window.innerWidth;
		if (screenWidth < 1300) {
			return 0;
		}
		return 250;
	};

	return (
		<Box
			sx={{
				position: 'relative',
			}}
		>
			<Box sx={{}} ref={ref} onClick={showDropDown}>
				<SearchGroup direction="row" alignItems="center">
					<SearchIconStyled alignItems="center" justifyContent="center">
						<SearchIcon sx={{ cursor: 'pointer', flexShrink: 0 }} />
					</SearchIconStyled>

					<FieldInput
						otherProps={{ ref: inputRef }}
						type="text"
						value={inputValue}
						placeholder={'Search...'}
						onChange={handleOnChangeInputValue}
						sx={{
							flexGrow: 1,
							padding: '0px 10px 0px 0px',
							my: 1,
							height: '17px',
							// backgroundColor: 'hsla(0,0%,100%,.15)',
							backgroundColor: 'initial',
							borderRadius: 'unset',
						}}
					/>
				</SearchGroup>

				<DropDownContentBS className={activeDropDown ? 'active' : ''}>
					{RenderSearchResults(deactivateDropdown)}
				</DropDownContentBS>
			</Box>
		</Box>
	);
}
