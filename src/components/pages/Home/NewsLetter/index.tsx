/* eslint-disable @typescript-eslint/no-unused-vars */
// styled
import {
	CardContent,
	CardDetail,
	CardHeader,
	CardHeaderInner,
	CardTitle,
	ContentWrap,
	FormButton,
	FormEmail,
	FormWrap,
	Header,
	InfoWrap,
	InputForm,
	Section,
} from './styled';
// images
import Earth from 'assets/images/planets/earth.svg';
import Mars from 'assets/images/planets/mars.svg';
import Neptune from 'assets/images/planets/neptune.svg';
import Saturn from 'assets/images/planets/saturn.svg';
// constants
import { RELATED_URLS } from '../../../../constants';

const listTutorial = [
	{
		id: 1,
		title: '1. Connect your wallet',
		description:
			'Connect to wallet button in the top right corner to initialize your account ih the MetaSpacecy.',
		image: Earth,
		link: RELATED_URLS.tutorialConnectWallet,
	},
	{
		id: 2,
		title: '2. Create an asset',
		description:
			'Create your own collectibles of art, sport, photography and etc. in an open asset shared storage.',
		image: Mars,
		link: RELATED_URLS.tutorialCreateAsset,
	},
	{
		id: 3,
		title: '3. Earn MS assets',
		description:
			'Take any actions from doing exchange to join INO to get MS assets including MST, MCA, MMB and MTC.',
		image: Saturn,
		link: RELATED_URLS.tutorialEarnAsset,
	},
	{
		id: 4,
		title: '4. List item for sale',
		description:
			'List your NFT with a variety sale method supported in both primary and secondary market.',
		image: Neptune,
		link: RELATED_URLS.tutorialListItem,
	},
];
const Newsletter: React.FC = () => {
	return (
		<Section>
			<div className="container">
				<ContentWrap>
					{listTutorial.map((item: any, index: number) => (
						<CardContent key={index}>
							<CardHeader className="card-header">
								<CardHeaderInner
									className="card-header-inner"
									href={item.link}
									target="_blank"
									rel="noreferrer"
								>
									<img
										src={item.image}
										width="34"
										height="34"
										alt={item.title}
									></img>
								</CardHeaderInner>
							</CardHeader>
							<a href={item.link} rel="noreferrer" target="_blank">
								<CardTitle>{item.title}</CardTitle>
							</a>

							<CardDetail>{item.description}</CardDetail>
						</CardContent>
					))}
				</ContentWrap>
				{/* <InfoWrap>
					Join our mailing list to stay in the loop with our newest feature releases, NFT
					drops, and tips and tricks for navigating Xhibiter
				</InfoWrap>
				<FormWrap>
					<FormEmail>
						<InputForm type="email" placeholder="Email Address" />
						<FormButton>Subcribe</FormButton>
					</FormEmail>
				</FormWrap> */}
			</div>
		</Section>
	);
};

export default Newsletter;
